import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mergedBooksAndChapters } from "@/data";
import { useState } from "react";

export default function Step2({
  onNext,
  onBack,
  selectedBooks,
  selectedChapters = {},
}) {
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
