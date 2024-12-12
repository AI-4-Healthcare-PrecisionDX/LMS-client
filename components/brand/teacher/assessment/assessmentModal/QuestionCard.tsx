import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { CheckCircle2, Trash2 } from "lucide-react";

// Animation configuration
const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 },
};

// Header component with question metadata
const QuestionHeader = ({ index, type, marks, onMarksChange, onDelete }: {
  index: number;
  type: string;
  marks: number;
  onMarksChange: (value: number) => void;
  onDelete: () => void
}) => (
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center space-x-4">
      <Badge variant="outline">Question {index + 1}</Badge>
      <Badge variant="outline" className="bg-primary text-white">{type}</Badge>
      <div className="flex items-center space-x-2">
        <Label>Marks:</Label>
        <Input
          type="number"
          value={marks}
          onChange={(e) => onMarksChange(parseInt(e.target.value))}
          className="w-20"
        />
      </div>
    </div>
    <Button
      variant="destructive"
      size="sm"
      onClick={onDelete}
      className="flex items-center"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Delete
    </Button>
  </div>
);

// Question text input component
const QuestionText = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div>
    <Label className="text-base">Question Text</Label>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="mt-2"
    />
  </div>
);

const MCQOption = ({
  option,
  index,
  isCorrect,
  onOptionChange,
  onCorrectToggle,
}: {
  option: string;
  index: number;
  isCorrect: boolean;
  onOptionChange: (value: string) => void;
  onCorrectToggle: () => void;
}) => (
  <div className="flex items-center space-x-3">
    <div className="flex-1">
      <Input
        value={option || ""} // Add fallback for empty value
        onChange={(e) => onOptionChange(e.target.value)}
        placeholder={`Option ${index + 1}`}
      />
    </div>
    <Button
      variant={isCorrect ? "default" : "outline"}
      onClick={onCorrectToggle}
      className="min-w-[100px]"
    >
      {isCorrect && <CheckCircle2 className="w-4 h-4 mr-2" />}
      Correct
    </Button>
  </div>
);

// MCQ options section
const MCQSection = ({ options, expectedAnswer, onUpdate }: { options: string[]; expectedAnswer: string[]; onUpdate: (options: string[], expectedAnswer: string[]) => void }) => (
  <div className="space-y-4">
    <Label className="text-base">Options</Label>
    <div className="grid gap-3">
      {options.map((option, optionIndex) => (
        <MCQOption
          key={optionIndex}
          option={option}
          index={optionIndex}
          isCorrect={expectedAnswer?.includes(option)}
          onOptionChange={(value) => {
            const newOptions = [...options];
            newOptions[optionIndex] = value;
            onUpdate(newOptions, expectedAnswer);
          }}
          onCorrectToggle={() => {
            const currentExpectedAnswers = Array.isArray(expectedAnswer)
              ? [...expectedAnswer]
              : [];
            const newAnswers = currentExpectedAnswers.includes(option)
              ? currentExpectedAnswers.filter((answer) => answer !== option)
              : [...currentExpectedAnswers, option];
            onUpdate(options, newAnswers);
          }}
        />
      ))}
    </div>
  </div>
);

// Broad question answer section
const BroadQuestionSection = ({ value, onChange }: { value: string | string[]; onChange: (value: string | string[]) => void }) => (
  <div className="space-y-4">
    <div>
      <Label className="text-base">Expected Answer</Label>
      <Textarea
        value={Array.isArray(value) ? value[0] || "" : value || ""}
        onChange={(e) => onChange([e.target.value])}
        rows={4}
        className="mt-2"
      />
    </div>
  </div>
);

// Main QuestionCard component
export default function QuestionCard({ question, index, onUpdate, onDelete }: { question: any; index: number; onUpdate: (index: number, field: string, value: any) => void; onDelete: (index: number) => void }) {
  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate(index, field, value);
  };

  return (
    <motion.div {...cardAnimation} tabIndex={index}>
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <QuestionHeader
            index={index}
            type={question.question_type}
            marks={question.marks}
            onMarksChange={(value) => handleFieldUpdate("marks", value)}
            onDelete={() => onDelete(index)}
          />

          <div className="space-y-4">
            <QuestionText
              value={question.question_text}
              onChange={(value) => handleFieldUpdate("question_text", value)}
            />

            {question.question_type === "mcq" ? (
              <MCQSection
                options={question.options_for_mcq || []}
                expectedAnswer={question.expected_answer}
                onUpdate={(options, newAnswers) => {
                  handleFieldUpdate("options_for_mcq", options);
                  if (newAnswers) {
                    handleFieldUpdate("expected_answer", newAnswers);
                  }
                }}
              />
            ) : (
              <BroadQuestionSection
                value={question.expected_answer}
                onChange={(value) =>
                  handleFieldUpdate("expected_answer", value)
                }
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
