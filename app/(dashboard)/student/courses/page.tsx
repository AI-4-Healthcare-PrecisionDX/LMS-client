"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowRight, BookOpen, Microscope, Search } from "lucide-react";
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error loading courses: {error.message}
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
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
                    dispatch({
                      type: "SET_COURSE_CODE",
                      payload: e.target.value,
                    })
                  }
                  required
                />
                {joinSectionMutation.isError && (
                  <p className="text-red-500">
                    {joinSectionMutation.error.message}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleJoinCourse}>Join Course</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center text-gray-500">
          <p>You haven't joined any courses yet.</p>
          <p>Use the "Join New Course" button to enroll in a course.</p>
        </div>
      </div>
    );
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSections?.map((section) => (
          <Card
            key={section.section_id}
            className="hover:shadow-lg transition-shadow overflow-hidden"
          >
            <CardHeader className="border-b bg-secondary/10">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-mono">{section.section_code}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date() < new Date(section.start_date)
                    ? "Upcoming"
                    : new Date() > new Date(section.end_date)
                      ? "Completed"
                      : "Active"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-xl mb-4 text-primary">
                {section.template_course.template_name}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-secondary/20 rounded-full">
                    <Microscope className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Department:</span>{" "}
                    {section.template_course.department.department_name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-secondary/20 rounded-full">
                    <Microscope className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Instructor:</span>{" "}
                    {section.teacher.user.first_name}{" "}
                    {section.teacher.user.last_name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium mb-1">Course Materials</p>
                    <p className="text-2xl font-bold text-primary">
                      {section.template_course.course_materials.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Exclusive Content
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {section.section_exclusive_contents.length}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-sm p-3 bg-secondary/10 rounded-lg">
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p>
                      {new Date(section.start_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">End Date</p>
                    <p>
                      {new Date(section.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center bg-secondary/5 mt-4">
              <Link href={`/student/courses/${section.section_id}`}>
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  View Course <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
