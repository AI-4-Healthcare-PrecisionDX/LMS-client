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

const useCreateAssignment = () => {
  return useMutation({
    mutationFn: async (assignmentData) => {
      // Ensure dates are converted to ISO string without timezone adjustment
      const formattedData = {
        ...assignmentData,
        start_time: new Date(assignmentData.start_time).toISOString(),
        deadline: new Date(assignmentData.deadline).toISOString(),
        questions: assignmentData.questions.map((q) => ({
          ...q,
          marks: Number(q.marks),
          options: q.options?.map((opt) => ({
            ...opt,
            isCorrect: Boolean(opt.isCorrect),
          })),
        })),
      };

      const response = await api.post(
        "/assignment/create-assignment",
        formattedData,
      );
      return response.data;
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.detail);
      }
      throw error;
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

  const handleAddAssignment = () => {
    dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: true });
    dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: 1 });
    dispatch({ type: ACTIONS.SET_NEW_ASSIGNMENT, payload: {} });
    dispatch({ type: ACTIONS.SET_EDITING_ASSIGNMENT, payload: null });
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
      // handleUpdateAssignment(finalAssignment);
    } else {
      const newAssignmentEntry = {
        assignment_type: state.newAssignment.category,
        assignment_title:
          finalAssignment.assignment_title ||
          `New ${state.newAssignment.questionType} Assignment`,
        number_of_questions: Number(finalAssignment.questions.length),
        total_marks: Number(finalAssignment.total_marks),
        start_time: finalAssignment.start_time,
        deadline: finalAssignment.deadline,
        section_id: sectionId,
        questions: finalAssignment.questions,
      };

      createAssignment(newAssignmentEntry, {
        onSuccess: () => {
          dispatch({
            type: ACTIONS.ADD_ASSIGNMENT,
            payload: newAssignmentEntry,
          });
          dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: false });
          toast.success("Assignment created successfully");
          console.log(newAssignmentEntry);
        },
        onError: (error) => {
          console.error("Assignment creation failed:", error);
        },
      });
    }
  };

  const { data: Assignments, isLoading } = useQuery({
    queryKey: queryClient.invalidateQueries(["assignments", sectionId]),
    queryFn: () => fetchAssignments(sectionId),
    enabled: !!sectionId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
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

  const handleEdit = async (assignmentId) => {
    try {
      const { data: assignmentData } = await api.get(
        `/assignment/${assignmentId}`,
      );

      dispatch({
        type: "SET_MULTIPLE",
        payload: {
          assignment_title: assignmentData.assignment_title,
          start_time: new Date(assignmentData.start_time), // Preserve exact time
          deadline: new Date(assignmentData.deadline), // Preserve exact time
          questions: assignmentData.questions || [],
          editingAssignment: assignmentData,
          newAssignment: {
            category: assignmentData.assignment_type,
          },
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
