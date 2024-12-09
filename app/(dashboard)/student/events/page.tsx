"use client";

import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { compareAsc, format, isSameDay, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Edit,
  Link,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface Event {
  event_id: string;
  event_title: string;
  event_description: string;
  event_topics: string[];
  event_date: string;
  event_link?: string;
  student_id: string;
  created_at: string;
  updated_at: string;
  status?: "upcoming" | "successful" | "failed";
  is_completed: boolean;
}

interface EventFormData {
  title: string;
  description: string;
  topics?: string;
  date: string;
  time?: string;
  link?: string;
}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  topics: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await api.get("/student-event");
  return data;
};

const addEvent = async (
  event: Omit<Event, "event_id" | "student_id" | "created_at" | "updated_at">,
): Promise<Event> => {
  const { data } = await api.post("/student-event", event);
  return data;
};

const updateEvent = async ({
  eventId,
  event,
}: {
  eventId: string;
  event: Partial<Event>;
}): Promise<Event> => {
  const { data } = await api.put(`/student-event/${eventId}`, event);
  return data;
};

const deleteEvent = async (eventId: string): Promise<void> => {
  await api.delete(`/student-event/${eventId}`);
};

const items = [{ href: "/student", label: "Home" }, { label: "Events" }];
const ITEMS_TO_DISPLAY = 2;

const EventCard = ({
  event,
  onEdit,
  onDelete,
  onComplete,
}: {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}) => (
  <div
    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border 
    ${event.is_completed ? "border-green-500/50" : "border-gray-200/50 dark:border-gray-700/50"} 
    rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
  >
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {event.event_title}
        </h2>
        <div className="flex items-center space-x-2">
          {!event.is_completed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onComplete}
              className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircle2 className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-9 w-9 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {event.event_description}
      </p>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <CalendarIcon className="w-4 h-4 mr-2" />
          {format(parseISO(event.event_date), "PPP p")}
        </div>

        {event.event_link && (
          <div className="flex items-center">
            <Link className="w-4 h-4 mr-2" />
            <a
              href={event.event_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Event Link
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {event.event_topics.map((topic, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
          >
            {topic}
          </span>
        ))}
        {event.is_completed && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        )}
      </div>
    </div>
  </div>
);

const CalendarEvents = () => {
  const queryClient = useQueryClient();
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [sortOption, setSortOption] = useState<"all" | "selected">("all");
  const [viewMode, setViewMode] = useState<"upcoming" | "completed" | "past">(
    "upcoming",
  );

  const { control, handleSubmit, reset, setValue } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (editingEvent) {
      setValue("title", editingEvent.event_title);
      setValue("description", editingEvent.event_description);
      setValue("topics", editingEvent.event_topics.join(", "));
      setValue("date", format(parseISO(editingEvent.event_date), "yyyy-MM-dd"));
      setValue("time", format(parseISO(editingEvent.event_date), "HH:mm"));
      setValue("link", editingEvent.event_link || "");
    }
  }, [editingEvent, setValue]);

  const addEventMutation = useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsAddEventOpen(false);
      reset();
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsAddEventOpen(false);
      reset();
      setEditingEvent(null);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleAddOrEditEvent = (data: EventFormData) => {
    const deadline = data.time
      ? `${data.date}T${data.time}`
      : `${data.date}T00:00:00`;

    const eventData = {
      event_title: data.title,
      event_description: data.description,
      event_topics: data.topics
        ? data.topics.split(",").map((topic) => topic.trim())
        : [],
      event_date: deadline,
      event_link: data.link || undefined,
    };

    if (editingEvent) {
      updateEventMutation.mutate({
        eventId: editingEvent.event_id,
        event: eventData,
      });
    } else {
      addEventMutation.mutate({ ...eventData, is_completed: false });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSortOption("selected");
    }
  };

  const handleCompleteEvent = (eventId: string) => {
    updateEventMutation.mutate({
      eventId,
      event: { is_completed: true },
    });
  };

  const getFilteredEvents = () => {
    let filteredEvents = [...events];
    const now = new Date();

    if (sortOption === "selected") {
      filteredEvents = filteredEvents.filter((event) =>
        isSameDay(parseISO(event.event_date), selectedDate),
      );
    } else {
      switch (viewMode) {
        case "upcoming":
          filteredEvents = filteredEvents.filter(
            (event) => parseISO(event.event_date) >= now && !event.is_completed,
          );
          break;
        case "completed":
          filteredEvents = filteredEvents.filter((event) => event.is_completed);
          break;
        case "past":
          filteredEvents = filteredEvents.filter(
            (event) => parseISO(event.event_date) < now && !event.is_completed,
          );
          break;
      }
    }

    return filteredEvents.sort((a, b) =>
      compareAsc(parseISO(a.event_date), parseISO(b.event_date)),
    );
  };

  const isDateWithEvent = (date: Date) => {
    return events.some((event) => isSameDay(parseISO(event.event_date), date));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm pb-2 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between w-full items-center p-2">
            <BreadcrumbResponsive
              items={items}
              ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Section */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-24">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Calendar
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(selectedDate, "MMMM yyyy")}
                  </span>
                </div>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  className="rounded-md border-none w-full"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption:
                      "flex justify-center pt-1 relative items-center px-7",
                    caption_label: "text-base font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 absolute",
                    nav_button_previous: "left-1",
                    nav_button_next: "right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full justify-between px-1",
                    head_cell:
                      "text-gray-500 rounded-md w-10 font-normal text-[0.8rem] dark:text-gray-400",
                    row: "flex w-full mt-2 justify-between px-1",
                    cell: "text-center text-sm relative p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center justify-center",
                    day_selected:
                      "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white dark:focus:bg-blue-600 dark:focus:text-white",
                    day_today:
                      "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
                    day_outside: "opacity-50",
                    day_disabled: "opacity-50",
                    day_range_middle:
                      "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                    day_hidden: "invisible",
                  }}
                  modifiers={{ hasEvent: isDateWithEvent }}
                  modifiersStyles={{
                    hasEvent: {
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      color: "rgb(59, 130, 246)",
                      fontWeight: "bold",
                    },
                  }}
                />

                <div className="flex items-center gap-4 pt-2 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Events
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No Events
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Events
              </h2>
              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              id="title"
                              {...field}
                              className="col-span-3"
                            />
                          )}
                        />
                      </div>

                      <div className="grid items-center grid-cols-4 gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Controller
                          name="description"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Textarea
                              id="description"
                              {...field}
                              className="col-span-3"
                            />
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
                          defaultValue=""
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
                          defaultValue=""
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
                          Time
                        </Label>
                        <Controller
                          name="time"
                          control={control}
                          defaultValue=""
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
                          Link
                        </Label>
                        <Controller
                          name="link"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              id="link"
                              type="url"
                              {...field}
                              className="col-span-3"
                              placeholder="https://"
                            />
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        {editingEvent ? "Update Event" : "Create Event"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex gap-4 mb-6">
              <Select
                value={viewMode}
                onValueChange={(value: "upcoming" | "completed" | "past") =>
                  setViewMode(value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="View events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="completed">Completed Events</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOption}
                onValueChange={(value: "all" | "selected") =>
                  setSortOption(value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="selected">
                    Events on Selected Date
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {getFilteredEvents().map((event) => (
                <EventCard
                  key={event.event_id}
                  event={event}
                  onEdit={() => {
                    setEditingEvent(event);
                    setIsAddEventOpen(true);
                  }}
                  onDelete={() => deleteEventMutation.mutate(event.event_id)}
                  onComplete={() => handleCompleteEvent(event.event_id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarEvents;
