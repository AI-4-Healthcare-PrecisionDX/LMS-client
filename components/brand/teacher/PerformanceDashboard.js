"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
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

export default function CourseDashboard() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (student) => {
    console.log("Row clicked:", student);
    setSelectedStudent(student);
    setDialogOpen(true);
    console.log("Dialog open state:", isDialogOpen); // To check state change
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="container mx-auto pt-8">
      <h1 className="text-3xl font-bold mb-6">Course Performance Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Assignment 1 (10)</TableHead>
                <TableHead>Assignment 2 (20)</TableHead>
                <TableHead>Mid-term (50)</TableHead>
                <TableHead>Final (30)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => handleRowClick(student)} // Ensure student is correctly passed
                  className="cursor-pointer"
                >
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.assignment1}</TableCell>
                  <TableCell>{student.assignment2}</TableCell>
                  <TableCell>{student.mid}</TableCell>
                  <TableCell>{student.final}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isDialogOpen && selectedStudent && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={setDialogOpen}
          aria-label="Student Performance Dialog"
        >
          <DialogContent className="max-w-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">
              Performance Chart: {selectedStudent.name}
            </h2>
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-4">
                <Bar
                  data={{
                    labels: [
                      "Assignment 1",
                      "Assignment 2",
                      "Mid-term",
                      "Final",
                    ],
                    datasets: [
                      {
                        label: "Scores",
                        data: [
                          selectedStudent.assignment1,
                          selectedStudent.assignment2,
                          selectedStudent.mid,
                          selectedStudent.final,
                        ],
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 50,
                      },
                    },
                  }}
                />

                <Line
                  data={{
                    labels: [
                      "Assignment 1",
                      "Assignment 2",
                      "Mid-term",
                      "Final",
                    ],
                    datasets: [
                      {
                        label: "Progress",
                        data: [
                          selectedStudent.assignment1,
                          selectedStudent.assignment2,
                          selectedStudent.mid,
                          selectedStudent.final,
                        ],
                        borderColor: "rgba(153, 102, 255, 1)",
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 50,
                      },
                    },
                  }}
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
