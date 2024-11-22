import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle2 } from "lucide-react";

// interface FooterButtonsProps {
//   onBack: () => void;
//   onPublish: () => void;
//   disabled?: boolean;
//   isPublishing?: boolean;
// }

export default function FooterButtons({
  onBack,
  onPublish,
  disabled = false,
  isPublishing = false,
}) {
  return (
    <div className="flex justify-between pt-6">
      <Button
        onClick={onBack}
        variant="outline"
        size="lg"
        className="flex items-center"
        disabled={isPublishing}
      >
        <CalendarIcon className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button
        onClick={onPublish}
        size="lg"
        className="flex items-center"
        disabled={disabled || isPublishing}
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        {isPublishing ? "Creating..." : "Create Assignment"}
      </Button>
    </div>
  );
}
