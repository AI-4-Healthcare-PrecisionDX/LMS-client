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
                    questions: assignmentData.questions.map((q) => {
                        const formattedQuestion = {
                            ...q,
                            marks: Number(q.marks),
                            options_for_mcq:
                                q.question_type === "mcq"
                                    ? (q.options_for_mcq || []).map((opt: string) =>
                                        typeof opt === "string" ? opt : "",
                                    )
                                    : [],
                            expected_answer: Array.isArray(q.expected_answer)
                                ? q.expected_answer
                                : [],
                        };

                        return formattedQuestion;
                    }),
                };


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
                    assignment_title: assignmentData.assignment_title,
                    assignment_type: assignmentData.assignment_type,
                    total_marks: Number(assignmentData.total_marks),
                    number_of_questions: assignmentData.questions.length,
                    start_time: assignmentData.start_time,
                    deadline: assignmentData.deadline,
                    questions: assignmentData.questions.map((q) => {
                        const formattedQuestion = {
                            ...q,
                            question_id: q.question_id,
                            question_text: String(q.question_text || ""),
                            question_type: String(q.question_type || ""),
                            marks: Number(q.marks),
                            options_for_mcq:
                                q.question_type === "mcq"
                                    ? (q.options_for_mcq || []).map((opt: string) =>
                                        typeof opt === "string" ? opt : "",
                                    )
                                    : [],
                            expected_answer: Array.isArray(q.expected_answer)
                                ? q.expected_answer.map((ans) => String(ans || ""))
                                : [],
                            explanation: q.explanation || "",
                            pattern_type: q.pattern_type || "",
                            difficulty: q.difficulty || ""
                        };

                        return formattedQuestion;
                    }),
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
                console.log("response from update", response);
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

interface AiGenerateQuestionsFormatted {
    pdf_file: string;
    question_bank_mcq: number;
    question_bank_broad: number;
    adaptive_learning_mcq: number;
    adaptive_learning_broad: number;
    application_based_mcq: number;
    application_based_broad: number;
    writing_assignment_mcq: number;
    writing_assignment_broad: number;
    scenario_based_mcq: number;
    scenario_based_broad: number;
    total_mcq_questions: number;
    total_broad_questions: number;
}

export const useGenerateAiQuestions = ({ aiGenerateQuestionsFormatted }: { aiGenerateQuestionsFormatted: AiGenerateQuestionsFormatted }) => {
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