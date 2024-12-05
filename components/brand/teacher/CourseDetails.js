"use client";

import PerformanceDashboard from "@/components/brand/teacher/PerformanceDashboard";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import AnnouncementPage from "./announcement";
import AssignmentDashboard from "./assessment/AssignmentDashboard";
import ExamEvaluation from "./assessment/ExamEvaluation";
import CourseDashboard from "./CourseDashboard";
import DiscussionsContent from "./DiscussionsContent";
import BookListWithTour from "./materials/BookList";
import TeacherInbox from "./TeacherInbox";

export default function CourseDetails({
  courseName,
  section,
  sectionId,
  totalStudents,
  instructor,
  section_exclusive_contents,
}) {
  // Get initial tab from localStorage, default to 'dashboard'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTab") || "dashboard";
    }
    return "dashboard";
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDashboard, setIsDashboard] = useState(true);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  const handleAssignmentClick = () => {
    if (isDashboard) setIsDashboard(false);
    else setIsDashboard(true);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveTab("inbox");
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{courseName}</h1>
        <p className="text-md">Section: {section}</p>
        {totalStudents && (
          <p className="text-md">Total Students: {totalStudents}</p>
        )}
        <p className="text-gray-600 text-md">Instructor: {instructor}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="bg-secondary rounded-lg">
          <div className="w-full relative h-10">
            <TabsList className="flex w-full absolute h-10 justify-evenly">
              <TabsTrigger className="w-full" value="dashboard">
                Dashboard
              </TabsTrigger>
              <TabsTrigger className="w-full" value="assignments">
                Assignments
              </TabsTrigger>
              <TabsTrigger className="w-full" value="materials">
                Materials
              </TabsTrigger>
              <TabsTrigger className="w-full" value="performance">
                Performance
              </TabsTrigger>
              <TabsTrigger className="w-full" value="discussions">
                Discussions
              </TabsTrigger>
              <TabsTrigger className="w-full" value="announcements">
                Announcements
              </TabsTrigger>
              <TabsTrigger className="w-full" value="inbox">
                Inbox
              </TabsTrigger>
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="dashboard">
          <CourseDashboard onStudentSelect={handleStudentSelect} />
        </TabsContent>
        <TabsContent value="assignments">
          {isDashboard && (
            <AssignmentDashboard
              examEvaluation={handleAssignmentClick}
              sectionId={sectionId}
            />
          )}
          {!isDashboard && (
            <div className="space-y-2">
              <Button onClick={handleAssignmentClick}>Back to Dashboard</Button>
              <ExamEvaluation />
            </div>
          )}
        </TabsContent>
        <TabsContent value="materials">
          <BookListWithTour
            section_exclusive_contents={section_exclusive_contents}
            sectionId={sectionId}
          />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceDashboard />
        </TabsContent>
        <TabsContent value="discussions">
          <DiscussionsContent />
        </TabsContent>
        <TabsContent value="announcements">
          <AnnouncementPage />
        </TabsContent>
        <TabsContent value="inbox">
          <TeacherInbox selectedStudent={selectedStudent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
