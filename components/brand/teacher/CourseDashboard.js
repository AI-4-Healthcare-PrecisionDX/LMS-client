"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar, Line, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Filler,
  Tooltip,
  Legend,
);

const studentData = [
  {
    id: "S1",
    name: "John Doe",
    assignment1: 8,
    assignment2: 18,
    mid: 45,
    final: 28,
  },
  {
    id: "S2",
    name: "Jane Smith",
    assignment1: 9,
    assignment2: 19,
    mid: 48,
    final: 29,
  },
  {
    id: "S3",
    name: "Bob Johnson",
    assignment1: 7,
    assignment2: 17,
    mid: 42,
    final: 27,
  },
  {
    id: "S4",
    name: "Alice Brown",
    assignment1: 10,
    assignment2: 20,
    mid: 50,
    final: 30,
  },
  {
    id: "S5",
    name: "Charlie Davis",
    assignment1: 6,
    assignment2: 16,
    mid: 40,
    final: 25,
  },
  {
    id: "S6",
    name: "Eva Wilson",
    assignment1: 9,
    assignment2: 18,
    mid: 47,
    final: 28,
  },
  {
    id: "S7",
    name: "Frank Miller",
    assignment1: 8,
    assignment2: 19,
    mid: 46,
    final: 29,
  },
  {
    id: "S8",
    name: "Grace Lee",
    assignment1: 10,
    assignment2: 20,
    mid: 49,
    final: 30,
  },
  {
    id: "S9",
    name: "Henry Taylor",
    assignment1: 7,
    assignment2: 17,
    mid: 43,
    final: 26,
  },
  {
    id: "S10",
    name: "Ivy Clark",
    assignment1: 9,
    assignment2: 18,
    mid: 48,
    final: 29,
  },
];

const atRiskStudents = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    riskFactor: "Low Scores",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    riskFactor: "Low Attendance",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    riskFactor: "Both",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    riskFactor: "Low Scores",
  },
];

export default function CourseDashboard({ onStudentSelect }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRiskFactor, setSelectedRiskFactor] = useState(null);

  const handleChartClick = (riskFactor) => {
    setSelectedRiskFactor(riskFactor);
    setDialogOpen(true);
  };

  const filteredStudents = selectedRiskFactor
    ? atRiskStudents.filter(
        (student) =>
          student.riskFactor === selectedRiskFactor ||
          (selectedRiskFactor === "Both" && student.riskFactor === "Both"),
      )
    : atRiskStudents;

  const assignmentGradesData = {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        label: "Percentage of Students",
        data: [30, 35, 20, 10, 5],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const examScoresData = {
    labels: ["Midterm", "Final", "Quiz 1", "Quiz 2"],
    datasets: [
      {
        label: "Class Average",
        data: [75, 82, 68, 72],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const attendanceData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Attendance Rate",
        data: [95, 92, 88, 90, 93],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const completionRateData = {
    labels: ["Module 1", "Module 2", "Module 3", "Module 4"],
    datasets: [
      {
        label: "Completion Rate",
        data: [100, 85, 92, 78],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const submissionTimeData = {
    labels: ["Early", "1-3 Days Before", "Day Before", "On Due Date", "Late"],
    datasets: [
      {
        label: "Percentage of Submissions",
        data: [10, 25, 30, 28, 7],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const quizAttemptsData = {
    labels: ["1 Attempt", "2 Attempts", "3 Attempts", "4+ Attempts"],
    datasets: [
      {
        label: "Number of Students",
        data: [20, 15, 8, 5],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const averageScoresByAssessment = {
    labels: ["Assignment 1", "Assignment 2", "Mid-term", "Final"],
    datasets: [
      {
        label: "Class Average",
        data: [
          studentData.reduce((sum, student) => sum + student.assignment1, 0) /
            studentData.length,
          studentData.reduce((sum, student) => sum + student.assignment2, 0) /
            studentData.length,
          studentData.reduce((sum, student) => sum + student.mid, 0) /
            studentData.length,
          studentData.reduce((sum, student) => sum + student.final, 0) /
            studentData.length,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const overallGradeDistribution = {
    labels: [
      "A (90-100%)",
      "B (80-89%)",
      "C (70-79%)",
      "D (60-69%)",
      "F (0-59%)",
    ],
    datasets: [
      {
        label: "Number of Students",
        data: [2, 3, 3, 1, 1],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const assessmentPerformanceTrend = {
    labels: ["Assignment 1", "Assignment 2", "Mid-term", "Final"],
    datasets: [
      {
        label: "Class Average (%)",
        data: [
          (studentData.reduce((sum, student) => sum + student.assignment1, 0) /
            studentData.length) *
            10,
          (studentData.reduce((sum, student) => sum + student.assignment2, 0) /
            studentData.length) *
            5,
          (studentData.reduce((sum, student) => sum + student.mid, 0) /
            studentData.length) *
            2,
          (studentData.reduce((sum, student) => sum + student.final, 0) /
            studentData.length) *
            (10 / 3),
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  const skillCompetencyData = {
    labels: [
      "Critical Thinking",
      "Problem Solving",
      "Communication",
      "Teamwork",
      "Technical Skills",
    ],
    datasets: [
      {
        label: "Class Average Competency (%)",
        data: [75, 80, 70, 85, 78],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const learningObjectivesAchievement = {
    labels: [
      "Objective 1",
      "Objective 2",
      "Objective 3",
      "Objective 4",
      "Objective 5",
    ],
    datasets: [
      {
        label: "Achievement Rate (%)",
        data: [85, 78, 92, 70, 88],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const performanceImprovement = {
    labels: [
      "Assignment 1 to 2",
      "Assignment 2 to Mid-term",
      "Mid-term to Final",
    ],
    datasets: [
      {
        label: "Average Improvement (%)",
        data: [15, 5, 10],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const topicMastery = {
    labels: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"],
    datasets: [
      {
        label: "Class Average Mastery (%)",
        data: [85, 70, 90, 65, 80, 75],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const classParticipationTrend = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
    ],
    datasets: [
      {
        label: "Average Participation Score",
        data: [7, 6.5, 8, 7.5, 8.5, 9, 8.5, 9.5],
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="container mx-auto pt-8">
      <h1 className="text-3xl font-bold mb-6">Performance Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Students at Risk</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <svg width="300" height="200" viewBox="0 0 300 200">
              <circle
                cx="95"
                cy="100"
                r="95"
                fill="rgba(255, 99, 132, 0.6)"
                onClick={() => handleChartClick("Low Scores")}
                className="cursor-pointer"
              />
              <circle
                cx="205"
                cy="100"
                r="95"
                fill="rgba(54, 162, 235, 0.6)"
                onClick={() => handleChartClick("Low Attendance")}
                className="cursor-pointer"
              />
              {/* <path d="M95,100 A95,95 0 0,1 205,100 A95,95 0 0,1 95,100" fill="rgba(255, 206, 86, 0.6)" onClick={() => handleChartClick('Both')} className="cursor-pointer" /> */}
              <text
                x="60"
                y="90"
                textAnchor="middle"
                fill="black"
                fontWeight="bold"
                fontSize="14"
              >
                Low Scores
              </text>
              <text
                x="60"
                y="110"
                textAnchor="middle"
                fill="black"
                fontWeight="bold"
                fontSize="14"
              >
                (2)
              </text>
              <text
                x="240"
                y="85"
                textAnchor="middle"
                fill="black"
                fontWeight="bold"
                fontSize="14"
              >
                Low
              </text>
              <text
                x="240"
                y="105"
                textAnchor="middle"
                fill="black"
                fontWeight="bold"
                fontSize="14"
              >
                Attendance
              </text>
              <text
                x="240"
                y="125"
                textAnchor="middle"
                fill="black"
                fontWeight="bold"
                fontSize="14"
              >
                (1)
              </text>
              <text
                x="150"
                y="100"
                textAnchor="middle"
                fill="black"
                fontWeight="bold"
                fontSize="14"
              >
                Both (1)
              </text>
            </svg>
            <div className="mt-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedRiskFactor(null)}>
                    View At-Risk Students
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedRiskFactor
                        ? `Students at Risk: ${selectedRiskFactor}`
                        : "All At-Risk Students"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="p-2 border-b cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          onStudentSelect(student);
                          setDialogOpen(false);
                        }}
                      >
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.riskFactor}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Assignment Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              data={assignmentGradesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Exam Scores</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line
              data={examScoresData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={attendanceData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={completionRateData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Assignment Submission Timing</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={submissionTimeData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quiz/Assessment Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={quizAttemptsData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Average Scores by Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={averageScoresByAssessment} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={overallGradeDistribution} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Assessment Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={assessmentPerformanceTrend} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Skill Competency Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={skillCompetencyData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Learning Objectives Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={learningObjectivesAchievement} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Performance Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={performanceImprovement} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Topic Mastery</CardTitle>
          </CardHeader>
          <CardContent>
            <Radar data={topicMastery} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Class Participation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={classParticipationTrend} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
