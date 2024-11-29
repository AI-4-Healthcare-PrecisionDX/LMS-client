import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { BookOpen, Edit3 } from "lucide-react";
import { useReducer } from "react";
import { initialState, reducer } from "../reducer";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentSetup from "./AssignmentSetup";
import FooterButtons from "./FooterButtons";
import QuestionsList from "./QuestionsList";

export default function Step3({
  assignmentDetails,
  onPublish,
  onBack,
  category,
}) {
  //STATE HANDLING
  // const [state, dispatch] = useReducer(reducer, {
  //   ...initialState,
  //   title: assignmentDetails.assignment_title || "",
  //   start_time: assignmentDetails.start_time
  //     ? parseISO(assignmentDetails.start_time)
  //     : new Date(),
  //   deadline: assignmentDetails.deadline
  //     ? parseISO(assignmentDetails.deadline)
  //     : new Date(),
  // });

  // UTILS
  const totalQuestions =
    category === "ai-generated"
      ? Object.values(state.patternCounts).reduce((a, b) => a + b, 0)
      : state.questions.length;

  const totalMarks = state.questions.reduce(
    (sum, q) => sum + (q.marks || 0),
    0,
  );

  // const handlePublish = () => {
  //   onPublish({
  //     assignment_title: state.assignment_title,
  //     totalMarks,
  //     start_time: format(state.start_time, "yyyy-MM-dd'T'HH:mm:ss"),
  //     deadline: format(state.deadline, "yyyy-MM-dd'T'HH:mm:ss"),
  //     questions: state.questions,
  //     ...(category === "ai-generated" && {
  //       questionCounts: {
  //         patterns: state.patternCounts,
  //         types: state.questionTypeCounts,
  //       },
  //     }),
  //   });
  // };

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    assignment_title: assignmentDetails?.assignment_title || "",
    start_time: assignmentDetails?.start_time
      ? parseISO(assignmentDetails.start_time)
      : new Date(),
    deadline: assignmentDetails?.deadline
      ? parseISO(assignmentDetails.deadline)
      : new Date(),
    questions: assignmentDetails?.questions || [],
    activeTab: "setup",
    patternCounts: assignmentDetails?.questionCounts?.patterns || {},
    questionTypeCounts: assignmentDetails?.questionCounts?.types || {},
  });

  useEffect(() => {
    if (assignmentDetails) {
      dispatch({
        type: "SET_MULTIPLE",
        payload: {
          assignment_title: assignmentDetails.assignment_title,
          start_time: parseISO(assignmentDetails.start_time),
          deadline: parseISO(assignmentDetails.deadline),
          questions: assignmentDetails.questions || [],
          patternCounts: assignmentDetails.questionCounts?.patterns || {},
          questionTypeCounts: assignmentDetails.questionCounts?.types || {},
        },
      });
    }
  }, [assignmentDetails]);

  const handlePublish = () => {
    const formattedData = {
      assignment_title: state.assignment_title,
      totalMarks: state.questions.reduce(
        (sum, q) => sum + (Number(q.marks) || 0),
        0,
      ),
      start_time: format(state.start_time, "yyyy-MM-dd'T'HH:mm:ss"),
      deadline: format(state.deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      questions: state.questions.map((q) => ({
        ...q,
        marks: Number(q.marks),
        options: q.options?.map((opt) => ({
          ...opt,
          isCorrect: Boolean(opt.isCorrect),
        })),
      })),
      ...(category === "ai-generated" && {
        questionCounts: {
          patterns: state.patternCounts,
          types: state.questionTypeCounts,
        },
      }),
    };

    onPublish(formattedData);
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
