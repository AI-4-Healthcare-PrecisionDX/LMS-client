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
import { SectionExclusiveContent, TemplateCourse } from "../materials/types";
import Step1 from "./assessmentModal/Step1";
import Step2 from "./assessmentModal/Step2";
import Step3 from "./assessmentModal/Step3";
import VivaStep from "./assessmentModal/VivaStep";
import { useCreateAssignment, useUpdateAssignment } from "./hooks";
import { ACTIONS, initialState, reducer } from "./reducer";
import { Assignment, Assignments, Question } from "./types";

type SortBy = "start_time" | "deadline" | "name";

const getSortLabel = (sortBy: SortBy) => {
  const labels = {
    start_time: "Start Date",
    deadline: "Deadline",
    name: "Exam Name",
  };
  return labels[sortBy] || "Sort By";
};

const sortAssignments = (assignments: Assignments, sortBy: SortBy) => {
  return [...assignments].sort((a, b) => {
    if (sortBy === "start_time" || sortBy === "deadline") {
      return new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
    }
    return sortBy === "name"
      ? a.assignment_title.localeCompare(b.assignment_title)
      : 0;
  });
};

const fetchAssignments = async (sectionId: string) => {
  const { data } = await api.get(
    `/assignment/section/${sectionId}/assignments`,
  );
  return data;
};

// Main Component
export default function AssignmentDashboard({
  examEvaluation,
  sectionId,
  section_exclusive_contents,
  template_course,
}: {
  examEvaluation: () => void;
  sectionId: string;
  section_exclusive_contents: SectionExclusiveContent[];
  template_course: TemplateCourse;
}) {
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

  const handleStep1Next = (details: any) => {
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

  const handleBack = (details: any) => {
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

  const handleStep2Next = (details: any) => {
    // console.log("details", details);
    dispatch({
      type: ACTIONS.SET_NEW_ASSIGNMENT,
      payload: {
        bookIds: details.bookIds,
        chapterIds: details.chapterIds || {},
        selectedPdf: details.selectedPdf, // Store PDF in state
      },
    });
    dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: 3 });
  };

  const { mutate: createAssignment } = useCreateAssignment();

  const handlePublish = (finalAssignment: Assignment) => {
    if (state.editingAssignment) {
      handleUpdateAssignment(finalAssignment);
    } else {
      const questions = Array.isArray(finalAssignment?.questions)
        ? finalAssignment.questions.map(q => ({
          question_text: q.question_text,
          question_type: q.question_type,
          marks: Number(q.marks) || 0,
          options_for_mcq: q.options_for_mcq || [],
          expected_answer: q.expected_answer || [],
          explanation: q.explanation,
          pattern_type: q.pattern_type,
          difficulty: q.difficulty,
          isAIGenerated: q.isAIGenerated // Preserve AI generation flag
        }))
        : [];

      const assignment_materials = Array.isArray(
        finalAssignment.assignment_materials,
      )
        ? finalAssignment.assignment_materials
        : [];

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
        questions: questions, // Use the mapped questions array
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

      createAssignment(newAssignmentEntry as Assignment, {
        onSuccess: () => {
          dispatch({
            type: ACTIONS.ADD_ASSIGNMENT,
            payload: newAssignmentEntry,
          });
          dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: false });
          toast.success("Assignment created successfully");
        },
        onError: (error: any) => {
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
    queryKey: ["assignments", sectionId],
    queryFn: () => fetchAssignments(sectionId),
    enabled: !!sectionId && isAuthenticated,
    // staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // retry: 2,
  });

  const { mutate: deleteAssignment } = useMutation({
    mutationFn: (assignmentId: string) =>
      api.delete(`/assignment/${assignmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", sectionId] });
      toast.success("Assignment deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete assignment");
      console.error(error);
    },
  });

  const handleDelete = (assignmentId: string) => {
    deleteAssignment(assignmentId);
  };

  const sortedAssignments = Assignments
    ? sortAssignments(Assignments, state.sortBy)
    : [];

  const handleUpdateAssignment = (finalAssignment: Assignment) => {
    if (!state.editingAssignment?.assignment_id) {
      toast.error("No assignment ID found for updating");
      return;
    }

    const questions = Array.isArray(finalAssignment?.questions)
      ? finalAssignment.questions.map(q => ({
        question_id: q.question_id, // Preserve existing question ID if it exists
        question_text: q.question_text,
        question_type: q.question_type,
        marks: Number(q.marks) || 0,
        options_for_mcq: q.options_for_mcq || [],
        expected_answer: q.expected_answer || [],
        explanation: q.explanation,
        pattern_type: q.pattern_type,
        difficulty: q.difficulty,
        isAIGenerated: q.isAIGenerated
      }))
      : [];

    const updatedAssignment = {
      ...finalAssignment,
      assignment_id: state.editingAssignment.assignment_id,
      assignment_type:
        state.newAssignment?.category ||
        state.editingAssignment.assignment_type,
      section_id: sectionId,
      number_of_questions: questions.length,
      questions: questions,
      assignment_materials: finalAssignment.assignment_materials || [],
    };

    updateAssignment(updatedAssignment as Assignment, {
      onSuccess: () => {
        dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: false });
        dispatch({ type: ACTIONS.SET_EDITING_ASSIGNMENT, payload: null });
        toast.success("Assignment updated successfully");
      },
      onError: (error) => {
        toast.error("Failed to update assignment");
        console.error(error);
      }
    });
  };

  const handleEdit = async (assignmentId: string) => {
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
        questions: assignmentData.assignment_questions.map((q: Question) => ({
          question_id: q.question_id,
          question_text: q.question_text,
          question_type: q.question_type,
          marks: q.marks,
          options_for_mcq: q.options_for_mcq || [],
          expected_answer: q.expected_answer || [],
          explanation: q.explanation || '',
          pattern_type: q.pattern_type || '',
          difficulty: q.difficulty || '',
          isAiGenerated: q.isAiGenerated || false,
          ai_metadata: q.ai_metadata || {},
          text: q.text // Include text field as some AI questions might use this
        })),
        assignment_materials: assignmentData.assignment_materials || []
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

      dispatch({ type: ACTIONS.SET_IS_EDITING, payload: true });

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
            {/* <TableHead>Submitted</TableHead> */}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading assignments...</TableCell>
            </TableRow>
          ) : (
            sortedAssignments.map((assignment: Assignment) => (
              <TableRow key={assignment.assignment_id}>
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
                {/* <TableCell>{assignment.submitted}</TableCell> */}
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
                      {/* <DropdownMenuItem
                        onClick={() =>
                          handleCheckSubmission(assignment.assignment_id)
                        }
                      >
                        Check Submission
                      </DropdownMenuItem> */}
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
        <DialogContent className="w-screen h-screen sm:max-w-none sm:max-h-none sm:p-4">
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
              onNext={(details) => handleStep2Next(details)}
              onBack={() => handleBack(state.newAssignment)}
              selectedBooks={state.newAssignment.bookIds}
              selectedChapters={state.newAssignment.chapterIds}
              section_exclusive_contents={section_exclusive_contents}
              template_course={template_course}
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
              sectionId={sectionId}
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
