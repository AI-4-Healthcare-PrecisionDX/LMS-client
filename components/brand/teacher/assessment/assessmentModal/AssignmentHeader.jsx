// interface AssignmentHeaderProps {
//   totalQuestions: number;
//   totalMarks: number;
// }

export default function AssignmentHeader({ totalQuestions, totalMarks }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Assignment
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Configure your assignment details and questions
        </p>
      </div>
      {/* <div className="flex items-center space-x-4 pr-1">
        <Badge variant="outline" className="px-4 py-2">
          <Timer className="w-4 h-4 mr-2" />
          Total Questions: {totalQuestions}
        </Badge>
        <Badge variant="outline" className="px-4 py-2">
          <GraduationCap className="w-4 h-4 mr-2" />
          Total Marks: {totalMarks}
        </Badge>
      </div> */}
    </div>
  );
}
