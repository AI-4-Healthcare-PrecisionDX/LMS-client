"use client";
import ErrorMessage from "@/components/brand/shared/error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CalendarIcon,
  Microscope,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useReducer } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Zod schemas
const UserSchema = z.object({
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_active: z.boolean(),
});

const TeacherSchema = z.object({
  teacher_id: z.string().uuid(),
  user_id: z.string().uuid(),
  user: UserSchema,
});

const DepartmentSchema = z.object({
  department_name: z.string(),
  department_id: z.string().uuid(),
  branch_id: z.string().uuid(),
  updated_at: z.string().datetime(),
});

const TemplateCourseSchema = z.object({
  template_name: z.string(),
  template_description: z.string(),
  template_year: z.string(),
  course_outline: z.string(),
  department_id: z.string().uuid(),
  template_course_id: z.string().uuid(),
  admin_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  course_materials: z.array(z.unknown()),
  branch_id: z.string().uuid(),
  department: DepartmentSchema,
});

const SectionSchema = z.object({
  section_name: z.string(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  template_course_id: z.string().uuid(),
  section_id: z.string().uuid(),
  section_code: z.string(),
  teacher_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  teacher: TeacherSchema,
  template_course: TemplateCourseSchema,
  student_count: z.number(),
  section_exclusive_contents: z.array(z.unknown()),
});

type Section = z.infer<typeof SectionSchema>;

// State management
type State = {
  searchTerm: string;
  courseCode: string;
};

type Action =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_COURSE_CODE"; payload: string }
  | { type: "RESET_COURSE_CODE" };

const initialState: State = {
  searchTerm: "",
  courseCode: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_COURSE_CODE":
      return { ...state, courseCode: action.payload };
    case "RESET_COURSE_CODE":
      return { ...state, courseCode: "" };
    default:
      return state;
  }
}

export default function CoursesPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();

  // Fetch sections
  const {
    data: sections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      const response = await api.get<Section[]>("/student/get-sections");

      return response.data;
    },
  });

  // Join section mutation
  const joinSectionMutation = useMutation({
    mutationFn: async (sectionCode: string) => {
      await api.post(`student/join-section?section_code=${sectionCode}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Successfully joined the course");
      dispatch({ type: "RESET_COURSE_CODE" });
    },
    onError: (error) => {
      toast.error("Failed to join course: " + error.message);
    },
  });

  const handleJoinCourse = () => {
    if (state.courseCode.trim()) {
      joinSectionMutation.mutate(state.courseCode);
    }
  };

  const filteredSections = sections?.filter(
    (section) =>
      section.template_course.template_name
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase()) ||
      section.section_code
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Error loading courses" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          My Courses
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
            }
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              Join New Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a Course</DialogTitle>
              <DialogDescription>
                Enter the course section code provided by your instructor
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter course code"
                value={state.courseCode}
                onChange={(e) =>
                  dispatch({ type: "SET_COURSE_CODE", payload: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleJoinCourse}>Join Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredSections?.length === 0 && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">No courses found</div>
          <div className="text-gray-500">
            You are not enrolled in any courses yet. Please contact your
            instructor to get enrolled. If you have a course code, you can join
            a course by clicking the button above.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSections?.map((section) => (
          <Card
            key={section.section_id}
            className="hover:shadow-lg transition-shadow overflow-hidden group relative"
          >
            <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/10 relative">
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {section.template_course.template_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    {section.teacher.user.first_name}{" "}
                    {section.teacher.user.last_name}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span className="text-sm font-mono text-gray-600">
                    {section.section_code}
                  </span>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm"
                >
                  {new Date() < new Date(section.start_date)
                    ? "Upcoming"
                    : new Date() > new Date(section.end_date)
                      ? "Completed"
                      : "Active"}
                </Badge>
              </div>
            </div>

            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Microscope className="h-4 w-4" />
                  <span className="text-sm">
                    {section.template_course.department.department_name}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>
                      {section.template_course.course_materials.length}{" "}
                      Materials
                    </span>
                  </div>
                  <div>•</div>
                  <div>
                    {section.section_exclusive_contents.length} Exclusive
                    Content
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(section.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {" - "}
                    {new Date(section.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Link
                href={`/student/courses/${section.section_id}`}
                className="w-full"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-primary/5"
                >
                  Open Course
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
