/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  Pencil,
  PlusIcon,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { reducer } from "@/components/brand/admin/section/reducer";
import {
  formSchema,
  Section,
  Teacher,
} from "@/components/brand/admin/section/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function Component() {
  const [state, dispatch] = useReducer(reducer, {
    sections: [],
    filteredSections: [],
    searchTerm: "",
    currentPage: 1,
    itemsPerPage: 9,
    selectedCourse: "",
    selectedTeacher: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const queryClient = useQueryClient();

  // Fetch sections
  const {
    data: sections,
    isLoading,
    error: sectionsError,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      try {
        const response = await api.get("/section/?skip=0&limit=100");
        dispatch({ type: "SET_SECTIONS", payload: response.data });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });

  // Fetch courses for filter
  const { data: courses, error: coursesError } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      try {
        const response = await api.get("/course?skip=0&limit=1000");
        return response.data;
      } catch (error) {
        toast.error("Failed to fetch courses. Please try again later.");
        throw error;
      }
    },
  });

  // Fetch teachers for filter
  const { data: teachers, error: teachersError } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await api.get<Teacher[]>("/admin/teachers");
      return response.data;
    },
  });

  // Add new section mutation
  const addSectionMutation = useMutation({
    mutationFn: (newSection: z.infer<typeof formSchema>) =>
      api.post("/section/create", newSection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setIsAddModalOpen(false);
      form.reset();
      toast.success("Section added successfully!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { detail: string })?.detail ||
          "Failed to add section",
      );
    },
  });

  // Edit section mutation
  const editSectionMutation = useMutation({
    mutationFn: (
      updatedSection: z.infer<typeof formSchema> & { section_id: string },
    ) => api.put(`/section/${updatedSection.section_id}`, updatedSection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setIsEditModalOpen(false);
      setEditingSection(null);
      toast.success("Section updated successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { detail: string })?.detail ||
          "Failed to update section",
      );
    },
  });

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: string) => api.delete(`/section/${sectionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Section deleted successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { detail: string })?.detail ||
          "Failed to delete section",
      );
    },
  });

  // React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section_name: "",
      start_date: "",
      end_date: "",
      template_course_id: "",
      teacher_id: "",
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section_name: "",
      start_date: "",
      end_date: "",
      template_course_id: "",
      teacher_id: "",
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const handleCourseFilter = (value: string) => {
    dispatch({ type: "SET_SELECTED_COURSE", payload: value });
  };

  const handleTeacherFilter = (value: string) => {
    dispatch({ type: "SET_SELECTED_TEACHER", payload: value });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await addSectionMutation.mutateAsync(values);
  };

  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    if (editingSection) {
      await editSectionMutation.mutateAsync({
        ...values,
        section_id: editingSection.section_id,
        // Keep original teacher and course IDs
        teacher_id: editingSection.teacher.teacher_id,
        template_course_id: editingSection.template_course.template_course_id,
      });
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    editForm.reset({
      section_name: section.section_name,
      start_date: format(new Date(section.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(section.end_date), "yyyy-MM-dd"),
      template_course_id: section.template_course.template_course_id,
      teacher_id: section.teacher.teacher_id,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (sectionId: string) => {
    await deleteSectionMutation.mutateAsync(sectionId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  const totalPages = Math.ceil(
    state.filteredSections.length / state.itemsPerPage,
  );
  const paginatedSections =
    sections?.slice(
      (state.currentPage - 1) * state.itemsPerPage,
      state.currentPage * state.itemsPerPage,
    ) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl mb-6">Section Management</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search sections..."
            value={state.searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Select onValueChange={handleCourseFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-courses">All Courses</SelectItem>
              {courses?.map(
                (course: {
                  template_course_id: string;
                  template_name: string;
                }) => (
                  <SelectItem
                    key={course.template_course_id}
                    value={course.template_course_id}
                  >
                    {course.template_name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Select onValueChange={handleTeacherFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-teachers">All Teachers</SelectItem>
              {teachers?.map((teacher) => (
                <SelectItem
                  key={teacher.user_id}
                  value={teacher.teacher.teacher_id}
                >
                  {teacher.first_name} {teacher.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
                <DialogDescription>
                  Create a new section here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="section_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter section name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="template_course_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses?.map(
                              (course: {
                                template_course_id: string;
                                template_name: string;
                              }) => (
                                <SelectItem
                                  key={course.template_course_id}
                                  value={course.template_course_id}
                                >
                                  {course.template_name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teacher_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers?.map((teacher) => (
                              <SelectItem
                                key={teacher.teacher.teacher_id}
                                value={teacher.teacher.teacher_id}
                              >
                                {teacher.first_name} {teacher.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={addSectionMutation.status === "pending"}
                    >
                      {addSectionMutation.status === "pending" && (
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Section
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {
        // Show error message if there's an error fetching sections
        sectionsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            An error occurred while fetching sections. Please try again.
          </div>
        )
      }

      {
        // Show error message if there's an error fetching courses
        coursesError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            An error occurred while fetching courses. Please try again.
          </div>
        )
      }

      {
        // Show error message if there's an error fetching teachers
        teachersError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            An error occurred while fetching teachers. Please try again.
          </div>
        )
      }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {paginatedSections.map((section: Section) => (
          <Card key={section.section_id}>
            <CardHeader>
              <CardTitle>{section.section_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                {section.template_course.template_name}
              </p>
              <p className="text-sm mb-2">
                Teacher: {section.teacher.user.first_name}{" "}
                {section.teacher.user.last_name}
              </p>
              <p className="text-sm mb-2">
                Students: {section.student_count ?? 0}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(section.start_date), "MMM d, yyyy")} -{" "}
                {format(new Date(section.end_date), "MMM d, yyyy")}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleEdit(section)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the section and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(section.section_id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={() => handlePageChange(state.currentPage - 1)}
          disabled={state.currentPage === 1}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <span>
          Page {state.currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(state.currentPage + 1)}
          disabled={state.currentPage === totalPages}
        >
          Next <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update the section details here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-8"
            >
              <FormField
                control={editForm.control}
                name="section_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter section name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="template_course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input
                        value={
                          editingSection?.template_course.template_name || ""
                        }
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <FormControl>
                      <Input
                        value={
                          `${editingSection?.teacher.user.first_name} ${editingSection?.teacher.user.last_name}` ||
                          ""
                        }
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={editSectionMutation.status === "pending"}
                >
                  {editSectionMutation.status === "pending" && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
