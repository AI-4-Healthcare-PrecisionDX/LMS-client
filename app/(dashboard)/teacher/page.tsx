/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/axios-config";
import { AuthContextType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ArrowRight,
  BookOpen,
  Filter,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useReducer } from "react";

interface User {
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

interface Teacher {
  teacher_id: string;
  user_id: string;
  user: User;
}

interface TemplateCourse {
  template_name: string;
  template_description: string;
  template_year: string;
  course_outline: string;
  department_id: string;
  template_course_id: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
  template_course_access: any[];
  course_materials: any[];
}

interface Section {
  section_name: string;
  start_date: string;
  end_date: string;
  template_course_id: string;
  section_id: string;
  section_code: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
  teacher: Teacher;
  template_course: TemplateCourse;
  student_count: number | null;
  section_exclusive_contents: any[];
}

interface DashboardState {
  sections: Section[];
  selectedCourse: string;
  sectionName: string;
  isDialogOpen: boolean;
  viewMode: "grid" | "list";
  searchQuery: string;
  filterCourse: string;
}

const initialState: DashboardState = {
  sections: [],
  selectedCourse: "",
  sectionName: "",
  isDialogOpen: false,
  viewMode: "grid",
  searchQuery: "",
  filterCourse: "",
};

type DashboardAction =
  | { type: "SET_SELECTED_COURSE"; payload: string }
  | { type: "SET_SECTION_NAME"; payload: string }
  | { type: "SET_DIALOG_OPEN"; payload: boolean }
  | { type: "ADD_SECTION"; payload: Section }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_FILTER_COURSE"; payload: string };

function reducer(
  state: DashboardState,
  action: DashboardAction,
): DashboardState {
  switch (action.type) {
    case "SET_SELECTED_COURSE":
      return { ...state, selectedCourse: action.payload };
    case "SET_SECTION_NAME":
      return { ...state, sectionName: action.payload };
    case "SET_DIALOG_OPEN":
      return { ...state, isDialogOpen: action.payload };
    case "ADD_SECTION":
      return {
        ...state,
        sections: [...state.sections, action.payload],
        selectedCourse: "",
        sectionName: "",
        isDialogOpen: false,
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER_COURSE":
      return { ...state, filterCourse: action.payload };
    default:
      return state;
  }
}

const PageHeader = ({ teacherSecData }: { teacherSecData: Section[] }) => {
  const firstName = teacherSecData?.[0]?.teacher?.user?.first_name || "User";

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 px-4 mb-8">
      <div className="container mx-auto">
        <h1 className="text-xl font-bold mb-2">Welcome, {firstName}! 👋🏼</h1>
        <p className="text-primary-foreground/80">
          Manage your course sections and student access
        </p>
      </div>
    </div>
  );
};

const ActionBar = ({
  state,
  dispatch,
  teacherSecData,
}: {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  teacherSecData: Section[];
}) => {
  // Get unique courses from sections
  const uniqueCourses = Array.from(
    new Set(
      teacherSecData.map((section) => section.template_course.template_name),
    ),
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search sections by name or course..."
          className="pl-10"
          value={state.searchQuery}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })
          }
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                dispatch({ type: "SET_FILTER_COURSE", payload: "" })
              }
            >
              All Courses
            </DropdownMenuItem>
            {uniqueCourses.map((courseName) => (
              <DropdownMenuItem
                key={courseName}
                onClick={() =>
                  dispatch({
                    type: "SET_FILTER_COURSE",
                    payload: courseName,
                  })
                }
              >
                {courseName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex border rounded-lg">
          <Button
            variant={state.viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "grid" })}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={state.viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "list" })}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({
  section,
  viewMode,
}: {
  section: Section;
  viewMode: "grid" | "list";
}) => {
  if (viewMode === "list") {
    return (
      <>
        <Card className="flex items-center p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-white">
                  {section.template_course.template_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {section.section_name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right flex gap-1 items-center">
              <p className="text-sm font-medium">Join Code:</p>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                {section.section_code}
              </code>
            </div>
            <Button asChild variant="ghost">
              <Link href={`/teacher/course-details/${section.section_id}`}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              {section.template_course.template_name}
            </div>
          </CardTitle>
          <CardDescription>{section.section_name}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-sm">Join Code:</span>
            <code className="bg-muted px-3 py-1 rounded-md text-sm">
              {section.section_code}
            </code>
          </div>
          {/* <div className="text-sm text-muted-foreground">
            <small>{section.student_count || 0} Students</small>
          </div> */}
        </CardContent>
        <CardFooter className="bg-muted/50">
          <Button variant="ghost" className="w-full" asChild>
            <Link href={`/teacher/course-details/${section.section_id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

const fetchTeacherSec = async (): Promise<Section[]> => {
  const response = await api.get(`/section/teacher`);
  return response.data;
};

export default function FacultyPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = useAuth() as AuthContextType;

  //Query for fetching teacher data
  const teacherQuery = useQuery<Section[], AxiosError>({
    queryKey: ["teacherData"],
    queryFn: fetchTeacherSec,
    enabled: isAuthenticated && user?.role === "teacher",
  });
  if (teacherQuery.isError) {
    const error = teacherQuery.error;

    // Check for AxiosError and handle it
    if (error instanceof AxiosError && error.response?.status === 401) {
      redirect("/login");
    }
  }
  const teacherSecData = teacherQuery.data || [];

  // Enhanced filtering logic
  const filteredSections = teacherSecData.filter((section) => {
    const searchLower = state.searchQuery.toLowerCase().trim();

    // Search across template course name and section name
    const matchesSearch =
      searchLower === "" ||
      section.template_course.template_name
        .toLowerCase()
        .includes(searchLower) ||
      section.section_name.toLowerCase().includes(searchLower);

    // Improved course filter to use template_name instead of template_course_id
    const matchesCourseFilter =
      state.filterCourse === "" ||
      section.template_course.template_name === state.filterCourse;

    return matchesSearch && matchesCourseFilter;
  });

  return (
    <div>
      <PageHeader teacherSecData={teacherSecData} />

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Sections</h2>
        </div>

        <ActionBar
          state={state}
          dispatch={dispatch}
          teacherSecData={teacherSecData}
        />

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div
            className={
              state.viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredSections.map((section: Section) => (
              <SectionCard
                key={section.section_id}
                section={section}
                viewMode={state.viewMode}
              />
            ))}
            {filteredSections.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {state.searchQuery.trim() !== ""
                  ? `No sections found matching "${state.searchQuery}"`
                  : state.filterCourse
                    ? `No sections found for course: ${state.filterCourse}`
                    : "No sections found. Create a new section to get started."}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
