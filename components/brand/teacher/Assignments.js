"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  adaptiveLearningQuestions,
  applicationBasedQuestions,
  questionBankAssignmentQuestions,
  scenarioBasedQuestions,
  writingAssignmentQuestions,
} from "@/data";
import { format, parseISO, set } from "date-fns";
import {
  CalendarIcon,
  ClipboardCopyIcon,
  DownloadIcon,
  Filter,
  MoreHorizontal,
  X,
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

function Step1({ onNext, onBack, selectedBooks, selectedChapters = {} }) {
  const [currentBooks, setCurrentBooks] = useState(selectedBooks || []);
  const [currentChapters, setCurrentChapters] = useState(selectedChapters);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Choose Books and Chapters
      </h2>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
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
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="text-lg"
        >
          Back
        </Button>
        <Button
          onClick={() =>
            onNext({ bookIds: currentBooks, chapterIds: currentChapters })
          }
          disabled={
            currentBooks.length === 0 ||
            Object.values(currentChapters).flat().length === 0
          }
          size="lg"
          className="text-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Step2({ onNext, onBack, selectedType }) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Choose Question Type
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {questionTypes.map((type, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === type.title ? "ring-2 ring-primary" : ""}`}
            onClick={() => onNext(type.title)}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{type.title}</h3>
              <p className="text-muted-foreground">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="text-lg"
        >
          Back
        </Button>
        <Button
          onClick={() => onNext(selectedType || questionTypes[0].title)}
          size="lg"
          className="text-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Step3({ assignmentDetails, onModify, onPublish, onBack }) {
  const [title, setTitle] = useState(assignmentDetails.name || "");
  const [numQuestions, setNumQuestions] = useState(
    assignmentDetails.numQuestions || 10,
  );
  const [totalMarks, setTotalMarks] = useState(
    assignmentDetails.totalMarks || 10,
  );
  const [deadline, setDeadline] = useState(
    assignmentDetails.deadline
      ? parseISO(assignmentDetails.deadline)
      : new Date(),
  );
  const [startTime, setStartTime] = useState(
    assignmentDetails.startTime
      ? parseISO(assignmentDetails.startTime)
      : new Date(),
  );
  const [questions, setQuestions] = useState(assignmentDetails.questions || []);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    expected_answer: "",
  });
  const [files, setFiles] = useState([]);
  const [manualQuestions, setManualQuestions] = useState([]);

  useEffect(() => {
    if (
      !assignmentDetails.questions ||
      assignmentDetails.questions.length === 0
    ) {
      const questionSetMap = {
        "Question Bank": questionBankAssignmentQuestions,
        "Adaptive Learning": adaptiveLearningQuestions,
        "Application-based": applicationBasedQuestions,
        "Writing Assignment": writingAssignmentQuestions,
        "Scenario-based": scenarioBasedQuestions,
      };

      const selectedQuestions =
        questionSetMap[assignmentDetails.questionType] || [];

      const newQuestions = selectedQuestions
        .slice(0, numQuestions)
        .map((q) => ({
          ...q,
          answer: q.answer || "",
          marks: totalMarks / numQuestions,
        }));

      setQuestions(newQuestions);
    }
  }, [
    assignmentDetails.questionType,
    numQuestions,
    totalMarks,
    assignmentDetails.questions,
  ]);

  const handleModify = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleDelete = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setManualQuestions([
      ...manualQuestions,
      { ...newQuestion, id: Date.now() },
    ]);
    setNewQuestion({
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      expected_answer: "",
    });
    setShowAddQuestion(false);
  };

  const handleCancelAddQuestion = () => {
    setShowAddQuestion(false);
    setNewQuestion({
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      expected_answer: "",
    });
  };

  const handleTimeChange = (date, timeString, setter) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = set(date, { hours, minutes });
    setter(newDate);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([
      ...files,
      ...uploadedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(files[index].preview);
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handlePublish = () => {
    onPublish({
      name: title,
      numQuestions,
      totalMarks,
      startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      deadline: format(deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      questions: [...questions, ...manualQuestions],
      files: files.map((f) => f.file),
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Set Assignment Details
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="assignmentTitle" className="text-lg">
              Assignment Title
            </Label>
            <Input
              id="assignmentTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numQuestions" className="text-lg">
                Number of Questions (Max 30)
              </Label>
              <Input
                id="numQuestions"
                type="number"
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(
                    Math.min(30, Math.max(1, parseInt(e.target.value))),
                  )
                }
                min="1"
                max="30"
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="totalMarks" className="text-lg">
                Total Marks
              </Label>
              <Input
                id="totalMarks"
                type="number"
                value={totalMarks}
                onChange={(e) =>
                  setTotalMarks(Math.max(1, parseInt(e.target.value)))
                }
                min="1"
                className="text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-lg">Start Date and Time</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startTime, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startTime}
                      onSelect={(date) => setStartTime(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={format(startTime, "HH:mm")}
                  onChange={(e) =>
                    handleTimeChange(startTime, e.target.value, setStartTime)
                  }
                  className="w-1/2"
                />
              </div>
            </div>

            <div>
              <Label className="text-lg">Deadline Date and Time</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(deadline, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={(date) => setDeadline(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={format(deadline, "HH:mm")}
                  onChange={(e) =>
                    handleTimeChange(deadline, e.target.value, setDeadline)
                  }
                  className="w-1/2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auto">Auto-Generated Questions</TabsTrigger>
              <TabsTrigger value="manual">Manual Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="auto" className="space-y-4">
              <Button
                onClick={() => setShowAddQuestion(true)}
                className="w-full"
              >
                Add Question Manually
              </Button>

              {showAddQuestion && (
                <Card>
                  <CardContent className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Add New Question
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelAddQuestion}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        setNewQuestion({ ...newQuestion, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                      </SelectContent>
                    </Select>

                    <Textarea
                      placeholder="Enter your question"
                      value={newQuestion.question}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          question: e.target.value,
                        })
                      }
                    />

                    {newQuestion.type === "mcq" && (
                      <>
                        {newQuestion.options.map((option, index) => (
                          <Input
                            key={index}
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion({
                                ...newQuestion,
                                options: newOptions,
                              });
                            }}
                          />
                        ))}
                        <Input
                          placeholder="Correct answer"
                          value={newQuestion.correct_answer}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              correct_answer: e.target.value,
                            })
                          }
                        />
                      </>
                    )}

                    {newQuestion.type === "essay" && (
                      <Textarea
                        placeholder="Expected answer"
                        value={newQuestion.expected_answer}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            expected_answer: e.target.value,
                          })
                        }
                      />
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancelAddQuestion}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddQuestion}>Add Question</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {questions.map((q, index) => (
                  <Card key={q.id} className="p-4">
                    <div className="mb-2">
                      <Label className="text-lg">Question {index + 1}</Label>
                      <Textarea
                        value={q.question}
                        onChange={(e) =>
                          handleModify(index, "question", e.target.value)
                        }
                        placeholder="Enter question"
                        className="mb-2"
                      />
                    </div>

                    {q.type === "mcq" ? (
                      <>
                        <Label className="text-lg">Options</Label>
                        {q.options.map((option, optIndex) => (
                          <Input
                            key={optIndex}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...q.options];
                              newOptions[optIndex] = e.target.value;
                              handleModify(index, "options", newOptions);
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                            className="mb-2"
                          />
                        ))}
                        <Label className="text-lg">Correct Answer</Label>
                        <Input
                          value={q.correct_answer}
                          onChange={(e) =>
                            handleModify(
                              index,
                              "correct_answer",
                              e.target.value,
                            )
                          }
                          placeholder="Correct Answer"
                          className="mb-2"
                        />
                      </>
                    ) : (
                      <>
                        <Label className="text-lg">Expected Answer</Label>
                        <Textarea
                          value={q.expected_answer}
                          onChange={(e) =>
                            handleModify(
                              index,
                              "expected_answer",
                              e.target.value,
                            )
                          }
                          placeholder="Expected Answer"
                          className="mb-2"
                          rows={4}
                        />
                      </>
                    )}

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(index)}
                    >
                      Delete Question
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="manual" className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="text-lg">
                  Upload Files
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <span>{file.file.name}</span>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    {file.file.type.startsWith("image/") && (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="mt-2 max-w-full h-auto"
                      />
                    )}
                    {file.file.type === "application/pdf" && (
                      <iframe
                        src={file.preview}
                        className="mt-2 w-full h-96"
                        title={file.file.name}
                      ></iframe>
                    )}
                  </Card>
                ))}
              </div>

              <Button
                onClick={() => setShowAddQuestion(true)}
                className="w-full"
              >
                Add Question Manually
              </Button>

              {showAddQuestion && (
                <Card>
                  <CardContent className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Add New Question
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelAddQuestion}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        setNewQuestion({ ...newQuestion, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                      </SelectContent>
                    </Select>

                    <Textarea
                      placeholder="Enter your question"
                      value={newQuestion.question}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          question: e.target.value,
                        })
                      }
                    />

                    {newQuestion.type === "mcq" && (
                      <>
                        {newQuestion.options.map((option, index) => (
                          <Input
                            key={index}
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion({
                                ...newQuestion,
                                options: newOptions,
                              });
                            }}
                          />
                        ))}
                        <Input
                          placeholder="Correct answer"
                          value={newQuestion.correct_answer}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              correct_answer: e.target.value,
                            })
                          }
                        />
                      </>
                    )}

                    {newQuestion.type === "essay" && (
                      <Textarea
                        placeholder="Expected answer"
                        value={newQuestion.expected_answer}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            expected_answer: e.target.value,
                          })
                        }
                      />
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancelAddQuestion}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddQuestion}>Add Question</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {manualQuestions.map((q, index) => (
                  <Card key={q.id} className="p-4">
                    <div className="mb-2">
                      <Label className="text-lg">Question {index + 1}</Label>
                      <Textarea value={q.question} readOnly className="mb-2" />
                    </div>

                    {q.type === "mcq" ? (
                      <>
                        <Label className="text-lg">Options</Label>
                        {q.options.map((option, optIndex) => (
                          <Input
                            key={optIndex}
                            value={option}
                            readOnly
                            className="mb-2"
                          />
                        ))}
                        <Label className="text-lg">Correct Answer</Label>
                        <Input
                          value={q.correct_answer}
                          readOnly
                          className="mb-2"
                        />
                      </>
                    ) : (
                      <>
                        <Label className="text-lg">Expected Answer</Label>
                        <Textarea
                          value={q.expected_answer}
                          readOnly
                          className="mb-2"
                          rows={4}
                        />
                      </>
                    )}

                    <Button
                      variant="destructive"
                      onClick={() =>
                        setManualQuestions(
                          manualQuestions.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Delete Question
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="text-lg"
        >
          Back
        </Button>
        <Button onClick={handlePublish} size="lg" className="text-lg">
          Publish
        </Button>
      </div>
    </div>
  );
}

export default function AssignmentDashboard() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      name: "Math Homework",
      startTime: "2023-06-01",
      deadline: "2023-06-15",
      totalMarks: 100,
      submitted: 15,
    },
    {
      id: 2,
      name: "Science Project",
      startTime: "2023-06-05",
      deadline: "2023-06-20",
      totalMarks: 150,
      submitted: 10,
    },
    {
      id: 3,
      name: "History Essay",
      startTime: "2023-06-10",
      deadline: "2023-06-25",
      totalMarks: 80,
      submitted: 20,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newAssignment, setNewAssignment] = useState({});
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [sortBy, setSortBy] = useState("startTime");
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
  const handleAddAssignment = () => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setNewAssignment({});
    setEditingAssignment(null);
  };

  const handleStep1Next = (details) => {
    setNewAssignment({ ...newAssignment, ...details });
    setCurrentStep(2);
  };

  const handleStep2Next = (questionType) => {
    setNewAssignment({ ...newAssignment, questionType });
    setCurrentStep(3);
  };

  const handlePublish = (finalAssignment) => {
    if (editingAssignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === editingAssignment.id ? { ...a, ...finalAssignment } : a,
        ),
      );
    } else {
      const newAssignmentEntry = {
        id: assignments.length + 1,
        name:
          finalAssignment.name ||
          `New ${newAssignment.questionType} Assignment`,
        startTime: finalAssignment.startTime,
        deadline: finalAssignment.deadline,
        totalMarks: finalAssignment.totalMarks,
        submitted: 0,
        questions: finalAssignment.questions,
        files: finalAssignment.files,
      };
      setAssignments([...assignments, newAssignmentEntry]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (id) => {
    const assignmentToEdit = assignments.find((a) => a.id === id);
    setEditingAssignment(assignmentToEdit);
    setNewAssignment(assignmentToEdit);
    setCurrentStep(3);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
    setDeleteConfirmOpen(null);
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
      case "startTime":
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
    if (sortBy === "startTime" || sortBy === "deadline") {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Assignment Dashboard</h1>
      <div className="flex justify-between mb-4 flex-col gap-4 items-start sm:flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Sort by: {getSortLabel(sortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("startTime")}>
              Start Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("deadline")}>
              Deadline
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name")}>
              Assignment Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleAddAssignment}>Add Assignment</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignment Name</TableHead>
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
              <TableCell>{assignment.startTime}</TableCell>
              <TableCell>{assignment.deadline}</TableCell>
              <TableCell>{assignment.totalMarks}</TableCell>
              <TableCell>{assignment.submitted}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
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
              {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
            </DialogTitle>
            <DialogDescription>
              {editingAssignment
                ? "Modify the assignment details."
                : "Create a new assignment in 3 easy steps."}
            </DialogDescription>
          </DialogHeader>
          {currentStep === 1 && (
            <Step1
              onNext={handleStep1Next}
              onBack={handleBack}
              selectedBooks={newAssignment.bookIds}
              selectedChapters={newAssignment.chapterIds}
            />
          )}
          {currentStep === 2 && (
            <Step2
              onNext={handleStep2Next}
              onBack={handleBack}
              selectedType={newAssignment.questionType}
            />
          )}
          {currentStep === 3 && (
            <Step3
              assignmentDetails={editingAssignment || newAssignment}
              onModify={() => setCurrentStep(2)}
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
            <DialogTitle>Assignment Details</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              <strong>Assignment Name:</strong> {viewingAssignment?.name}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {formatDateTime(viewingAssignment?.startTime)}
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
          <p>Are you sure you want to delete this assignment?</p>
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
