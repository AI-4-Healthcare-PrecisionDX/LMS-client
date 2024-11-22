"use client"; // Ensure this component runs on the client-side

import { useEffect, useState } from "react";

import { Editor } from "primereact/editor";

import { BreadcrumbResponsive } from "@/components/BreadCrumb";
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
import { PencilAltIcon, SearchIcon, TrashIcon } from "@heroicons/react/outline"; // Import icons

const formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "link",
  "image",
  "align",
  "color",
  "background",
];

const items = [
  { href: "/student", label: "Home" },
  { label: "Note Management" },
];

const ITEMS_TO_DISPLAY = 2;

const ResourceManagementPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  const [sortOption, setSortOption] = useState("time"); // Default sorting option
  const [editorData, setEditorData] = useState(""); // Content of the editor
  const [savedNotes, setSavedNotes] = useState([]); // List of saved notes
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null); // Currently selected note index for editing
  const [isClient, setIsClient] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // For delete confirmation
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");

  // Control visibility of the note editor page and visiting page
  const [isNoteEditorVisible, setIsNoteEditorVisible] = useState(false);
  const [isVisitingPageVisible, setIsVisitingPageVisible] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true on client-side mount
    // Initialize dummy notes
    const dummyNotes = [
      {
        title: "Anatomy Overview",
        subject: "Anatomy",
        teacher: "Dr. Smith",
        content: "<p>This note covers the basics of human anatomy.</p>",
        timestamp: "10:30 AM, 12 Sep 2024",
      },
    ];
    setSavedNotes(dummyNotes);
  }, []);

  if (!isClient) return null; // Prevent SSR issues

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Clear any existing timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
  };

  const handleMouseLeave = () => {
    setHideTimeout(
      setTimeout(() => {
        setIsHovered(false);
      }, 3000),
    ); // 3000 milliseconds = 3 seconds
  };

  // Open the dialog
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Open the delete confirmation dialog
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  // Close the delete confirmation dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  // saveNote function checks if there is any content in the editor and then opens the dialog
  const saveNote = () => {
    // Extract text from editorData if it's rich text or HTML
    const element = document.createElement("div");
    element.innerHTML = editorData; // If editorData contains HTML
    const textContent = element.textContent || element.innerText || ""; // Extract plain text
    console.log(editorData);
    if (textContent.trim()) {
      openDialog(); // Open dialog to get metadata before saving
    }
  };

  // confirmSaveNote function saves the note if title and editorData are non-empty
  const confirmSaveNote = () => {
    // Extract text from editorData similar to the saveNote function
    const element = document.createElement("div");
    element.innerHTML = editorData; // If editorData contains HTML
    const textContent = element.textContent || element.innerText || ""; // Extract plain text
    if (title.trim() && textContent.trim()) {
      const now = new Date();
      const timestamp = `${now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}, ${now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;

      const note = {
        title,
        subject,
        teacher,
        content: editorData, // Here, you save the full editor content (rich text or HTML)
        timestamp, // Add the timestamp here
      };

      if (currentNoteIndex !== null) {
        // Update existing note
        const updatedNotes = [...savedNotes];
        updatedNotes[currentNoteIndex] = note;
        setSavedNotes(updatedNotes);
      } else {
        // Save new note
        setSavedNotes([note, ...savedNotes]);
      }
    console.log(editorData);

      // Clear inputs after saving
      setTitle("");
      setSubject("");
      setTeacher("");
      setEditorData(""); // Clear editor data
      setCurrentNoteIndex(null);
      closeDialog();
      setIsNoteEditorVisible(false);
      setIsVisitingPageVisible(false);

    }
  };

  // Edit a saved note
  const editNote = (index) => {
    const note = savedNotes[index];
    setTitle(note.title);
    setSubject(note.subject);
    setTeacher(note.teacher);
    setEditorData(note.content);
    setCurrentNoteIndex(index); // Set current note index to update the right note
    setIsNoteEditorVisible(true); // Show the note editor
    setIsVisitingPageVisible(false); // Hide the visiting page
  };

  // Handle "Add Notes" button click
  const handleAddNoteClick = () => {
  console.log(editNote);

    setIsNoteEditorVisible(true);
    setCurrentNoteIndex(null); // Clear current note index
    setEditorData(""); // Clear the editor for a new note
    setTitle("");
    setSubject("");
    setTeacher("");
    setIsVisitingPageVisible(false); // Hide the visiting page
  };

  // View a note
  const viewNote = (index) => {
    const note = savedNotes[index];
    setTitle(note.title);
    setSubject(note.subject);
    setTeacher(note.teacher);
    setEditorData(note.content);
    setCurrentNoteIndex(index);
    setIsVisitingPageVisible(true); // Show the visiting page
    setIsNoteEditorVisible(false); // Hide the note editor
  };

  // Delete a note
  const deleteNote = () => {
    if (currentNoteIndex !== null) {
      const updatedNotes = savedNotes.filter(
        (_, index) => index !== currentNoteIndex,
      );
      setSavedNotes(updatedNotes);
      setCurrentNoteIndex(null);
      closeDeleteDialog();
      setIsVisitingPageVisible(false);
    }
  };

  // Sort notes based on the selected option
  const sortedNotes = [...savedNotes].sort((a, b) => {
    if (sortOption === "time") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortOption === "teacher") {
      return a.teacher.localeCompare(b.teacher);
    }
    return 0;
  });

  // Filter and search notes
  const filteredNotes = sortedNotes.filter((note) => {
    const searchMatches =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const teacherMatches =
      filterTeacher && filterTeacher !== "all"
        ? note.teacher === filterTeacher
        : true;

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
      {/* Sidebar */}
      {/* Fixed header and controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Resource Management</h2>
        <Button
          onClick={handleAddNoteClick}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Add Notes
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col items-start justify-between mb-4 space-y-4 md:flex-row">
        {/* Sort Section */}
        <div className="flex flex-col w-full gap-4 md:flex-row">
          <div className="">
            <label className="block text-sm font-medium">Sort</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Sort by Time</SelectItem>
                <SelectItem value="teacher">Sort by Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Teacher Section */}
          <div className="relative">
            <label className="block text-sm font-medium">
              Filter by Teacher
            </label>
            <Select value={filterTeacher} onValueChange={setFilterTeacher}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="All Teachers" />
              </SelectTrigger>
              <SelectContent className="z-10">
                <SelectItem value="all">All Teachers</SelectItem>
                {[...new Set(savedNotes.map((note) => note.teacher))].map(
                  (teacher) => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Section */}
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
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <Card
                key={note.id}
                onClick={() => viewNote(index)}
                className="relative rounded shadow cursor-pointer group"
              >
                <CardHeader className="pb-2">
                  <div className="text-lg font-semibold">{note.title}</div>
                </CardHeader>

                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {"Subject: " + note.subject}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {"Teacher: " + note.teacher}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {note.timestamp}
                  </div>
                </CardContent>

                <CardFooter className="absolute bottom-1 right-2">
                  <div className="flex space-x-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editNote(index);
                      }}
                      className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                    >
                      <PencilAltIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentNoteIndex(index);
                        openDeleteDialog();
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

      {/* Note Viewer */}
      <Dialog
        open={isVisitingPageVisible}
        onOpenChange={setIsVisitingPageVisible}
      >
        <DialogContent className="max-w-4xl">
          <div
            className="relative flex-1 p-2 overflow-y-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Edit, Delete, Close Icons */}
            <div className="absolute flex space-x-2 top-4 right-4">
              <button
                onClick={() => {
                  setIsNoteEditorVisible(true);
                  setIsVisitingPageVisible(false);
                }}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              >
                <PencilAltIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  setCurrentNoteIndex(currentNoteIndex);
                  openDeleteDialog();
                }}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
              <DialogClose asChild>
                <button className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                  {/* <XIcon className="w-6 h-6" /> */}
                </button>
              </DialogClose>
            </div>

            {/* Display Title */}
            <div className="mb-4 text-2xl font-bold">{title}</div>

            {/* Display Subject and Teacher */}
            <div className="mb-4 text-lg text-gray-700 dark:text-gray-300">
              Subject: {subject}
            </div>
            <div className="mb-4 text-lg text-gray-700 dark:text-gray-300">
              Teacher: {teacher}
            </div>

            {/* Display the Note Content */}
            <div className="p-4 bg-gray-200 rounded-md shadow-md dark:bg-gray-800">
              <div
                dangerouslySetInnerHTML={{
                  __html: savedNotes[currentNoteIndex]?.content,
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Editor */}
      <Dialog open={isNoteEditorVisible} onOpenChange={setIsNoteEditorVisible}>
        <DialogContent className="max-w-4xl">
          <div className="flex flex-col">
            <div className="flex flex-row justify-end gap-2 mb-4">
              <DialogClose asChild></DialogClose>
            </div>

            {/* Input fields for Title, Subject, and Teacher */}
            <div className="">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teacher
                </label>
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="mb-4">
              <Editor
                value={editorData}
                onTextChange={(e) => setEditorData(e.htmlValue)}
                formats={formats}
                style={{ height: "250px" }}
                className="w-full text-gray-900 bg-gray-100 border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <Button onClick={saveNote} className="px-4 py-2 mb-2 w-28">
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding/editing notes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Save</DialogTitle>
          <DialogDescription>
            Are you sure you want to save this note?
          </DialogDescription>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={confirmSaveNote}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-gray-800 bg-gray-300 rounded-md dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for delete confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note?
          </DialogDescription>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={deleteNote}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={closeDeleteDialog}
              className="px-4 py-2 text-gray-800 bg-gray-300 rounded-md dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceManagementPage;
