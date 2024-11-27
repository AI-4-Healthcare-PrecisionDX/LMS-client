import { Card, CardContent } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface PrivacySectionProps {
  isPrivate: boolean;
  onToggle: (checked: boolean) => void;
}

export default function PrivarySection({
  isPrivate,
  onToggle,
}: PrivacySectionProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              {/* {isPrivate ? (
                  <EyeOff className="h-5 w-5 text-primary" />
                ) : (
                  <Eye className="h-5 w-5 text-primary" />
                )} */}
            </div>
            <div>
              <h3 className="font-medium">Privacy Settings</h3>
              <p className="text-sm text-muted-foreground">
                {isPrivate
                  ? "Only you can access this material"
                  : "Anyone with the link can access this material"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Private materials are only visible to you.</p>
                  <p>
                    Public materials can be accessed by anyone with the link.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              checked={isPrivate}
              onCheckedChange={onToggle}
              className="ml-2"
            />
            <Label className="text-sm font-medium">
              {isPrivate ? "Private" : "Public"}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
