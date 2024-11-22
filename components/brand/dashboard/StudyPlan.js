import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  format,
  isPast,
  isToday,
  isBefore,
  addDays,
  differenceInHours,
} from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

const initialSchedules = [
  {
    id: 1,
    title: "Practice Test for Neurology",
    startDate: "2024-09-30T14:00",
    endDate: "2024-09-30T16:00",
    description: "Revise chapters 3 and 4 of the Neurology Secrets book.",
    link: "",
  },
  {
    id: 2,
    title: "Lab Preparation",
    startDate: "2024-10-05T09:00",
    endDate: "2024-10-05T11:00",
    description:
      "Prepare for the lab on Nerve Conduction Studies. Read chapter 6.",
    link: "",
  },
];

const isValidLink = (link) => {
  return (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("www.")
  );
};

export default function StudyPlan() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    link: "",
  });
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertSchedules, setAlertSchedules] = useState([]);

  // Helper to check if a schedule is within the next 24 hours
  const isScheduleInNext24Hours = (startDate) => {
    const now = new Date();
    const scheduleStart = new Date(startDate);
    return (
      differenceInHours(scheduleStart, now) <= 24 &&
      differenceInHours(scheduleStart, now) >= 0
    );
  };

  useEffect(() => {
    const today = new Date();
    const upcomingOrPastSchedules = schedules.filter(
      (schedule) =>
        isPast(new Date(schedule.endDate)) ||
        isScheduleInNext24Hours(schedule.startDate),
    );

    if (upcomingOrPastSchedules.length > 0) {
      setAlertSchedules(upcomingOrPastSchedules);
      setAlertDialogOpen(true);
    }
  }, [schedules]);

  const openDialog = (schedule = null) => {
    setSelectedSchedule(schedule);
    if (schedule) {
      setFormData({
        title: schedule.title,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        description: schedule.description,
        link: schedule.link,
      });
    } else {
      setFormData({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        link: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedSchedule(null);
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.startDate.trim())
      newErrors.startDate = "Start date is required.";
    if (!formData.endDate.trim()) newErrors.endDate = "End date is required.";
    if (new Date(formData.startDate) >= new Date(formData.endDate))
      newErrors.endDate = "End date must be after the start date.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (formData.link && !isValidLink(formData.link))
      newErrors.link = "Invalid link format.";
    return newErrors;
  };

  const saveSchedule = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent saving if validation errors exist
    }

    const newSchedule = {
      ...formData,
      id: selectedSchedule ? selectedSchedule.id : Date.now(),
    };

    if (selectedSchedule) {
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === selectedSchedule.id ? newSchedule : schedule,
        ),
      );
    } else {
      setSchedules((prev) => [...prev, newSchedule]);
    }

    closeDialog();
    setExpandedScheduleId(null);
  };

  const deleteSchedule = (id) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  const toggleExpand = (id) => {
    setExpandedScheduleId((prev) => (prev === id ? null : id));
  };

  const sortedSchedules = schedules.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate),
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Study Plan</CardTitle>
              <CardDescription>Manage your goals / plans</CardDescription>
            </div>
            <Button
              onClick={() => openDialog(null)}
              variant="outline"
              className="text-lg"
            >
              +
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-1 gap-4 max-h-[500px]">
              {sortedSchedules.map((schedule) => (
                <Card key={schedule.id} className="p-4">
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleExpand(schedule.id)}
                  >
                    <h2 className="text-lg font-semibold">{schedule.title}</h2>
                    <p className="text-sm">
                      {format(new Date(schedule.startDate), "PPP, p")} -{" "}
                      {format(new Date(schedule.endDate), "PPP, p")}
                    </p>
                  </div>

                  {expandedScheduleId === schedule.id && (
                    <div className="mt-2 space-y-2">
                      <p>{schedule.description}</p>
                      <a
                        href={schedule.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {schedule.link}
                      </a>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            openDialog(schedule);
                            setExpandedScheduleId(null);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteSchedule(schedule.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Alert Dialog for Past and Upcoming Schedules */}
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upcoming or Missed Deadlines</DialogTitle>
            <DialogDescription>
              The following schedules are either past or happening soon:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {alertSchedules.map((schedule) => (
              <div key={schedule.id} className="flex flex-col space-y-1">
                <h2 className="font-semibold">{schedule.title}</h2>
                <p>
                  {format(new Date(schedule.startDate), "PPP, p")} -{" "}
                  {format(new Date(schedule.endDate), "PPP, p")}
                </p>
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={() => setAlertDialogOpen(false)}>
            Acknowledge
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSchedule ? "Edit Schedule" : "Add Schedule"}
            </DialogTitle>
            <DialogDescription>
              {selectedSchedule
                ? "Edit your study plan schedule."
                : "Add a new study plan schedule."}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-600" : ""}
            />
            {errors.title && <p className="text-red-600">{errors.title}</p>}
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              name="startDate"
              type="datetime-local"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? "border-red-600" : ""}
            />
            {errors.startDate && (
              <p className="text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              name="endDate"
              type="datetime-local"
              placeholder="End Date"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? "border-red-600" : ""}
            />
            {errors.endDate && <p className="text-red-600">{errors.endDate}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-600" : ""}
            />
            {errors.description && (
              <p className="text-red-600">{errors.description}</p>
            )}
          </div>
          <div>
            <Label>Link</Label>
            <Input
              name="link"
              type="url"
              placeholder="Link (optional)"
              value={formData.link}
              onChange={handleChange}
              className={errors.link ? "border-red-600" : ""}
            />
            {errors.link && <p className="text-red-600">{errors.link}</p>}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={saveSchedule}>
              {selectedSchedule ? "Save Changes" : "Add Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
