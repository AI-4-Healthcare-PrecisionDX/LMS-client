import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export interface Note {
  note_id: string;
  note_title: string;
  note_teacher: string;
  note_content: string;
  note_markdown_content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotePayload {
  note_title: string;
  note_teacher: string;
  note_content: string;
  note_markdown_content: string;
}

export const useNotes = () => {
  const queryClient = useQueryClient();
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateNotePayload>({
    note_title: "",
    note_teacher: "",
    note_content: "",
    note_markdown_content: "",
  });

  // Fetch notes
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await api.get<Note[]>("/notes/");
      return data;
    },
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (payload: CreateNotePayload) => {
      const { data } = await api.post<Note>("/notes/", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({
      noteId,
      payload,
    }: {
      noteId: string;
      payload: CreateNotePayload;
    }) => {
      const { data } = await api.put<Note>(`/notes/${noteId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await api.delete(`/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Form handlers
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      note_content: content,
      note_markdown_content: content,
    }));
  };

  const initializeForm = (note?: Note) => {
    if (note) {
      setFormData({
        note_title: note.note_title,
        note_teacher: note.note_teacher,
        note_content: note.note_content,
        note_markdown_content: note.note_markdown_content,
      });
      setCurrentNoteId(note.note_id);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      note_title: "",
      note_teacher: "",
      note_content: "",
      note_markdown_content: "",
    });
    setCurrentNoteId(null);
  };

  const saveNote = async () => {
    try {
      if (currentNoteId) {
        await updateNoteMutation.mutateAsync({
          noteId: currentNoteId,
          payload: formData,
        });
      } else {
        await createNoteMutation.mutateAsync(formData);
      }
      resetForm();
      return true;
    } catch (error) {
      console.error("Note operation failed:", error);
      return false;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteNoteMutation.mutateAsync(noteId);
      resetForm();
      return true;
    } catch (error) {
      console.error("Delete operation failed:", error);
      return false;
    }
  };

  return {
    notes,
    formData,
    currentNoteId,
    isLoading:
      isLoading ||
      createNoteMutation.isPending ||
      updateNoteMutation.isPending ||
      deleteNoteMutation.isPending,
    isError:
      !!error ||
      createNoteMutation.isError ||
      updateNoteMutation.isError ||
      deleteNoteMutation.isError,
    error:
      error ||
      createNoteMutation.error ||
      updateNoteMutation.error ||
      deleteNoteMutation.error,
    handleInputChange,
    handleEditorChange,
    initializeForm,
    resetForm,
    saveNote,
    deleteNote,
  };
};
