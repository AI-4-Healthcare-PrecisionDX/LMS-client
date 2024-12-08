import api from "@/lib/axios-config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Assignment } from "./types";

export const useCreateAssignment = () => {
    return useMutation({
        mutationFn: async (assignmentData: Assignment) => {
            try {
                const formattedData = {
                    ...assignmentData,
                    assignment_materials: Array.isArray(
                        assignmentData.assignment_materials,
                    )
                        ? assignmentData.assignment_materials
                        : [],
                    questions: assignmentData.questions.map((q) => ({
                        ...q,
                        marks: Number(q.marks),
                        options_for_mcq:
                            q.question_type === "mcq"
                                ? q.options_for_mcq.map((opt: any) =>
                                    typeof opt === "string" ? opt : opt.text,
                                )
                                : [],
                        expected_answer: Array.isArray(q.expected_answer)
                            ? q.expected_answer
                            : [],
                    })),
                };

                console.log("Formatted data being sent:", formattedData);

                const response = await api.post(
                    "/assignment/create-assignment",
                    formattedData,
                );
                return response.data;
            } catch (error: any) {
                console.error("Creation error:", error.response?.data);
                throw new Error(
                    error.response?.data?.message || "Failed to create assignment",
                );
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (assignmentData: Assignment) => {
            try {
                const formattedData = {
                    ...assignmentData,
                    questions: assignmentData.questions.map((q) => ({
                        ...q,
                        marks: Number(q.marks),
                        options_for_mcq:
                            q.question_type === "mcq"
                                ? (q.options_for_mcq || []).map((opt: any) =>
                                    typeof opt === "string" ? opt : opt.text || "",
                                )
                                : [],
                        expected_answer: Array.isArray(q.expected_answer)
                            ? q.expected_answer.map((ans) => String(ans || ""))
                            : [],
                    })),
                    assignment_materials: Array.isArray(
                        assignmentData.assignment_materials,
                    )
                        ? assignmentData.assignment_materials
                        : [],
                };

                console.log("Sending update request:", formattedData);
                const response = await api.put(
                    `/assignment/${assignmentData.assignment_id}`,
                    formattedData,
                );
                return response.data;
            } catch (error: any) {
                console.error("Update error details:", error.response?.data);
                throw new Error(
                    error.response?.data?.message || "Failed to update assignment",
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            toast.success("Assignment updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};