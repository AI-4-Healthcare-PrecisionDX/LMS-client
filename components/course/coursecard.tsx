import React from "react";

interface CourseCardProps {
  courseName: string;
  section: string;
  teacher: string;
  department: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseName,
  section,
  teacher,
  department,
}) => {
  return (
    <div className="relative w-full h-40 bg-blue-900 mb-4 rounded-lg overflow-hidden shadow-md text-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold">{courseName}</h2>
        <p className="mt-2 text-sm font-medium">Section: {section}</p>
        <p className="mt-1 text-sm font-medium">Teacher: {teacher}</p>
        <p className="mt-1 text-sm font-medium">Department: {department}</p>
      </div>
    </div>
  );
};

export default CourseCard;
