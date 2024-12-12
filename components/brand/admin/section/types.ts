import { z } from "zod";
export type Section = {
  section_id: string;
  section_name: string;
  start_date: string;
  end_date: string;
  template_course: { template_name: string; template_course_id: string };
  teacher: {
    user: { first_name: string; last_name: string };
    teacher_id: string;
  };
  student_count: number;
  section_code: string;
};

export type Teacher = {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone_number: string;
  user_id: string;
  branch_id: string;
  username: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  updated_at: string;
  teacher: {
    teacher_id: string;
  };
};

export type State = {
  sections: Section[];
  filteredSections: Section[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  selectedCourse: string;
  selectedTeacher: string;
};

export type Action =
  | { type: "SET_SECTIONS"; payload: Section[] }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_SELECTED_COURSE"; payload: string }
  | { type: "SET_SELECTED_TEACHER"; payload: string };

export const formSchema = z.object({
  section_name: z.string().min(1, "Section name is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  template_course_id: z.string().min(1, "Course is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
});
