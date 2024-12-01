"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Edit2, Plus, Trash2, X } from "lucide-react";
import { useReducer } from "react";
import { z } from "zod";

// Zod schemas
const departmentSchema = z.object({
  department_id: z.string(),
  department_name: z.string().min(1, "Department name is required"),
  branch_id: z.string(),
  updated_at: z.string(),
});

const departmentArraySchema = z.array(departmentSchema);

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

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/admin/departments");
      const parsedData = departmentArraySchema.parse(response.data);
      return parsedData;
    },
  });

  // Create department mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post("/admin/departments", {
        department_name: name,
      });
      const parsedData = departmentSchema.parse(response.data);
      return parsedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      dispatch({ type: "SET_NEW_DEPARTMENT_NAME", payload: "" });
    },
  });

  // Update department mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await api.put(`/admin/departments/${id}`, {
        department_name: name,
      });
      const parsedData = departmentSchema.parse(response.data);
      return parsedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      dispatch({ type: "SET_EDITING", payload: { id: null } });
    },
  });

  // Delete department mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/departments/${id}`);
      const parsedData = departmentSchema.parse(response.data);
      return parsedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

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
            disabled={!state.newDepartmentName}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Departments list */}
      <div className="space-y-3">
        {departments?.map((dept: Department) => (
          <div
            key={dept.department_id}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-all duration-200 hover:shadow-md"
          >
            {state.editingId === dept.department_id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={state.editingName}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_EDITING_NAME",
                      payload: e.target.value,
                    })
                  }
                  className="flex-grow rounded-xl border-gray-200"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    updateMutation.mutate({
                      id: dept.department_id,
                      name: state.editingName,
                    })
                  }
                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                >
                  <Check className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    dispatch({ type: "SET_EDITING", payload: { id: null } })
                  }
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-100 font-medium">
                  {dept.department_name}
                </span>
                <div className="flex gap-2">
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
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this department?",
                        )
                      ) {
                        deleteMutation.mutate(dept.department_id);
                      }
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
