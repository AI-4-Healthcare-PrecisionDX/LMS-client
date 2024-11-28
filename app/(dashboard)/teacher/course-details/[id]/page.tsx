/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
export const runtime = "edge";

import CourseDetails from "@/components/brand/teacher/CourseDetails";
import { SectionExclusiveContent } from "@/components/brand/teacher/materials/types";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
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
  student_count: number;
  section_exclusive_contents: SectionExclusiveContent;
}

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
  course_materials: any[];
  department: any;
}

interface PageProps {
  params: {
    id: string;
  };
}

const fetchSection = async (sectionId: string): Promise<Section> => {
  const { data } = await api.get<Section>(`/section/${sectionId}`);
  return data;
};

const CoursePage = ({ params }: PageProps) => {
  const { user, isAuthenticated } = useAuth();

  const {
    data: sectionData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["section", params.id],
    queryFn: () => fetchSection(params.id),
    enabled: !!params.id && isAuthenticated, // Only fetch if we have an ID and user is authenticated
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2, // Retry twice before failing
  });

  if (isLoading) {
    return <LoadingSection />;
  }

  if (isError) {
    return <ErrorLoadingSection />;
  }

  if (!isAuthenticated || !sectionData || user?.role !== "teacher") {
    return <SectionNotFound />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <CourseDetails
        courseName={sectionData.template_course.template_name}
        section={sectionData.section_name}
        sectionId={sectionData?.section_id}
        totalStudents={sectionData.student_count}
        instructor={sectionData.teacher.user.first_name}
        section_exclusive_contents={sectionData.section_exclusive_contents}
      />
    </div>
  );
};

const LoadingSection = () => (
  <div className="text-center py-12">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
    </div>
  </div>
);

const SectionNotFound = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold text-gray-700">Section not found</h2>
    <p className="mt-2 text-gray-500">
      The requested section could not be found.
    </p>
  </div>
);

const ErrorLoadingSection = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold text-red-600">Error</h2>
    <p className="mt-2 text-gray-500">
      Failed to load section details. Please try again later.
    </p>
  </div>
);

export default CoursePage;
