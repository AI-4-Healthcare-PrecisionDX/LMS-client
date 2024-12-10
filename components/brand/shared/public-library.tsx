"use client";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import {
  Book,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Presentation,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useCallback, useMemo, useReducer, useState } from "react";
import { toast } from "sonner";

import CaseLoadingSkeleton from "@/components/brand/shared/loading";
import { BookMaterial } from "@/components/brand/student/exam-v2/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFileUpload from "@/hooks/use-upload";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useQuery } from "@tanstack/react-query";
import UploadContent from "../student/exam-v2/UploadPdf";

type State = {
  searchTerm: string;
  selectedCourse: string;
  selectedSemester: string | number;
  selectedType: string;
  viewMode: "grid" | "list";
  sortBy: "title" | "year";
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
};

type Action =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_COURSE"; payload: string }
  | { type: "SET_SEMESTER"; payload: string | number }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" }
  | { type: "SET_SORT_BY"; payload: "title" | "year" }
  | { type: "TOGGLE_SORT_ORDER" }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_ITEMS_PER_PAGE"; payload: number };

const initialState: State = {
  searchTerm: "",
  selectedCourse: "All Courses",
  selectedSemester: "All Semesters",
  selectedType: "All Types",
  viewMode: "grid",
  sortBy: "title",
  sortOrder: "asc",
  currentPage: 1,
  itemsPerPage: 9,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_COURSE":
      return { ...state, selectedCourse: action.payload, currentPage: 1 };
    case "SET_SEMESTER":
      return { ...state, selectedSemester: action.payload, currentPage: 1 };
    case "SET_TYPE":
      return { ...state, selectedType: action.payload, currentPage: 1 };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "TOGGLE_SORT_ORDER":
      return {
        ...state,
        sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
      };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ITEMS_PER_PAGE":
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };
    default:
      return state;
  }
}

const getIcon = (type: string) => {
  switch (type) {
    case "book":
      return <Book className="h-6 w-6" />;
    case "notes":
      return <FileText className="h-6 w-6" />;
    case "slides":
      return <Presentation className="h-6 w-6" />;
    default:
      return <Book className="h-6 w-6" />;
  }
};

const materialTypes = ["All Types", "book", "notes", "slides"];

export default function MedicalLibraryPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getLibraries, getLibraryFileByLibraryID } = useFileUpload();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: getLibraries,
  });

  const filteredAndSortedResources = useCallback(() => {
    return resources
      .filter((resource: BookMaterial) => {
        return (
          resource.material_title
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase()) &&
          (state.selectedType === "All Types" ||
            resource.material_type === state.selectedType)
        );
      })
      .sort((a: BookMaterial, b: BookMaterial) => {
        if (state.sortBy === "title") {
          return state.sortOrder === "asc"
            ? a.material_title.localeCompare(b.material_title)
            : b.material_title.localeCompare(a.material_title);
        } else {
          return state.sortOrder === "asc"
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();
        }
      });
  }, [state, resources]);

  const totalPages = useMemo(() => {
    const filteredResources = filteredAndSortedResources();
    return Math.ceil(filteredResources.length / state.itemsPerPage);
  }, [filteredAndSortedResources, state.itemsPerPage]);

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const paginatedResources = useCallback(() => {
    const filteredResources = filteredAndSortedResources();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    return filteredResources.slice(startIndex, startIndex + state.itemsPerPage);
  }, [state, filteredAndSortedResources]);

  if (isLoading) {
    return <CaseLoadingSkeleton />;
  }

  const renderPdfViewer = () => (
    <div className="h-[90vh] w-[90vw] mx-auto max-w-none max-h-none">
      <Viewer fileUrl={pdfUrl || ""} plugins={[defaultLayoutPluginInstance]} />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[url('/library.avif')] bg-cover bg-center rounded-lg p-12 mb-8 relative">
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 rounded-lg"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-xl font-medium text-white/90 mb-2">Welcome to</h2>
          <h1 className="text-5xl font-bold text-white mb-4">Public Library</h1>
          <h3 className="text-2xl font-medium text-white/80">
            Powering your learning with knowledge
          </h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search materials..."
            className="pl-10"
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={state.selectedType}
            onValueChange={(value) =>
              dispatch({ type: "SET_TYPE", payload: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {materialTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  dispatch({ type: "SET_SORT_BY", payload: "title" })
                }
              >
                Sort by Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  dispatch({ type: "SET_SORT_BY", payload: "year" })
                }
              >
                Sort by Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => dispatch({ type: "TOGGLE_SORT_ORDER" })}
              >
                Toggle Order ({state.sortOrder === "asc" ? "↑" : "↓"})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-end">
        <UploadContent />
      </div>

      <Tabs
        value={state.viewMode}
        onValueChange={(value) =>
          dispatch({ type: "SET_VIEW_MODE", payload: value as "grid" | "list" })
        }
        className="my-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResources().map((resource: BookMaterial) => (
              <Card
                key={resource.library_id}
                className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 dark:bg-gray-900"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getIcon(resource.material_type)}
                      <span className="truncate">
                        {resource.material_title.length > 30
                          ? resource.material_title.slice(0, 30) + "..."
                          : resource.material_title}
                      </span>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-500 mb-2">
                    by {resource.author}
                  </p>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {resource.material_type}
                  </Badge>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    className="read-book-button flex-1 "
                    variant="outline"
                    onClick={async () => {
                      try {
                        const url = await getLibraryFileByLibraryID(
                          resource.library_id,
                        );
                        setPdfUrl(url);
                        setIsPdfOpen(true);
                      } catch (error) {
                        toast.error(
                          "Failed to load book" +
                            (error instanceof Error
                              ? error.message
                              : "Unknown error"),
                        );
                        setPdfUrl(null);
                      }
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Content
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="space-y-4">
            {paginatedResources().map((resource: BookMaterial) => (
              <Card
                key={resource.library_id}
                className="hover:shadow-md transition-shadow duration-200 dark:bg-gray-900"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getIcon(resource.material_type)}
                      <span>{resource.material_title}</span>
                    </span>

                    <Button
                      className="read-book-button hover:bg-primary hover:text-white transition-colors"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const url = await getLibraryFileByLibraryID(
                            resource.library_id,
                          );
                          setPdfUrl(url);
                          setIsPdfOpen(true);
                        } catch (error) {
                          toast.error(
                            "Failed to load book" +
                              (error instanceof Error
                                ? error.message
                                : "Unknown error"),
                          );
                          setPdfUrl(null);
                        }
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Content
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        by {resource.author}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          {resource.material_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="w-screen h-screen max-w-none m-0 p-6">
          {renderPdfViewer()}
        </DialogContent>
      </Dialog>

      <div className="flex justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.max(state.currentPage - 1, 1))}
          disabled={state.currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={state.currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handlePageChange(Math.min(state.currentPage + 1, totalPages))
          }
          disabled={state.currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
