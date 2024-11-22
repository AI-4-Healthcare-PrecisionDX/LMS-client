import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useReducer } from "react";
import { initialState, reducer } from "../reducer";
import QuestionCard from "./QuestionCard";

export default function VivaStep({ assignmentDetails, onPublish, onBack }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Mock student data - replace with your actual data
  const studentsList = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    // Add more students
  ];

  const handlePublish = () => {
    const totalMarks = Object.values(state.marksPerQuestion).reduce(
      (a, b) => a + b,
      0,
    );
    onPublish({
      title: state.title,
      questions: state.questions,
      marksPerQuestion: state.marksPerQuestion,
      comments: state.comments,
      totalMarks,
    });
  };

  return (
    <div className="space-y-8 mt-6">
      <ScrollArea className="h-[800px]">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <Label>Viva Title</Label>
                <Input
                  value={state.title}
                  onChange={(e) =>
                    dispatch({ type: "SET_TITLE", payload: e.target.value })
                  }
                  placeholder="Enter viva title"
                />
              </div>

              {/* Questions Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="space-y-2">
                    <Label>Total Number of Questions</Label>
                    <div className="flex space-x-4">
                      <Input
                        type="number"
                        value={state.totalQuestions}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_TOTAL_QUESTIONS",
                            payload: e.target.value,
                          })
                        }
                        min="1"
                        className="w-32"
                      />
                      <Button
                        onClick={() =>
                          dispatch({ type: "GENERATE_VIVA_QUESTIONS" })
                        }
                      >
                        Generate Questions
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => dispatch({ type: "ADD_VIVA_QUESTION" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question Manually
                  </Button>
                </div>

                <div className="space-y-4">
                  {state.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      onUpdate={(index, field, value) =>
                        dispatch({
                          type: "UPDATE_QUESTION",
                          payload: { index, field, value },
                        })
                      }
                      onDelete={(index) =>
                        dispatch({ type: "DELETE_QUESTION", payload: index })
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Student Selection and Marks Entry */}
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Student Name</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentsList.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Student ID</Label>
                    <Input readOnly value={state.selectedStudent?.id || ""} />
                  </div>
                </div>

                {/* Marks Entry */}
                <div className="space-y-4">
                  {state.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-center space-x-4"
                    >
                      <Label className="w-32">
                        Question {index + 1} Marks:
                      </Label>
                      <Input
                        type="number"
                        value={state.marksPerQuestion[question.id] || ""}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_MARKS",
                            payload: {
                              questionId: question.id,
                              marks: e.target.value,
                            },
                          })
                        }
                        className="w-24"
                        max={question.marks}
                      />
                      <span className="text-sm text-gray-500">
                        Max: {question.marks}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Comments */}
                <div>
                  <Label>Comments</Label>
                  <Textarea
                    value={state.comments}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_COMMENT",
                        payload: e.target.value,
                      })
                    }
                    placeholder="Add comments about student's performance"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Buttons */}
        <div className="flex justify-between pt-2 mr-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!state.title || state.questions.length === 0}
          >
            Submit Viva
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
