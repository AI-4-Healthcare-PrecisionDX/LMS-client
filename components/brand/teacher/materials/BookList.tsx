"use client";

import { TourProvider } from "@reactour/tour";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Book, EllipsisVertical, Loader2, Search } from "lucide-react";
import { useState, type ReactElement } from "react";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFileUpload from "@/hooks/use-upload";
import api from "@/lib/axios-config";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { toast } from "sonner";
import { useFilteredContents } from "../materials";
import TOC from "./TOC";
import { SectionExclusiveContent, Step, TemplateCourse } from "./types";

// Set up the worker for react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  template_course,
}: {
  section_exclusive_contents: SectionExclusiveContent[];
  sectionId: string;
  template_course: TemplateCourse;
}): ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMaterialType, setFilterMaterialType] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { getLibraryFileByLibraryID } = useFileUpload();

  const { data: filteredContents } = useFilteredContents({
    section_exclusive_contents,
    template_course,
    searchTerm,
    filterVisibility,
    filterMaterialType
  });

  const uniqueMaterialTypes = Array.from(
    new Set([
      ...section_exclusive_contents.map(
        (content) => content.library_item.material_type,
      ),
      ...(template_course.course_materials || []).map(
        (material) => material.library_item.material_type,
      ),
    ]),
  );

  const { mutate: deleteContent, isPending: isDeleting } = useMutation({
    mutationFn: async (section_exclusive_content_id: string) => {
      await api.delete(
        `/section/${sectionId}/content/${section_exclusive_content_id}`,
      );
    },
    onSuccess: () => {
      toast.success("The book has been successfully deleted.");
      queryClient.invalidateQueries({
        queryKey: ["filteredContents"],
      });
    },
    onError: () => {
      toast.error("Unable to delete the book. Please try again.");
    },
  });

  const getPdfUrl = async (library_item: any) => {
    setIsDialogOpen(true);
    setIsLoadingPdf(true);
    try {
      const file_url = await getLibraryFileByLibraryID((library_item.library_id) ? library_item.library_id : library_item.library_item.library_id);
      setSelectedPdf(file_url);
      console.log("selectedPdf", selectedPdf);
      setSelectedPdfName((library_item.material_title) ? library_item.material_title : library_item.library_item.material_title);
    } catch (error) {
      toast.error("Failed to load PDF");
      setIsDialogOpen(false);
    } finally {
      setIsLoadingPdf(false);
    }
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="dark:text-white upload-content-button">
                  Upload PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] h-full p-0 sm:max-w-none sm:max-h-none sm:p-4">
                <ScrollArea>
                  <TOC sectionId={sectionId} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {filteredContents?.map(
          (content: any) => (
            <Card
              key={content.section_exclusive_content_id || content.library_item.library_id}
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
                        {truncateString((content.library_item.material_title) ? content.library_item.material_title : content.library_item.library_item.material_title, 30)}
                      </h2>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{(content.library_item.material_title) ? content.library_item.material_title : content.library_item.library_item.material_title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <h4 className="text-sm pt-2 text-gray-300">
                        {truncateString((content.library_item.author) ? content.library_item.author : content.library_item.library_item.author, 30)}
                      </h4>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{(content.library_item.author) ? content.library_item.author : content.library_item.library_item.author}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>

              <CardContent className="flex-grow p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">
                    {(content.library_item.material_type) ? content.library_item.material_type : content.library_item.library_item.material_type}
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
                <Button onClick={() => getPdfUrl(content.library_item)} className="w-full read-book-button" variant="outline">
                  Read Book
                </Button>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-3/4 h-screen max-w-none m-0 p-6">
          <DialogHeader>
            <DialogTitle>{selectedPdfName}</DialogTitle>
          </DialogHeader>
          {isLoadingPdf ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading PDF...</span>
            </div>
          ) : (
            <div className=" w-full h-4/6 mt-10 mb-5">
              <Viewer
                fileUrl={selectedPdf as string}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BookListWithTour({
  section_exclusive_contents,
  sectionId,
  template_course,
}: {
  section_exclusive_contents: SectionExclusiveContent[];
  sectionId: string;
  template_course: TemplateCourse;
}): ReactElement {
  return (
    <TourProvider steps={steps}>
      <BookList
        section_exclusive_contents={section_exclusive_contents}
        sectionId={sectionId}
        template_course={template_course}
      />
    </TourProvider>
  );
}
