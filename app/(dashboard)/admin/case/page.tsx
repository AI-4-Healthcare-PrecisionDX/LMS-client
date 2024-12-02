"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  Calendar,
  CircleUser,
  ClipboardList,
  Edit2,
  Eye,
  Heart,
  HeartCrack,
  Loader2,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  User,
  UserRound,
} from "lucide-react";
import { Dispatch, useReducer, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Zod schemas
const departmentSchema = z.object({
  department_name: z.string(),
  department_id: z.string(),
  branch_id: z.string(),
  updated_at: z.string(),
});

const departmentArraySchema = z.array(departmentSchema);

const caseSchema = z.object({
  department_id: z.string(),
  scenario: z.object({
    scenario_title: z.string().min(1, "Scenario title is required"),
    patient_name: z.string().min(1, "Patient name is required"),
    patient_age: z.string().min(1, "Age is required"),
    patient_gender: z.enum(["male", "female", "other"]),
    patient_chief_complaint: z.string(),
    detailed_description: z.string(),
    conversation_example: z.array(z.object({})).optional(),
    scenario_id: z.string(),
  }),
  scenario_examination_findings: z.object({
    vital_signs: z.string(),
    general_appearance: z.string(),
    cardiovascular_findings: z.string(),
    lungs_findings: z.string(),
    additional_findings: z.string(),
  }),
});

const caseArraySchema = z.array(caseSchema);

type Case = z.infer<typeof caseSchema>;
type Department = z.infer<typeof departmentSchema>;

type State = {
  cases: Case[];
  editingId: string | null;
  formData: Partial<Case>;
};

type Action =
  | { type: "SET_CASES"; payload: Case[] }
  | { type: "SET_EDITING"; payload: string | null }
  | { type: "SET_FORM_DATA"; payload: Partial<Case> }
  | { type: "RESET_FORM" };

const initialState: State = {
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
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CASES":
      return { ...state, cases: action.payload };
    case "SET_EDITING":
      return { ...state, editingId: action.payload };
    case "SET_FORM_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "RESET_FORM":
      return {
        ...state,
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
        editingId: null,
      };
    default:
      return state;
  }
};

export default function ManageCases() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/admin/departments");
      const parsedData = departmentArraySchema.parse(response.data);
      return parsedData;
    },
  });

  // Fetch cases
  const {
    data: cases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const response = await api.get("/admin/scenarios");
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Create case mutation
  const createMutation = useMutation({
    mutationFn: async (caseData: Omit<Case, "case_id" | "updated_at">) => {
      const response = await api.post("/admin/create_scenario", caseData);
      const parsedData = caseSchema.parse(response.data);
      return parsedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      dispatch({ type: "RESET_FORM" });
      setIsDialogOpen(false);
      toast.success("Case created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create case");
    },
  });

  // Update case mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Case> }) => {
      const response = await api.put(`/admin/create_scenario/${id}`, data);
      const parsedData = caseSchema.parse(response.data);
      return parsedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      dispatch({ type: "RESET_FORM" });
      setIsDialogOpen(false);
      toast.success("Case updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update case");
    },
  });

  // Delete case mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/create_scenario/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast.success("Case deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete case");
    },
  });

  const filteredCases = cases?.filter(
    (case_) =>
      case_.scenario.scenario_title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      case_.scenario.patient_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="container p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div className="space-y-3">
                <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Error Loading Cases
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
        <pre className="text-sm text-red-500 bg-red-50 p-4 rounded-md overflow-auto max-w-lg">
          {error instanceof Error
            ? error.message
            : JSON.stringify(error, null, 2)}
        </pre>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["cases"] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Clinical Cases
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {state.editingId ? "Edit Case" : "Add New Case"}
              </DialogTitle>
              <DialogDescription>
                Fill in the case details below
              </DialogDescription>
            </DialogHeader>
            <CaseForm
              state={state}
              dispatch={dispatch}
              departments={departments || []}
              onSubmit={(e) => {
                e.preventDefault();
                if (state.editingId) {
                  updateMutation.mutate({
                    id: state.editingId,
                    data: state.formData,
                  });
                } else {
                  createMutation.mutate(
                    state.formData as Omit<Case, "case_id" | "updated_at">,
                  );
                }
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCases?.map((case_) => (
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
                          {
                            case_.scenario_examination_findings
                              .general_appearance
                          }
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
    </div>
  );
}

function CaseForm({
  state,
  dispatch,
  departments,
  onSubmit,
  isLoading,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  departments: Department[];
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          value={state.formData.department_id}
          onValueChange={(value) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: { department_id: value },
            })
          }
        >
          <SelectTrigger>
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
        <Input
          placeholder="Scenario Title"
          value={state.formData.scenario?.scenario_title || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario: {
                  scenario_id: state.formData.scenario?.scenario_id || "",
                  scenario_title: e.target.value,
                  patient_name: state.formData.scenario?.patient_name || "",
                  patient_age: state.formData.scenario?.patient_age || "",
                  patient_gender:
                    state.formData.scenario?.patient_gender || "male",
                  patient_chief_complaint:
                    state.formData.scenario?.patient_chief_complaint || "",
                  detailed_description:
                    state.formData.scenario?.detailed_description || "",
                  conversation_example:
                    state.formData.scenario?.conversation_example,
                },
              },
            })
          }
        />
        <Input
          placeholder="Patient Name"
          value={state.formData.scenario?.patient_name || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario: {
                  scenario_id: state.formData.scenario?.scenario_id || "",
                  scenario_title: state.formData.scenario?.scenario_title || "",
                  patient_name: e.target.value,
                  patient_age: state.formData.scenario?.patient_age || "",
                  patient_gender:
                    state.formData.scenario?.patient_gender || "male",
                  patient_chief_complaint:
                    state.formData.scenario?.patient_chief_complaint || "",
                  detailed_description:
                    state.formData.scenario?.detailed_description || "",
                  conversation_example:
                    state.formData.scenario?.conversation_example,
                },
              },
            })
          }
        />
        <Input
          placeholder="Age"
          value={state.formData.scenario?.patient_age || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario: {
                  scenario_id: state.formData.scenario?.scenario_id || "",
                  scenario_title: state.formData.scenario?.scenario_title || "",
                  patient_name: state.formData.scenario?.patient_name || "",
                  patient_age: e.target.value,
                  patient_gender:
                    state.formData.scenario?.patient_gender || "male",
                  patient_chief_complaint:
                    state.formData.scenario?.patient_chief_complaint || "",
                  detailed_description:
                    state.formData.scenario?.detailed_description || "",
                  conversation_example:
                    state.formData.scenario?.conversation_example,
                },
              },
            })
          }
        />
        <Select
          value={state.formData.scenario?.patient_gender}
          onValueChange={(value) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario: {
                  scenario_id: state.formData.scenario?.scenario_id || "",
                  scenario_title: state.formData.scenario?.scenario_title || "",
                  patient_name: state.formData.scenario?.patient_name || "",
                  patient_age: state.formData.scenario?.patient_age || "",
                  patient_gender: value as "male" | "female" | "other",
                  patient_chief_complaint:
                    state.formData.scenario?.patient_chief_complaint || "",
                  detailed_description:
                    state.formData.scenario?.detailed_description || "",
                  conversation_example:
                    state.formData.scenario?.conversation_example,
                },
              },
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Chief Complaint"
        value={state.formData.scenario?.patient_chief_complaint || ""}
        onChange={(e) =>
          dispatch({
            type: "SET_FORM_DATA",
            payload: {
              scenario: {
                scenario_id: state.formData.scenario?.scenario_id || "",
                scenario_title: state.formData.scenario?.scenario_title || "",
                patient_name: state.formData.scenario?.patient_name || "",
                patient_age: state.formData.scenario?.patient_age || "",
                patient_gender:
                  state.formData.scenario?.patient_gender || "male",
                patient_chief_complaint: e.target.value,
                detailed_description:
                  state.formData.scenario?.detailed_description || "",
                conversation_example:
                  state.formData.scenario?.conversation_example,
              },
            },
          })
        }
      />

      <Textarea
        placeholder="Detailed Description"
        value={state.formData.scenario?.detailed_description || ""}
        onChange={(e) =>
          dispatch({
            type: "SET_FORM_DATA",
            payload: {
              scenario: {
                scenario_id: state.formData.scenario?.scenario_id || "",
                scenario_title: state.formData.scenario?.scenario_title || "",
                patient_name: state.formData.scenario?.patient_name || "",
                patient_age: state.formData.scenario?.patient_age || "",
                patient_gender:
                  state.formData.scenario?.patient_gender || "male",
                patient_chief_complaint:
                  state.formData.scenario?.patient_chief_complaint || "",
                detailed_description: e.target.value,
                conversation_example:
                  state.formData.scenario?.conversation_example,
              },
            },
          })
        }
      />

      <div className="space-y-4">
        <h3 className="font-medium">Examination Findings</h3>
        <Textarea
          placeholder="Vital Signs"
          value={
            state.formData.scenario_examination_findings?.vital_signs || ""
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
        <Textarea
          placeholder="General Appearance"
          value={
            state.formData.scenario_examination_findings?.general_appearance ||
            ""
          }
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario_examination_findings: {
                  vital_signs:
                    state.formData.scenario_examination_findings?.vital_signs ||
                    "",
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
        <Textarea
          placeholder="Cardiovascular Findings"
          value={
            state.formData.scenario_examination_findings
              ?.cardiovascular_findings || ""
          }
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario_examination_findings: {
                  vital_signs:
                    state.formData.scenario_examination_findings?.vital_signs ||
                    "",
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
        <Textarea
          placeholder="Lungs Findings"
          value={
            state.formData.scenario_examination_findings?.lungs_findings || ""
          }
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario_examination_findings: {
                  vital_signs:
                    state.formData.scenario_examination_findings?.vital_signs ||
                    "",
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
        <Textarea
          placeholder="Additional Findings"
          value={
            state.formData.scenario_examination_findings?.additional_findings ||
            ""
          }
          onChange={(e) =>
            dispatch({
              type: "SET_FORM_DATA",
              payload: {
                scenario_examination_findings: {
                  vital_signs:
                    state.formData.scenario_examination_findings?.vital_signs ||
                    "",
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

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch({ type: "RESET_FORM" })}
        >
          Cancel
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
