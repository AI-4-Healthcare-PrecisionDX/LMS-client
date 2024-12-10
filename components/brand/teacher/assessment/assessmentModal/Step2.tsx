import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFileUpload from "@/hooks/use-upload";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Loader2 } from "lucide-react";
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFilteredContents } from "../../materials";
import { ContentOutline, SectionExclusiveContent, TemplateCourse } from "../../materials/types";

export default function Step2({
  onNext,
  onBack,
  selectedBooks,
  selectedChapters = {},
  section_exclusive_contents,
  template_course,
}: {
  onNext: (details: any) => void;
  onBack: (details: any) => void;
  selectedBooks: string[];
  selectedChapters: Record<string, string[]>;
  section_exclusive_contents: SectionExclusiveContent[];
  template_course: TemplateCourse;
}) {
  const [currentBooks, setCurrentBooks] = useState(selectedBooks || []);
  const [currentChapters, setCurrentChapters] = useState(selectedChapters);
  const [selectedSections, setSelectedSections] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [contentMetaOutlines, setContentMetaOutlines] = useState<Record<string, ContentOutline>>({});
  const [loadingBookId, setLoadingBookId] = useState<string | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [hasSelectedContent, setHasSelectedContent] = useState(false);

  const { getLibraryById, getLibraryFileByLibraryID } = useFileUpload();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { data: filteredBooks } = useFilteredContents({
    section_exclusive_contents,
    template_course,
    searchTerm,
    filterVisibility: "all",
    filterMaterialType: "all",
  });

  useEffect(() => {
    // Update hasSelectedContent whenever selections change
    const hasChapters = Object.values(currentChapters).some(chapters => chapters.length > 0);
    const hasSections = Object.values(selectedSections).some(sections => sections.length > 0);
    setHasSelectedContent(hasChapters || hasSections);
  }, [currentChapters, selectedSections]);

  const loadBookChapters = async (bookId: string) => {
    if (!contentMetaOutlines[bookId]) {
      setLoadingBookId(bookId);
      try {
        const outline = await getLibraryById(bookId);
        setContentMetaOutlines(prev => ({
          ...prev,
          [bookId]: outline
        }));
        // Automatically add book to currentBooks when expanding
        if (!currentBooks.includes(bookId)) {
          setCurrentBooks(prev => [...prev, bookId]);
        }
      } catch (error) {
        console.error(`Failed to load outline for book ${bookId}:`, error);
        toast.error("Failed to load chapters");
      } finally {
        setLoadingBookId(null);
      }
    }
  };

  const handleChapterToggle = (bookId: string, chapterId: string, sections: any[]) => {
    // Ensure book is in currentBooks
    if (!currentBooks.includes(bookId)) {
      setCurrentBooks(prev => [...prev, bookId]);
    }

    setCurrentChapters((prev) => {
      const isCurrentlySelected = prev[bookId]?.includes(chapterId);
      const newChapters = {
        ...prev,
        [bookId]: isCurrentlySelected
          ? prev[bookId].filter((id) => id !== chapterId)
          : [...(prev[bookId] || []), chapterId],
      };

      if (!isCurrentlySelected) {
        setSelectedSections(prev => ({
          ...prev,
          [chapterId]: sections.map(section => section.id)
        }));
      } else {
        const { [chapterId]: removed, ...rest } = selectedSections;
        setSelectedSections(rest);
      }

      return newChapters;
    });
  };

  const handleSectionToggle = (bookId: string, chapterId: string, sectionId: string) => {
    // Ensure book is in currentBooks
    if (!currentBooks.includes(bookId)) {
      setCurrentBooks(prev => [...prev, bookId]);
    }

    setSelectedSections(prev => {
      const currentSections = prev[chapterId] || [];
      const newSections = currentSections.includes(sectionId)
        ? currentSections.filter(id => id !== sectionId)
        : [...currentSections, sectionId];

      // If no sections are selected, remove the chapter from currentChapters
      if (newSections.length === 0) {
        setCurrentChapters(prev => ({
          ...prev,
          [bookId]: prev[bookId]?.filter(id => id !== chapterId) || []
        }));
        const { [chapterId]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [chapterId]: newSections
      };
    });
  };

  const generatePdf = async () => {
    setIsLoadingPdf(true);
    try {
      const newPdfDoc = await PDFDocument.create();
      const relevantBooks = filteredBooks?.filter(book => {
        const bookId = book.library_item.library_id || book.library_item.library_item.library_id;
        return currentBooks.includes(bookId);
      });

      for (const book of relevantBooks || []) {
        const bookId = book.library_item.library_id || book.library_item.library_item.library_id;
        const content_meta_outline = contentMetaOutlines[bookId];
        if (!content_meta_outline) continue;

        const file_url = await getLibraryFileByLibraryID(bookId);
        const response = await fetch(file_url);
        const pdfBytes = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const selectedChapterIds = currentChapters[bookId] || [];

        for (const chapter of content_meta_outline.content_outline) {
          const chapterSections = selectedSections[chapter.id] || [];

          if (selectedChapterIds.includes(chapter.id) && chapterSections.length === 0) {
            // If entire chapter is selected
            const pageIndices = Array.from(
              { length: chapter.pageRanges.end - chapter.pageRanges.start + 1 },
              (_, i) => i + chapter.pageRanges.start - 1
            );
            const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
            copiedPages.forEach(page => newPdfDoc.addPage(page));
          } else if (chapterSections.length > 0) {
            // If specific sections are selected
            for (const section of chapter.sections) {
              if (chapterSections.includes(section.id)) {
                const pageIndices = Array.from(
                  { length: section.pageRanges.end - section.pageRanges.start + 1 },
                  (_, i) => i + section.pageRanges.start - 1
                );
                const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
                copiedPages.forEach(page => newPdfDoc.addPage(page));
              }
            }
          }
        }
      }

      const mergedPdfBytes = await newPdfDoc.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setGeneratedPdfUrl(url);
      toast.success("PDF generated successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handlePreviewPdf = () => {
    if (!generatedPdfUrl) {
      toast.error("Please generate PDF first");
      return;
    }
    setSelectedPdf(generatedPdfUrl);
    setSelectedPdfName("Selected Chapters Preview");
    setIsDialogOpen(true);
  };

  // Rest of the component remains the same, but update the button's disabled prop
  return (
    <div className="">
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
              <Accordion type="single" collapsible className="w-full" onValueChange={(value) => {
                if (value) {
                  const bookId = value.replace('book-', '');
                  loadBookChapters(bookId);
                }
              }}>
                {filteredBooks?.map((book) => {
                  const bookId = book.library_item.library_id || book.library_item.library_item.library_id;
                  const outline = contentMetaOutlines[bookId];
                  const isLoading = loadingBookId === bookId;

                  return (
                    <AccordionItem value={`book-${bookId}`} key={bookId}>
                      <AccordionTrigger>{book.library_item.material_title}</AccordionTrigger>
                      <AccordionContent>
                        {isLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            <span>Loading chapters...</span>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {outline?.content_outline?.map((chapter: any) => (
                              <div key={chapter.id} className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`book-${bookId}-chapter-${chapter.id}`}
                                    checked={currentChapters[bookId]?.includes(chapter.id) || false}
                                    onCheckedChange={() => handleChapterToggle(bookId, chapter.id, chapter.sections)}
                                  />
                                  <Label
                                    htmlFor={`book-${bookId}-chapter-${chapter.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {chapter.title}
                                  </Label>
                                </div>

                                <div className="ml-6 space-y-1">
                                  {chapter.sections.map((section: any) => (
                                    <div key={section.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`section-${section.id}`}
                                        checked={selectedSections[chapter.id]?.includes(section.id) || false}
                                        onCheckedChange={() => handleSectionToggle(bookId, chapter.id, section.id)}
                                      />
                                      <Label
                                        htmlFor={`section-${section.id}`}
                                        className="text-sm text-muted-foreground"
                                      >
                                        {section.title}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </ScrollArea>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <Button
              onClick={generatePdf}
              disabled={!hasSelectedContent || isLoadingPdf}
              className="w-full md:w-auto"
            >
              {isLoadingPdf ? "Generating PDF..." : "Generate PDF"}
            </Button>
            <Button
              onClick={handlePreviewPdf}
              disabled={!generatedPdfUrl || isLoadingPdf}
              className="w-full md:w-auto"
            >
              Preview PDF
            </Button>
          </div>

          {isDialogOpen && selectedPdf && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="w-3/4 h-screen max-w-none m-0 p-6">
                <DialogHeader>
                  <DialogTitle>{selectedPdfName}</DialogTitle>
                </DialogHeader>
                {isLoadingPdf ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading PDF...</span>
                  </div>
                ) : (
                  <div className="w-full h-4/6 mt-10 mb-5">
                    <Viewer
                      fileUrl={selectedPdf}
                      plugins={[defaultLayoutPluginInstance]}
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
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
            onNext({
              bookIds: currentBooks,
              chapterIds: currentChapters,
              selectedSections,
              selectedPdf: generatedPdfUrl
            })
          }
          disabled={!hasSelectedContent || !generatedPdfUrl}
          size="lg"
          className="text-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
