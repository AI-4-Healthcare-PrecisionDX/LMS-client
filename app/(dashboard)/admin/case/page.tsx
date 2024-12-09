"use client";

import CaseForm from "@/components/brand/admin/case/case-form";
import CaseList from "@/components/brand/admin/case/list";
import CaseLoadingSkeleton from "@/components/brand/admin/case/loading";
import { caseReducer } from "@/components/brand/admin/case/reducer";
import {
  Case,
  caseInitialState,
  caseSchema,
  departmentArraySchema,
} from "@/components/brand/admin/case/types";
import ErrorMessage from "@/components/brand/shared/error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useReducer, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function ManageCases() {
  const [state, dispatch] = useReducer(caseReducer, caseInitialState);
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

  const validateForm = (data: Partial<Case>) => {
    try {
      caseSchema.parse(data);
      dispatch({ type: "SET_ERRORS", payload: {} });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        dispatch({ type: "SET_ERRORS", payload: errors });
      }
      return false;
    }
  };

  // Create case mutation
  const createMutation = useMutation({
    mutationFn: async (caseData: Omit<Case, "case_id" | "updated_at">) => {
      if (!validateForm(caseData)) {
        throw new Error("Validation failed");
      }
      const response = await api.post("/admin/create_scenario", caseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      dispatch({ type: "RESET_FORM" });
      setIsDialogOpen(false);
      toast.success("Case created successfully");
    },
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message === "Validation failed") {
          toast.error("Please fill in all required fields correctly");
        } else {
          toast.error(error.message || "Failed to create case");
        }
      }
    },
  });

  // Update case mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Case> }) => {
      if (!validateForm(data)) {
        throw new Error("Validation failed");
      }
      const response = await api.put(`/admin/create_scenario/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      dispatch({ type: "RESET_FORM" });
      setIsDialogOpen(false);
      toast.success("Case updated successfully");
    },
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message === "Validation failed") {
          toast.error("Please fill in all required fields correctly");
        } else {
          toast.error(error.message || "Failed to update case");
        }
      }
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
    (case_: Case) =>
      case_.scenario.scenario_title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      case_.scenario.patient_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <CaseLoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Error Loading Cases" />;
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

      <CaseList
        filteredCases={filteredCases || []}
        dispatch={dispatch}
        setIsDialogOpen={setIsDialogOpen}
        deleteMutation={deleteMutation}
      />
    </div>
  );
}
