"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { chapters } from "@/data";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { BookOpen, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";

export default function MaterialsView({ book, onClose }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  const toggleChapter = (chapterId) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    setSelectedChapters((prev) => {
      const isSelected = prev.includes(chapterId);
      const newSelectedChapters = isSelected
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];

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

  const handleSmartReading = async () => {
    const mergedPdfData = await mergeSelectedPages(
      chapters,
      selectedChapters,
      selectedSections,
    );
    setMergedPdfUrl(mergedPdfData);
  };

  return (
    <div className="container mx-auto py-8 dark:bg-gray-900 dark:text-gray-100">
      <Button variant="ghost" className="mb-4" onClick={onClose}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Books
      </Button>
      <h1 className="text-3xl font-bold mb-8 text-center">
        Select Chapters for Smart Reading: {book.title}
      </h1>
      <div className="space-y-4">
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
                <CardTitle className="text-lg font-semibold">
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
      <div className="mt-8 flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={
                selectedChapters.length === 0 && selectedSections.length === 0
              }
              onClick={handleSmartReading}
              className="smart-reading-button"
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
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-blue-600 text-white hover:bg-blue-700">
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

  const copyOperations = [];

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

  await Promise.all(copyOperations);

  const mergedPdfBytes = await newPdfDoc.save();
  const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
  const pdfUrlNew = URL.createObjectURL(blob);
  return pdfUrlNew;
}

async function copyPageToNewDoc(sourcePdfDoc, targetPdfDoc, pageIndex) {
  const [copiedPage] = await targetPdfDoc.copyPages(sourcePdfDoc, [pageIndex]);
  targetPdfDoc.addPage(copiedPage);
}
