import { z } from "zod";

export const courseSchema = z.object({
  template_name: z.string().min(1, "Name is required"),
  template_description: z.string().min(1, "Description is required"),
  template_year: z.string().min(1, "Year is required"),
  department_id: z.string().uuid("Invalid department ID"),
  course_materials: z.array(z.string().uuid()),
});

export type Course = z.infer<typeof courseSchema> & {
  template_course_id: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
  department: {
    department_name: string;
    branch_id: string;
    department_id: string;
  };
  course_materials: CourseMaterial[];
};

export type CourseMaterial = {
  library_item: {
    material_type: string;
    material_title: string;
    material_description: string;
    author: string;
    visibility: boolean;
    library_id: string;
    updated_at: string;
    created_at: string;
    user_id: string;
  };
};

// State management
export type State = {
  searchTerm: string;
  selectedDepartment: string | null;
  selectedYear: string | null;
};

export type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_DEPARTMENT"; payload: string | null }
  | { type: "SET_YEAR"; payload: string | null };

export type Department = {
  department_id: string;
  department_name: string;
  branch_id: string;
};
