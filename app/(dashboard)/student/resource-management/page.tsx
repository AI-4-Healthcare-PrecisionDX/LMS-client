"use client";

import { PencilAltIcon, SearchIcon, TrashIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import RTEditor from "@/components/brand/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Note, useNotes } from "@/hooks/useNotes";
import { FileText, User, X } from "lucide-react";

const items = [
  { href: "/student", label: "Home" },
  { label: "Note Management" },
];

const ITEMS_TO_DISPLAY = 2;

interface HoverState {
  timeout: NodeJS.Timeout | null;
  isHovered: boolean;
}

const ResourceManagementPage = () => {
  const {
    notes,
    formData,
    currentNoteId,
    isLoading,
    error,
    handleInputChange,
    handleEditorChange,
    initializeForm,
    resetForm,
    saveNote,
    deleteNote,
  } = useNotes();

  const [hover, setHover] = useState<HoverState>({
    timeout: null,
    isHovered: false,
  });

  const [isClient, setIsClient] = useState(false);
  const [sortOption, setSortOption] = useState<"time" | "teacher">("time");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNoteEditorVisible, setIsNoteEditorVisible] = useState(false);
  const [isVisitingPageVisible, setIsVisitingPageVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseEnter = () => {
    if (hover.timeout) {
      clearTimeout(hover.timeout);
    }
    setHover({ timeout: null, isHovered: true });
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHover((prev) => ({ ...prev, isHovered: false }));
    }, 3000);
    setHover((prev) => ({ ...prev, timeout }));
  };

  const handleAddNoteClick = () => {
    initializeForm();
    setIsNoteEditorVisible(true);
    setIsVisitingPageVisible(false);
  };

  const handleSaveClick = async () => {
    const success = await saveNote();
    if (success) {
      setIsNoteEditorVisible(false);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!currentNoteId) return;

    const success = await deleteNote(currentNoteId);
    if (success) {
      setIsDeleteDialogOpen(false);
      setIsVisitingPageVisible(false);
    }
  };

  const editNote = (note: Note) => {
    initializeForm(note);
    setIsNoteEditorVisible(true);
    setIsVisitingPageVisible(false);
  };

  const viewNote = (note: Note) => {
    initializeForm(note);
    setIsVisitingPageVisible(true);
    setIsNoteEditorVisible(false);
  };

  if (!isClient) return null;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-red-500 text-xl font-semibold mb-4">
          Error loading notes
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading notes...
        </p>
      </div>
    );
  }

  const sortedAndFilteredNotes = [...notes]
    .sort((a, b) => {
      if (sortOption === "time") {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      }
      return a.note_teacher.localeCompare(b.note_teacher);
    })
    .filter((note) => {
      const searchMatches =
        note.note_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.note_teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.note_content.toLowerCase().includes(searchQuery.toLowerCase());

      const teacherMatches =
        !filterTeacher ||
        filterTeacher === "all" ||
        note.note_teacher === filterTeacher;

      return searchMatches && teacherMatches;
    });

  return (
    <div className="p-6">
      <div className="sticky top-0 bg-background pb-2 z-10">
        <div className="flex justify-between w-full items-center pt-2">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Resource Management</h2>
        <Button onClick={handleAddNoteClick}>Add Notes</Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col items-start justify-between mb-4 space-y-4 md:flex-row">
        <div className="flex flex-col w-full gap-4 md:flex-row">
          {/* Sort Section */}
          <div>
            <label className="block text-sm font-medium">Sort</label>
            <Select
              value={sortOption}
              onValueChange={(value: "time" | "teacher") =>
                setSortOption(value)
              }
            >
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Sort by Time</SelectItem>
                <SelectItem value="teacher">Sort by Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Teacher */}
          <div>
            <label className="block text-sm font-medium">
              Filter by Teacher
            </label>
            <Select value={filterTeacher} onValueChange={setFilterTeacher}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="All Teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {Array.from(
                  new Set(notes.map((note: Note) => note.note_teacher)),
                ).map((teacher) => (
                  <SelectItem key={teacher} value={teacher}>
                    {teacher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex items-center w-full md:w-[280px]">
          <SearchIcon className="absolute w-6 h-6 text-gray-500 transform -translate-y-1/2 left-2 top-1/2 dark:text-gray-300" />
          <Input
            type="text"
            placeholder="Search notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 py-2 pl-10 bg-gray-200 border rounded-md dark:bg-gray-900"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedAndFilteredNotes.length > 0 ? (
            sortedAndFilteredNotes.map((note) => (
              <Card
                key={note.note_id}
                onClick={() => viewNote(note)}
                className="relative rounded shadow cursor-pointer group"
              >
                <CardHeader className="pb-2">
                  <div className="text-lg font-semibold">{note.note_title}</div>
                </CardHeader>

                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Teacher: {note.note_teacher}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(note.updated_at).toLocaleString()}
                  </div>
                </CardContent>

                <CardFooter className="absolute bottom-1 right-2">
                  <div className="flex space-x-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editNote(note);
                      }}
                      className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                    >
                      <PencilAltIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        initializeForm(note);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No notes found.</p>
          )}
        </div>
      </ScrollArea>

      {/* Note Viewer Dialog */}
      <Dialog
        open={isVisitingPageVisible}
        onOpenChange={setIsVisitingPageVisible}
      >
        <DialogContent className="max-w-4xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-800 p-0 overflow-hidden rounded-lg">
          <div className="relative flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="absolute right-2 top-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsNoteEditorVisible(true);
                    setIsVisitingPageVisible(false);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <PencilAltIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <DialogClose className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-24">
                {formData.note_title}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Teacher: {formData.note_teacher}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-[#141824] rounded-lg p-6">
                <div
                  className="tiptap"
                  dangerouslySetInnerHTML={{ __html: formData.note_content }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Editor Dialog */}
      <Dialog open={isNoteEditorVisible} onOpenChange={setIsNoteEditorVisible}>
        <DialogContent className="max-w-4xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-800 p-0 overflow-hidden rounded-lg shadow-xl">
          <div className="flex flex-col">
            {/* Header Section */}
            <div className="p-6 bg-gray-50 dark:bg-gradient-to-b dark:from-[#1e2438] dark:to-[#1a1f2e] relative">
              <div className="absolute top-2 right-2">
                <DialogClose className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currentNoteId ? "Edit Note" : "Create New Note"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {currentNoteId
                    ? "Update your note details"
                    : "Fill in the details to create a new note"}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Title
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.note_title}
                    onChange={(e) =>
                      handleInputChange("note_title", e.target.value)
                    }
                    className="w-full h-10 bg-white dark:bg-[#141824] border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-3 pr-10"
                    placeholder="Enter a descriptive title"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500">
                    <FileText className="h-5 w-5" />
                  </span>
                </div>
              </div>

              {/* Teacher Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Teacher
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.note_teacher}
                    onChange={(e) =>
                      handleInputChange("note_teacher", e.target.value)
                    }
                    className="w-full h-10 bg-white dark:bg-[#141824] border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-3 pr-10"
                    placeholder="Enter teacher's name"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500">
                    <User className="h-5 w-5" />
                  </span>
                </div>
              </div>

              {/* Content Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Content
                </label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#141824]">
                  <RTEditor
                    content={formData.note_content}
                    onChange={(content: string) => handleEditorChange(content)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your content
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1e2438]">
              <Button
                variant="outline"
                onClick={() => setIsNoteEditorVisible(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveClick}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {currentNoteId ? "Update Note" : "Create Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Save</DialogTitle>
          <DialogDescription>
            Are you sure you want to save this note?
          </DialogDescription>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              onClick={handleSaveClick}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Confirm
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-gray-800 bg-gray-300 rounded-md dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-gray-100"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note?
          </DialogDescription>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              onClick={handleDeleteClick}
              variant="destructive"
              className="px-4 py-2"
            >
              Delete
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
              className="px-4 py-2"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceManagementPage;
