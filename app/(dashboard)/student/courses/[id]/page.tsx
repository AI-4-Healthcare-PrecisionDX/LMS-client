"use client";
export const runtime = "edge";
import ErrorMessage from "@/components/brand/shared/error";
import CaseLoadingSkeleton from "@/components/brand/shared/loading";
import AnnouncementSection from "@/components/brand/student/course/announcement";
import AssignmentSection from "@/components/brand/student/course/assignment";
import { ExclusiveMaterialSection } from "@/components/brand/student/course/exclusive-material";
import { CourseMateriels } from "@/components/brand/student/course/materials";
import { Section } from "@/components/brand/student/course/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function CourseDetailsPage() {
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
    return <CaseLoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Error loading section" />;
  }

  if (!section) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="bg-background dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-md p-8 mb-6 transition-colors">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground dark:text-gray-100 tracking-tight">
              {section.template_course.template_name}
            </h1>
            <p className="text-muted-foreground dark:text-gray-300 text-lg leading-relaxed">
              {section.template_course.template_description}
            </p>
            <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground dark:text-gray-400 border-t dark:border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16v-2" />
                  <path d="M3.3 7l8.7 5 8.7-5" />
                </svg>
                <span>
                  Department:{" "}
                  {section.template_course.department.department_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Year: {section.template_course.template_year}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stream" className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 shadow-sm">
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
            <TabsTrigger value="exclusive">Exclusive Content</TabsTrigger>
          </TabsList>

          <TabsContent value="stream" className="space-y-4">
            <AnnouncementSection announcements={section?.announcements} />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <AssignmentSection assignments={section.assignments} />
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <CourseMateriels templateCourse={section.template_course} />
          </TabsContent>

          <TabsContent value="exclusive" className="space-y-4">
            <ExclusiveMaterialSection
              section_exclusive_contents={section.section_exclusive_contents}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
