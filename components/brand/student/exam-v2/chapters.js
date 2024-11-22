"use client";

import "./styles.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CirclePlay,
  ChevronRightIcon,
  ChevronLeftIcon,
  MoveLeft,
  StopCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chapters, questions_mcq, questions_essay } from "@/data";
import { useAtom } from "jotai";
import { examTypeAtom, timeLimitAtom } from "@/store";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { PDFDocument } from "pdf-lib";
import { TourProvider, useTour } from "@reactour/tour";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { selectedChaptersAtom, selectedSectionsAtom } from "@/store";
import Link from "next/link";
import { Position, Button as PdfButton, Tooltip } from "@react-pdf-viewer/core";
import { PlayCircle } from "lucide-react";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { playAudio, stopAudio } from "@/lib/utils";

const steps = [
  {
    selector: ".chapter-card",
    content:
      "Here you can see the available chapters. Click on a chapter to expand and view its sections.",
  },
  {
    selector: ".chapter-checkbox",
    content:
      "Select chapters by clicking these checkboxes. You can also select individual sections within each chapter.",
  },
  {
    selector: ".difficulty-badge",
    content:
      "The difficulty level of each chapter is indicated by these badges.",
  },
  {
    selector: ".expand-button",
    content: "Click this button to expand or collapse the chapter details.",
  },
  {
    selector: ".section-list",
    content:
      "When expanded, you can see and select individual sections within the chapter.",
  },
  {
    selector: ".flashcard-button",
    content:
      "Click here to practice with flashcards based on your selected chapters and sections.",
  },
  {
    selector: ".smart-reading-button",
    content:
      "Use Smart Reading to get a customized PDF of your selected content.",
  },
  {
    selector: ".exam-button",
    content:
      "Once you've made your selections, click here to configure and start your exam.",
  },
  {
    selector: ".start-tour-button",
    content: "Click here to restart the tour.",
  },
];

const items = [
  { href: "/student", label: "Home" },
  { href: "/student/exam-v2", label: "Book List" },
  { label: "Chapter List" },
];

const ITEMS_TO_DISPLAY = 3;

const renderHighlightTarget = (props) => (
  <div
    style={{
      background: "#eee",
      display: "flex",
      position: "absolute",
      left: `${props.selectionRegion.left}%`,
      top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
      transform: "translate(0, 8px)",
      zIndex: 1,
    }}
  >
    <div className="flex gap-1">
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            onClick={() => playAudio(props.selectedText)}
            variant="secondary"
          >
            <PlayCircle className="size-4" />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Play audio</div>}
        offset={{ left: 0, top: -8 }}
      />
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={() => stopAudio()} variant="secondary">
            <StopCircle className="size-4" />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Stop audio</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  </div>
);

function ChapterList() {
  const { setIsOpen } = useTour();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const router = useRouter();
  const [selectedChapters, setSelectedChapters] = useAtom(selectedChaptersAtom);
  const [selectedSections, setSelectedSections] = useAtom(selectedSectionsAtom);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [examType, setExamType] = useAtom(examTypeAtom);
  const [timeLimit, setTimeLimit] = useAtom(timeLimitAtom);
  const [questionAmount, setQuestionAmount] = useState("10");
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isExamConfigOpen, setIsExamConfigOpen] = useState(false);
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
  });

  const toggleChapter = (chapterId) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    setSelectedChapters((prev) => {
      const isSelected = prev.includes(chapterId);
      const newSelectedChapters = isSelected
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];

      // Auto-select or deselect sections
      setSelectedSections((prevSections) => {
        const chapterSectionIds = chapter.sections.map((s) => s.id);
        if (isSelected) {
          return prevSections.filter((id) => !chapterSectionIds.includes(id));
        } else {
          return [...new Set([...prevSections, ...chapterSectionIds])];
        }
      });

      return newSelectedChapters;
    });
  };

  const toggleSection = (sectionId, chapterId) => {
    setSelectedSections((prev) => {
      const newSelectedSections = prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId];

      // Check if all sections of the chapter are selected
      const chapter = chapters.find((c) => c.id === chapterId);
      if (chapter) {
        const allSectionsSelected = chapter.sections.every((s) =>
          newSelectedSections.includes(s.id),
        );
        setSelectedChapters((prevChapters) => {
          if (allSectionsSelected && !prevChapters.includes(chapterId)) {
            return [...prevChapters, chapterId];
          } else if (!allSectionsSelected && prevChapters.includes(chapterId)) {
            return prevChapters.filter((id) => id !== chapterId);
          }
          return prevChapters;
        });
      }

      return newSelectedSections;
    });
  };

  const toggleExpand = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const isChapterSelected = (chapterId) => selectedChapters.includes(chapterId);
  const isSectionSelected = (sectionId) => selectedSections.includes(sectionId);
  const isChapterExpanded = (chapterId) => expandedChapters.includes(chapterId);

  const handleStartExam = () => {
    let selectedQuestions = [];
    if (examType === "mcq") {
      selectedQuestions = questions_mcq;
    } else if (examType === "essay") {
      selectedQuestions = questions_essay;
    } else if (examType === "mix") {
      selectedQuestions = [...questions_mcq, ...questions_essay];
    }

    const examData = {
      selectedChapters,
      selectedSections,
      examConfig: {
        examType,
        questionAmount,
        timeLimit,
      },
      questions: selectedQuestions.slice(0, parseInt(questionAmount)),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("examData", JSON.stringify(examData));
    }

    router.push("/student/exam-v2/chapter/question");
  };

  const handleSmartReading = async () => {
    setIsOpen(false);
    const mergedPdfData = await mergeSelectedPages(
      chapters,
      selectedChapters,
      selectedSections,
    );
    setMergedPdfUrl(mergedPdfData);
  };

  if (typeof window !== "undefined") {
    if (localStorage.getItem("chapterListPage") === null) {
      setIsOpen(true);
      localStorage.setItem("chapterListPage", "true");
    }
  }

  return (
    <div className="container mx-auto px-4 pb-2 dark:text-gray-100">
      <div className="sticky top-0 bg-background pb-2 z-10">
        <div className="flex justify-between w-full items-center pt-2">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
          <div className="flex items-center gap-1">
            <Link href="/student/exam-v2">
              <Button variant="outline">
                <MoveLeft className="w-4 h-4 mr-2" />
                Back to Book List
              </Button>
            </Link>
            <Button
              onClick={() => setIsOpen(true)}
              className="start-tour-button"
              variant="outline"
            >
              <CirclePlay />
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Select Chapters for Your Exam
        </h1>
        <div className="flex items-center justify-end mb-6 gap-4">
          <Button
            onClick={() => router.push("/student/exam-v2/chapter/flashcard")}
            disabled={
              selectedChapters.length === 0 && selectedSections.length === 0
            }
            className="flashcard-button dark:text-white"
          >
            Flash Card
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={
                  selectedChapters.length === 0 && selectedSections.length === 0
                }
                onClick={handleSmartReading}
                className="smart-reading-button dark:text-white"
              >
                Smart Reading
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full max-w-6xl h-[90vh] rounded-lg">
              <div className="h-full overflow-auto">
                {mergedPdfUrl ? (
                  <div style={{ height: "750px" }}>
                    <Viewer
                      fileUrl={mergedPdfUrl}
                      plugins={[
                        defaultLayoutPluginInstance,
                        highlightPluginInstance,
                      ]}
                    />
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogAction
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => stopAudio()}
                >
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={isExamConfigOpen} onOpenChange={setIsExamConfigOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={
                  selectedChapters.length === 0 && selectedSections.length === 0
                }
                className="exam-button dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                Proceed to Exam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exam Configuration</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                <div>
                  <Label htmlFor="exam-type">Exam Type</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger id="exam-type">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">MCQ</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="mix">Mix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="question-amount">Number of Questions</Label>
                  <Input
                    id="question-amount"
                    type="number"
                    value={questionAmount}
                    onChange={(e) => setQuestionAmount(e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input
                    id="time-limit"
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <Button onClick={handleStartExam}>Start Exam</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4 p-1">
        {chapters.map((chapter) => (
          <Card
            key={chapter.id}
            className="chapter-card transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isChapterSelected(chapter.id)}
                  onCheckedChange={() => toggleChapter(chapter.id)}
                  aria-label={`Select ${chapter.title}`}
                  className="chapter-checkbox"
                />
                <CardTitle
                  className={`text-lg font-semibold ${chapter.sections.length ? "cursor-pointer" : ""}`}
                  onClick={() => toggleExpand(chapter.id)}
                >
                  {chapter.title}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className="difficulty-badge"
                  variant={
                    chapter.difficulty === "Easy"
                      ? "success"
                      : chapter.difficulty === "Intermediate"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {chapter.difficulty}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(chapter.id)}
                  aria-label={
                    isChapterExpanded(chapter.id)
                      ? "Collapse chapter"
                      : "Expand chapter"
                  }
                  className="expand-button"
                >
                  {isChapterExpanded(chapter.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <BookOpen className="mr-2 h-4 w-4" />
                Number of Sections: {chapter.estimatedTime}
              </div>
              <Collapsible open={isChapterExpanded(chapter.id)}>
                <CollapsibleContent>
                  <div className="mt-2 space-y-2 ml-6 section-list">
                    {chapter.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={isSectionSelected(section.id)}
                          onCheckedChange={() =>
                            toggleSection(section.id, chapter.id)
                          }
                          aria-label={`Select ${section.title}`}
                        />
                        <span className="text-sm">{section.title}</span>
                        <span className="text-xs text-muted-foreground">
                          ({section.estimatedTime} min)
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function mergeSelectedPages(
  chapters,
  selectedChapters,
  selectedSections,
) {
  const pdfUrl = "/pdfs/book1.pdf"; // Path to the original PDF
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const newPdfDoc = await PDFDocument.create();

  // Create an array to hold all our copy operations
  const copyOperations = [];

  // Iterate over selected chapters and sections
  for (const chapter of chapters) {
    if (selectedChapters.includes(chapter.id)) {
      for (let i = chapter.pageRanges.start; i <= chapter.pageRanges.end; i++) {
        copyOperations.push(copyPageToNewDoc(pdfDoc, newPdfDoc, i - 1));
      }
    } else {
      for (const section of chapter.sections) {
        if (selectedSections.includes(section.id)) {
          for (
            let i = section.pageRanges.start;
            i <= section.pageRanges.end;
            i++
          ) {
            copyOperations.push(copyPageToNewDoc(pdfDoc, newPdfDoc, i - 1));
          }
        }
      }
    }
  }

  // Wait for all copy operations to complete
  await Promise.all(copyOperations);

  // Save the merged PDF and create a URL to display
  const mergedPdfBytes = await newPdfDoc.save();
  const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
  const pdfUrlNew = URL.createObjectURL(blob);
  console.log(pdfUrlNew);
  return pdfUrlNew;
}

// Helper function to copy a page
async function copyPageToNewDoc(sourcePdfDoc, targetPdfDoc, pageIndex) {
  const [copiedPage] = await targetPdfDoc.copyPages(sourcePdfDoc, [pageIndex]);
  targetPdfDoc.addPage(copiedPage);
}

export default function ChapterListWithTour() {
  const handlePrevStep = ({ currentStep, setCurrentStep }) => {
    setCurrentStep(currentStep - 1);
  };
  const handleNextStep = ({
    currentStep,
    stepsLength,
    setIsOpen,
    setCurrentStep,
  }) => {
    const clickable = [1, 3];
    const currentSelector = steps[currentStep].selector;
    const elementToClick = document.querySelector(currentSelector);
    if (clickable.includes(currentStep) && elementToClick) {
      elementToClick.click();
    }
    const last = currentStep === stepsLength - 1;
    if (last) {
      setIsOpen(false);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };
  return (
    <TourProvider
      steps={steps}
      disableDotsNavigation
      scrollSmooth
      onClickHighlighted={(e) => {
        e.stopPropagation();
      }}
      disableInteraction
      prevButton={({ currentStep, setCurrentStep }) => (
        <button
          onClick={() => handlePrevStep({ currentStep, setCurrentStep })}
          disabled={currentStep === 0}
          className="disabled:opacity-50"
        >
          <ChevronLeftIcon />
        </button>
      )}
      nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => (
        <button
          onClick={() =>
            handleNextStep({
              currentStep,
              stepsLength,
              setIsOpen,
              setCurrentStep,
            })
          }
          disabled={currentStep === stepsLength - 1}
          className="disabled:opacity-50"
        >
          <ChevronRightIcon />
        </button>
      )}
    >
      <ChapterList />
    </TourProvider>
  );
}
