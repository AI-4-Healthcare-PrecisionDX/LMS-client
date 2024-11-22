'use client'

import { TourProvider } from "@reactour/tour"
import { useQuery } from "@tanstack/react-query"
import { Book, Search } from 'lucide-react'
import { useState, type ReactElement } from "react"
import { pdfjs } from "react-pdf"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import api from "@/lib/axios-config"
import Link from "next/link"
import { LibraryItem, Props, Step } from "./types"

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const steps: Step[] = [
  {
    selector: ".search-input",
    content: "Search for a particular book by title, author, or subject.",
  },
  {
    selector: ".filter-options",
    content: "Filter books by department and material type.",
  },
  {
    selector: ".read-book-button",
    content: "Click here to read a particular book.",
  },
  {
    selector: ".inspect-button",
    content: "Click here to inspect the materials for this book.",
  },
]

const truncateString = (str: string | undefined, maxLength: number): string => 
  str && str.length > maxLength ? str.slice(0, maxLength) + "..." : str || ""

function BookList({ section_exclusive_contents }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMaterialType, setFilterMaterialType] = useState("all")
  const [filterVisibility, setFilterVisibility] = useState("all")
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)

  const { data: filteredContents } = useQuery({
    queryKey: ['filteredContents', searchTerm, filterVisibility, filterMaterialType],
    queryFn: () => {
      return section_exclusive_contents.filter(content => {
        const matchesSearch = searchTerm === "" || (
          content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.library_item.material_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.library_item.author.toLowerCase().includes(searchTerm.toLowerCase())
        )

        const matchesMaterialType = filterMaterialType === "all" ||
          content.library_item.material_type === filterMaterialType

        const matchesVisibility = filterVisibility === "all" ||
          (filterVisibility === "visible" ? content.library_item.visibility : !content.library_item.visibility)

        return matchesSearch && matchesMaterialType && matchesVisibility
      })
    },
    enabled: !!section_exclusive_contents,
  })

  const uniqueMaterialTypes = Array.from(new Set(
    section_exclusive_contents.map(content => content.library_item.material_type)
  ))

  const handleViewContent = async (id: string, title: string) => {
    try {
      const fetchPDF = async (): Promise<LibraryItem> => {
        const response = await api.get(`/utils/library_course_section/file/${id}`);
        return response.data;
      };

      const pdfData = await fetchPDF();
      console.log(pdfData.file_url);
      // Fetch PDF as a blob
      const pdfResponse = await fetch(pdfData.file_url);
      const blob = await pdfResponse.blob();
      
      setPdfUrl(pdfData.file_url);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  }

  const handleDownloadPDF = () => {
    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    }
    console.log(pdfBlob);
  }

  return (
    <div className="container mx-auto pt-8">
      <div className="sticky top-0 bg-background pb-2 z-10">
        <div className="mb-6 flex flex-wrap justify-between gap-4 items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by title, material title, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-10 pr-4 py-2 w-full rounded-full border-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center filter-options">
            <Select onValueChange={setFilterMaterialType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Material Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueMaterialTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterVisibility}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {filteredContents?.map((content, index) => (
          <Card
            key={index}
            className="flex flex-col h-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            <CardHeader className="bg-primary p-4">
              <Book className="w-12 h-12 mb-2 text-white" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <h2 className="text-xl font-semibold text-white">
                      {truncateString(content.title, 30)}
                    </h2>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{content.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <h4 className="text-sm pt-2 text-gray-300">
                      {truncateString(content.library_item.author, 30)}
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{content.library_item.author}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>

            <CardContent className="flex-grow p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  {content.library_item.material_type}
                </Badge>
                <Badge variant="secondary">
                  {content.library_item.visibility ? 'Visible' : 'Hidden'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {truncateString(content.library_item.material_description, 100)}
              </p>
            </CardContent>

            <CardFooter className="p-4 mx-auto">
              <Link
              target="_blank"
                href={`/teacher/view/${encodeURIComponent(content.library_item.library_id)}`}
              ><Button
              className="w-full read-book-button"
              variant="outline"
            >
              Read Book
            </Button></Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
    </div>
  )
}

export default function BookListWithTour({ 
  section_exclusive_contents 
}: { 
  section_exclusive_contents: Props["section_exclusive_contents"]
}): ReactElement {
  return (
    <TourProvider steps={steps}>
      <BookList section_exclusive_contents={section_exclusive_contents} />
    </TourProvider>
  )
}