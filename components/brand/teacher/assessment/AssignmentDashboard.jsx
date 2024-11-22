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
import { Filter, MoreHorizontal } from "lucide-react";
import { useReducer } from "react";
import Step1 from "./assessmentModal/Step1";
import Step2 from "./assessmentModal/Step2";
import Step3 from "./assessmentModal/Step3";
import VivaStep from "./assessmentModal/VivaStep";
import { ACTIONS, initialState, reducer } from "./reducer";
import SubmissionDialog from "./SubmissionDialog";

// Utility Functions
const getSortLabel = (sortBy) => {
  const labels = {
    startTime: "Start Date",
    deadline: "Deadline",
    name: "Exam Name",
  };
  return labels[sortBy] || "Sort By";
};

const sortAssignments = (assignments, sortBy) => {
  return [...assignments].sort((a, b) => {
    if (sortBy === "startTime" || sortBy === "deadline") {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    }
    return sortBy === "name" ? a.name.localeCompare(b.name) : 0;
  });
};

// Main Component
export default function AssignmentDashboard({ examEvaluation }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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
          : details.category === "custom"
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
      } else if (details.category === "custom" && state.currentStep === 3) {
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
    console.log("details", details);
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
    // console.log("details", details);
  };

  const handlePublish = (finalAssignment) => {
    if (state.editingAssignment) {
      dispatch({
        type: ACTIONS.UPDATE_ASSIGNMENT,
        payload: { ...state.editingAssignment, ...finalAssignment },
      });
    } else {
      const newAssignmentEntry = {
        id: state.assignments.length + 1,
        assignment_type: state.newAssignment.category,
        assignment_title:
          finalAssignment.assignment_title ||
          `New ${state.newAssignment.questionType} Assignment`,
        // assignment_question_type: state.newAssignment.category,
        number_of_questions: finalAssignment.questions.length,
        totalMarks: finalAssignment.totalMarks,
        startTime: finalAssignment.startTime,
        deadline: finalAssignment.deadline,
        section_id: 123,
        // submitted: 0,
        // questions: finalAssignment.questions,
        // files: finalAssignment.files,
      };
      dispatch({ type: ACTIONS.ADD_ASSIGNMENT, payload: newAssignmentEntry });
      // console.log("New Assignment:", newAssignmentEntry);
      console.log("questions:", finalAssignment.questions);
    }
    dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: false });
  };

  const handleEdit = (id) => {
    const assignmentToEdit = state.assignments.find((a) => a.id === id);
    dispatch({
      type: ACTIONS.SET_EDITING_ASSIGNMENT,
      payload: assignmentToEdit,
    });
    dispatch({ type: ACTIONS.SET_NEW_ASSIGNMENT, payload: assignmentToEdit });
    // Set appropriate step based on category when editing
    dispatch({
      type: ACTIONS.SET_CURRENT_STEP,
      payload: assignmentToEdit.category === "viva" ? 4 : 3,
    });
    dispatch({ type: ACTIONS.SET_MODAL_OPEN, payload: true });
  };

  const handleDelete = (id) => {
    dispatch({ type: ACTIONS.DELETE_ASSIGNMENT, payload: id });
  };

  const handleCheckSubmission = (assignmentId) => {
    const assignment = state.assignments.find((a) => a.id === assignmentId);
    dispatch({ type: ACTIONS.SET_SELECTED_ASSIGNMENT, payload: assignment });
    dispatch({ type: ACTIONS.SET_SUBMISSION_MODAL_OPEN, payload: true });
  };

  const sortedAssignments = sortAssignments(state.assignments, state.sortBy);

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
                dispatch({ type: ACTIONS.SET_SORT_BY, payload: "startTime" })
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
          {sortedAssignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell onClick={examEvaluation}>
                {assignment.assignment_title}
              </TableCell>
              <TableCell>{assignment.startTime}</TableCell>
              <TableCell>{assignment.deadline}</TableCell>
              <TableCell>{assignment.totalMarks}</TableCell>
              <TableCell>{assignment.submitted}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(assignment.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(assignment.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCheckSubmission(assignment.id)}
                    >
                      Check Submission
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
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
              assignmentDetails={state.editingAssignment || state.newAssignment}
              onModify={() =>
                dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: 2 })
              }
              onPublish={handlePublish}
              onBack={handleBack}
              category={state.newAssignment.category}
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

      <SubmissionDialog
        isOpen={state.isSubmissionModalOpen}
        onClose={() =>
          dispatch({ type: ACTIONS.SET_SUBMISSION_MODAL_OPEN, payload: false })
        }
        assignment={state.selectedAssignment}
        students={state.students}
        onSubmitMarks={(marks) => {
          // Handle mark submission logic here
          console.log("Marks submitted:", marks);
          // You might want to dispatch an action to update the marks in the state
          dispatch({ type: ACTIONS.SET_STUDENT_MARKS, payload: marks });
        }}
      />
    </div>
  );
}
