"use client";

import RTEditor from "@/components/brand/rich-text-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  FileIcon,
  ImageIcon,
  Pencil,
  PinIcon,
  PlusCircle,
  Trash2,
} from "lucide-react";
import React, { useMemo, useReducer } from "react";
import { toast } from "sonner";
import { z } from "zod";

const AttachmentSchema = z.object({
  type: z.enum(["file", "image"]),
  url: z.string().url(),
});

const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string(),
  authorAvatar: z.string(),
  createdAt: z.date(),
  expiresAt: z.date().optional(),
  isPinned: z.boolean(),
  course: z.string(),
  group: z.string(),
  attachments: z.array(AttachmentSchema).optional(),
});

type Announcement = z.infer<typeof AnnouncementSchema>;

const FormDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  course: z.string(),
  group: z.string(),
  expiresAt: z.date().nullable(),
  isPinned: z.boolean(),
  attachments: z.array(AttachmentSchema).optional(),
});

type FormData = z.infer<typeof FormDataSchema>;

type State = {
  announcements: Announcement[];
  filter: "all" | "pinned" | "upcoming" | "past";
  isDialogOpen: boolean;
  currentAnnouncement: Announcement | null;
  formData: FormData;
  searchTerm: string;
  courseFilter: string;
  groupFilter: string;
};

type Action =
  | { type: "SET_FILTER"; payload: State["filter"] }
  | { type: "SET_DIALOG_OPEN"; payload: boolean }
  | { type: "SET_CURRENT_ANNOUNCEMENT"; payload: Announcement | null }
  | { type: "UPDATE_FORM_DATA"; payload: Partial<FormData> }
  | { type: "ADD_ANNOUNCEMENT"; payload: Announcement }
  | { type: "UPDATE_ANNOUNCEMENT"; payload: Announcement }
  | { type: "DELETE_ANNOUNCEMENT"; payload: string }
  | { type: "PIN_ANNOUNCEMENT"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_COURSE_FILTER"; payload: string }
  | { type: "SET_GROUP_FILTER"; payload: string };

const initialState: State = {
  announcements: [
    {
      id: "1",
      title: "Welcome to the new semester!",
      content:
        "Hello everyone! I hope you're all excited for the new semester. Please review the syllabus and let me know if you have any questions.",
      author: "Dr. Smith",
      authorAvatar: "/placeholder-avatar.jpg",
      createdAt: new Date("2023-09-01"),
      isPinned: true,
      course: "Introduction to Biology",
      attachments: [{ type: "file", url: "/syllabus.pdf" }],
      group: "Group A",
    },
    {
      id: "2",
      title: "Upcoming Quiz",
      content:
        "Don't forget, we have a quiz next week covering chapters 1-3. Study hard!",
      author: "Dr. Johnson",
      authorAvatar: "/placeholder-avatar.jpg",
      createdAt: new Date("2023-09-15"),
      expiresAt: new Date("2023-09-22"),
      isPinned: false,
      course: "Advanced Mathematics",
      group: "Group A",
      attachments: [],
    },
    {
      id: "3",
      title: "Field Trip Announcement",
      content:
        "We're planning a field trip to the Natural History Museum next month. Please fill out the permission slip by the end of this week.",
      author: "Prof. Williams",
      authorAvatar: "/placeholder-avatar.jpg",
      createdAt: new Date("2023-09-20"),
      isPinned: false,
      course: "World History",
      attachments: [
        { type: "file", url: "/permission-slip.pdf" },
        { type: "image", url: "/museum-preview.jpg" },
      ],
      group: "Group B",
    },
  ],
  filter: "all",
  isDialogOpen: false,
  currentAnnouncement: null,
  formData: {
    title: "",
    content: "",
    course: "",
    group: "",
    expiresAt: null,
    isPinned: false,
    attachments: [],
  },
  searchTerm: "",
  courseFilter: "all",
  groupFilter: "all",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_DIALOG_OPEN":
      return { ...state, isDialogOpen: action.payload };
    case "SET_CURRENT_ANNOUNCEMENT":
      return {
        ...state,
        currentAnnouncement: action.payload,
        formData: action.payload
          ? {
              title: action.payload.title,
              content: action.payload.content,
              course: action.payload.course || "",
              group: action.payload.group || "",
              expiresAt: action.payload.expiresAt || null,
              isPinned: action.payload.isPinned,
              attachments: action.payload.attachments,
            }
          : initialState.formData,
      };
    case "UPDATE_FORM_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "ADD_ANNOUNCEMENT":
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
      };
    case "UPDATE_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.map((ann) =>
          ann.id === action.payload.id ? action.payload : ann,
        ),
      };
    case "DELETE_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.filter(
          (ann) => ann.id !== action.payload,
        ),
      };
    case "PIN_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.map((ann) =>
          ann.id === action.payload ? { ...ann, isPinned: !ann.isPinned } : ann,
        ),
      };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_COURSE_FILTER":
      return { ...state, courseFilter: action.payload };
    case "SET_GROUP_FILTER":
      return { ...state, groupFilter: action.payload };
    default:
      return state;
  }
}

const courses = [
  "Introduction to Biology",
  "Advanced Mathematics",
  "World History",
];
const groups = ["Group A", "Group B", "Group C"];

export default function AnnouncementPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedFormData = FormDataSchema.parse(state.formData);
      if (state.currentAnnouncement) {
        // Update existing announcement
        const updatedAnnouncement = AnnouncementSchema.parse({
          ...state.currentAnnouncement,
          ...validatedFormData,
          updatedAt: new Date(),
        });
        dispatch({ type: "UPDATE_ANNOUNCEMENT", payload: updatedAnnouncement });
        toast.success("Announcement updated successfully");
      } else {
        // Create new announcement
        const newAnnouncement = AnnouncementSchema.parse({
          id: Date.now().toString(),
          ...validatedFormData,
          author: "Current Teacher",
          authorAvatar: "/placeholder-avatar.jpg",
          createdAt: new Date(),
        });
        dispatch({ type: "ADD_ANNOUNCEMENT", payload: newAnnouncement });
        toast.success("New announcement created");
        toast.info(newAnnouncement.content);
      }
      dispatch({ type: "SET_DIALOG_OPEN", payload: false });
      dispatch({ type: "SET_CURRENT_ANNOUNCEMENT", payload: null });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      } else {
        toast.error("An error occurred while submitting the form");
      }
    }
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_ANNOUNCEMENT", payload: id });
    toast.success("Announcement deleted");
  };

  const handlePin = (id: string) => {
    dispatch({ type: "PIN_ANNOUNCEMENT", payload: id });
    toast.success("Announcement pin status updated");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        type: file.type.startsWith("image/")
          ? ("image" as const)
          : ("file" as const),
        url: URL.createObjectURL(file),
      }));
      dispatch({
        type: "UPDATE_FORM_DATA",
        payload: {
          attachments: [
            ...(state.formData.attachments || []),
            ...newAttachments,
          ],
        },
      });
    }
  };

  const filteredAnnouncements = useMemo(() => {
    return state.announcements
      .filter((ann) => {
        const now = new Date();
        switch (state.filter) {
          case "pinned":
            return ann.isPinned;
          case "upcoming":
            return ann.expiresAt ? ann.expiresAt > now : true;
          case "past":
            return ann.expiresAt ? ann.expiresAt <= now : false;
          default:
            return true;
        }
      })
      .filter((ann) => {
        const matchesSearch =
          ann.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          ann.content.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesCourse =
          state.courseFilter === "all" || ann.course === state.courseFilter;
        const matchesGroup =
          state.groupFilter === "all" || ann.group === state.groupFilter;
        return matchesSearch && matchesCourse && matchesGroup;
      });
  }, [
    state.announcements,
    state.filter,
    state.searchTerm,
    state.courseFilter,
    state.groupFilter,
  ]);
  return (
    <div className="mx-auto p-4">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search announcements..."
                value={state.searchTerm}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
                }
                className="w-full sm:w-64"
              />
              <Dialog
                open={state.isDialogOpen}
                onOpenChange={(open) =>
                  dispatch({ type: "SET_DIALOG_OPEN", payload: open })
                }
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() =>
                      dispatch({
                        type: "SET_CURRENT_ANNOUNCEMENT",
                        payload: null,
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>
                      {state.currentAnnouncement
                        ? "Edit Announcement"
                        : "Create New Announcement"}
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-4 p-2">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={state.formData.title}
                          placeholder="Enter a title"
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FORM_DATA",
                              payload: { title: e.target.value },
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <RTEditor
                          content={state.formData.content}
                          onChange={(content) =>
                            dispatch({
                              type: "UPDATE_FORM_DATA",
                              payload: { content },
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="course">Course</Label>
                          <Select
                            value={state.formData.course}
                            onValueChange={(value) =>
                              dispatch({
                                type: "UPDATE_FORM_DATA",
                                payload: { course: value },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course} value={course}>
                                  {course}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="group">Group</Label>
                          <Select
                            value={state.formData.group}
                            onValueChange={(value) =>
                              dispatch({
                                type: "UPDATE_FORM_DATA",
                                payload: { group: value },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map((group) => (
                                <SelectItem key={group} value={group}>
                                  {group}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Expiration Date (Optional)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !state.formData.expiresAt &&
                                  "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {state.formData.expiresAt ? (
                                format(state.formData.expiresAt, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={state.formData.expiresAt || undefined}
                              onSelect={(date) =>
                                dispatch({
                                  type: "UPDATE_FORM_DATA",
                                  payload: { expiresAt: date },
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPinned"
                          checked={state.formData.isPinned}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FORM_DATA",
                              payload: { isPinned: e.target.checked },
                            })
                          }
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="isPinned">Pin this announcement</Label>
                      </div>
                      <div>
                        <Label htmlFor="attachments">Attachments</Label>
                        <Input
                          id="attachments"
                          type="file"
                          onChange={handleFileUpload}
                          multiple
                          className="mt-1"
                        />
                        {state.formData.attachments &&
                          state.formData.attachments.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">
                                Attached files:
                              </p>
                              <ul className="list-disc list-inside">
                                {state.formData.attachments.map(
                                  (attachment, index) => (
                                    <li key={index} className="text-sm">
                                      {attachment.type === "image" ? (
                                        <ImageIcon className="inline mr-1 h-4 w-4" />
                                      ) : (
                                        <FileIcon className="inline mr-1 h-4 w-4" />
                                      )}
                                      {attachment.url.split("/").pop()}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {state.currentAnnouncement ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <Select
              value={state.courseFilter}
              onValueChange={(value) =>
                dispatch({ type: "SET_COURSE_FILTER", payload: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={state.groupFilter}
              onValueChange={(value) =>
                dispatch({ type: "SET_GROUP_FILTER", payload: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={(value) =>
              dispatch({
                type: "SET_FILTER",
                payload: value as State["filter"],
              })
            }
          >
            <ScrollArea className="bg-secondary rounded-lg">
              <div className="w-full relative h-10">
                <TabsList className="flex w-full absolute h-10 justify-evenly">
                  <TabsTrigger className="w-full" value="pinned">
                    Pinned
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="all">
                    All
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="upcoming">
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="past">
                    Past
                  </TabsTrigger>
                </TabsList>
              </div>
            </ScrollArea>
            <TabsContent value="all" className="mt-4">
              {renderAnnouncementList(filteredAnnouncements)}
            </TabsContent>
            <TabsContent value="pinned" className="mt-4">
              {renderAnnouncementList(filteredAnnouncements)}
            </TabsContent>
            <TabsContent value="upcoming" className="mt-4">
              {renderAnnouncementList(filteredAnnouncements)}
            </TabsContent>
            <TabsContent value="past" className="mt-4">
              {renderAnnouncementList(filteredAnnouncements)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderAnnouncementList(announcements: Announcement[]) {
    return announcements.length === 0 ? (
      <p className="text-center text-gray-500">No announcements found.</p>
    ) : (
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className={cn(
              "transition-all hover:shadow-md",
              announcement.isPinned && "border-primary border-2",
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={announcement.authorAvatar}
                      alt={announcement.author}
                    />
                    <AvatarFallback>{announcement.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {announcement.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      By {announcement.author} •{" "}
                      {format(announcement.createdAt, "PPP")}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={announcement.isPinned ? "secondary" : "outline"}
                    onClick={() => handlePin(announcement.id)}
                    title={
                      announcement.isPinned
                        ? "Unpin announcement"
                        : "Pin announcement"
                    }
                  >
                    <PinIcon
                      className={cn(
                        "h-4 w-4",
                        announcement.isPinned && "fill-primary",
                      )}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      dispatch({
                        type: "SET_CURRENT_ANNOUNCEMENT",
                        payload: announcement,
                      });
                      dispatch({ type: "SET_DIALOG_OPEN", payload: true });
                    }}
                    title="Edit announcement"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(announcement.id)}
                    title="Delete announcement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                {announcement.course && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {announcement.course}
                  </Badge>
                )}
                {announcement.group && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {announcement.group}
                  </Badge>
                )}
                {announcement.expiresAt && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Expires {format(announcement.expiresAt, "PP")}
                  </Badge>
                )}
              </div>
              <div className="prose max-w-none text-sm text-gray-600 mb-2">
                {announcement.content.length > 150
                  ? announcement.content.slice(0, 150) + "..."
                  : announcement.content}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {announcement.attachments &&
                    announcement.attachments.length > 0 && (
                      <Badge variant="outline" className="text-gray-600">
                        <FileIcon className="w-3 h-3 mr-1" />
                        {announcement.attachments.length} attachment
                        {announcement.attachments.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                </div>
                {announcement.content.length > 10 && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-primary"
                      >
                        Read more
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <div className="mx-auto w-full max-w-2xl p-6">
                        <h2 className="text-2xl font-bold mb-4">
                          {announcement.title}
                        </h2>
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: announcement.content,
                          }}
                        />
                        {announcement.attachments &&
                          announcement.attachments.length > 0 && (
                            <div className="mt-4">
                              <p className="font-medium">Attachments:</p>
                              <ul className="list-disc list-inside">
                                {announcement.attachments.map(
                                  (attachment, index) => (
                                    <li key={index}>
                                      <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        {attachment.type === "image" ? (
                                          <ImageIcon className="inline mr-1 h-4 w-4" />
                                        ) : (
                                          <FileIcon className="inline mr-1 h-4 w-4" />
                                        )}
                                        {attachment.url.split("/").pop()}
                                      </a>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
