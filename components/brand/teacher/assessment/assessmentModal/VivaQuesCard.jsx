import { Button, Card, Input, Label, Textarea } from "@windmill/react-ui";
import { Trash } from "react-feather";

export default function VivaQuesCard({ question, index, onUpdate, onDelete }) {
  return (
    <Card className="mb-4 p-4">
      <div className="flex justify-between items-start mb-4">
        <Label className="text-lg font-semibold">Question {index + 1}</Label>
        <div className="flex items-center space-x-4">
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
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Question Text</Label>
          <Textarea
            value={question.question}
            onChange={(e) => onUpdate(index, "question", e.target.value)}
            placeholder="Enter question"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Expected Answer</Label>
          <Textarea
            value={question.expectedAnswer}
            onChange={(e) => onUpdate(index, "expectedAnswer", e.target.value)}
            placeholder="Enter expected answer"
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
}
