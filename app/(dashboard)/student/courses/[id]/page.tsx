"use client";
export const runtime = "edge";
import Loading from "@/app/(dashboard)/loading";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useReducer } from "react";

// Type definitions
interface Section {
  section_name: string;
  start_date: string;
  end_date: string;
  section_id: string;
  section_code: string;
  teacher: {
    user: {
      first_name: string;
      last_name: string;
    };
  };
  template_course: {
    template_name: string;
    department: {
      department_name: string;
    };
    course_materials: Array<{
      library_item: {
        material_title: string;
        material_type: string;
      };
    }>;
  };
  section_exclusive_contents: Array<{
    title: string;
    library_item: {
      material_title: string;
      material_type: string;
    };
  }>;
}

// State management
type State = {
  section: Section | null;
};

type Action = { type: "SET_SECTION"; payload: Section };

const initialState: State = {
  section: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SECTION":
      return { ...state, section: action.payload };
    default:
      return state;
  }
}

export default function CourseDetailsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { id } = useParams();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error loading section: {error.message}
        </div>
      </div>
    );
  }

  if (!state.section) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 space-y-6">
        {sections
          ?.filter((section) => section.section_code === id)
          .map((section) => (
            <div key={section.section_id} className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {section.template_course.template_name}
                </h1>
                <p className="text-gray-600 mb-4">
                  {section.template_course.department.department_name}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h2 className="font-semibold">Section Details</h2>
                    <p>Section Code: {section.section_code}</p>
                    <p>Section Name: {section.section_name}</p>
                    <p>
                      Start Date:{" "}
                      {new Date(section.start_date).toLocaleDateString()}
                    </p>
                    <p>
                      End Date:{" "}
                      {new Date(section.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h2 className="font-semibold">Instructor</h2>
                    <p>
                      {section.teacher.user.first_name}{" "}
                      {section.teacher.user.last_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Course Materials</h2>
                <div className="space-y-2">
                  {section.template_course.course_materials.map(
                    (material, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-600">
                          {material.library_item.material_type}:
                        </span>
                        <span>{material.library_item.material_title}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Section Exclusive Content
                </h2>
                <div className="space-y-2">
                  {section.section_exclusive_contents.map((content, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {content.library_item.material_type}:
                      </span>
                      <span>{content.library_item.material_title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
