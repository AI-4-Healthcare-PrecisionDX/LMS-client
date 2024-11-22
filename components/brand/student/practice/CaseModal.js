import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, FileText, Stethoscope, User } from "lucide-react";

export default function CaseModal(props) {
  const { patientCase } = props;
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">View Details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl font-bold">
              <span className="mr-2">{patientCase.caseNumber}</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({patientCase.date})
              </span>
            </DialogTitle>
            <DialogDescription>
              Detailed information about the patient case
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center mb-2 text-lg font-semibold">
                  <User className="w-5 h-5 mr-2" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-medium">Name</p>
                    <p>{patientCase.patientName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Age</p>
                    <p>{patientCase.age} years</p>
                  </div>
                  <div>
                    <p className="font-medium">Gender</p>
                    <p>{patientCase.gender}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="flex items-center mb-2 text-lg font-semibold">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Chief Complaint
                </h3>
                <p>{patientCase.chiefComplaint}</p>
              </div>
              <Separator />
              <div>
                <h3 className="flex items-center mb-2 text-lg font-semibold">
                  <FileText className="w-5 h-5 mr-2" />
                  Description
                </h3>
                <p>{patientCase.description}</p>
              </div>
              <Separator />
              <div>
                <h3 className="flex items-center mb-2 text-lg font-semibold">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Physical Examination Findings
                </h3>
                <p>{patientCase.physicalExamFindings}</p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
