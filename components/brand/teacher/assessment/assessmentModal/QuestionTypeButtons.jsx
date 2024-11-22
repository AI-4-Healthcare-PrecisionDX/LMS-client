import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

const questionTypes = [
  {
    type: "mcq",
    label: "Add MCQ",
    tooltip: "Add Multiple Choice Question (5 marks)",
    shortcut: "⌘+M",
  },
  {
    type: "broad",
    label: "Add Broad Question",
    tooltip: "Add Broad Question (10 marks)",
    shortcut: "⌘+B",
  },
];

export default function QuestionTypeButtons({
  dispatch,
  disabled = false,
  showTooltips = true,
}) {
  const handleAddQuestion = (type) => {
    dispatch({ type: "ADD_QUESTION", payload: type });
  };

  const ButtonWrapper = ({ children, tooltip }) => {
    if (!showTooltips) return <>{children}</>;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex items-center space-x-4">
      {questionTypes.map(({ type, label, tooltip, shortcut }) => (
        <ButtonWrapper key={type} tooltip={`${tooltip} (${shortcut})`}>
          <Button
            variant="outline"
            onClick={() => handleAddQuestion(type)}
            disabled={disabled}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {label}
          </Button>
        </ButtonWrapper>
      ))}
    </div>
  );
}
