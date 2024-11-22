// app/components/ExamEvaluation/index.js
import { useEffect, useState } from "react";
import { mockAnswers, mockExam, mockSubmissions } from "./data/index";

const ExamHeader = ({ exam, submissions }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
    <div className="flex justify-between items-center">
      <p className="text-gray-300">
        Submissions: {submissions.length} / {exam.totalStudents}
      </p>
      <p className="text-gray-300">Total Marks: {exam.totalMarks}</p>
    </div>
  </div>
);

const StudentList = ({ submissions, selectedStudent, onStudentSelect }) => (
  <div className="col-span-3 bg-gray-800 rounded-lg p-4">
    <h2 className="text-xl font-bold mb-4">Students</h2>
    <div className="space-y-2">
      {submissions.map((submission) => (
        <div
          key={submission.studentId}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedStudent?.studentId === submission.studentId
              ? "bg-purple-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => onStudentSelect(submission)}
        >
          <p className="font-medium">Roll No: {submission.rollNo}</p>
          <p className="text-sm text-gray-300">{submission.studentName}</p>
        </div>
      ))}
    </div>
  </div>
);

const QuestionEvaluation = ({
  question,
  studentAnswer,
  expectedAnswer,
  maxMarks,
  type,
  options,
  onMarksUpdate,
}) => {
  const [marks, setMarks] = useState(0);

  useEffect(() => {
    if (type === "mcq") {
      setMarks(studentAnswer === expectedAnswer ? maxMarks : 0);
    } else {
      setMarks(0);
    }
  }, [type, studentAnswer, expectedAnswer]);

  const handleMarksChange = (e) => {
    const value = Math.min(
      maxMarks,
      Math.max(0, parseInt(e.target.value, 10) || 0),
    );
    setMarks(value);
    onMarksUpdate(value);
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="font-bold">Question:</h3>
        <p className="text-gray-300">{question}</p>
      </div>

      {type === "mcq" ? (
        <div className="mb-4">
          <h4 className="font-bold mb-2">Options:</h4>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  studentAnswer === option
                    ? expectedAnswer === option
                      ? "bg-green-600"
                      : "bg-red-600"
                    : expectedAnswer === option
                      ? "bg-green-600/50"
                      : "bg-gray-600"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h4 className="font-bold">Student's Answer:</h4>
            <p className="text-gray-300 whitespace-pre-wrap">{studentAnswer}</p>
          </div>
          <div className="mb-4">
            <h4 className="font-bold">Expected Answer:</h4>
            <p className="text-gray-300 whitespace-pre-wrap">
              {expectedAnswer}
            </p>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <div>
          <label className="font-bold">Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={handleMarksChange}
            min="0"
            max={maxMarks}
            className="ml-2 w-20 p-1 rounded bg-gray-600 text-white"
            disabled={type === "mcq"}
          />
          <span className="ml-2">/ {maxMarks}</span>
        </div>
        {type === "mcq" && (
          <div className="text-sm">
            <span
              className={
                studentAnswer === expectedAnswer
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {studentAnswer === expectedAnswer ? "Correct" : "Incorrect"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const StudentSubmission = ({ student, onMarksUpdate }) => {
  const [marksMap, setMarksMap] = useState({});

  if (!student) {
    return (
      <div className="col-span-9 bg-gray-800 rounded-lg p-4 flex items-center justify-center">
        <p className="text-gray-400">
          Select a student to view their submission
        </p>
      </div>
    );
  }

  const answers = mockAnswers[student.studentId] || [];

  const handleMarksUpdate = (questionId, marks) => {
    const newMarksMap = {
      ...marksMap,
      [questionId]: parseInt(marks, 10),
    };
    setMarksMap(newMarksMap);

    const total = Object.values(newMarksMap).reduce(
      (sum, mark) => sum + mark,
      0,
    );
    onMarksUpdate(total);
  };

  return (
    <div className="col-span-9 bg-gray-800 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          {student.studentName}'s Submission
        </h2>
        <p className="text-gray-300">Roll No: {student.rollNo}</p>
      </div>
      <div className="space-y-6">
        {answers.map((answer) => (
          <QuestionEvaluation
            key={answer.questionId}
            {...answer}
            onMarksUpdate={(marks) =>
              handleMarksUpdate(answer.questionId, marks)
            }
          />
        ))}
      </div>
    </div>
  );
};

const TotalMarks = ({ total }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700">
    <div className="container mx-auto flex justify-end items-center">
      <div className="text-xl">
        <span className="font-bold">Total Marks:</span>
        <span className="ml-2">{total}</span>
      </div>
    </div>
  </div>
);

const ExamEvaluation = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [totalMarks, setTotalMarks] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <ExamHeader exam={mockExam} submissions={mockSubmissions} />
        <div className="grid grid-cols-12 gap-4 mt-6">
          <StudentList
            submissions={mockSubmissions}
            selectedStudent={selectedStudent}
            onStudentSelect={setSelectedStudent}
          />
          <StudentSubmission
            student={selectedStudent}
            onMarksUpdate={setTotalMarks}
          />
        </div>
        <TotalMarks total={totalMarks} />
      </div>
    </div>
  );
};

export default ExamEvaluation;
