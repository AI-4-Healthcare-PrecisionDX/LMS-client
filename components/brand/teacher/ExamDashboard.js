"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardCopyIcon,
  DownloadIcon,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";

const mergedBooksAndChapters = [
  {
    id: 1,
    title: "Fundamentals of Anatomy and Physiology",
    subject: "Anatomy",
    author: "Anna ChruŚCik, Kate Kauter, Louisa Windus and Eliza Whiteside",
    chapters: 12,
    difficulty: "Intermediate",
    pdfUrl: "/pdfs/book1.pdf",
    chapterDetails: [
      {
        id: 1,
        title: "Levels of Organisation, Homeostasis and Nomenclature",
        estimatedTime: 40,
        difficulty: "Easy",
        pageRanges: { start: 11, end: 37 },
        sections: [
          {
            id: "1.1",
            title: "Overview of Anatomy and Physiology",
            estimatedTime: 10,
            pageRanges: { start: 12, end: 15 },
          },
          {
            id: "1.2",
            title: "Structural Organisation of the Human Body",
            estimatedTime: 10,
            pageRanges: { start: 16, end: 23 },
          },
          {
            id: "1.3",
            title: "Homeostasis",
            estimatedTime: 10,
            pageRanges: { start: 24, end: 28 },
          },
          {
            id: "1.4",
            title: "Anatomical Terminology",
            estimatedTime: 10,
            pageRanges: { start: 29, end: 37 },
          },
        ],
      },
      {
        id: 2,
        title: "Cells and Reproduction",
        estimatedTime: 90,
        difficulty: "Intermediate",
        pageRanges: { start: 38, end: 145 },
        sections: [
          {
            id: "2.1",
            title: "Synthesis of Biological Macromolecules",
            estimatedTime: 10,
            pageRanges: { start: 39, end: 41 },
          },
          {
            id: "2.2",
            title: "Carbohydrates",
            estimatedTime: 10,
            pageRanges: { start: 42, end: 55 },
          },
          {
            id: "2.3",
            title: "Lipids",
            estimatedTime: 10,
            pageRanges: { start: 56, end: 65 },
          },
          {
            id: "2.4",
            title: "Protein",
            estimatedTime: 10,
            pageRanges: { start: 66, end: 78 },
          },
          {
            id: "2.5",
            title: "Nucleic Acid",
            estimatedTime: 10,
            pageRanges: { start: 78, end: 85 },
          },
          {
            id: "2.6",
            title: "The Cell Membrane",
            estimatedTime: 10,
            pageRanges: { start: 86, end: 100 },
          },
          {
            id: "2.7",
            title: "The Cytoplasm and Cellular Organelles",
            estimatedTime: 10,
            pageRanges: { start: 101, end: 111 },
          },
          {
            id: "2.8",
            title: "The Nucleus and DNA Replication",
            estimatedTime: 10,
            pageRanges: { start: 112, end: 120 },
          },
          {
            id: "2.9",
            title: "Protein Synthesis",
            estimatedTime: 10,
            pageRanges: { start: 121, end: 130 },
          },
          {
            id: "2.10",
            title: "Cell Growth and Division",
            estimatedTime: 5,
            pageRanges: { start: 131, end: 139 },
          },
          {
            id: "2.11",
            title: "Cellular Differentiation",
            estimatedTime: 5,
            pageRanges: { start: 140, end: 145 },
          },
        ],
      },
      {
        id: 3,
        title: "Tissues, Organs, Systems",
        estimatedTime: 60,
        difficulty: "Intermediate",
        pageRanges: { start: 146, end: 192 },
        sections: [
          {
            id: "3.1",
            title: "Types of Tissues",
            estimatedTime: 10,
            pageRanges: { start: 147, end: 154 },
          },
          {
            id: "3.2",
            title: "Epithelial Tissue",
            estimatedTime: 10,
            pageRanges: { start: 155, end: 167 },
          },
          {
            id: "3.3",
            title: "Connective Tissue Supports and Protects",
            estimatedTime: 10,
            pageRanges: { start: 168, end: 178 },
          },
          {
            id: "3.4",
            title: "Muscle Tissue and Motion",
            estimatedTime: 10,
            pageRanges: { start: 179, end: 183 },
          },
          {
            id: "3.5",
            title: "Nervous Tissue Mediates Perception and Response",
            estimatedTime: 10,
            pageRanges: { start: 184, end: 186 },
          },
          {
            id: "3.6",
            title: "Tissue Injury and Ageing",
            estimatedTime: 10,
            pageRanges: { start: 187, end: 192 },
          },
        ],
      },
      {
        id: 4,
        title: "Integumentary System",
        estimatedTime: 15,
        difficulty: "Easy",
        pageRanges: { start: 193, end: 200 },
        sections: [
          {
            id: "4.1",
            title: "Layers of the Skin",
            estimatedTime: 15,
            pageRanges: { start: 194, end: 200 },
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Anatomy & Physiology",
    subject: "Anatomy and Physiology",
    author: "OpenStax",
    chapters: 28,
    difficulty: "Intermediate",
    pdfUrl: "/pdfs/anatomy-physiology-openstax.pdf",
  },
  {
    id: 3,
    title:
      "Osteosarcoma: A Review of Diagnosis, Management, and Treatment Strategies",
    subject: "Oncology",
    author: "David S. Geller, Richard Gorlick",
    chapters: 8,
    difficulty: "Advanced",
    pdfUrl: "/pdfs/osteosarcoma-review.pdf",
  },
  {
    id: 4,
    title: "Basic Cardiac Rhythms-Identification and Response",
    subject: "Cardiology",
    author: "The University of Toledo",
    chapters: 6,
    difficulty: "Intermediate",
    pdfUrl: "/pdfs/basic-cardiac-rhythms.pdf",
  },
  {
    id: 5,
    title: "Oral and Maxillofacial Surgery for the Clinician",
    subject: "Dentistry",
    author: "Krishnamurthy Bonanthaya, Elavenil Panneerselvam",
    chapters: 20,
    difficulty: "Advanced",
    pdfUrl: "/pdfs/oral-maxillofacial-surgery.pdf",
  },
  {
    id: 6,
    title: "Common Skin Conditions Explained",
    subject: "Dermatology",
    author: "Unknown",
    chapters: 10,
    difficulty: "Beginner",
    pdfUrl: "/pdfs/common-skin-conditions.pdf",
  },
];

const questionTypes = [
  { title: "Question Bank", description: "Create from existing questions" },
  {
    title: "Adaptive Learning",
    description: "Questions adapt to student's level",
  },
  {
    title: "Application-based",
    description: "Apply concepts to real-world scenarios",
  },
  {
    title: "Writing Assignment",
    description: "Essay or long-form writing tasks",
  },
  {
    title: "Scenario-based",
    description: "Questions based on a given scenario",
  },
];

export default function ExamDashboard() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      name: "Math Homework",
      startDate: "2023-06-01",
      deadline: "2023-06-15",
      totalMarks: 100,
      submitted: 15,
    },
    {
      id: 2,
      name: "Science Project",
      startDate: "2023-06-05",
      deadline: "2023-06-20",
      totalMarks: 150,
      submitted: 10,
    },
    {
      id: 3,
      name: "History Essay",
      startDate: "2023-06-10",
      deadline: "2023-06-25",
      totalMarks: 80,
      submitted: 20,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newExam, setNewExam] = useState({});
  const [editingExam, setEditingExam] = useState(null);
  const [sortBy, setSortBy] = useState("startDate");
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]); // This will hold the list of students and their submissions
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Controls the view modal
  const [viewingAssignment, setViewingAssignment] = useState(null); // Holds the selected assignment's data
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(null); // Holds the selected assignment's data

  // Function to handle viewing an assignment
  const handleView = (assignmentId) => {
    // Find the assignment based on its ID
    const assignment = sortedAssignments.find(
      (item) => item.id === assignmentId,
    );

    // Set the selected assignment's details in state
    setViewingAssignment(assignment);

    // Open the view modal
    setIsViewModalOpen(true);
  };

  const handleCheckSubmission = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    setSelectedAssignment(assignment);

    // Mock student data or fetch it from API
    const submissionData = [
      {
        id: 1,
        studentName: "John Doe",
        submitted: true,
        marks: null,
        submission: "Test fe dfv",
        fileUpload: true,
        file: "http://localhost:3000/teacher/course-details/1",
      },
      {
        id: 2,
        studentName: "Jane Smith",
        submitted: false,
        marks: null,
        submission: "",
        fileUpload: false,
        file: "",
      },
      // Add more student data as needed
    ];

    setStudents(submissionData);
    setIsSubmissionModalOpen(true);
  };

  const handleAddExam = () => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setNewExam({});
    setEditingExam(null);
  };

  const handleStep1Next = (details) => {
    setNewExam({ ...newExam, ...details });
    setCurrentStep(2);
  };

  const handleStep2Next = (description) => {
    setNewExam({ ...newExam, description });
    setCurrentStep(3);
  };

  const handlePublish = (finalAssignment) => {
    const { startDate, timeLimit, totalMarks, description, name } =
      finalAssignment;

    // Ensure that startDate and timeLimit are provided
    if (!startDate || !timeLimit || !totalMarks) {
      console.error(
        "Missing required fields: startDate, timeLimit, or totalMarks",
      );
      return;
    }

    // Calculate the deadline by adding the timeLimit (in minutes) to the startDate
    const startDateTime = new Date(startDate); // Convert startDate to a Date object
    const deadline = new Date(startDateTime.getTime() + timeLimit * 60000); // Add timeLimit (in minutes)

    if (editingExam) {
      setAssignments(
        assignments.map((a) =>
          a.id === editingExam.id
            ? { ...a, ...finalAssignment, deadline, totalMarks, description }
            : a,
        ),
      );
    } else {
      const newExamEntry = {
        id: assignments.length + 1, // Increment ID
        name: name || `New ${newExam.questionType} Assignment`, // Default name if not provided
        startDate: startDateTime.toISOString(), // Store as ISO string for consistency
        deadline: deadline.toISOString(), // Calculate and store deadline
        totalMarks: totalMarks || 100, // Default total marks if not provided
        submitted: 0, // Default value for submitted count
        description: description || "No description provided", // Default description if not provided
      };

      setAssignments([...assignments, newExamEntry]); // Add the new exam to the list
    }

    // Close the modal
    setIsModalOpen(false);
  };

  const handleEdit = (id) => {
    const assignmentToEdit = assignments.find((a) => a.id === id);
    setEditingExam(assignmentToEdit);
    setNewExam(assignmentToEdit);
    setCurrentStep(3);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
    setDeleteConfirmOpen(null);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsModalOpen(false);
    }
  };

  // Sort options with dynamic label
  const getSortLabel = (sortBy) => {
    switch (sortBy) {
      case "startDate":
        return "Start Date";
      case "deadline":
        return "Deadline";
      case "name":
        return "Exam Name";
      default:
        return "Sort By"; // Default label if no sort option is selected
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === "startDate" || sortBy === "deadline") {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  function formatDateTime(isoString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // This will display time in 12-hour format with AM/PM
    };
    return new Date(isoString).toLocaleString(undefined, options);
    // You can pass a locale like 'en-US' instead of undefined for consistent formatting
  }

  function SubmissionDialog({
    isOpen,
    onClose,
    assignment,
    students,
    onSubmitMarks,
  }) {
    const [studentMarks, setStudentMarks] = useState({});

    // Initialize student marks with 0 by default when the dialog opens
    useEffect(() => {
      if (isOpen) {
        const initialMarks = {};
        students.forEach((student) => {
          initialMarks[student.id] = studentMarks[student.id] || 0; // Default to 0 for all students
        });
        setStudentMarks(initialMarks);
      }
    }, [isOpen, students]);

    const totalSubmitted = students.filter(
      (student) => student.submitted,
    ).length;

    const handleMarksChange = (studentId, marks) => {
      setStudentMarks((prev) => ({
        ...prev,
        [studentId]: marks,
      }));
    };

    const handleSave = () => {
      onSubmitMarks(studentMarks);
      onClose();
    };

    const handleCopyText = (text) => {
      navigator.clipboard.writeText(text);
      alert("Text copied to clipboard!");
    };

    const handleFileDownload = (fileUrl) => {
      window.open(fileUrl, "_blank"); // Open file in a new tab
    };

    if (!assignment) return null; // Prevent rendering if assignment is not available

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{`Submissions for ${assignment.name}`}</DialogTitle>
            <DialogDescription>
              {/* Show submission stats */}
              {`${totalSubmitted} out of ${students.length} students have submitted.`}
              <br />
              Total Marks: {assignment.totalMarks}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[300px] space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex flex-col space-y-2 mb-5">
                <div className="flex justify-between items-center">
                  <span>{student.studentName}</span>
                  <span className="">
                    {student.submitted ? "Submitted" : "Not Submitted"}
                  </span>
                  {/* Marks input, only enabled if student has submitted */}
                  <Input
                    type="number"
                    placeholder="Marks"
                    value={studentMarks[student.id]} // Default to 0 for all
                    onChange={(e) =>
                      handleMarksChange(student.id, e.target.value)
                    }
                    className="w-20 border rounded-md p-1"
                  />
                </div>

                {/* Text area for student's submission, disabled if not submitted */}
                <div className="relative">
                  <Textarea
                    value={student.submission || ""}
                    readOnly
                    disabled={!student.submitted}
                    className={`w-full p-2 border rounded-md ${
                      student.submitted ? "" : "bg-gray-200"
                    }`}
                    placeholder="No submission"
                    rows={3}
                  />
                  {student.submitted && (
                    <Button
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyText(student.submission)}
                    >
                      <ClipboardCopyIcon className="w-5 h-5 text-white-500" />
                    </Button>
                  )}
                </div>
                {/* File Download Option */}
                {student.fileUpload && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleFileDownload(student.file)}
                      className="w-40 mt-2 p-2 rounded-md flex items-center space-x-2"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      <span>Download File</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>

          <div className="flex justify-end mt-4">
            <Button onClick={handleSave}>Save Marks</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-5 text-2xl font-bold">Exam Dashboard</h1>
      <div className="flex justify-between mb-4 flex-col gap-4 items-start sm:flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              Sort by: {getSortLabel(sortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("startDate")}>
              Start Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("deadline")}>
              Deadline
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name")}>
              Exam Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleAddExam}>Create Exam</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exam Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Total Marks</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.name}</TableCell>
              <TableCell>{formatDateTime(assignment.startDate)}</TableCell>{" "}
              {/* Format the start time */}
              <TableCell>{formatDateTime(assignment.deadline)}</TableCell>{" "}
              {/* Format the deadline */}
              <TableCell>{assignment.totalMarks}</TableCell>
              <TableCell>{assignment.submitted}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(assignment.id)}>
                      View
                    </DropdownMenuItem>{" "}
                    {/* New View Option */}
                    <DropdownMenuItem onClick={() => handleEdit(assignment.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteConfirmOpen(assignment.id)}
                    >
                      Delete
                    </DropdownMenuItem>{" "}
                    {/* Confirmation for Delete */}
                    <DropdownMenuItem
                      onClick={() => handleCheckSubmission(assignment.id)}
                    >
                      Check Submission
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExam ? "Edit Exam" : "Add New Exam"}
            </DialogTitle>
            <DialogDescription>
              {editingExam ? "Modify the exam details" : "Create a new exam"}
            </DialogDescription>
          </DialogHeader>
          {currentStep === 1 && (
            <Step1
              assignmentDetails={editingExam || newExam}
              onNext={handleStep1Next}
              onBack={handleBack}
            />
          )}
          {currentStep === 2 && (
            <Step2
              onNext={handleStep2Next}
              onBack={handleBack}
              selectedType={newExam.questionType}
            />
          )}
          {currentStep === 3 && (
            <Step3
              assignmentDetails={editingExam || newExam}
              onPublish={handlePublish}
              onBack={handleBack}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog for Viewing Assignment Details */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              <strong>Exam Name:</strong> {viewingAssignment?.name}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {formatDateTime(viewingAssignment?.startDate)}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {formatDateTime(viewingAssignment?.deadline)}
            </p>
            <p>
              <strong>Total Marks:</strong> {viewingAssignment?.totalMarks}
            </p>
            <p>
              <strong>Submitted:</strong> {viewingAssignment?.submitted}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this exam?</p>
          <DialogFooter>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => handleDelete(isDeleteConfirmOpen)}
            >
              Yes, Delete
            </Button>
            <Button
              type="button"
              className="bg-gray-200 text-black hover:bg-gray-400"
              onClick={() => setDeleteConfirmOpen(null)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SubmissionDialog
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        assignment={selectedAssignment}
        students={students}
        onSubmitMarks={(marks) => {
          // Handle mark submission logic here (e.g., update student marks)
          console.log("Marks submitted:", marks);
        }}
      />
    </div>
  );
}

function Step1({ assignmentDetails, onNext, onBack }) {
  const [title, setTitle] = useState(assignmentDetails.name || "");
  const [questionType, setQuestionType] = useState(
    assignmentDetails.questionType || "",
  );

  const handleNext = () => {
    if (title && questionType) {
      onNext({ name: title, questionType });
    }
  };

  const isNextDisabled = !title || !questionType;

  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-3xl font-bold text-center">Create Exam</h2>
      <div>
        <Label htmlFor="examTitle" className="text-lg">
          Exam Title
        </Label>
        <Input
          id="examTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter exam title"
        />
      </div>

      <div>
        <Label className="text-lg">Question Type</Label>
        <Select onValueChange={setQuestionType}>
          <SelectTrigger>
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AI">AI</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} disabled={isNextDisabled}>
          Next
        </Button>
      </div>
    </div>
  );
}

function Step2({ onNext, onBack, selectedType }) {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [currentBooks, setCurrentBooks] = useState(selectedBook || []);
  const [currentChapters, setCurrentChapters] = useState(selectedChapter);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDescriptionGenerated, setIsDescriptionGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleBookToggle = (bookId) => {
    setCurrentBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  };

  const handleChapterToggle = (bookId, chapterId) => {
    setCurrentChapters((prev) => ({
      ...prev,
      [bookId]: prev[bookId]
        ? prev[bookId].includes(chapterId)
          ? prev[bookId].filter((id) => id !== chapterId)
          : [...prev[bookId], chapterId]
        : [chapterId],
    }));
  };

  const filteredBooks = mergedBooksAndChapters.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAISelection = () => {
    // Simulating the generation of a description based on selected books and chapters
    const generatedDescription = `Generated description for Books: ${currentBooks.join(", ")} - Chapters: ${JSON.stringify(currentChapters)}`;
    setDescription(generatedDescription);
    setIsDescriptionGenerated(true);
    setIsEditing(false); // Disable editing until the user clicks 'Edit'
  };

  const handleEditDescription = () => {
    setIsEditing(true); // Enable text area for editing
  };

  const handleSaveDescription = () => {
    setIsEditing(false); // Enable text area for editing
  };

  // Adjust the 'isNextDisabled' logic based on 'selectedType'
  const isNextDisabled =
    selectedType === "AI"
      ? isEditing || !isDescriptionGenerated // Disable Next when editing or description not generated
      : description.trim() === ""; // Disable Next for manual type if no description is provided

  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-3xl font-bold text-center">
        Choose Question Type
      </h2>

      {selectedType === "AI" ? (
        <div>
          <Label className="text-lg font-semibold">Search Books</Label>
          <Input
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Label className="text-lg font-semibold">Select Books</Label>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`book-${book.id}`}
                      checked={currentBooks.includes(book.id)}
                      onCheckedChange={() => handleBookToggle(book.id)}
                    />
                    <label
                      htmlFor={`book-${book.id}`}
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {book.title}
                    </label>
                  </div>
                  {currentBooks.includes(book.id) && book.chapterDetails && (
                    <div className="ml-6 space-y-2">
                      {book.chapterDetails.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`chapter-${book.id}-${chapter.id}`}
                            checked={currentChapters[book.id]?.includes(
                              chapter.id,
                            )}
                            onCheckedChange={() =>
                              handleChapterToggle(book.id, chapter.id)
                            }
                          />
                          <label
                            htmlFor={`chapter-${book.id}-${chapter.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {chapter.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <Button
            onClick={handleAISelection}
            disabled={currentBooks.length === 0}
          >
            Generate Description
          </Button>
          {isDescriptionGenerated && (
            <div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditing} // Disable editing until the 'Edit' button is clicked
              />
              <Button onClick={handleEditDescription} disabled={isEditing}>
                Edit
              </Button>

              <Button onClick={handleSaveDescription} disabled={!isEditing}>
                Save
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Label htmlFor="manualDescription">Description</Label>
          <Textarea
            id="manualDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={() => onNext(description)} disabled={isNextDisabled}>
          Next
        </Button>
      </div>
    </div>
  );
}

function Step3({ assignmentDetails, onPublish, onBack }) {
  const [points, setPoints] = useState(assignmentDetails.points || 10);
  const [timeLimit, setTimeLimit] = useState(assignmentDetails.timeLimit || "");
  const [startDateTime, setStartDateTime] = useState(
    assignmentDetails.startDateTime || new Date().toISOString().slice(0, 16),
  );
  const [totalAttempts, setTotalAttempts] = useState(
    assignmentDetails.totalAttempts || 1,
  );
  const [submissionType, setSubmissionType] = useState(
    assignmentDetails.submissionType || "",
  );

  // Check if all fields are filled and submission type is selected
  const isFormValid =
    points > 0 &&
    timeLimit > 0 &&
    startDateTime &&
    totalAttempts > 0 &&
    submissionType !== ""; // Ensure submissionType is selected

  const handlePublish = () => {
    if (isFormValid) {
      onPublish({
        ...assignmentDetails,
        totalMarks: points, // Map points to totalMarks
        timeLimit,
        startDate: startDateTime, // Map startDateTime to startDate
        totalAttempts,
        submissionType,
      });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-3xl font-bold text-center">Set Exam Details</h2>

      <div>
        <Label htmlFor="points">Total Marks</Label>
        <Input
          id="points"
          type="number"
          value={points}
          onChange={(e) =>
            setPoints(Math.max(1, parseInt(e.target.value) || 1))
          }
        />
      </div>
      <div>
        <Label htmlFor="timeLimit">Time Limit (in minutes)</Label>
        <Input
          id="timeLimit"
          type="number"
          value={timeLimit}
          onChange={(e) =>
            setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))
          }
        />
      </div>
      <div>
        <Label htmlFor="startDateTime">Start Date and Time</Label>
        <Input
          id="startDateTime"
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="totalAttempts">Total Attempts</Label>
        <Input
          id="totalAttempts"
          type="number"
          value={totalAttempts}
          onChange={(e) =>
            setTotalAttempts(Math.max(1, parseInt(e.target.value) || 1))
          }
        />
      </div>
      <div>
        <Label htmlFor="submissionType">Submission Type</Label>
        <Select onValueChange={setSubmissionType}>
          <SelectTrigger>
            <SelectValue placeholder="Select submission type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text_entry">Text Entry</SelectItem>
            <SelectItem value="url">Website URL</SelectItem>
            <SelectItem value="file_upload">File Upload</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handlePublish} disabled={!isFormValid}>
          Publish
        </Button>
      </div>
    </div>
  );
}
