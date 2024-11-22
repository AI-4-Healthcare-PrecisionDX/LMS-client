import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from "react";

const CourseCard = ({ name, section, totalStudents, href }) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Section: {section}</CardDescription>
        <CardDescription>Total Students: {totalStudents}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button onClick={() => router.push(href)} variant="outline">
          Click for details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
