import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Edit3 } from "lucide-react";
import { useEffect } from "react";
import { Assignment, Question } from "../types";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentSetup from "./AssignmentSetup";
import FooterButtons from "./FooterButtons";
import QuestionsList from "./QuestionsList";

export default function Step3({
  onPublish,
  onBack,
  category,
  sectionId,
  state,
  dispatch,
}: {
  onPublish: (assignment: Assignment) => void;
  onBack: (details: any) => void;
  category: string;
  sectionId: string;
  state: any;
  dispatch: (action: any) => void;
}) {
  useEffect(() => {
    if (!state.editingAssignment) {
      dispatch({ type: "SET_QUESTIONS", payload: [] });
    }
  }, []);

  const totalMarks = state.questions.reduce(
    (sum: number, q: Question) => sum + (Number(q.marks) || 0),
    0,
  );
  // console.log("selectedPdf", state.newAssignment.selectedPdf);
  const selectedPdf = state.newAssignment.selectedPdf;

  const handlePublish = () => {
    const questions = Array.isArray(state.questions) ? state.questions : [];

    const assignment_materials = Array.isArray(state.materials)
      ? state.materials.map((material: any) => material.library_id)
      : [];

    if (state.editingAssignment) {
      const updatedAssignment = {
        assignment_id: state.editingAssignment.assignment_id,
        assignment_type: state.editingAssignment.assignment_type,
        assignment_title: state.assignment_title,
        total_marks: questions.reduce(
          (sum: number, q: Question) => sum + (Number(q.marks) || 0),
          0,
        ),
        number_of_questions: questions.length,
        start_time: state.start_time.toISOString(),
        deadline: state.deadline.toISOString(),
        questions: questions.map((q: Question) => ({
          question_id: q.question_id,
          question_text: String(q.question_text || ""),
          question_type: String(q.question_type || ""),
          marks: Number(q.marks) || 0,
          options_for_mcq: q.options_for_mcq,
          expected_answer: Array.isArray(q.expected_answer)
            ? q.expected_answer.map((ans: string) => String(ans || ""))
            : [],
          explanation: q.explanation, // Preserve AI explanation
          pattern_type: q.pattern_type, // Preserve AI pattern type
          difficulty: q.difficulty, // Preserve AI difficulty
          isAIGenerated: q.isAIGenerated // Preserve AI generation flag
        })),
        assignment_materials,
      };

      onPublish(updatedAssignment as Assignment);
    } else {
      const newAssignment = {
        assignment_type: state.newAssignment?.category || "manual",
        assignment_title: state.assignment_title,
        assignment_description: state.assignment_description || "",
        total_marks: questions.reduce(
          (sum: number, q: Question) => sum + (Number(q.marks) || 0),
          0,
        ),
        number_of_questions: questions.length,
        start_time: state.start_time.toISOString(),
        deadline: state.deadline.toISOString(),
        section_id: sectionId,
        assignment_materials,
        questions: questions.map((q: Question) => ({
          question_id: q.question_id,
          question_text: String(q.question_text || ""),
          question_type: String(q.question_type || ""),
          marks: Number(q.marks) || 0,
          options_for_mcq: q.options_for_mcq,
          expected_answer: Array.isArray(q.expected_answer)
            ? q.expected_answer.map((ans: string) => String(ans || ""))
            : [],
          explanation: q.explanation,
          pattern_type: q.pattern_type,
          difficulty: q.difficulty,
          isAIGenerated: q.isAIGenerated
        })),
      };

      onPublish(newAssignment as Assignment);
    }
  };

  const handleBack = () => {
    if (!state.editingAssignment) {
      dispatch({ type: "SET_QUESTIONS", payload: [] });
    }
    onBack(state.newAssignment);
  };

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-6 mt-4 rounded">
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="w-full mx-auto space-y-8 pr-6">
          <AssignmentHeader
            totalQuestions={state.questions.length}
            totalMarks={totalMarks}
            isEditing={!!state.editingAssignment}
          />

          <Tabs
            defaultValue={state.activeTab}
            value={state.activeTab}
            onValueChange={(value) =>
              dispatch({
                type: "SET_ACTIVE_TAB",
                payload: value,
              })
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="setup" className="text-lg py-3">
                <BookOpen className="w-4 h-4 mr-2" />
                Setup
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className="text-lg py-3"
                // Remove the category condition to allow access to questions tab
                disabled={!state.assignment_title}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup">
              <AssignmentSetup
                state={state}
                dispatch={dispatch}
                category={category}
                selectedPdf={selectedPdf}
              />
            </TabsContent>

            <TabsContent value="questions">
              <QuestionsList
                state={state}
                dispatch={dispatch}
                category={category}
              />
            </TabsContent>
          </Tabs>

          <FooterButtons
            onBack={handleBack}
            onPublish={handlePublish}
            isEditing={!!state.editingAssignment}
            isPublishing={state.isPublishing}
            disabled={!state.assignment_title || state.questions.length === 0}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
