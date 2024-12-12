import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseMutationResult } from "@tanstack/react-query";
import {
  Activity,
  Calendar,
  CircleUser,
  ClipboardList,
  Edit2,
  Eye,
  Heart,
  HeartCrack,
  Plus,
  Stethoscope,
  Trash2,
  User,
  UserRound,
} from "lucide-react";
import React from "react";
import { Case, caseAction } from "./types";

export default function CaseList({
  filteredCases,
  dispatch,
  setIsDialogOpen,
  deleteMutation,
}: {
  filteredCases: Case[];
  dispatch: React.Dispatch<caseAction>;
  setIsDialogOpen: (open: boolean) => void;
  deleteMutation: UseMutationResult<void, Error, string>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredCases?.map((case_: Case) => (
        <Card key={case_.scenario.scenario_id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>{case_.scenario.scenario_title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Case Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-primary mb-1 flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Chief Complaint
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {case_.scenario.patient_chief_complaint}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-primary mb-1 flex items-center">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Description
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {case_.scenario.detailed_description}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-primary mb-1 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Vital Signs
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {case_.scenario_examination_findings.vital_signs}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-primary mb-1 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        General Appearance
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {case_.scenario_examination_findings.general_appearance}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-primary mb-1 flex items-center">
                        <Heart className="w-4 h-4 mr-2" />
                        Cardiovascular Findings
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {
                          case_.scenario_examination_findings
                            .cardiovascular_findings
                        }
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-primary mb-1 flex items-center">
                        <HeartCrack className="w-4 h-4 mr-2" />
                        Lungs Findings
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {case_.scenario_examination_findings.lungs_findings}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-primary mb-1 flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Additional Findings
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {
                          case_.scenario_examination_findings
                            .additional_findings
                        }
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  dispatch({
                    type: "SET_EDITING",
                    payload: case_.scenario.scenario_id,
                  });
                  dispatch({ type: "SET_FORM_DATA", payload: case_ });
                  setIsDialogOpen(true);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() =>
                  deleteMutation.mutate(case_.scenario.scenario_id)
                }
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CircleUser className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">Name:</span>
                  </div>
                  <div>{case_.scenario.patient_name}</div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">Age:</span>
                  </div>
                  <div>{case_.scenario.patient_age}</div>
                  <div className="flex items-center">
                    <UserRound className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">Gender:</span>
                  </div>
                  <div className="capitalize">
                    {case_.scenario.patient_gender}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
