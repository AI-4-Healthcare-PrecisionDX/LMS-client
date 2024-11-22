"use client";
export const runtime = "edge";
import React, { useReducer, useState } from "react";
import {
  BookOpen,
  FileText,
  MessagesSquare,
  Clock,
  Video,
  Brain,
  CheckCircle2,
  Microscope,
  Stethoscope,
  ArrowUpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Type definitions
interface CourseInfo {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  description: string;
  progress: number;
  nextDeadline: string;
  learningObjectives: string[];
}

interface RubricCriterion {
  criterion: string;
  points: number;
}

interface Submission {
  id: number;
  timestamp: string;
  files: string[];
  notes: string;
}

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  type: "case-study" | "practical-exam";
  status: "pending" | "upcoming";
  maxScore: number;
  weight: number;
  requirements: string[];
  submissions: Submission[];
  rubric?: RubricCriterion[];
  stationCount?: number;
  timePerStation?: number;
}

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "interactive" | "pdf";
  duration?: string;
  size?: string;
  watched?: boolean;
  completed?: boolean;
  hasQuiz?: boolean;
  downloaded?: boolean;
}

interface Module {
  id: number;
  title: string;
  type: "module";
  content: ContentItem[];
}

interface Reply {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
}

interface Discussion {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  date: string;
  content: string;
  replies: Reply[];
  tags: string[];
}

interface State {
  courseInfo: CourseInfo;
  assignments: Assignment[];
  materials: Module[];
  discussions: Discussion[];
  activeDiscussion: number | null;
  selectedMaterial: string | null;
  filters: {
    assignments: string;
    materials: string;
    discussions: string;
  };
}

interface AssignmentSubmissionPayload {
  assignmentId: number;
  submission: Submission;
}

interface DiscussionReplyPayload {
  discussionId: number;
  reply: Reply;
}

type Action =
  | { type: "SET_FILTER"; payload: { category: string; value: string } }
  | { type: "SELECT_MATERIAL"; payload: string }
  | { type: "SET_ACTIVE_DISCUSSION"; payload: number }
  | { type: "ADD_DISCUSSION_REPLY"; payload: DiscussionReplyPayload }
  | {
      type: "TOGGLE_MATERIAL_COMPLETION";
      payload: { moduleId: number; contentId: string };
    }
  | { type: "SUBMIT_ASSIGNMENT"; payload: AssignmentSubmissionPayload }
  | { type: "UPDATE_COURSE_PROGRESS"; payload: number };

const initialState: State = {
  courseInfo: {
    id: "MED101",
    title: "Clinical Anatomy",
    instructor: "Dr. Sarah Johnson",
    instructorAvatar: "/placeholder/32/32",
    description:
      "Comprehensive study of human anatomy with clinical correlations",
    progress: 65,
    nextDeadline: "2024-10-28T23:59:59",
    learningObjectives: [
      "Understand musculoskeletal system anatomy",
      "Correlate anatomical structures with clinical presentations",
      "Master surface anatomy landmarks",
      "Apply anatomical knowledge in clinical scenarios",
    ],
  },
  assignments: [
    {
      id: 1,
      title: "Clinical Case Analysis: Upper Limb",
      dueDate: "2024-10-28T23:59:59",
      type: "case-study",
      status: "pending",
      maxScore: 100,
      weight: 30,
      requirements: [
        "Detailed anatomical analysis",
        "Clinical correlations",
        "Diagnostic approach",
        "Treatment considerations",
      ],
      submissions: [],
      rubric: [
        { criterion: "Anatomical Accuracy", points: 40 },
        { criterion: "Clinical Reasoning", points: 30 },
        { criterion: "Evidence Integration", points: 30 },
      ],
    },
    {
      id: 2,
      title: "Practical Examination: Thorax",
      dueDate: "2024-11-05T14:00:00",
      type: "practical-exam",
      status: "upcoming",
      maxScore: 100,
      weight: 40,
      requirements: [
        "Lab coat required",
        "Dissection kit",
        "Clinical examination tools",
      ],
      submissions: [],
      stationCount: 10,
      timePerStation: 5,
    },
  ],
  materials: [
    {
      id: 1,
      title: "Week 1: Introduction to Clinical Anatomy",
      type: "module",
      content: [
        {
          id: "1.1",
          title: "Lecture: Anatomical Terminology",
          type: "video",
          duration: "45:00",
          watched: true,
          hasQuiz: true,
        },
        {
          id: "1.2",
          title: "3D Atlas: Upper Limb",
          type: "interactive",
          duration: "∞",
          completed: false,
        },
        {
          id: "1.3",
          title: "Clinical Correlations PDF",
          type: "pdf",
          size: "2.8 MB",
          downloaded: false,
        },
      ],
    },
    {
      id: 2,
      title: "Week 2: Musculoskeletal System",
      type: "module",
      content: [
        {
          id: "2.1",
          title: "Virtual Dissection Lab",
          type: "interactive",
          duration: "120:00",
          completed: false,
        },
        {
          id: "2.2",
          title: "Clinical Cases Collection",
          type: "pdf",
          size: "4.2 MB",
          downloaded: true,
        },
      ],
    },
  ],
  discussions: [
    {
      id: 1,
      title: "Clinical Case Discussion: Shoulder Injury",
      author: "Dr. Johnson",
      authorAvatar: "/placeholder/32/32",
      date: "2024-10-24T10:30:00",
      content:
        "Let's discuss the anatomical considerations in rotator cuff injuries...",
      replies: [
        {
          id: 1,
          author: "Jane Smith",
          authorAvatar: "/placeholder/32/32",
          content: "The supraspinatus muscle is commonly involved...",
          date: "2024-10-24T11:15:00",
          likes: 5,
        },
      ],
      tags: ["clinical-correlation", "musculoskeletal"],
    },
  ],
  activeDiscussion: null,
  selectedMaterial: null,
  filters: {
    assignments: "all",
    materials: "all",
    discussions: "all",
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.category]: action.payload.value,
        },
      };
    case "SELECT_MATERIAL":
      return {
        ...state,
        selectedMaterial: action.payload,
      };
    case "SET_ACTIVE_DISCUSSION":
      return {
        ...state,
        activeDiscussion: action.payload,
      };
    case "ADD_DISCUSSION_REPLY":
      return {
        ...state,
        discussions: state.discussions.map((discussion) =>
          discussion.id === action.payload.discussionId
            ? {
                ...discussion,
                replies: [...discussion.replies, action.payload.reply],
              }
            : discussion,
        ),
      };
    case "TOGGLE_MATERIAL_COMPLETION":
      return {
        ...state,
        materials: state.materials.map((module) =>
          module.id === action.payload.moduleId
            ? {
                ...module,
                content: module.content.map((content) =>
                  content.id === action.payload.contentId
                    ? { ...content, completed: !content.completed }
                    : content,
                ),
              }
            : module,
        ),
      };
    case "SUBMIT_ASSIGNMENT":
      return {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === action.payload.assignmentId
            ? {
                ...assignment,
                submissions: [
                  ...assignment.submissions,
                  action.payload.submission,
                ],
              }
            : assignment,
        ),
      };
    case "UPDATE_COURSE_PROGRESS":
      return {
        ...state,
        courseInfo: {
          ...state.courseInfo,
          progress: action.payload,
        },
      };
    default:
      return state;
  }
}

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmit: (payload: AssignmentSubmissionPayload) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onSubmit,
}) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      assignmentId: assignment.id,
      submission: {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        files: Array.from(formData.getAll("files")).map((file) =>
          file instanceof File ? file.name : String(file),
        ),
        notes: (formData.get("notes") as string) || "",
      },
    });
    setIsSubmitOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge
              variant={
                assignment.type === "practical-exam" ? "destructive" : "default"
              }
            >
              {assignment.type}
            </Badge>
            <CardTitle className="mt-2">{assignment.title}</CardTitle>
            <CardDescription>
              Due: {new Date(assignment.dueDate).toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant="outline">{assignment.weight}% of grade</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Requirements:</h4>
            <ul className="list-disc list-inside space-y-1">
              {assignment.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          {assignment.rubric && (
            <div>
              <h4 className="font-medium mb-2">Grading Rubric:</h4>
              <div className="space-y-2">
                {assignment.rubric.map((criterion, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{criterion.criterion}</span>
                    <span>{criterion.points} points</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Submit Assignment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Assignment</DialogTitle>
              <DialogDescription>
                Upload your files and add any necessary notes.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="files">Files</Label>
                <Input
                  id="files"
                  name="files"
                  type="file"
                  multiple
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any notes for your instructor..."
                  className="mt-1"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

interface MaterialsListProps {
  materials: Module[];
  onSelect: (id: string) => void;
  onToggleCompletion: (moduleId: number, contentId: string) => void;
}

const MaterialsList: React.FC<MaterialsListProps> = ({
  materials,
  onSelect,
  onToggleCompletion,
}) => (
  <Accordion type="single" collapsible className="w-full">
    {materials.map((module) => (
      <AccordionItem key={module.id} value={`module-${module.id}`}>
        <AccordionTrigger>{module.title}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {module.content.map((content) => (
              <div
                key={content.id}
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => onSelect(content.id)}
              >
                <div className="flex items-center gap-2">
                  {content.type === "video" && <Video className="h-4 w-4" />}
                  {content.type === "pdf" && <FileText className="h-4 w-4" />}
                  {content.type === "interactive" && (
                    <Brain className="h-4 w-4" />
                  )}
                  <div>
                    <div className="font-medium">{content.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {content.duration || content.size}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onToggleCompletion(module.id, content.id);
                  }}
                >
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      content.completed || content.watched
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  />
                </Button>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

interface DiscussionThreadProps {
  discussion: Discussion;
  onReply: (payload: DiscussionReplyPayload) => void;
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({
  discussion,
  onReply,
}) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const handleSubmitReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onReply({
      discussionId: discussion.id,
      reply: {
        id: Date.now(),
        author: "Current User",
        authorAvatar: "/placeholder/32/32",
        content: (formData.get("content") as string) || "",
        date: new Date().toISOString(),
        likes: 0,
      },
    });
    setIsReplyOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={discussion.authorAvatar} />
            <AvatarFallback>{discussion.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{discussion.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{discussion.author}</span>
              <span>•</span>
              <span>{new Date(discussion.date).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>{discussion.content}</p>
          <div className="flex gap-2">
            {discussion.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="flex gap-4 pl-8">
              <Avatar className="w-8 h-8">
                <AvatarImage src={reply.authorAvatar} />
                <AvatarFallback>{reply.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{reply.author}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(reply.date).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{reply.content}</p>
                <Button variant="ghost" size="sm" className="mt-1">
                  <ArrowUpCircle className="h-4 w-4 mr-1" /> {reply.likes}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
          <DialogTrigger asChild>
            <Button>Reply</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reply to Discussion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <Label htmlFor="content">Your Reply</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your reply..."
                  className="mt-1"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Post Reply</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default function CourseDetailsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmitAssignment = (payload: AssignmentSubmissionPayload) => {
    dispatch({ type: "SUBMIT_ASSIGNMENT", payload });
  };

  const handleToggleMaterialCompletion = (
    moduleId: number,
    contentId: string,
  ) => {
    dispatch({
      type: "TOGGLE_MATERIAL_COMPLETION",
      payload: { moduleId, contentId },
    });
  };

  const handleAddDiscussionReply = (payload: DiscussionReplyPayload) => {
    dispatch({ type: "ADD_DISCUSSION_REPLY", payload });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 space-y-6">
        {/* Course Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  {state.courseInfo.title}
                </CardTitle>
                <CardDescription>
                  Instructor: {state.courseInfo.instructor}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="mb-2">Course Progress</div>
                <Progress value={state.courseInfo.progress} className="w-64" />
                <div className="mt-1 text-sm text-muted-foreground">
                  {state.courseInfo.progress}% Complete
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Learning Objectives</h3>
                <ul className="list-disc list-inside space-y-1">
                  {state.courseInfo.learningObjectives.map(
                    (objective, index) => (
                      <li key={index}>{objective}</li>
                    ),
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Next Deadline</h3>
                <div className="flex items-center text-red-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(state.courseInfo.nextDeadline).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="materials" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials">
              <BookOpen className="h-4 w-4 mr-2" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <FileText className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="discussions">
              <MessagesSquare className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-4">
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <MaterialsList
                  materials={state.materials}
                  onSelect={(id) =>
                    dispatch({ type: "SELECT_MATERIAL", payload: id })
                  }
                  onToggleCompletion={handleToggleMaterialCompletion}
                />
              </div>
              <div className="md:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        <Microscope className="h-4 w-4 mr-2" />
                        Virtual Lab
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Brain className="h-4 w-4 mr-2" />
                        3D Anatomy Atlas
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Clinical Cases
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="grid gap-4">
              {state.assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onSubmit={handleSubmitAssignment}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discussions">
            <div className="space-y-4">
              {state.discussions.map((discussion) => (
                <DiscussionThread
                  key={discussion.id}
                  discussion={discussion}
                  onReply={handleAddDiscussionReply}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
