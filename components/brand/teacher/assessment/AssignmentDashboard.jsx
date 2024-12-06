"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Filter, MoreHorizontal } from "lucide-react";
import { useReducer } from "react";
import { toast } from "sonner";
import Step1 from "./assessmentModal/Step1";
import Step2 from "./assessmentModal/Step2";
import Step3 from "./assessmentModal/Step3";
import VivaStep from "./assessmentModal/VivaStep";
import { ACTIONS, initialState, reducer } from "./reducer";

// Utility Functions
const getSortLabel = (sortBy) => {
  const labels = {
    start_time: "Start Date",
    deadline: "Deadline",
    name: "Exam Name",
  };
  return labels[sortBy] || "Sort By";
};

const sortAssignments = (assignments, sortBy) => {
  return [...assignments].sort((a, b) => {
    if (sortBy === "start_time" || sortBy === "deadline") {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    }
    return sortBy === "name"
      ? a.assignment_title.localeCompare(b.assignment_title)
      : 0;
  });
};

// const formatAssignmentData = (assignmentData) => {
//   return {
//     assignment_type: String(assignmentData.assignment_type || ""),
//     assignment_title: String(assignmentData.assignment_title || ""),
//     assignment_description: String(assignmentData.assignment_description || ""),
//     number_of_questions: Number(assignmentData.number_of_questions) || 0,
//     total_marks: Number(assignmentData.total_marks) || 0,
//     start_time: new Date(assignmentData.start_time).toISOString(),
//     deadline: new Date(assignmentData.deadline).toISOString(),
//     section_id: assignmentData.section_id,
//     assignment_materials: Array.isArray(assignmentData.assignment_materials)
//       ? assignmentData.assignment_materials
//       : [],
//     questions: (assignmentData.questions || []).map((q) => ({
//       question_text: String(q.question_text || ""),
//       question_type: String(q.question_type || ""),
//       marks: Number(q.marks) || 0,
//       options_for_mcq:
//         q.question_type === "mcq"
//           ? (q.options_for_mcq || []).map((opt) => ({
//               option_text: String(opt.option_text || "").trim(),
//               is_correct: Boolean(opt.is_correct),
//             }))
//           : [],
//       expected_answer: Array.isArray(q.expected_answer)
//         ? q.expected_answer.map((ans) => String(ans || ""))
//         : [],
//     })),
//   };
// };

const useCreateAssignment = () => {
  return useMutation({
    mutationFn: async (assignmentData) => {
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
                ? q.options_for_mcq.map((opt) =>
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
      } catch (error) {
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

const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentData) => {
      try {
        const formattedData = {
          ...assignmentData,
          questions: assignmentData.questions.map((q) => ({
            ...q,
            marks: Number(q.marks),
            options_for_mcq:
              q.question_type === "mcq"
                ? (q.options_for_mcq || []).map((opt) =>
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
      } catch (error) {
        console.error("Update error details:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to update assignment",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignments"]);
      toast.success("Assignment updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

const fetchAssignments = async (sectionId) => {
  const { data } = await api.get(
    `/assignment/section/${sectionId}/assignments`,
  );
  return data;
};

// Main Component
export default function AssignmentDashboard({ examEvaluation, sectionId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();

  const queryClient = useQueryClient();
  const { mutate: updateAssignment } = useUpdateAssignment();

  const handleAddAssignment = () => {
    dispatch({ type: ACTIONS.RESET_STATE }); // Add this line to reset the state
    dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: true });
    dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: 1 });
    dispatch({ type: ACTIONS.SET_NEW_ASSIGNMENT, payload: {} });
    dispatch({ type: ACTIONS.SET_EDITING_ASSIGNMENT, payload: null });
    dispatch({ type: ACTIONS.SET_QUESTIONS, payload: [] }); // Add this line to clear questions
  };

  const handleStep1Next = (details) => {
    dispatch({ type: ACTIONS.SET_NEW_ASSIGNMENT, payload: details });
    // Check if assessmentType is viva, set to step 4, otherwise step 2
    dispatch({
      type: ACTIONS.SET_CURRENT_STEP,
      payload:
        details.assessmentType === "viva"
          ? 4
          : details.category === "manual"
            ? 3
            : 2,
    });
    // console.log("details", details);
  };

  const handleBack = (details) => {
    if (state.currentStep > 1) {
      // If we're in VivaStep (step 4), go back to step 1
      if (state.currentStep === 4) {
        dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: 1 });
      } else if (details.category === "manual" && state.currentStep === 3) {
        dispatch({
          type: ACTIONS.SET_CURRENT_STEP,
          payload: 1,
        });
      } else {
        dispatch({
          type: ACTIONS.SET_CURRENT_STEP,
          payload: state.currentStep - 1,
        });
      }
    } else {
      dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: false });
    }
    // console.log("details", details);
  };

  const handleStep2Next = (details) => {
    dispatch({
      type: ACTIONS.SET_NEW_ASSIGNMENT,
      payload: {
        bookIds: details.bookIds,
        chapterIds: details.chapterIds || {},
      },
    });
    dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: 3 });
  };

  const { mutate: createAssignment } = useCreateAssignment();

  const handlePublish = (finalAssignment) => {
    if (state.editingAssignment) {
      handleUpdateAssignment(finalAssignment);
    } else {
      // Get questions array safely
      const questions = Array.isArray(finalAssignment?.questions)
        ? finalAssignment.questions
        : [];

      // Format assignment materials properly
      const assignment_materials = Array.isArray(
        finalAssignment.assignment_materials,
      )
        ? finalAssignment.assignment_materials
        : [];

      // Create new assignment entry with all required fields
      const newAssignmentEntry = {
        assignment_type: state.newAssignment?.category || "manual",
        assignment_title:
          state.assignment_title ||
          finalAssignment.assignment_title ||
          "New Assignment",
        section_id: sectionId,
        total_marks: Number(
          finalAssignment.total_marks || state.total_marks || 0,
        ),
        number_of_questions: questions.length,
        start_time:
          state.start_time || finalAssignment.start_time || new Date(),
        deadline: state.deadline || finalAssignment.deadline || new Date(),
        questions: finalAssignment.questions,
        // Only include the library_ids
        assignment_materials: assignment_materials,
      };

      if (!newAssignmentEntry.assignment_title) {
        toast.error("Assignment title is required");
        return;
      }

      if (
        !Array.isArray(newAssignmentEntry.questions) ||
        newAssignmentEntry.questions.length === 0
      ) {
        toast.error("At least one question is required");
        return;
      }

      createAssignment(newAssignmentEntry, {
        onSuccess: () => {
          dispatch({
            type: ACTIONS.ADD_ASSIGNMENT,
            payload: newAssignmentEntry,
          });
          dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: false });
          toast.success("Assignment created successfully");
        },
        onError: (error) => {
          console.error(
            "Assignment creation failed:",
            error?.response?.data || error,
          );
          if (error.response?.status === 422) {
            toast.error(
              error.response.data.detail ||
                "Validation failed. Please check all fields.",
            );
          } else {
            toast.error("Failed to create assignment. Please try again.");
          }
        },
      });
    }
  };

  const { data: Assignments, isLoading } = useQuery({
    queryKey: queryClient.invalidateQueries(["assignments", sectionId]),
    queryFn: () => fetchAssignments(sectionId),
    enabled: !!sectionId && isAuthenticated,
    // staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // retry: 2,
  });

  const { mutate: deleteAssignment } = useMutation({
    mutationFn: (assignmentId) => api.delete(`/assignment/${assignmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["assignments", sectionId]);
      toast.success("Assignment deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete assignment");
      console.error(error);
    },
  });

  const handleDelete = (assignmentId) => {
    deleteAssignment(assignmentId);
  };

  const sortedAssignments = Assignments
    ? sortAssignments(Assignments, state.sortBy)
    : [];

  const handleUpdateAssignment = (finalAssignment) => {
    if (!state.editingAssignment?.assignment_id) {
      toast.error("No assignment ID found for updating");
      return;
    }

    const questions = Array.isArray(finalAssignment?.questions)
      ? finalAssignment.questions
      : [];

    const updatedAssignment = {
      ...finalAssignment,
      assignment_id: state.editingAssignment.assignment_id,
      assignment_type:
        state.newAssignment?.category ||
        state.editingAssignment.assignment_type,
      section_id: sectionId,
      number_of_questions: questions.length,
      questions: questions.map((q) => ({
        question_text: q.question_text,
        question_type: q.question_type,
        marks: Number(q.marks) || 0,
        options_for_mcq: q.options_for_mcq, // Convert to array of strings
        expected_answer: q.expected_answer || [],
        question_id: q.question_id, // Preserve question_id for updates
      })),
      assignment_materials: finalAssignment.assignment_materials || [],
    };

    updateAssignment(updatedAssignment, {
      onSuccess: () => {
        dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: false });
        dispatch({ type: ACTIONS.SET_EDITING_ASSIGNMENT, payload: null });
      },
    });
  };

  const handleEdit = async (assignmentId) => {
    try {
      const { data: assignmentData } = await api.get(
        `/assignment/${assignmentId}`,
      );
      // console.log("assignment materials", assignmentData.assignment_materials);

      // Transform the data to match the expected structure
      const transformedData = {
        ...assignmentData,
        start_time: new Date(assignmentData.start_time),
        deadline: new Date(assignmentData.deadline),
        questions: assignmentData.assignment_questions.map((q) => ({
          question_id: q.question_id,
          question_text: q.question_text,
          question_type: q.question_type,
          marks: q.marks,
          options_for_mcq: q.options_for_mcq || [],
          expected_answer: q.expected_answer,
        })),
      };

      dispatch({
        type: "SET_MULTIPLE",
        payload: {
          assignment_title: transformedData.assignment_title,
          start_time: transformedData.start_time,
          deadline: transformedData.deadline,
          questions: transformedData.questions,
          editingAssignment: transformedData,
          newAssignment: {
            category: transformedData.assignment_type,
          },
          activeTab: "setup",
        },
      });

      dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
      dispatch({ type: "SET_MODAL_OPEN", payload: true });
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      toast.error("Failed to load assignment details");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Assignment Dashboard</h1>
      <div className="flex justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Sort by: {getSortLabel(state.sortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                dispatch({ type: ACTIONS.SET_SORT_BY, payload: "start_time" })
              }
            >
              Start Date
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                dispatch({ type: ACTIONS.SET_SORT_BY, payload: "deadline" })
              }
            >
              Deadline
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                dispatch({ type: ACTIONS.SET_SORT_BY, payload: "name" })
              }
            >
              Assignment Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleAddAssignment}>Add Assignment</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignment Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Total Marks</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading assignments...</TableCell>
            </TableRow>
          ) : (
            sortedAssignments.map((assignment) => (
              <TableRow key={assignment.assignmnent_id}>
                <TableCell onClick={examEvaluation}>
                  {assignment.assignment_title}
                </TableCell>
                <TableCell>
                  {format(new Date(assignment.start_time), "PPp")}
                </TableCell>
                <TableCell>
                  {format(new Date(assignment.deadline), "PPp")}
                </TableCell>
                <TableCell>{assignment.total_marks}</TableCell>
                <TableCell>{assignment.submitted}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEdit(assignment.assignment_id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(assignment.assignment_id)}
                      >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleCheckSubmission(assignment.assignment_id)
                        }
                      >
                        Check Submission
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog
        open={state.isModalOpen}
        onOpenChange={(open) =>
          dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: open })
        }
      >
        <DialogContent className="w-[90vw] h-[90vh] sm:max-w-none sm:max-h-none sm:p-4">
          {/* <DialogHeader>
            <DialogTitle>
              {state.editingAssignment ? "Edit Assignment" : ""}
            </DialogTitle>
            <DialogDescription>
              {state.editingAssignment ? "Modify the assignment details." : ""}
            </DialogDescription>
          </DialogHeader> */}

          {state.currentStep === 1 && <Step1 onNext={handleStep1Next} />}

          {state.currentStep === 2 && (
            <Step2
              onNext={handleStep2Next}
              onBack={handleBack}
              selectedBooks={state.newAssignment.bookIds}
              selectedChapters={state.newAssignment.chapterIds}
            />
          )}

          {state.currentStep === 3 && (
            <Step3
              onPublish={handlePublish}
              onBack={handleBack}
              category={
                state.editingAssignment
                  ? state.editingAssignment.assignment_type
                  : state.newAssignment?.category
              }
              state={state}
              dispatch={dispatch}
            />
          )}

          {state.currentStep === 4 && (
            <VivaStep
              assignmentDetails={state.editingAssignment || state.newAssignment}
              onPublish={handlePublish}
              onBack={handleBack}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* <SubmissionDialog
        isOpen={state.isSubmissionModalOpen}
        onClose={() =>
          dispatch({ type: ACTIONS.SET_SUBMISSION_MODAL_OPEN, payload: false })
        }
        assignment={state.selectedAssignment}
        students={state.students}
        onSubmitMarks={(marks) => {
          dispatch({ type: ACTIONS.SET_STUDENT_MARKS, payload: marks });
        }}
      /> */}
    </div>
  );
}
