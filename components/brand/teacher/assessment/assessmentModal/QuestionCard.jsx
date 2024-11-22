import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";

export default function QuestionCard({ question, index, onUpdate, onDelete }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/png",
    );

    if (validFiles.length > 0) {
      const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
      const currentImages = question.images || [];
      onUpdate(index, "images", [...currentImages, ...imageUrls]);
    }
  };

  const removeImage = (imageIndex) => {
    const newImages = question.images.filter((_, idx) => idx !== imageIndex);
    onUpdate(index, "images", newImages);
  };

  const handleCorrectAnswerToggle = (option) => {
    const currentAnswers = Array.isArray(question.correctAnswers)
      ? question.correctAnswers
      : [question.correctAnswer].filter(Boolean);

    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((answer) => answer !== option)
      : [...currentAnswers, option];

    onUpdate(index, "correctAnswers", newAnswers);
  };

  const navigateImages = (direction) => {
    if (!question.images?.length) return;

    const newIndex =
      direction === "next"
        ? (selectedImageIndex + 1) % question.images.length
        : (selectedImageIndex - 1 + question.images.length) %
          question.images.length;

    setSelectedImageIndex(newIndex);
  };

  const handleKeyPress = (e) => {
    if (imagePreviewOpen) {
      if (e.key === "ArrowLeft") navigateImages("prev");
      if (e.key === "ArrowRight") navigateImages("next");
      if (e.key === "Escape") setImagePreviewOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onKeyDown={handleKeyPress}
      tabIndex="0"
    >
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Question {index + 1}</Badge>
              <Badge>
                {question.type === "mcq" ? "Multiple Choice" : "Broad Question"}
              </Badge>
              <div className="flex items-center space-x-2">
                <Label>Marks:</Label>
                <Input
                  type="number"
                  value={question.marks}
                  onChange={(e) =>
                    onUpdate(index, "marks", parseInt(e.target.value))
                  }
                  className="w-20"
                />
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(index)}
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              {question.images?.length > 0 ? (
                <Label className="text-base">Attachments</Label>
              ) : (
                <div></div>
              )}
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                  id={`image-upload-${index}`}
                />
                <Label
                  htmlFor={`image-upload-${index}`}
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add attachments
                </Label>
              </div>
            </div>

            {question.images?.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {question.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="relative group">
                    <img
                      src={image}
                      alt={`Question ${index + 1} Image ${imgIndex + 1}`}
                      className="w-full h-32 object-cover rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedImageIndex(imgIndex);
                        setImagePreviewOpen(true);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(imgIndex);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-base">Question Text</Label>
              <Textarea
                value={question.question}
                onChange={(e) => onUpdate(index, "question", e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>

            {question.type === "mcq" && (
              <div className="space-y-4">
                <Label className="text-base">Options</Label>
                <div className="grid gap-3">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-1">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optionIndex] = e.target.value;
                            onUpdate(index, "options", newOptions);
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                      <Button
                        variant={
                          (
                            Array.isArray(question.correctAnswers)
                              ? question.correctAnswers.includes(option)
                              : question.correctAnswer === option
                          )
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleCorrectAnswerToggle(option)}
                        className="min-w-[100px]"
                      >
                        {(Array.isArray(question.correctAnswers)
                          ? question.correctAnswers.includes(option)
                          : question.correctAnswer === option) && (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Correct
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.type === "broad" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Expected Answer</Label>
                  <Textarea
                    value={question.expectedAnswer}
                    onChange={(e) =>
                      onUpdate(index, "expectedAnswer", e.target.value)
                    }
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            {question.images?.[selectedImageIndex] && (
              <img
                src={question.images[selectedImageIndex]}
                alt={`Question ${index + 1} Preview`}
                className="w-full h-auto"
              />
            )}
            {question.images?.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  onClick={() => navigateImages("prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={() => navigateImages("next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
