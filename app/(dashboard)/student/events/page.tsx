"use client";

import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { compareAsc, format, isFuture, isSameDay, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Edit,
  Link,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";

interface Event {
  id: string;
  title: string;
  topics: string[];
  deadline: Date;
  status: "upcoming" | "successful" | "failed";
  link?: string;
}

interface EventFormData {
  title: string;
  topics?: string;
  date: string;
  time?: string;
  link?: string;
}

const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await axios.get("/api/events");
  return data;
};

const addEvent = async (event: Event): Promise<Event> => {
  const { data } = await axios.post("/api/events", event);
  return data;
};

const updateEvent = async (event: Event): Promise<Event> => {
  const { data } = await axios.put(`/api/events/${event.id}`, event);
  return data;
};

const deleteEvent = async (eventId: string): Promise<void> => {
  await axios.delete(`/api/events/${eventId}`);
};

const items = [{ href: "/student", label: "Home" }, { label: "Events" }];

const ITEMS_TO_DISPLAY = 2;

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  topics: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional(),
});

const CalendarEvents = () => {
  const queryClient = useQueryClient();
  const { data: events = [], refetch } = useQuery<Event[]>(
    "events",
    fetchEvents,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    topics: "",
    date: "",
    time: "",
    status: "upcoming" as const,
    link: "",
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [sortOption, setSortOption] = useState<"all" | "selected">("all");

  const { control, handleSubmit, reset } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSortOption("selected");
    }
  };

  const getFilteredEvents = (category: "upcoming" | "passed") => {
    const filteredEvents = events.filter((event) => {
      if (category === "upcoming") {
        return event.status === "upcoming";
      } else if (category === "passed") {
        return event.status === "successful" || event.status === "failed";
      }
      return true;
    });

    if (sortOption === "selected") {
      return filteredEvents.filter((event) =>
        isSameDay(event.deadline, selectedDate),
      );
    }

    if (category === "passed") {
      return filteredEvents.sort((a, b) => compareAsc(a.deadline, b.deadline));
    }

    return filteredEvents;
  };

  const addEventMutation = useMutation(addEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("events");
      refetch();
    },
  });

  const updateEventMutation = useMutation(updateEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("events");
      refetch();
    },
  });

  const deleteEventMutation = useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("events");
      refetch();
    },
  });

  const handleAddOrEditEvent = (data: EventFormData) => {
    const deadline = data.time
      ? parseISO(`${data.date}T${data.time}`)
      : parseISO(`${data.date}`);

    const event: Event = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      title: data.title,
      topics: data.topics
        ? data.topics.split(",").map((topic) => topic.trim())
        : [],
      deadline: deadline,
      status: isFuture(deadline) ? "upcoming" : "failed",
      link: data.link,
    };

    if (editingEvent) {
      updateEventMutation.mutate(event);
    } else {
      addEventMutation.mutate(event);
    }

    setIsAddEventOpen(false);
    reset();
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      topics: event.topics.join(", "),
      date: format(event.deadline, "yyyy-MM-dd"),
      time: format(event.deadline, "HH:mm"),
      status: "upcoming", // Force status to "upcoming" when editing
      link: event.link || "",
    });
    setIsAddEventOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };

  const handleCompleteEvent = (eventId: string) => {
    refetch();
  };

  const isDateWithEvent = (date: Date) => {
    return events.some((event) => isSameDay(date, event.deadline));
  };

  return (
    <div>
      <div className="sticky top-0 bg-background pb-2 z-10">
        <div className="flex justify-between w-full items-center p-2 ">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
        </div>
      </div>
      <div className="flex h-[90vh] bg-gray-100 dark:bg-gray-900">
        {/* Calendar column */}
        <div className="w-4/10 h-[90vh] p-6 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-blue-600 dark:text-blue-400">
            Calendar
          </h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            className="w-full py-4 mx-auto border-2 border-blue-200 rounded-lg dark:border-blue-700"
            modifiers={{ hasEvent: isDateWithEvent }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "rgb(59, 130, 246)",
                fontWeight: "bold",
              },
            }}
          />
        </div>

        {/* Events column */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Events
            </h2>
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? "Edit Event" : "Add New Event"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleAddOrEditEvent)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <Input id="title" {...field} className="col-span-3" />
                        )}
                      />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="topics" className="text-right">
                        Topics
                      </Label>
                      <Controller
                        name="topics"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="topics"
                            {...field}
                            className="col-span-3"
                            placeholder="Separate topics with commas"
                          />
                        )}
                      />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="date"
                            type="date"
                            {...field}
                            className="col-span-3"
                          />
                        )}
                      />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time (Optional)
                      </Label>
                      <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="time"
                            type="time"
                            {...field}
                            className="col-span-3"
                          />
                        )}
                      />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="link" className="text-right">
                        Link (Optional)
                      </Label>
                      <Controller
                        name="link"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="link"
                            {...field}
                            className="col-span-3"
                            placeholder="https://example.com"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingEvent ? "Update" : "Confirm"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="upcoming" className="flex-1">
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger value="passed" className="flex-1">
                Passed Events
              </TabsTrigger>
            </TabsList>
            <div className="mb-4">
              <Select
                value={sortOption}
                onValueChange={(value: "all" | "selected") =>
                  setSortOption(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="selected">
                    Events on Selected Date
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TabsContent value="upcoming">
              {getFilteredEvents("upcoming").map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onComplete={handleCompleteEvent}
                  showCompleteButton={true}
                />
              ))}
            </TabsContent>
            <TabsContent value="passed">
              {getFilteredEvents("passed").map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  showCompleteButton={false}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const EventCard = ({
  event,
  onEdit,
  onDelete,
  onComplete,
  showCompleteButton,
}: {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onComplete?: (eventId: string) => void;
  showCompleteButton: boolean;
}) => (
  <Card
    key={event.id}
    className={`mb-4 border-l-4 bg-white dark:bg-gray-800 ${
      event.status === "successful"
        ? "border-green-600"
        : event.status === "failed"
          ? "border-red-600"
          : "border-blue-600"
    }`}
  >
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-300">
        {event.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
        <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
        {format(event.deadline, "MMMM d, yyyy")}
      </div>
      {event.deadline.getHours() !== 0 && event.deadline.getMinutes() !== 0 && (
        <div className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2 text-blue-500" />
          {format(event.deadline, "h:mm a")}
        </div>
      )}
      {event.link && (
        <div className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
          <Link className="w-4 h-4 mr-2 text-blue-500" />
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {event.link}
          </a>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {event.topics.map((topic, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
          >
            {topic}
          </span>
        ))}
      </div>
    </CardContent>
    <CardFooter className="justify-end space-x-2">
      {showCompleteButton && onComplete && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComplete(event.id)}
          className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900"
        >
          <CheckCircle className="w-4 h-4 mr-2" /> Complete
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(event)}
        className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
      >
        <Edit className="w-4 h-4 mr-2" /> Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(event.id)}
        className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </Button>
    </CardFooter>
  </Card>
);

export default CalendarEvents;
