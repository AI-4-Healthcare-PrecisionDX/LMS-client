"use client";

import RTEditor from "@/components/brand/rich-text-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { AlertCircle, Edit2, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
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

export default function AnnouncementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    announcement_title: "",
    announcement_description: "",
  });

  const sectionId = useParams().id as string;

  const queryClient = useQueryClient();

  // Fetch announcements
  const {
    data: announcements = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await api.get(
        `/announcement/?section_id=${sectionId}&skip=0&limit=100`,
      );
      return z.array(AnnouncementSchema).parse(response.data);
    },
  });

  // Create announcement mutation
  const createMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const response = await api.post(`/announcement/${sectionId}`, formData);
      return AnnouncementSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Announcement created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    },
  });

  // Update announcement mutation
  const updateMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      const response = await api.put(
        `/announcement/${announcementId}`,
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
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    },
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      await api.delete(`/announcement/${announcementId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setIsDeleteDialogOpen(false);
      toast.success("Announcement deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentAnnouncement) {
      updateMutation.mutate(currentAnnouncement.announcement_id);
    } else {
      createMutation.mutate(sectionId);
    }
  };

  const resetForm = () => {
    setFormData({
      announcement_title: "",
      announcement_description: "",
    });
    setCurrentAnnouncement(null);
  };

  const handleDelete = (announcementId: string) => {
    setAnnouncementToDelete(announcementId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (announcementToDelete) {
      deleteMutation.mutate(announcementToDelete);
    }
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-lg font-medium">Failed to load announcements</p>
        <p>
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <CardTitle className="text-2xl font-bold">Announcements</CardTitle>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl mx-4">
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
                    <Button
                      type="submit"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {currentAnnouncement ? "Updating..." : "Creating..."}
                        </>
                      ) : currentAnnouncement ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No announcements found
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <Card key={announcement.announcement_id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
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
                              announcement_title:
                                announcement.announcement_title,
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
                            handleDelete(announcement.announcement_id)
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
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              announcement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
