"use client";
export const runtime = "edge";
import Loading from "@/app/(dashboard)/loading";
import ErrorMessage from "@/components/brand/shared/error";
import {
  courseReducer,
  initialState,
} from "@/components/brand/student/course/reducer";
import { Section } from "@/components/brand/student/course/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, FileText, MessageSquare, Paperclip } from "lucide-react";
import { useParams } from "next/navigation";
import { useReducer } from "react";

export default function CourseDetailsPage() {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  const { id } = useParams();

  const {
    data: section,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["section", id],
    queryFn: async () => {
      const response = await api.get<Section>(`/section/section_updates/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Error loading section" />;
  }

  if (!section) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {section.template_course.template_name}
          </h1>
          <p className="text-gray-600 mt-2">
            {section.template_course.template_description}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Department: {section.template_course.department.department_name}
            </p>
            <p>Year: {section.template_course.template_year}</p>
          </div>
        </div>

        <Tabs defaultValue="stream" className="space-y-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
            <TabsTrigger value="exclusive">Exclusive Content</TabsTrigger>
          </TabsList>

          <TabsContent value="stream" className="space-y-4">
            {section.announcements.map((announcement) => (
              <Card key={announcement.announcement_id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">
                      {announcement.announcement_title}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-500">
                    Posted on {format(new Date(announcement.created_at), "PPP")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: announcement.announcement_description,
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            {section.assignments.map((assignment) => (
              <Card key={assignment.assignment_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        {assignment.assignment_title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          Due {format(new Date(assignment.deadline), "PPP")}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          dispatch({
                            type: "SET_SELECTED_ASSIGNMENT",
                            payload: assignment,
                          })
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{assignment.assignment_description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            {section.template_course.course_materials.map((material) => (
              <Card key={material.library_item.library_id}>
                <CardHeader>
                  <CardTitle>{material.library_item.material_title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p>{material.library_item.material_description}</p>
                    <div className="text-sm text-gray-500">
                      <p>Type: {material.library_item.material_type}</p>
                      <p>Author: {material.library_item.author}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="exclusive" className="space-y-4">
            {section.section_exclusive_contents.map((content) => (
              <Card key={content.section_exclusive_content_id}>
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p>{content.description}</p>
                    <div className="text-sm text-gray-500">
                      <p>Library Item ID: {content.library_item_id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog
          open={!!state.selectedAssignment}
          onOpenChange={() =>
            dispatch({ type: "SET_SELECTED_ASSIGNMENT", payload: null })
          }
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {state.selectedAssignment?.assignment_title}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">
                    {state.selectedAssignment?.assignment_description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Assignment Details</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Type: {state.selectedAssignment?.assignment_type}</p>
                    <p>Total Marks: {state.selectedAssignment?.total_marks}</p>
                    <p>
                      Number of Questions:{" "}
                      {state.selectedAssignment?.number_of_questions}
                    </p>
                    <p>
                      Start Time:{" "}
                      {state.selectedAssignment &&
                        format(
                          new Date(state.selectedAssignment.start_time),
                          "PPP p",
                        )}
                    </p>
                    <p>
                      Deadline:{" "}
                      {state.selectedAssignment &&
                        format(
                          new Date(state.selectedAssignment.deadline),
                          "PPP p",
                        )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Materials</h4>
                {state.selectedAssignment?.assignment_materials.length ? (
                  <ul className="space-y-2">
                    {state.selectedAssignment.assignment_materials.map(
                      (material) => (
                        <li
                          key={material.assignment_material_id}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span>
                            {material.title || material.library_item_id}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500">No materials attached</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
