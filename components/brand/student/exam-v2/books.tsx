/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import useFileUpload from "@/hooks/use-upload";
import { BookMaterial, Book as BookType } from "@/types";
import { TourProvider, useTour } from "@reactour/tour";
import { useQuery } from "@tanstack/react-query";
import {
  Book,
  BookOpen,
  ChevronLeftIcon,
  ChevronRightIcon,
  CirclePlay,
  GraduationCap,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useReducer } from "react";
import UploadContent from "./UploadPdf";

// Utility function to truncate strings
const truncateString = (str: string, maxLength: number) =>
  str.length <= maxLength ? str : str.slice(0, maxLength) + "...";

// Tour steps configuration
const steps = [
  {
    selector: ".search-input",
    content:
      "You can Search for a particular book by title, author, or subject.",
  },
  { selector: ".category-filter", content: "Filter books by category." },
  { selector: ".course-filter", content: "Filter books by course." },
  {
    selector: ".read-book-button",
    content: "You can click here to read a particular book.",
  },
  {
    selector: ".start-prep-button",
    content: "You can click here to start your exam preparation for this book.",
  },
  {
    selector: ".upload-content-button",
    content: "You can click here to upload your own content.",
  },
  {
    selector: ".start-tour-button",
    content: "You can click here to restart the tour.",
  },
];

const items = [{ href: "/student", label: "Home" }, { label: "Book List" }];
const ITEMS_TO_DISPLAY = 2;

// State and action types for reducer
type State = {
  searchTerm: string;
  filteredBooks: BookType[];
  categoryFilter: string;
  courseFilter: string;
};

type Action =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_FILTERED_BOOKS"; payload: BookType[] }
  | { type: "SET_CATEGORY_FILTER"; payload: string }
  | { type: "SET_COURSE_FILTER"; payload: string };

// Initial state for the reducer
const initialState: State = {
  searchTerm: "",
  filteredBooks: [],
  categoryFilter: "all",
  courseFilter: "all",
};

// Reducer function to manage state
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_FILTERED_BOOKS":
      return { ...state, filteredBooks: action.payload };
    case "SET_CATEGORY_FILTER":
      return { ...state, categoryFilter: action.payload };
    case "SET_COURSE_FILTER":
      return { ...state, courseFilter: action.payload };
    default:
      return state;
  }
};

const categories = ["all", "fiction", "non-fiction", "science", "history"];
const courses = ["all", "course1", "course2", "course3"];

// BookList component
const BookList = () => {
  const { getLibraries } = useFileUpload();
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: getLibraries,
  });

  const [state, dispatch] = useReducer(reducer, initialState);
  const { setIsOpen } = useTour();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("bookListPage") === null &&
      state.filteredBooks.length > 0
    ) {
      setIsOpen(true);
      localStorage.setItem("bookListPage", "true");
    }
  }, [setIsOpen, state.filteredBooks]);

  useEffect(() => {
    if (data?.data) {
      console.log("Fetched books:", data.data);
      dispatch({ type: "SET_FILTERED_BOOKS", payload: data });
    }
  }, [data]);

  console.log("Filtered Books:", state.filteredBooks);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching books: {(error as Error).message}</div>;

  function handleReadBook(book: BookMaterial): void {
    // Implement the logic to read the book
  }

  return (
    <div className="container mx-auto px-4 pb-8 dark:text-gray-100">
      <div className="sticky top-0 bg-background pb-4 z-10">
        <div className="flex justify-between w-full items-center pt-4">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
          <Button
            onClick={() => setIsOpen(true)}
            className="start-tour-button"
            variant="outline"
          >
            <CirclePlay className="mr-2 h-4 w-4" />
            Start Tour
          </Button>
        </div>
        <h1 className="text-4xl font-bold my-8 text-center">
          Select a Book for Your Exam Preparation
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <SearchInput searchTerm={state.searchTerm} dispatch={dispatch} />
          <FilterSelect
            label="Category"
            value={state.categoryFilter}
            options={categories}
            onChange={(value) =>
              dispatch({ type: "SET_CATEGORY_FILTER", payload: value })
            }
          />
          <FilterSelect
            label="Course"
            value={state.courseFilter}
            options={courses}
            onChange={(value) =>
              dispatch({ type: "SET_COURSE_FILTER", payload: value })
            }
          />
          <UploadContent />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.filteredBooks.length > 0 ? (
          state.filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              handleReadBook={handleReadBook}
            />
          ))
        ) : (
          <div>No books available.</div>
        )}
      </div>
    </div>
  );
};

// SearchInput component
const SearchInput = ({
  searchTerm,
  dispatch,
}: {
  searchTerm: string;
  dispatch: React.Dispatch<Action>;
}) => (
  <div className="relative flex-grow max-w-md w-full">
    <Input
      type="text"
      placeholder="Search books..."
      value={searchTerm}
      onChange={(e) =>
        dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
      }
      className="w-full py-2 pl-10 pr-4 transition-colors duration-300 border-2 rounded-full search-input border-primary focus:outline-none focus:border-primary-dark dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />
    <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-primary dark:text-gray-400" />
  </div>
);

// FilterSelect component
const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full md:w-[180px]">
      <SelectValue placeholder={label} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// BookCard component
const BookCard = ({
  book,
  handleReadBook,
}: {
  book: BookMaterial;
  handleReadBook: (book: BookType) => void;
}) => (
  <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 overflow-hidden">
    <CardHeader className="bg-primary p-6 text-primary-foreground h-[180px]">
      <div className="flex items-center justify-between mb-4">
        <Book className="w-12 h-12" />
        <Badge variant="secondary" className="text-xs font-semibold">
          {book.material_type}
        </Badge>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <h2 className="text-2xl font-bold leading-tight line-clamp-2">
              {book.material_title}
            </h2>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-primary-foreground">{book.material_title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="text-sm mt-2 text-primary-foreground/80">
        by {book.author}
      </p>
    </CardHeader>
    <CardContent className="flex-grow p-6 bg-card">
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline">{book.material_type}</Badge>
      </div>
    </CardContent>
    <CardFooter className="bg-muted/50 p-6 gap-4">
      <Button
        className="read-book-button flex-1"
        variant="outline"
        onClick={() => handleReadBook(book as unknown as BookType)}
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Read Content
      </Button>
      <Link href="/student/exam-v2/chapter" className="flex-1">
        <Button className="start-prep-button w-full" variant="default">
          <GraduationCap className="w-4 h-4 mr-2" />
          Start Prep
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

// BookListWithTour component
export default function BookListWithTour() {
  const handlePrevStep = ({
    currentStep,
    setCurrentStep,
  }: {
    currentStep: number;
    setCurrentStep: (step: number) => void;
  }) => {
    setCurrentStep(currentStep - 1);
  };

  const handleNextStep = ({
    currentStep,
    stepsLength,
    setIsOpen,
    setCurrentStep,
  }: {
    currentStep: number;
    stepsLength: number;
    setIsOpen: (isOpen: boolean) => void;
    setCurrentStep: (step: number) => void;
  }) => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <TourProvider
      steps={steps}
      disableDotsNavigation
      scrollSmooth
      onClickHighlighted={(e) => e.stopPropagation()}
      disableInteraction
      prevButton={({ currentStep, setCurrentStep }) => (
        <button
          onClick={() => handlePrevStep({ currentStep, setCurrentStep })}
          disabled={currentStep === 0}
          className="disabled:opacity-50"
        >
          <ChevronLeftIcon />
        </button>
      )}
      nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => (
        <button
          onClick={() =>
            handleNextStep({
              currentStep,
              stepsLength,
              setIsOpen,
              setCurrentStep,
            })
          }
          disabled={currentStep === stepsLength - 1}
          className="disabled:opacity-50"
        >
          <ChevronRightIcon />
        </button>
      )}
    >
      <BookList />
    </TourProvider>
  );
}
