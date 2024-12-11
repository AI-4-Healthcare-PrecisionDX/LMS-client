import api from "@/lib/axios-config";
import { aiGeneratedQuestionsAtom } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
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

                // console.log("Formatted data being sent:", formattedData);

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

export const useGenerateAiQuestions = ({ aiGenerateQuestionsFormatted }: { aiGenerateQuestionsFormatted: any }) => {
    const setAiQuestions = useSetAtom(aiGeneratedQuestionsAtom);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            try {
                const formData = new FormData();
                const pdfResponse = await fetch(aiGenerateQuestionsFormatted.pdf_file);
                const pdfBlob = await pdfResponse.blob();
                formData.append('pdf_file', pdfBlob);
                formData.append('question_bank_mcq', aiGenerateQuestionsFormatted.question_bank_mcq.toString());
                formData.append('question_bank_broad', aiGenerateQuestionsFormatted.question_bank_broad.toString());
                formData.append('adaptive_learning_mcq', aiGenerateQuestionsFormatted.adaptive_learning_mcq.toString());
                formData.append('adaptive_learning_broad', aiGenerateQuestionsFormatted.adaptive_learning_broad.toString());
                formData.append('application_based_mcq', aiGenerateQuestionsFormatted.application_based_mcq.toString());
                formData.append('application_based_broad', aiGenerateQuestionsFormatted.application_based_broad.toString());
                formData.append('writing_assignment_mcq', aiGenerateQuestionsFormatted.writing_assignment_mcq.toString());
                formData.append('writing_assignment_broad', aiGenerateQuestionsFormatted.writing_assignment_broad.toString());
                formData.append('scenario_based_mcq', aiGenerateQuestionsFormatted.scenario_based_mcq.toString());
                formData.append('scenario_based_broad', aiGenerateQuestionsFormatted.scenario_based_broad.toString());
                formData.append('total_mcq_questions', aiGenerateQuestionsFormatted.total_mcq_questions.toString());
                formData.append('total_broad_questions', aiGenerateQuestionsFormatted.total_broad_questions.toString());

                const response = await api.post('/llm/assignment_questions', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setAiQuestions(response.data);
                return response.data;

            } catch (error: any) {
                console.error("Generate questions error:", error.response?.data);
                throw new Error(error.response?.data?.message || "Failed to generate questions");
            }
        },
        onSuccess: () => {
            toast.success("Questions generated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
};