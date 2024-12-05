import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { CheckCircle2, Trash2 } from "lucide-react";

export default function QuestionCard({ question, index, onUpdate, onDelete }) {
  const handleExpectedAnswerToggle = (option) => {
    const currentExpectedAnswers = Array.isArray(question.expected_answer)
      ? question.expected_answer
      : [];

    const newAnswers = currentExpectedAnswers.includes(option)
      ? currentExpectedAnswers.filter((answer) => answer !== option)
      : [...currentExpectedAnswers, option];

    onUpdate(index, "expected_answer", newAnswers);
  };

  const handleMarksChange = (e) => {
    const value = e.target.value;
    // Ensure marks is always a valid number
    const marks = value === "" ? 0 : parseInt(value);
    onUpdate(index, "marks", marks);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      tabIndex="0"
    >
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Question {index + 1}</Badge>
              <Badge>
                {question.question_type === "mcq"
                  ? "Multiple Choice"
                  : "Broad Question"}
              </Badge>
              <div className="flex items-center space-x-2">
                <Label>Marks:</Label>
                <Input
                  type="number"
                  value={question.marks || 0}
                  onChange={handleMarksChange}
                  min="0"
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

          <div className="space-y-4">
            <div>
              <Label className="text-base">Question Text</Label>
              <Textarea
                value={question.question_text || ""}
                onChange={(e) =>
                  onUpdate(index, "question_text", e.target.value)
                }
                rows={3}
                className="mt-2"
              />
            </div>

            {question.question_type === "mcq" && (
              <div className="space-y-4">
                <Label className="text-base">Options</Label>
                <div className="grid gap-3">
                  {(question.options_for_mcq || []).map(
                    (option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-1">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options_for_mcq];
                              newOptions[optionIndex] = e.target.value;
                              onUpdate(index, "options_for_mcq", newOptions);
                            }}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                        <Button
                          variant={
                            question.expected_answer?.includes(option)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleExpectedAnswerToggle(option)}
                          className="min-w-[100px]"
                        >
                          {question.expected_answer?.includes(option) && (
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                          )}
                          Correct
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {question.question_type === "broad" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Expected Answer</Label>
                  <Textarea
                    value={
                      Array.isArray(question.expected_answer)
                        ? question.expected_answer[0] || ""
                        : question.expected_answer || ""
                    }
                    onChange={(e) =>
                      onUpdate(index, "expected_answer", [e.target.value])
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
    </motion.div>
  );
}
