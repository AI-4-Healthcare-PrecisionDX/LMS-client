"use client";

import React, { useReducer, useCallback, useState } from "react";
import {
  Book,
  FileText,
  Presentation,
  Search,
  ExternalLink,
  BookmarkPlus,
  Bookmark,
  StickyNote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

// Types
type Resource = {
  id: number;
  title: string;
  type: "book" | "notes" | "slides";
  course: string;
  semester: number;
  author: string;
  year: number;
  link: string;
  bookmarked: boolean;
  studyNotes: string;
};

type State = {
  resources: Resource[];
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
  | { type: "TOGGLE_BOOKMARK"; payload: number }
  | { type: "UPDATE_STUDY_NOTES"; payload: { id: number; notes: string } }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_ITEMS_PER_PAGE"; payload: number };

// Constants
const COURSES = [
  "All Courses",
  "Anatomy",
  "Neuroscience",
  "Biochemistry",
  "Pathology",
  "Pharmacology",
  "Physical Diagnosis",
  "Physiology",
  "Immunology",
  "Microbiology",
];
const SEMESTERS = ["All Semesters", 1, 2, 3, 4];
const TYPES = ["All Types", "book", "notes", "slides"];

// Initial state and dummy data
const initialResources: Resource[] = [
  {
    id: 1,
    title: "Gray's Anatomy",
    type: "book",
    course: "Anatomy",
    semester: 1,
    author: "Henry Gray",
    year: 2020,
    link: "https://example.com/grays-anatomy",
    bookmarked: false,
    studyNotes: "",
  },
  {
    id: 2,
    title: "Neuroanatomy Lecture Slides",
    type: "slides",
    course: "Neuroscience",
    semester: 2,
    author: "Dr. Jane Smith",
    year: 2021,
    link: "https://example.com/neuro-slides",
    bookmarked: false,
    studyNotes: "",
  },
  {
    id: 3,
    title: "Biochemistry Study Notes",
    type: "notes",
    course: "Biochemistry",
    semester: 1,
    author: "John Doe",
    year: 2022,
    link: "https://example.com/biochem-notes",
    bookmarked: false,
    studyNotes: "",
  },
  {
    id: 4,
    title: "Robbins Basic Pathology",
    type: "book",
    course: "Pathology",
    semester: 3,
    author: "Vinay Kumar",
    year: 2019,
    link: "https://example.com/robbins-pathology",
    bookmarked: false,
    studyNotes: "",
  },
  {
    id: 5,
    title: "Pharmacology Flashcards",
    type: "notes",
    course: "Pharmacology",
    semester: 4,
    author: "Emily Brown",
    year: 2023,
    link: "https://example.com/pharm-flashcards",
    bookmarked: false,
    studyNotes: "",
  },
  // Add more resources to demonstrate pagination
  ...Array.from({ length: 45 }, (_, i) => ({
    id: i + 6,
    title: `Resource ${i + 6}`,
    type: ["book", "notes", "slides"][i % 3] as "book" | "notes" | "slides",
    course: COURSES[1 + (i % (COURSES.length - 1))],
    semester: (i % 4) + 1,
    author: `Author ${i + 6}`,
    year: 2020 + (i % 5),
    link: `https://example.com/resource-${i + 6}`,
    bookmarked: false,
    studyNotes: "",
  })),
];

const initialState: State = {
  resources: initialResources,
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

// Reducer function
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
    case "TOGGLE_BOOKMARK":
      return {
        ...state,
        resources: state.resources.map((resource) =>
          resource.id === action.payload
            ? { ...resource, bookmarked: !resource.bookmarked }
            : resource,
        ),
      };
    case "UPDATE_STUDY_NOTES":
      return {
        ...state,
        resources: state.resources.map((resource) =>
          resource.id === action.payload.id
            ? { ...resource, studyNotes: action.payload.notes }
            : resource,
        ),
      };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ITEMS_PER_PAGE":
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };
    default:
      return state;
  }
}

// Helper functions
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

// Components
const FilterBar = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => (
  <div className="flex flex-col md:flex-row gap-4 mb-8">
    <div className="flex-grow">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search resources..."
          value={state.searchTerm}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
          }
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
    </div>
    <div className="flex gap-2 flex-wrap">
      <Select
        value={state.selectedCourse}
        onValueChange={(value) =>
          dispatch({ type: "SET_COURSE", payload: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Course" />
        </SelectTrigger>
        <SelectContent>
          {COURSES.map((course) => (
            <SelectItem key={course} value={course}>
              {course}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={state.selectedSemester.toString()}
        onValueChange={(value) =>
          dispatch({
            type: "SET_SEMESTER",
            payload: value === "All Semesters" ? value : parseInt(value),
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          {SEMESTERS.map((semester) => (
            <SelectItem key={semester} value={semester.toString()}>
              {semester}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={state.selectedType}
        onValueChange={(value) =>
          dispatch({ type: "SET_TYPE", payload: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const SortControls = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <Label>Sort by:</Label>
    <Select
      value={state.sortBy}
      onValueChange={(value: "title" | "year") =>
        dispatch({ type: "SET_SORT_BY", payload: value })
      }
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="title">Title</SelectItem>
        <SelectItem value="year">Year</SelectItem>
      </SelectContent>
    </Select>
    <Button
      variant="outline"
      size="sm"
      onClick={() => dispatch({ type: "TOGGLE_SORT_ORDER" })}
    >
      {state.sortOrder === "asc" ? "Ascending" : "Descending"}
    </Button>
  </div>
);

const StudyNotesPopover = ({
  resource,
  onUpdateNotes,
}: {
  resource: Resource;
  onUpdateNotes: (id: number, notes: string) => void;
}) => {
  const [notes, setNotes] = useState(resource.studyNotes);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <StickyNote className="mr-2 h-4 w-4" />
          Study Notes
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Study Notes</h4>
            <p className="text-sm text-muted-foreground">
              Add your personal notes for this resource.
            </p>
          </div>
          <div className="grid gap-2">
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your study notes here..."
            />
          </div>
          <Button onClick={() => onUpdateNotes(resource.id, notes)}>
            Save Notes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ResourceCard = ({
  resource,
  onToggleBookmark,
  onUpdateNotes,
}: {
  resource: Resource;
  onToggleBookmark: (id: number) => void;
  onUpdateNotes: (id: number, notes: string) => void;
}) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          {getIcon(resource.type)}
          <span className="truncate">{resource.title}</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleBookmark(resource.id)}
        >
          {resource.bookmarked ? (
            <Bookmark className="h-4 w-4 text-yellow-500" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-gray-500 mb-2">by {resource.author}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        <Badge variant="secondary">{resource.course}</Badge>
        <Badge variant="outline">Semester {resource.semester}</Badge>
        <Badge>{resource.type}</Badge>
      </div>
      <p className="text-sm mb-2">Year: {resource.year}</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button asChild variant="outline" size="sm">
        <a href={resource.link} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" /> View
        </a>
      </Button>
      <StudyNotesPopover resource={resource} onUpdateNotes={onUpdateNotes} />
    </CardFooter>
  </Card>
);

const ResourceList = ({
  resource,
  onToggleBookmark,
  onUpdateNotes,
}: {
  resource: Resource;
  onToggleBookmark: (id: number) => void;
  onUpdateNotes: (id: number, notes: string) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          {getIcon(resource.type)}
          <span>{resource.title}</span>
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleBookmark(resource.id)}
          >
            {resource.bookmarked ? (
              <Bookmark className="h-4 w-4 text-yellow-500" />
            ) : (
              <BookmarkPlus className="h-4  w-4" />
            )}
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> View
            </a>
          </Button>
          <StudyNotesPopover
            resource={resource}
            onUpdateNotes={onUpdateNotes}
          />
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">by {resource.author}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary">{resource.course}</Badge>
            <Badge variant="outline">Semester {resource.semester}</Badge>
            <Badge>{resource.type}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm mb-1">Year: {resource.year}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageNumbers.push(i);
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 mt-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(number)}
            aria-label={`Page ${number}`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="items-per-page">Items per page:</Label>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[9, 18, 27, 36].map((number) => (
              <SelectItem key={number} value={number.toString()}>
                {number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default function MedicalLibraryPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredAndSortedResources = useCallback(() => {
    return state.resources
      .filter((resource) => {
        return (
          resource.title
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase()) &&
          (state.selectedCourse === "All Courses" ||
            resource.course === state.selectedCourse) &&
          (state.selectedSemester === "All Semesters" ||
            resource.semester === state.selectedSemester) &&
          (state.selectedType === "All Types" ||
            resource.type === state.selectedType)
        );
      })
      .sort((a, b) => {
        if (state.sortBy === "title") {
          return state.sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else {
          return state.sortOrder === "asc" ? a.year - b.year : b.year - a.year;
        }
      });
  }, [state]);

  const paginatedResources = useCallback(() => {
    const filteredResources = filteredAndSortedResources();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    return filteredResources.slice(startIndex, startIndex + state.itemsPerPage);
  }, [state, filteredAndSortedResources]);

  const totalPages = Math.ceil(
    filteredAndSortedResources().length / state.itemsPerPage,
  );

  const handleUpdateNotes = (id: number, notes: string) => {
    dispatch({ type: "UPDATE_STUDY_NOTES", payload: { id, notes } });
    toast.success("Study notes updated successfully.");
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const handleItemsPerPageChange = (items: number) => {
    dispatch({ type: "SET_ITEMS_PER_PAGE", payload: items });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Public Library</h1>

      <FilterBar state={state} dispatch={dispatch} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <SortControls state={state} dispatch={dispatch} />
      </div>

      <Tabs
        value={state.viewMode}
        onValueChange={(value) =>
          dispatch({ type: "SET_VIEW_MODE", payload: value as "grid" | "list" })
        }
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResources().map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onToggleBookmark={(id) =>
                  dispatch({ type: "TOGGLE_BOOKMARK", payload: id })
                }
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="space-y-4">
            {paginatedResources().map((resource) => (
              <ResourceList
                key={resource.id}
                resource={resource}
                onToggleBookmark={(id) =>
                  dispatch({ type: "TOGGLE_BOOKMARK", payload: id })
                }
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Pagination
        currentPage={state.currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={state.itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
