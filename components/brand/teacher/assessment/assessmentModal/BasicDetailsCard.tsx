"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { BookOpen, CalendarIcon } from "lucide-react";
import { useEffect } from "react";

export default function BasicDetailsCard({ state, dispatch, category }: { state: any, dispatch: any, category: string }) {
  useEffect(() => {
    if (!state.editingAssignment) {
      const now = new Date();
      now.setSeconds(0, 0); // Clear seconds and milliseconds

      dispatch({
        type: "SET_MULTIPLE",
        payload: {
          assignment_title: "",
          start_time: now,
          deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Default 7 days later
        },
      });
    }
  }, []);

  const handleTimeChange = (date: Date, timeString: string, type: string) => {
    if (!date) return;

    // Parse the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Create a new date with the existing date's year, month, and day
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0); // Set precise time, clear seconds and milliseconds

    dispatch({
      type: type === "start_time" ? "SET_START_TIME" : "SET_DEADLINE",
      payload: newDate,
    });
  };

  // Ensure dates are properly handled, even for editing
  const start_time = state.start_time ? new Date(state.start_time) : new Date();
  const deadline = state.deadline ? new Date(state.deadline) : new Date();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Basic Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base">Assignment Title</Label>
          <Input
            value={state.assignment_title || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_ASSIGNMENT_TITLE",
                payload: e.target.value,
              })
            }
            placeholder="Enter assignment title"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-base">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(start_time, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={start_time}
                  onSelect={(date) => {
                    if (date) {
                      // Preserve the existing time when changing the date
                      const newDate = new Date(date);
                      newDate.setHours(
                        start_time.getHours(),
                        start_time.getMinutes(),
                        0,
                        0,
                      );
                      dispatch({
                        type: "SET_START_TIME",
                        payload: newDate,
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-base">Start Time</Label>
            <Input
              type="time"
              value={format(start_time, "HH:mm")}
              onChange={(e) =>
                handleTimeChange(start_time, e.target.value, "start_time")
              }
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-base">Deadline Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(deadline, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => {
                    if (date) {
                      // Preserve the existing time when changing the date
                      const newDate = new Date(date);
                      newDate.setHours(
                        deadline.getHours(),
                        deadline.getMinutes(),
                        0,
                        0,
                      );
                      dispatch({
                        type: "SET_DEADLINE",
                        payload: newDate,
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-base">Deadline Time</Label>
            <Input
              type="time"
              value={format(deadline, "HH:mm")}
              onChange={(e) =>
                handleTimeChange(deadline, e.target.value, "deadline")
              }
              className="mt-1"
            />
          </div>
        </div>

        {category === "manual" && (
          <Button
            className="w-full mt-6"
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_TAB", payload: "questions" })
            }
          >
            Add Questions
          </Button>
        )}
      </CardContent>
    </Card>
  );
}