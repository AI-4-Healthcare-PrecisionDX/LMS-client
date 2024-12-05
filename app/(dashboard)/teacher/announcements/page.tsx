"use client";

import RTEditor from "@/components/brand/rich-text-editor";
import { Button } from "@/components/ui/button";
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
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Zod schemas for API responses
const TeacherSchema = z.object({
  teacher_id: z.string(),
  user_id: z.string(),
  user: z.object({
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    is_active: z.boolean(),
  }),
});

const SectionSchema = z.object({
  section_id: z.string(),
  section_name: z.string(),
  section_code: z.string(),
});

const AnnouncementSchema = z.object({
  announcement_id: z.string(),
  announcement_title: z.string(),
  announcement_description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  section: SectionSchema,
  teacher: TeacherSchema,
});

type Announcement = z.infer<typeof AnnouncementSchema>;

export default function AnnouncementPage({
  params,
}: {
  params: { section_id: string };
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    announcement_title: "",
    announcement_description: "",
  });

  const { section_id } = params;

  const queryClient = useQueryClient();

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await api.get(
        `/v1/announcement/?section_id=${section_id}&skip=0&limit=100`,
      );
      return z.array(AnnouncementSchema).parse(response.data);
    },
  });

  // Create announcement mutation
  const createMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const response = await api.post(
        `/v1/announcement/${sectionId}`,
        formData,
      );
      return AnnouncementSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Announcement created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create announcement");
    },
  });

  // Update announcement mutation
  const updateMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      const response = await api.put(
        `/v1/announcement/${announcementId}`,
        formData,
      );
      return AnnouncementSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Announcement updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update announcement");
    },
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      await api.delete(`/v1/announcement/${announcementId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete announcement");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentAnnouncement) {
      updateMutation.mutate(currentAnnouncement.announcement_id);
    } else {
      createMutation.mutate(section_id);
    }
  };

  const resetForm = () => {
    setFormData({
      announcement_title: "",
      announcement_description: "",
    });
    setCurrentAnnouncement(null);
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(
      (announcement) =>
        announcement.announcement_title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        announcement.announcement_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [announcements, searchTerm]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-4">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <PlusCircle className="mr-2 h-4 w-4" /> New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    {currentAnnouncement
                      ? "Edit Announcement"
                      : "Create New Announcement"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.announcement_title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          announcement_title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <RTEditor
                      content={formData.announcement_description}
                      onChange={(content) =>
                        setFormData((prev) => ({
                          ...prev,
                          announcement_description: content,
                        }))
                      }
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {currentAnnouncement ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement.announcement_id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{announcement.announcement_title}</CardTitle>
                      <CardDescription>
                        By {announcement.teacher.user.first_name}{" "}
                        {announcement.teacher.user.last_name} •{" "}
                        {format(new Date(announcement.created_at), "PPP")}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentAnnouncement(announcement);
                          setFormData({
                            announcement_title: announcement.announcement_title,
                            announcement_description:
                              announcement.announcement_description,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          deleteMutation.mutate(announcement.announcement_id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: announcement.announcement_description,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
