// Type definitions
export interface AssignmentQuestion {
  assignment_question_id: string;
  question_type: "mcq" | "broad";
  question_text: string;
  options_for_mcq: string[];
  marks: number;
  question_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssignmentMaterial {
  assignment_material_id: string;
  title: string | null;
  description: string | null;
  library_item_id: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  assignment_id: string;
  assignment_type: string;
  assignment_title: string;
  assignment_description: string | null;
  number_of_questions: number;
  total_marks: number;
  start_time: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  section_id: string;
  assignment_questions: AssignmentQuestion[];
  assignment_materials: AssignmentMaterial[];
}

export interface Announcement {
  announcement_id: string;
  announcement_title: string;
  announcement_description: string;
  section_id: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}

export interface LibraryItem {
  material_type: string;
  material_title: string;
  material_description: string | null;
  author: string;
  visibility: boolean;
  library_id: string;
  updated_at: string;
  created_at: string;
  user_id: string;
}

export interface CourseMaterial {
  library_item: LibraryItem;
  created_at: string;
  updated_at: string;
}

export interface SectionExclusiveContent {
  section_exclusive_content_id: string;
  title: string;
  description: string | null;
  user_id: string;
  section_id: string;
  library_item_id: string;
}

export interface Department {
  department_name: string;
  department_id: string;
  branch_id: string;
  updated_at: string;
}

export interface TemplateCourse {
  template_name: string;
  template_description: string;
  template_year: string;
  course_outline: string;
  department_id: string;
  template_course_id: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
  course_materials: CourseMaterial[];
  branch_id: string;
  department: Department;
}

export interface Section {
  template_course: TemplateCourse;
  announcements: Announcement[];
  section_exclusive_contents: SectionExclusiveContent[];
  assignments: Assignment[];
}
