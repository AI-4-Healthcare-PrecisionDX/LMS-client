import { Loader2 } from "lucide-react";
import { Dispatch } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { caseAction, caseState, Department } from "./types";

export default function CaseForm({
  state,
  dispatch,
  departments,
  onSubmit,
  isLoading,
}: {
  state: caseState;
  dispatch: Dispatch<caseAction>;
  departments: Department[];
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Select
            value={state.formData.department_id}
            onValueChange={(value) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: { department_id: value },
              })
            }
          >
            <SelectTrigger
              className={state.errors["department_id"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors["department_id"] && (
            <p className="text-sm text-red-500">
              {state.errors["department_id"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Scenario Title"
            value={state.formData.scenario?.scenario_title || ""}
            className={
              state.errors["scenario.scenario_title"] ? "border-red-500" : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario: {
                    scenario_title: e.target.value,
                    patient_name: state.formData.scenario?.patient_name || "",
                    patient_age: state.formData.scenario?.patient_age || "",
                    patient_gender:
                      state.formData.scenario?.patient_gender || "male",
                    patient_chief_complaint:
                      state.formData.scenario?.patient_chief_complaint || "",
                    detailed_description:
                      state.formData.scenario?.detailed_description || "",
                    scenario_id: state.formData.scenario?.scenario_id || "",
                    conversation_example:
                      state.formData.scenario?.conversation_example,
                  },
                },
              })
            }
          />
          {state.errors["scenario.scenario_title"] && (
            <p className="text-sm text-red-500">
              {state.errors["scenario.scenario_title"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Patient Name"
            value={state.formData.scenario?.patient_name || ""}
            className={
              state.errors["scenario.patient_name"] ? "border-red-500" : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario: {
                    scenario_title:
                      state.formData.scenario?.scenario_title || "",
                    patient_name: e.target.value,
                    patient_age: state.formData.scenario?.patient_age || "",
                    patient_gender:
                      state.formData.scenario?.patient_gender || "male",
                    patient_chief_complaint:
                      state.formData.scenario?.patient_chief_complaint || "",
                    detailed_description:
                      state.formData.scenario?.detailed_description || "",
                    scenario_id: state.formData.scenario?.scenario_id || "",
                    conversation_example:
                      state.formData.scenario?.conversation_example,
                  },
                },
              })
            }
          />
          {state.errors["scenario.patient_name"] && (
            <p className="text-sm text-red-500">
              {state.errors["scenario.patient_name"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Age"
            value={state.formData.scenario?.patient_age || ""}
            className={
              state.errors["scenario.patient_age"] ? "border-red-500" : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario: {
                    scenario_title:
                      state.formData.scenario?.scenario_title || "",
                    patient_name: state.formData.scenario?.patient_name || "",
                    patient_age: e.target.value,
                    patient_gender:
                      state.formData.scenario?.patient_gender || "male",
                    patient_chief_complaint:
                      state.formData.scenario?.patient_chief_complaint || "",
                    detailed_description:
                      state.formData.scenario?.detailed_description || "",
                    scenario_id: state.formData.scenario?.scenario_id || "",
                    conversation_example:
                      state.formData.scenario?.conversation_example,
                  },
                },
              })
            }
          />
          {state.errors["scenario.patient_age"] && (
            <p className="text-sm text-red-500">
              {state.errors["scenario.patient_age"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Select
            value={state.formData.scenario?.patient_gender}
            onValueChange={(value) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario: {
                    scenario_title:
                      state.formData.scenario?.scenario_title || "",
                    patient_name: state.formData.scenario?.patient_name || "",
                    patient_age: state.formData.scenario?.patient_age || "",
                    patient_gender: value as "male" | "female" | "other",
                    patient_chief_complaint:
                      state.formData.scenario?.patient_chief_complaint || "",
                    detailed_description:
                      state.formData.scenario?.detailed_description || "",
                    scenario_id: state.formData.scenario?.scenario_id || "",
                    conversation_example:
                      state.formData.scenario?.conversation_example,
                  },
                },
              })
            }
          >
            <SelectTrigger
              className={
                state.errors["scenario.patient_gender"] ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {state.errors["scenario.patient_gender"] && (
            <p className="text-sm text-red-500">
              {state.errors["scenario.patient_gender"]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Chief Complaint"
          value={state.formData.scenario?.patient_chief_complaint || ""}
          className={
            state.errors["scenario.patient_chief_complaint"]
              ? "border-red-500"
              : ""
          }
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario: {
                  scenario_title: state.formData.scenario?.scenario_title || "",
                  patient_name: state.formData.scenario?.patient_name || "",
                  patient_age: state.formData.scenario?.patient_age || "",
                  patient_gender:
                    state.formData.scenario?.patient_gender || "male",
                  patient_chief_complaint: e.target.value,
                  detailed_description:
                    state.formData.scenario?.detailed_description || "",
                  scenario_id: state.formData.scenario?.scenario_id || "",
                  conversation_example:
                    state.formData.scenario?.conversation_example,
                },
              },
            })
          }
        />
        {state.errors["scenario.patient_chief_complaint"] && (
          <p className="text-sm text-red-500">
            {state.errors["scenario.patient_chief_complaint"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Detailed Description"
          value={state.formData.scenario?.detailed_description || ""}
          className={
            state.errors["scenario.detailed_description"]
              ? "border-red-500"
              : ""
          }
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario: {
                  scenario_title: state.formData.scenario?.scenario_title || "",
                  patient_name: state.formData.scenario?.patient_name || "",
                  patient_age: state.formData.scenario?.patient_age || "",
                  patient_gender:
                    state.formData.scenario?.patient_gender || "male",
                  patient_chief_complaint:
                    state.formData.scenario?.patient_chief_complaint || "",
                  detailed_description: e.target.value,
                  scenario_id: state.formData.scenario?.scenario_id || "",
                  conversation_example:
                    state.formData.scenario?.conversation_example,
                },
              },
            })
          }
        />
        {state.errors["scenario.detailed_description"] && (
          <p className="text-sm text-red-500">
            {state.errors["scenario.detailed_description"]}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Examination Findings</h3>

        <div className="space-y-2">
          <Textarea
            placeholder="Vital Signs"
            value={
              state.formData.scenario_examination_findings?.vital_signs || ""
            }
            className={
              state.errors["scenario_examination_findings.vital_signs"]
                ? "border-red-500"
                : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario_examination_findings: {
                    vital_signs: e.target.value,
                    general_appearance:
                      state.formData.scenario_examination_findings
                        ?.general_appearance || "",
                    cardiovascular_findings:
                      state.formData.scenario_examination_findings
                        ?.cardiovascular_findings || "",
                    lungs_findings:
                      state.formData.scenario_examination_findings
                        ?.lungs_findings || "",
                    additional_findings:
                      state.formData.scenario_examination_findings
                        ?.additional_findings || "",
                  },
                },
              })
            }
          />
          {state.errors["scenario_examination_findings.vital_signs"] && (
            <p className="text-sm text-red-500">
              {state.errors["scenario_examination_findings.vital_signs"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="General Appearance"
            value={
              state.formData.scenario_examination_findings
                ?.general_appearance || ""
            }
            className={
              state.errors["scenario_examination_findings.general_appearance"]
                ? "border-red-500"
                : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario_examination_findings: {
                    vital_signs:
                      state.formData.scenario_examination_findings
                        ?.vital_signs || "",
                    general_appearance: e.target.value,
                    cardiovascular_findings:
                      state.formData.scenario_examination_findings
                        ?.cardiovascular_findings || "",
                    lungs_findings:
                      state.formData.scenario_examination_findings
                        ?.lungs_findings || "",
                    additional_findings:
                      state.formData.scenario_examination_findings
                        ?.additional_findings || "",
                  },
                },
              })
            }
          />
          {state.errors["scenario_examination_findings.general_appearance"] && (
            <p className="text-sm text-red-500">
              {state.errors["scenario_examination_findings.general_appearance"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Cardiovascular Findings"
            value={
              state.formData.scenario_examination_findings
                ?.cardiovascular_findings || ""
            }
            className={
              state.errors[
                "scenario_examination_findings.cardiovascular_findings"
              ]
                ? "border-red-500"
                : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario_examination_findings: {
                    vital_signs:
                      state.formData.scenario_examination_findings
                        ?.vital_signs || "",
                    general_appearance:
                      state.formData.scenario_examination_findings
                        ?.general_appearance || "",
                    cardiovascular_findings: e.target.value,
                    lungs_findings:
                      state.formData.scenario_examination_findings
                        ?.lungs_findings || "",
                    additional_findings:
                      state.formData.scenario_examination_findings
                        ?.additional_findings || "",
                  },
                },
              })
            }
          />
          {state.errors[
            "scenario_examination_findings.cardiovascular_findings"
          ] && (
            <p className="text-sm text-red-500">
              {
                state.errors[
                  "scenario_examination_findings.cardiovascular_findings"
                ]
              }
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Lungs Findings"
            value={
              state.formData.scenario_examination_findings?.lungs_findings || ""
            }
            className={
              state.errors["scenario_examination_findings.lungs_findings"]
                ? "border-red-500"
                : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario_examination_findings: {
                    vital_signs:
                      state.formData.scenario_examination_findings
                        ?.vital_signs || "",
                    general_appearance:
                      state.formData.scenario_examination_findings
                        ?.general_appearance || "",
                    cardiovascular_findings:
                      state.formData.scenario_examination_findings
                        ?.cardiovascular_findings || "",
                    lungs_findings: e.target.value,
                    additional_findings:
                      state.formData.scenario_examination_findings
                        ?.additional_findings || "",
                  },
                },
              })
            }
          />
          {state.errors["scenario_examination_findings.lungs_findings"] && (
            <p className="text-sm text-red-500">
              {state.errors["scenario_examination_findings.lungs_findings"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Additional Findings"
            value={
              state.formData.scenario_examination_findings
                ?.additional_findings || ""
            }
            className={
              state.errors["scenario_examination_findings.additional_findings"]
                ? "border-red-500"
                : ""
            }
            onChange={(e) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  scenario_examination_findings: {
                    vital_signs:
                      state.formData.scenario_examination_findings
                        ?.vital_signs || "",
                    general_appearance:
                      state.formData.scenario_examination_findings
                        ?.general_appearance || "",
                    cardiovascular_findings:
                      state.formData.scenario_examination_findings
                        ?.cardiovascular_findings || "",
                    lungs_findings:
                      state.formData.scenario_examination_findings
                        ?.lungs_findings || "",
                    additional_findings: e.target.value,
                  },
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            dispatch({ type: "RESET_FORM" });
          }}
        >
          Clear
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : state.editingId ? (
            "Update Case"
          ) : (
            "Create Case"
          )}
        </Button>
      </div>
    </form>
  );
}
