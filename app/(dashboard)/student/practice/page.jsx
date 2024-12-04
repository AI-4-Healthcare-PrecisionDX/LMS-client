"use client";

import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TourProvider, useTour } from "@reactour/tour";
import { useQuery } from "@tanstack/react-query";
import { CirclePlay, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useReducer } from "react";

import api from "@/lib/axios-config";

const items = [
  { href: "/student", label: "Home" },
  { label: "Department List" },
];

const ITEMS_TO_DISPLAY = 2;
const colors = [
  "bg-red-600",
  "bg-blue-600",
  "bg-green-600",
  "bg-yellow-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-gray-600",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-violet-600",
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

const initialState = {
  searchTerm: "",
  selectedDepartment: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_SELECTED_DEPARTMENT":
      return { ...state, selectedDepartment: action.payload };
    default:
      return state;
  }
}

function DepartmentSelection() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const { setIsOpen } = useTour();

  // Check if the tour has been seen before
  if (typeof window !== "undefined") {
    if (localStorage.getItem("departmentListPage") == null) {
      localStorage.setItem("departmentListPage", "true");
      setIsOpen(true);
    }
  }

  // Fetch departments data
  const {
    data: departments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get(
        "/clinical-practice/departments?skip=0&limit=100",
      );
      return response.data;
    },
  });

  // Generate consistent case numbers for each department
  const departmentsWithCases = useMemo(() => {
    return departments.map((dept) => ({
      ...dept,
      cases: Math.floor(Math.random() * 20) + 1,
      completed: Math.floor(Math.random() * 20) + 1,
    }));
  }, [departments]);

  const filteredDepartments = departmentsWithCases.filter((dept) =>
    dept.department_name.toLowerCase().includes(state.searchTerm.toLowerCase()),
  );

  const handleDepartmentClick = (department) => {
    dispatch({ type: "SET_SELECTED_DEPARTMENT", payload: department });
  };

  const handleStartPractice = () => {
    if (state.selectedDepartment) {
      router.push(
        `/student/practice/${state.selectedDepartment.department_id}`,
      );
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-red-500 text-xl font-semibold mb-4">
          Error loading departments
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          {error.message || "Please try again later"}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading departments...
        </p>
      </div>
    );
  }

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
              value={state.searchTerm}
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
              }
              className="search-input w-full py-2 pl-10 pr-4 transition-colors duration-300 border-2 rounded-full search-input border-primary focus:outline-none focus:border-primary-dark dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-primary dark:text-gray-400" />
          </div>
          <div className="start-practice">
            <Button
              size="lg"
              onClick={handleStartPractice}
              disabled={!state.selectedDepartment}
              className="dark:text-white"
            >
              Start Practice
            </Button>
          </div>
        </div>
      </div>

      {filteredDepartments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No departments found matching your search
          </p>
        </div>
      ) : (
        <div className="grid gap-4 p-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((dept) => (
            <Card
              key={dept.department_id}
              className={`card-container cursor-pointer transition-all duration-200 hover:shadow-lg ${
                state.selectedDepartment === dept ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleDepartmentClick(dept)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    colors[Math.floor(Math.random() * colors.length)] ||
                    "bg-gray-600"
                  }`}
                ></div>
                <CardTitle>{dept.department_name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
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
