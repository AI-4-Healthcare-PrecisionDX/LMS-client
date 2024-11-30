"use client";

import { TourProvider } from "@reactour/tour";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Book, EllipsisVertical, Search } from "lucide-react";
import { useState, type ReactElement } from "react";
import { pdfjs } from "react-pdf";

const queryClient = new QueryClient();

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios-config";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import TOC from "./TOC";
import { SectionExclusiveContent, Step } from "./types";

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
];

const truncateString = (str: string | undefined, maxLength: number): string =>
  str && str.length > maxLength ? str.slice(0, maxLength) + "..." : str || "";

function BookList({
  section_exclusive_contents,
  sectionId,
}: {
  section_exclusive_contents: SectionExclusiveContent[];
  sectionId: string;
}): ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMaterialType, setFilterMaterialType] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const { data: filteredContents } = useQuery({
    queryKey: [
      "filteredContents",
      searchTerm,
      filterVisibility,
      filterMaterialType,
    ],
    queryFn: () => {
      return section_exclusive_contents.filter((content) => {
        const matchesSearch =
          searchTerm === "" ||
          content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.library_item.material_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          content.library_item.author
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesMaterialType =
          filterMaterialType === "all" ||
          content.library_item.material_type === filterMaterialType;

        const matchesVisibility =
          filterVisibility === "all" ||
          (filterVisibility === "visible"
            ? content.library_item.visibility
            : !content.library_item.visibility);

        return matchesSearch && matchesMaterialType && matchesVisibility;
      });
    },
    enabled: !!section_exclusive_contents,
  });

  const uniqueMaterialTypes = Array.from(
    new Set(
      section_exclusive_contents.map(
        (content) => content.library_item.material_type,
      ),
    ),
  );

  const { mutate: deleteContent, isPending: isDeleting } = useMutation({
    mutationFn: async (section_exclusive_content_id: string) => {
      await api.delete(
        `/section/${sectionId}/content/${section_exclusive_content_id}`,
      );
    },
    onSuccess: () => {
      toast.success("The book has been successfully deleted.");
      // Invalidate and refetch the contents
      queryClient.invalidateQueries({
        queryKey: ["filteredContents"],
      });
    },
    onError: () => {
      toast.error("Unable to delete the book. Please try again.");
    },
  });

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
                {uniqueMaterialTypes.map((type, index) => (
                  <SelectItem key={index} value={type as string}>
                    {type as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterVisibility}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="visible">Public</SelectItem>
                <SelectItem value="hidden">Private</SelectItem>
              </SelectContent>
            </Select>
            <Dialog
            >
              <DialogTrigger asChild>
                <Button className="dark:text-white upload-content-button">
                  Upload PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] h-full p-0 sm:max-w-none sm:max-h-none sm:p-4">
                <ScrollArea>
                  <TOC sectionId={sectionId}/>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {filteredContents?.map(
          (content: SectionExclusiveContent, index: number) => (
            <Card
              key={index}
              className="flex flex-col h-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader className="bg-primary p-4">
                <div className="flex justify-between">
                  <Book className="w-12 h-12 mb-2 text-white" />
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="w-5 h-5 text-white" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background text-white">
                      {/* <DropdownMenuItem className="p-2 hover:bg-primary">
                    Edit
                  </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className="p-2 hover:bg-primary text-red-500"
                        onClick={() =>
                          deleteContent(content.section_exclusive_content_id)
                        }
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
                    {content.library_item.visibility ? "Public" : "Private"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {truncateString(
                    content.library_item.material_description,
                    100,
                  )}
                </p>
              </CardContent>

              <CardFooter className="p-4 mx-auto">
                <Link
                  target="_blank"
                  href={`/teacher/view/${encodeURIComponent(content.library_item.library_id)}`}
                >
                  <Button className="w-full read-book-button" variant="outline">
                    Read Book
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}

export default function BookListWithTour({
  section_exclusive_contents,
  sectionId,
}: {
  section_exclusive_contents: SectionExclusiveContent[];
  sectionId: string;
}): ReactElement {
  return (
    <TourProvider steps={steps}>
      <BookList
        section_exclusive_contents={section_exclusive_contents}
        sectionId={sectionId}
      />
    </TourProvider>
  );
}
