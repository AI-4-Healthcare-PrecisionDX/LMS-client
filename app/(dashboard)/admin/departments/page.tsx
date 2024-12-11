"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Building2,
  Check,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useReducer, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Zod schemas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const departmentSchema = z.object({
  department_id: z.string(),
  department_name: z.string().min(1, "Department name is required"),
  branch_id: z.string(),
  updated_at: z.string(),
});

type Department = z.infer<typeof departmentSchema>;

type State = {
  departments: Department[];
  editingId: string | null;
  newDepartmentName: string;
  editingName: string;
};

type Action =
  | { type: "SET_DEPARTMENTS"; payload: Department[] }
  | { type: "SET_EDITING"; payload: { id: string | null; name?: string } }
  | { type: "SET_NEW_DEPARTMENT_NAME"; payload: string }
  | { type: "SET_EDITING_NAME"; payload: string };

const initialState: State = {
  departments: [],
  editingId: null,
  newDepartmentName: "",
  editingName: "",
};

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DEPARTMENTS":
      return { ...state, departments: action.payload };
    case "SET_EDITING":
      return {
        ...state,
        editingId: action.payload.id,
        editingName: action.payload.name || "",
      };
    case "SET_NEW_DEPARTMENT_NAME":
      return { ...state, newDepartmentName: action.payload };
    case "SET_EDITING_NAME":
      return { ...state, editingName: action.payload };
    default:
      return state;
  }
};

export default function ManageDepartments() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch departments
  const {
    data: departments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/admin/departments");
      return response.data;
    },
  });

  // Create department mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post("/admin/create_department", {
        department_name: name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      dispatch({ type: "SET_NEW_DEPARTMENT_NAME", payload: "" });
      toast.success("Department created successfully!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { detail: string })?.detail ||
          "Failed to create department",
      );
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  // Update department mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await api.put(`/admin/departments/${id}`, {
        department_name: name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      dispatch({ type: "SET_EDITING", payload: { id: null } });
      toast.success("Department updated successfully!");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { detail: string })?.detail ||
          "Failed to update department",
      );
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  // Delete department mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      const response = await api.delete(`/admin/delete-department/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully!");
      setDeletingId(null);
    },
    onError: (error: AxiosError) => {
      toast.error((error.response?.data as { detail: string })?.detail);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setDeletingId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading departments: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container p-6 ">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
        Manage Departments
      </h1>

      {/* Add new department */}
      <div className="bg-zinc-50 dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex gap-3">
          <Input
            placeholder="Enter department name"
            value={state.newDepartmentName}
            onChange={(e) =>
              dispatch({
                type: "SET_NEW_DEPARTMENT_NAME",
                payload: e.target.value,
              })
            }
            className="flex-grow rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={() => createMutation.mutate(state.newDepartmentName)}
            disabled={!state.newDepartmentName || createMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add
          </Button>
        </div>
      </div>

      {/* Departments list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments?.map((dept: Department) => (
          <div
            key={dept.department_id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 transition-all duration-200 hover:shadow-md border border-gray-100 dark:border-gray-700"
          >
            {state.editingId === dept.department_id ? (
              <div className="flex flex-col gap-4">
                <Input
                  value={state.editingName}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_EDITING_NAME",
                      payload: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border-gray-200 bg-gray-50 dark:bg-gray-900"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateMutation.mutate({
                        id: dept.department_id,
                        name: state.editingName,
                      })
                    }
                    disabled={updateMutation.isPending}
                    className="rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      dispatch({ type: "SET_EDITING", payload: { id: null } })
                    }
                    className="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {dept.department_name}
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      dispatch({
                        type: "SET_EDITING",
                        payload: {
                          id: dept.department_id,
                          name: dept.department_name,
                        },
                      })
                    }
                    className="rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === dept.department_id}
                        className="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                      >
                        {deletingId === dept.department_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this department? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteMutation.mutate(dept.department_id)
                          }
                          className="bg-red-100 text-red-500 hover:bg-red-200"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
