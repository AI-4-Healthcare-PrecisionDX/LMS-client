import { z } from "zod";

// Zod schemas
export const departmentSchema = z.object({
  department_name: z.string(),
  department_id: z.string(),
  branch_id: z.string(),
  updated_at: z.string(),
});

export const departmentArraySchema = z.array(departmentSchema);

export const caseSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  scenario: z.object({
    scenario_title: z.string().min(1, "Scenario title is required"),
    patient_name: z.string().min(1, "Patient name is required"),
    patient_age: z.string().min(1, "Age is required"),
    patient_gender: z.enum(["male", "female", "other"]),
    patient_chief_complaint: z.string().min(1, "Chief complaint is required"),
    detailed_description: z.string().min(1, "Description is required"),
    conversation_example: z.array(z.object({})).optional(),
    scenario_id: z.string(),
  }),
  scenario_examination_findings: z.object({
    vital_signs: z.string().min(1, "Vital signs are required"),
    general_appearance: z.string().min(1, "General appearance is required"),
    cardiovascular_findings: z
      .string()
      .min(1, "Cardiovascular findings are required"),
    lungs_findings: z.string().min(1, "Lungs findings are required"),
    additional_findings: z.string(),
  }),
});

export type Case = z.infer<typeof caseSchema>;
export type Department = z.infer<typeof departmentSchema>;

export type caseState = {
  cases: Case[];
  editingId: string | null;
  formData: Partial<Case>;
  errors: Record<string, string>;
};

export type caseAction =
  | { type: "SET_CASES"; payload: Case[] }
  | { type: "SET_EDITING"; payload: string | null }
  | { type: "SET_FORM_DATA"; payload: Partial<Case> }
  | { type: "SET_ERRORS"; payload: Record<string, string> }
  | { type: "RESET_FORM" };

export const caseInitialState: caseState = {
  cases: [],
  editingId: null,
  formData: {
    scenario: {
      scenario_title: "",
      patient_name: "",
      patient_age: "",
      patient_gender: "male",
      patient_chief_complaint: "",
      detailed_description: "",
      conversation_example: [],
      scenario_id: "",
    },
    scenario_examination_findings: {
      vital_signs: "",
      general_appearance: "",
      cardiovascular_findings: "",
      lungs_findings: "",
      additional_findings: "",
    },
  },
  errors: {},
};
