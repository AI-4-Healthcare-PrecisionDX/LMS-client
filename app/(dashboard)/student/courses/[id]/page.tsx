import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnnouncementCard from "@/components/course/announcement";
import { ScrollArea } from "@/components/ui/scroll-area";
import Classwork from "@/components/course/classwork";
import MaterialCard from "@/components/course/materials";
import CourseCard from "@/components/course/coursecard";

const CoursePage: React.FC = () => {
  return (
    <>
      <Tabs defaultValue="anouncement" className="w-full mt-2 items-center">
        <TabsList className="sticky top-0 z-10 border-b shadow-sm ml-32">
          <TabsTrigger value="anouncement">Announcement</TabsTrigger>
          <TabsTrigger value="classwork">Classwork</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>
        <TabsContent value="anouncement">
          <div className="w-full mt-8 max-w-screen-lg mx-auto p-4 space-y-4">
            <ScrollArea>
              <CourseCard
                courseName="Robi Datathon 3.0 Bangladesh"
                section="69"
                teacher="Nishan"
                department="420"
              />
              <AnnouncementCard
                teacherAvatarUrl="https://github.com/shadcn.png"
                teacherName="Nishan"
                date="Mar 25"
                content="The Datathon practice virtual session will be held tomorrow Tuesday 26-03-2024 at 10AM to 11:30AM."
                studentAvatarUrl="https://github.com/shadcn.png"
              />
              <AnnouncementCard
                teacherAvatarUrl="https://github.com/shadcn.png"
                teacherName="Nishan"
                date="Mar 24"
                content="Remember to submit your project proposals by this Friday!"
                studentAvatarUrl="https://github.com/shadcn.png"
              />
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="classwork">
          <div className="w-full mt-8 max-w-screen-lg mx-auto p-4 space-y-4">
            <ScrollArea>
              <CourseCard
                courseName="Robi Datathon 3.0 Bangladesh"
                section="69"
                teacher="Nishan"
                department="420"
              />
              <Classwork
                title="Classwork 1"
                description="Complete the exercise and submit by the due date."
                dueDate="2024-03-30"
                studentAvatarUrl="https://github.com/shadcn.png"
                instructionFileUrl="/path/to/instructions.pdf"
                instructionFileName="Dataset_Analysis_Instructions.pdf"
                instructionFileType="pdf"
              />
              <Classwork
                title="Classwork 69"
                description="Complete the exercise and submit by the due date."
                dueDate="2069-06-09"
                studentAvatarUrl="https://github.com/shadcn.png"
                instructionFileUrl="/path/to/instructions.pdf"
                instructionFileName="Assembly Language is best.docx"
                instructionFileType="docx"
              />
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <div className="w-full mt-8 max-w-screen-lg mx-auto p-4 space-y-4">
            <ScrollArea>
              <CourseCard
                courseName="Robi Datathon 3.0 Bangladesh"
                section="69"
                teacher="Nishan"
                department="420"
              />
              <MaterialCard
                title="Lecture Notes"
                description="This document contains all the key points covered in the lecture."
                fileUrl="/path/to/lecture_notes.pdf"
                fileName="Lecture_Notes.pdf"
                studentAvatarUrl="https://github.com/shadcn.png"
              />
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CoursePage;
