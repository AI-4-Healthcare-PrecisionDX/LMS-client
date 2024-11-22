"use client";

import React, { useReducer, useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, FileIcon, ImageIcon, Clock, Search } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: Date;
  expiresAt?: Date;
  course?: string;
  group?: string;
  attachments: Array<{ type: "file" | "image"; url: string }>;
};

type State = {
  filter: "all" | "upcoming" | "past";
  searchTerm: string;
  courseFilter: string;
  groupFilter: string;
};

type Action =
  | { type: "SET_FILTER"; payload: State["filter"] }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_COURSE_FILTER"; payload: string }
  | { type: "SET_GROUP_FILTER"; payload: string };

const initialState: State = {
  filter: "all",
  searchTerm: "",
  courseFilter: "All Courses",
  groupFilter: "All Groups",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.payload };
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

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to the new semester!",
    content:
      "Hello everyone! I hope you're all excited for the new semester. Please review the syllabus and let me know if you have any questions.",
    author: "Dr. Smith",
    authorAvatar: "/placeholder-avatar.jpg",
    createdAt: new Date("2023-09-01"),
    course: "Introduction to Biology",
    attachments: [{ type: "file", url: "/syllabus.pdf" }],
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
    course: "World History",
    attachments: [
      { type: "file", url: "/permission-slip.pdf" },
      { type: "image", url: "/museum-preview.jpg" },
    ],
  },
];

const courses = [
  "All Courses",
  "Introduction to Biology",
  "Advanced Mathematics",
  "World History",
];
const groups = ["All Groups", "Group A", "Group B", "Group C"];

export default function StudentAnnouncementPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((ann) => {
        const now = new Date();
        switch (state.filter) {
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
          state.courseFilter === "All Courses" ||
          ann.course === state.courseFilter;
        const matchesGroup =
          state.groupFilter === "All Groups" || ann.group === state.groupFilter;
        return matchesSearch && matchesCourse && matchesGroup;
      });
  }, [state]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search announcements..."
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
            }
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
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
            payload: value as "all" | "upcoming" | "past",
          })
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <AnnouncementList announcements={filteredAnnouncements} />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <AnnouncementList announcements={filteredAnnouncements} />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <AnnouncementList announcements={filteredAnnouncements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnnouncementList({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return announcements.length === 0 ? (
    <p className="text-center text-gray-500">No announcements found.</p>
  ) : (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
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
              <p className="text-sm text-muted-foreground">
                By {announcement.author} •{" "}
                {format(announcement.createdAt, "PPP")}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          {announcement.course && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {announcement.course}
            </Badge>
          )}
          {announcement.group && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
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
            {announcement.attachments.length > 0 && (
              <Badge variant="outline" className="text-gray-600">
                <FileIcon className="w-3 h-3 mr-1" />
                {announcement.attachments.length} attachment
                {announcement.attachments.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
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
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="px-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {announcement.title}
                  </h2>
                  <div className="flex items-center space-x-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={announcement.authorAvatar}
                        alt={announcement.author}
                      />
                      <AvatarFallback>{announcement.author[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-foreground">
                      By {announcement.author} •{" "}
                      {format(announcement.createdAt, "PPP")}
                    </p>
                  </div>
                  <div className="prose max-w-none mb-6">
                    {announcement.content}
                  </div>
                  {announcement.attachments.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Attachments:</h3>
                      <ul className="list-disc list-inside">
                        {announcement.attachments.map((attachment, index) => (
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
                        ))}
                      </ul>
                    </div>
                  )}
                  {announcement.expiresAt && (
                    <div className="flex items-center text-yellow-600">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>
                        Expires on {format(announcement.expiresAt, "PPP")}
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
}
