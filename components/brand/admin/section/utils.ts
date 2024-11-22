import { Section } from "./types";

export const filterSections = (
  sections: Section[],
  searchTerm: string,
  course: string,
  teacher: string,
) => {
  return sections.filter(
    (section) =>
      section.section_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (course === "all-courses" ||
        course === "" ||
        section.template_course.template_course_id === course) &&
      (teacher === "all-teachers" ||
        teacher === "" ||
        section.teacher.teacher_id === teacher),
  );
};
