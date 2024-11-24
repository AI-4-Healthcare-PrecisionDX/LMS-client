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

// interface BasicDetailsCardProps {
//   state: State;
//   dispatch: Dispatch<Action>;
//   category?: 'custom' | 'ai-generated';
// }

export function BasicDetailsCard({ state, dispatch, category }) {
  const handleTimeChange = (date, timeString, type) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);

    dispatch({
      type: type === "start_time" ? "SET_START_TIME" : "SET_DEADLINE",
      payload: newDate,
    });
  };

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
            value={state.assignment_title}
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
                  {format(state.start_time, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={state.start_time}
                  onSelect={(date) =>
                    date && dispatch({ type: "SET_START_TIME", payload: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-base">Start Time</Label>
            <Input
              type="time"
              value={format(state.start_time, "HH:mm")}
              onChange={(e) =>
                handleTimeChange(state.start_time, e.target.value, "start_time")
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
                  {format(state.deadline, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={state.deadline}
                  onSelect={(date) =>
                    date && dispatch({ type: "SET_DEADLINE", payload: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-base">Deadline Time</Label>
            <Input
              type="time"
              value={format(state.deadline, "HH:mm")}
              onChange={(e) =>
                handleTimeChange(state.deadline, e.target.value, "deadline")
              }
              className="mt-1"
            />
          </div>
        </div>

        {category === "custom" && (
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
