export type LibraryItem = {
  material_type: string
  material_title: string
  material_description: string
  author: string
  visibility: boolean,
  library_id: string,
  file_url: string
}

export type SectionExclusiveContent = {
  section_id: string
  title: string
  description: string
  library_item: LibraryItem
  section_exclusive_content_id: string
}

export type Props = {
  section_exclusive_contents: SectionExclusiveContent[]
}

export interface Step {
  selector: string;
  content: string;
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
  course_materials: any[];
  branch_id: string;
  department: Department;
}

export interface CourseMaterialLibraryItem {
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
  library_item: CourseMaterialLibraryItem;
  created_at: string;
  updated_at: string;
}

export type CourseMaterials = CourseMaterial[];

export interface ContentMeta {
  library_id: string;
  material_file: string;
  author: string;
  updated_at: string;
  user_id: string;
  material_type: string;
  material_title: string;
  material_description: string | null;
  visibility: boolean;
  created_at: string;
}

export interface PageRange {
  start: number;
  end: number;
}

export interface Section {
  id: string;
  title: string;
  pageRanges: PageRange;
}

export interface Chapter {
  id: string;
  title: string;
  pageRanges: PageRange;
  sections: Section[];
}

export interface ContentOutline {
  content_meta: ContentMeta;
  content_outline: Chapter[];
}
