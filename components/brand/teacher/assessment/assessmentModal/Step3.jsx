import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { BookOpen, Edit3 } from "lucide-react";
import { useEffect } from "react";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentSetup from "./AssignmentSetup";
import FooterButtons from "./FooterButtons";
import QuestionsList from "./QuestionsList";

export default function Step3({
  onPublish,
  onBack,
  category,
  state,
  dispatch,
}) {
  useEffect(() => {
    // Clear questions when mounting if not editing
    if (!state.editingAssignment) {
      dispatch({ type: "SET_QUESTIONS", payload: [] });
    }
  }, []);

  const totalQuestions =
    category === "ai-generated"
      ? Object.values(state.patternCounts).reduce((a, b) => a + b, 0)
      : state.questions.length;

  const totalMarks = state.questions.reduce(
    (sum, q) => sum + (parseInt(q.marks) || 0),
    0,
  );

  const handlePublish = () => {
    const assignmentData = {
      assignment_title: state.assignment_title,
      total_marks: totalMarks,
      start_time: format(state.start_time, "yyyy-MM-dd'T'HH:mm:ss"),
      deadline: format(state.deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      questions: state.questions.map((q) => ({
        ...q,
        question_id: q.question_id || undefined,
        marks: parseInt(q.marks) || 0,
        options_for_mcq: q.options_for_mcq || [],
        expected_answer: q.expected_answer || [],
      })),
      ...(category === "ai-generated" && {
        questionCounts: {
          patterns: state.patternCounts,
          types: state.questionTypeCounts,
        },
      }),
    };

    if (state.editingAssignment) {
      assignmentData.assignment_id = state.editingAssignment.assignment_id;
    }

    onPublish(assignmentData);
  };

  // When navigating back, also clear state if not editing
  const handleBack = () => {
    if (!state.editingAssignment) {
      dispatch({ type: "SET_QUESTIONS", payload: [] });
    }
    onBack(state.newAssignment);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 mt-4 rounded">
      <ScrollArea className="h-[600px]">
        <div className="max-w-7xl mx-auto space-y-8">
          <AssignmentHeader
            totalQuestions={totalQuestions}
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
                disabled={category === "manual" && !state.assignment_title}
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
            disabled={!state.assignment_title || state.questions.length === 0}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
