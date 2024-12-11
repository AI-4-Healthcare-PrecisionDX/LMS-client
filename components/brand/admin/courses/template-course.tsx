"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CourseMateriels } from "./course-materials";
import { reducer } from "./reducer";
import {
  Course,
  CourseMaterial,
  courseSchema,
  Department,
  State,
} from "./types";

const initialState: State = {
  searchTerm: "",
  selectedDepartment: null,
  selectedYear: null,
};

const getCourses = async () => {
  const { data } = await api.get<Course[]>("/course?skip=0&limit=100");
  return data;
};

const getDepartments = async () => {
  const { data } = await api.get<Department[]>("/admin/departments");
  return data;
};

const createCourse = async (course: z.infer<typeof courseSchema>) => {
  const { data } = await api.post("/course", course);
  return data;
};

const updateCourse = async ({
  id,
  ...course
}: { id: string } & z.infer<typeof courseSchema>) => {
  try {
    const { data } = await api.put(`/course/${id}`, {
      template_name: course.template_name,
      template_description: course.template_description,
      template_year: course.template_year,
      department_id: course.department_id,
      course_materials: course.course_materials,
    });
    return data;
  } catch (error) {
    throw new Error(`Failed to update course: ${error}`);
  }
};

const deleteCourse = async (id: string) => {
  const { data } = await api.delete(`/course/${id}`);
  return data;
};

export default function TemplateCourse() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      template_name: "",
      template_description: "",
      template_year: "",
      department_id: "",
      course_materials: [],
    },
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsOpen(false);
      form.reset();
      toast.success("Course created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create course");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsOpen(false);
      setEditingCourse(null);
      form.reset();
      toast.success("Course updated successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { detail: string })?.detail ||
          "Failed to update course",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });

  const filteredCourses = courses?.filter((course: Course) => {
    const matchesSearch =
      course.template_name
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase()) ||
      course.template_description
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase());
    const matchesDepartment =
      !state.selectedDepartment ||
      course.department_id === state.selectedDepartment;
    const matchesYear =
      !state.selectedYear || course.template_year === state.selectedYear;
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const onSubmit = (values: z.infer<typeof courseSchema>) => {
    if (editingCourse) {
      updateMutation.mutate({
        id: editingCourse.template_course_id,
        ...values,
        department_id: editingCourse.department_id, // Keep original department_id when editing
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.reset({
      template_name: course.template_name,
      template_description: course.template_description,
      template_year: course.template_year,
      department_id: course.department_id,
      course_materials: course.course_materials.map(
        (material: CourseMaterial) => material.library_item.library_id,
      ),
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingCourse(null);
      form.reset({
        template_name: "",
        template_description: "",
        template_year: "",
        department_id: "",
        course_materials: [],
      });
    }
    setIsOpen(open);
  };

  return (
    <div className="py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Course Management</h1>
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 p-1"
                >
                  <FormField
                    control={form.control}
                    name="template_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter course name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="template_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="template_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={
                            field.value ? field.value.toString() : undefined
                          }
                          disabled={
                            !!editingCourse || departments?.length === 0
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  editingCourse
                                    ? editingCourse.department.department_name
                                    : departments?.length === 0
                                      ? "No departments available"
                                      : "Select department"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments?.map((department) => (
                              <SelectItem
                                key={department.department_id}
                                value={department.department_id}
                              >
                                {department.department_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending ||
                      updateMutation.isPending ||
                      (!editingCourse && departments?.length === 0)
                    }
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingCourse ? "Update" : "Create"} Course
                  </Button>
                </form>
              </Form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={state.searchTerm}
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH", payload: e.target.value })
              }
            />
          </div>
        </div>

        <Select
          onValueChange={(value) =>
            dispatch({ type: "SET_DEPARTMENT", payload: value })
          }
          disabled={departments?.length === 0}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue
              placeholder={
                departments?.length === 0
                  ? "No departments available"
                  : "Filter by department"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-departments">All Departments</SelectItem>
            {departments?.map((department) => (
              <SelectItem
                key={department.department_id}
                value={department.department_id}
              >
                {department.department_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </div>
        ) : filteredCourses?.length === 0 ? (
          <div className="col-span-full text-center">No courses found</div>
        ) : (
          filteredCourses?.map((course: Course) => (
            <div
              key={course.template_course_id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-[350px] flex flex-col justify-between"
            >
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {course.template_name}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {course.template_description.length > 100
                    ? course.template_description.slice(0, 100) + "..."
                    : course.template_description}
                </p>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Year
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-200">
                      {course.template_year}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Department
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-200">
                      {course.department.department_name}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <CourseMateriels
                    courseMaterials={course.course_materials}
                    courseID={course.template_course_id}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(course)}
                  className="rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                >
                  <Edit className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(course.template_course_id)}
                  disabled={deleteMutation.isPending}
                  className="rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                >
                  <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
