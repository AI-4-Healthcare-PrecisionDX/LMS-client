"use client";

import React, { useReducer, useState } from "react";
import {
  Search,
  BookOpen,
  ExternalLink,
  Calendar,
  Star,
  Clock,
  Brain,
  FileText,
  Video,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Resource {
  type: "video" | "pdf" | "quiz" | "case";
  title: string;
  duration?: string;
  size?: string;
  questions?: number;
  difficulty?: string;
}

interface Course {
  id: number;
  title: string;
  category: string;
  isFavorite: boolean;
  progress: number;
  nextLesson: string;
  totalHours: number;
  completedHours: number;
  hasLiveSession: boolean;
  nextLiveSession?: string;
  resources: Resource[];
}

interface MedicalResource {
  id: number;
  title: string;
  url: string;
  category: string;
  description: string;
}

interface Deadline {
  id: number;
  title: string;
  date: string;
  type: string;
  location: string;
  duration: string;
  requirements: string[];
  priority: "high" | "medium" | "low";
}

interface StudyStats {
  weeklyStudyHours: number;
  weeklyGoal: number;
  completedAssessments: number;
  totalAssessments: number;
  averageScore: number;
  streakDays: number;
}

const initialCourses: Course[] = [
  {
    id: 1,
    title: "Introduction to Anatomy",
    category: "Anatomy",
    isFavorite: false,
    progress: 65,
    nextLesson: "Musculoskeletal System",
    totalHours: 40,
    completedHours: 26,
    hasLiveSession: true,
    nextLiveSession: "2024-10-26T14:00:00",
    resources: [
      { type: "video", title: "Skeletal System Overview", duration: "45 min" },
      { type: "pdf", title: "Anatomical Terms Reference", size: "2.3 MB" },
      { type: "quiz", title: "Week 3 Assessment", questions: 25 },
    ],
  },
  {
    id: 2,
    title: "Pharmacology Basics",
    category: "Pharmacology",
    isFavorite: true,
    progress: 42,
    nextLesson: "Drug Metabolism",
    totalHours: 35,
    completedHours: 14,
    hasLiveSession: false,
    resources: [
      { type: "video", title: "Drug Classifications", duration: "60 min" },
      { type: "pdf", title: "Common Drug Interactions", size: "4.1 MB" },
      { type: "case", title: "Patient Case Study 1", difficulty: "Medium" },
    ],
  },
];

const medicalResources: MedicalResource[] = [
  {
    id: 1,
    title: "PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    category: "Research",
    description: "Access to biomedical literature",
  },
  {
    id: 2,
    title: "Medscape",
    url: "https://www.medscape.com/",
    category: "Clinical",
    description: "Medical news and clinical references",
  },
];

const upcomingDeadlines: Deadline[] = [
  {
    id: 1,
    title: "Anatomy Practical Examination",
    date: "2024-10-28",
    type: "exam",
    location: "Anatomy Lab 2B",
    duration: "3 hours",
    requirements: ["Lab coat", "Dissection kit"],
    priority: "high",
  },
  {
    id: 2,
    title: "Patient Case Presentation",
    date: "2024-11-05",
    type: "presentation",
    location: "Clinical Skills Center",
    duration: "30 minutes",
    requirements: ["Patient history", "Differential diagnosis"],
    priority: "medium",
  },
];

const studyStats: StudyStats = {
  weeklyStudyHours: 28,
  weeklyGoal: 35,
  completedAssessments: 12,
  totalAssessments: 15,
  averageScore: 87,
  streakDays: 5,
};

interface State {
  searchTerm: string;
  courses: Course[];
  selectedView: "grid" | "list";
  filterCategory: string;
}

type Action =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: number }
  | { type: "SET_VIEW"; payload: "grid" | "list" }
  | { type: "SET_FILTER"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload
            ? { ...course, isFavorite: !course.isFavorite }
            : course,
        ),
      };
    case "SET_VIEW":
      return { ...state, selectedView: action.payload };
    case "SET_FILTER":
      return { ...state, filterCategory: action.payload };
    default:
      return state;
  }
}

interface CourseCardProps {
  course: Course;
  onToggleFavorite: (id: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onToggleFavorite,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={course.hasLiveSession ? "destructive" : "default"}>
            {course.category}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(course.id)}
                >
                  <Star
                    className={`h-4 w-4 ${course.isFavorite ? "fill-yellow-400" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {course.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription>Next: {course.nextLesson}</CardDescription>
        <div className="mt-2">
          <Progress value={course.progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{course.progress}% Complete</span>
            <span>
              {course.completedHours}/{course.totalHours} hours
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {course.hasLiveSession && course.nextLiveSession && (
          <div className="flex items-center text-sm text-red-600">
            <Clock className="h-4 w-4 mr-1" />
            Live Session: {new Date(course.nextLiveSession).toLocaleString()}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">
          <BookOpen className="mr-2 h-4 w-4" /> Continue
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Course Resources</DialogTitle>
              <DialogDescription>
                Access materials for {course.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {course.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {resource.type === "video" && <Video className="h-4 w-4" />}
                    {resource.type === "pdf" && (
                      <FileText className="h-4 w-4" />
                    )}
                    {resource.type === "quiz" && <Brain className="h-4 w-4" />}
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {resource.duration ||
                          resource.size ||
                          (resource.questions
                            ? `${resource.questions} questions`
                            : "")}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default function ClassroomPage() {
  const [state, dispatch] = useReducer(reducer, {
    searchTerm: "",
    courses: initialCourses,
    selectedView: "grid",
    filterCategory: "all",
  });

  const filteredCourses = state.courses.filter(
    (course) =>
      course.title.toLowerCase().includes(state.searchTerm.toLowerCase()) &&
      (state.filterCategory === "all" ||
        course.category === state.filterCategory),
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <div className="text-2xl font-bold">
                {studyStats.weeklyStudyHours}/{studyStats.weeklyGoal}h
              </div>
              <Progress
                value={
                  (studyStats.weeklyStudyHours / studyStats.weeklyGoal) * 100
                }
                className="h-2"
              />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              <div className="text-2xl font-bold">
                {studyStats.completedAssessments}/{studyStats.totalAssessments}
              </div>
              <Progress
                value={
                  (studyStats.completedAssessments /
                    studyStats.totalAssessments) *
                  100
                }
                className="h-2"
              />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <div className="text-2xl font-bold">
                {studyStats.averageScore}%
              </div>
              <Progress value={studyStats.averageScore} className="h-2" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Study Streak
              </CardTitle>
              <div className="text-2xl font-bold">
                {studyStats.streakDays} days
              </div>
              <Progress value={studyStats.streakDays * 20} className="h-2" />
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Courses</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search courses"
                        className="pl-8"
                        value={state.searchTerm}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_SEARCH_TERM",
                            payload: e.target.value,
                          })
                        }
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Filter</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            dispatch({ type: "SET_FILTER", payload: "all" })
                          }
                        >
                          All Courses
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            dispatch({ type: "SET_FILTER", payload: "Anatomy" })
                          }
                        >
                          Anatomy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            dispatch({
                              type: "SET_FILTER",
                              payload: "Pharmacology",
                            })
                          }
                        >
                          Pharmacology
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="mb-4">
                  <TabsList>
                    <TabsTrigger value="active">Active Courses</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filteredCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onToggleFavorite={(id) =>
                            dispatch({ type: "TOGGLE_FAVORITE", payload: id })
                          }
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(
                    medicalResources.reduce((acc, resource) => {
                      if (!acc.has(resource.category)) {
                        acc.set(resource.category, []);
                      }
                      acc.get(resource.category)?.push(resource);
                      return acc;
                    }, new Map<string, MedicalResource[]>()),
                  ).map(([category, resources]) => (
                    <div key={category}>
                      <h3 className="font-medium mb-2">{category}</h3>
                      <ul className="space-y-2">
                        {resources.map((resource) => (
                          <li key={resource.id}>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              <div>
                                <span>{resource.title}</span>
                                <p className="text-sm text-muted-foreground">
                                  {resource.description}
                                </p>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <li key={deadline.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{deadline.title}</span>
                          <Badge
                            variant={
                              deadline.priority === "high"
                                ? "destructive"
                                : "default"
                            }
                            className="ml-2"
                          >
                            {deadline.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {deadline.date}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {deadline.duration}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Location: {deadline.location}</div>
                        <div>Requirements:</div>
                        <ul className="list-disc list-inside ml-2">
                          {deadline.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Weekly Progress
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {studyStats.weeklyStudyHours}/{studyStats.weeklyGoal}{" "}
                        hours
                      </span>
                    </div>
                    <Progress
                      value={
                        (studyStats.weeklyStudyHours / studyStats.weeklyGoal) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Assessments Completed
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {studyStats.completedAssessments}/
                        {studyStats.totalAssessments}
                      </span>
                    </div>
                    <Progress
                      value={
                        (studyStats.completedAssessments /
                          studyStats.totalAssessments) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Average Score</div>
                        <div className="text-2xl font-bold">
                          {studyStats.averageScore}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Study Streak</div>
                        <div className="text-2xl font-bold">
                          {studyStats.streakDays} days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
