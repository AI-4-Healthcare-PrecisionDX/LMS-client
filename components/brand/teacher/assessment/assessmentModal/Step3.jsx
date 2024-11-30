import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { BookOpen, Edit3 } from "lucide-react";
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
  const totalQuestions =
    category === "ai-generated"
      ? Object.values(state.patternCounts).reduce((a, b) => a + b, 0)
      : state.questions.length;

  const totalMarks = state.questions.reduce(
    (sum, q) => sum + (q.marks || 0),
    0,
  );

  const handlePublish = () => {
    onPublish({
      assignment_title: state.assignment_title,
      total_marks: totalMarks,
      start_time: format(state.start_time, "yyyy-MM-dd'T'HH:mm:ss"),
      deadline: format(state.deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      questions: state.questions,
      ...(category === "ai-generated" && {
        questionCounts: {
          patterns: state.patternCounts,
          types: state.questionTypeCounts,
        },
      }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 mt-4 rounded">
      <ScrollArea className="h-[600px]">
        <div className="max-w-7xl mx-auto space-y-8">
          <AssignmentHeader
            totalQuestions={totalQuestions}
            totalMarks={totalMarks}
          />

          <Tabs
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
            onBack={onBack}
            onPublish={handlePublish}
            disabled={!state.assignment_title || state.questions.length === 0}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
