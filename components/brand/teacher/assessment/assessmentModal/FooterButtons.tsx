import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2, Save } from "lucide-react";

export default function FooterButtons({
  onBack,
  onPublish,
  disabled = false,
  isPublishing = false,
  isEditing = false,
}: {
  onBack: () => void;
  onPublish: () => void;
  disabled?: boolean;
  isPublishing?: boolean;
  isEditing?: boolean;
}) {
  const getButtonText = () => {
    if (isPublishing) {
      return isEditing ? "Updating..." : "Creating...";
    }
    return isEditing ? "Update Assignment" : "Create Assignment";
  };

  return (
    <div className="flex justify-between pt-6">
      <Button
        onClick={onBack}
        variant="outline"
        size="lg"
        className="flex items-center gap-2"
        disabled={isPublishing || isEditing}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Button
        onClick={onPublish}
        size="lg"
        className="flex items-center gap-2 min-w-[180px] justify-center"
        disabled={disabled || isPublishing}
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {getButtonText()}
          </>
        ) : (
          <>
            {isEditing ? (
              <Save className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {getButtonText()}
          </>
        )}
      </Button>
    </div>
  );
}
