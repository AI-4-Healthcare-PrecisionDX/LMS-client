"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CirclePlay, Search } from "lucide-react";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { TourProvider, useTour } from "@reactour/tour";

const departments = [
  { name: "Neurology", color: "bg-blue-500" },
  { name: "Cardiology", color: "bg-red-500" },
  { name: "Pulmonology", color: "bg-green-500" },
  { name: "Orthopedics", color: "bg-yellow-500" },
  { name: "Ophthalmology", color: "bg-purple-500" },
  { name: "Infectious Diseases", color: "bg-pink-500" },
  { name: "Pediatrics", color: "bg-indigo-500" },
  { name: "Immunology", color: "bg-teal-500" },
  { name: "Endocrinology", color: "bg-orange-500" },
];

const steps = [
  {
    selector: ".search-input",
    content: "Search for a department to practice diagnosing conditions.",
  },
  {
    selector: ".card-container",
    content: "Select a department to start practicing.",
  },
  {
    selector: ".start-practice",
    content: "Click here to start practicing.",
  },
];

const items = [
  { href: "/student", label: "Home" },
  { label: "Department List" },
];

const ITEMS_TO_DISPLAY = 2;

function DepartmentSelection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const router = useRouter();
  const { setIsOpen } = useTour();

  // Check if the tour has been seen before
  if (typeof window !== "undefined") {
    if (localStorage.getItem("departmentListPage") == null) {
      localStorage.setItem("departmentListPage", "true");
      setIsOpen(true);
    }
  }

  // Generate consistent case numbers for each department
  const departmentsWithCases = useMemo(() => {
    return departments.map((dept) => ({
      ...dept,
      cases: Math.floor(Math.random() * 20) + 1,
      completed: Math.floor(Math.random() * 20) + 1,
    }));
  }, []);

  const filteredDepartments = departmentsWithCases.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };

  const handleStartPractice = () => {
    if (selectedDepartment) {
      router.push("/student/practice/cases");
    }
  };

  return (
    <div className="container mx-auto px-4 pb-2 dark:text-gray-100">
      <div className="sticky top-0 bg-background pb-2 z-10">
        <div className="flex justify-between w-full items-center pt-2">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
          <div>
            <Button
              onClick={() => setIsOpen(true)}
              className="start-tour-button"
              variant="outline"
            >
              <CirclePlay />
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Select a department to test your diagnostic skills
        </h1>
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-grow max-w-md">
            <Input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input w-full py-2 pl-10 pr-4 transition-colors duration-300 border-2 rounded-full search-input border-primary focus:outline-none focus:border-primary-dark dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-primary dark:text-gray-400" />
          </div>
          <div className="start-practice">
            <Button
              size="lg"
              onClick={handleStartPractice}
              disabled={!selectedDepartment}
              className="dark:text-white"
            >
              Start Practice
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((dept) => (
          <Card
            key={dept.name}
            className={`card-container cursor-pointer ${selectedDepartment === dept ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleDepartmentClick(dept)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`p-2 rounded-full ${dept.color}`}></div>
              <CardTitle>{dept.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Practice diagnosing conditions related to{" "}
                {dept.name.toLowerCase()}.
              </CardDescription>
            </CardContent>
            <CardFooter className="gap-2">
              <Badge variant="outline">{dept.cases} cases available</Badge>
              <Badge variant="outline">{dept.completed} cases completed</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DepartmentSelectionWithTour() {
  return (
    <TourProvider steps={steps}>
      <DepartmentSelection />
    </TourProvider>
  );
}
