"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import QuestionCard from "./QuestionCard";
import QuestionTypeButtons from "./QuestionTypeButtons";

export default function QuestionsList({ state, dispatch, category }) {
  useEffect(() => {
    // Only set questions if we're editing and don't already have questions set
    if (
      state.editingAssignment?.questions &&
      (!state.questions || state.questions.length === 0)
    ) {
      dispatch({
        type: "SET_MULTIPLE",
        payload: {
          questions: state.editingAssignment.questions,
          assignment_title: state.editingAssignment.assignment_title,
        },
      });
    }
  }, [state.editingAssignment]);

  // Add null check for questions array
  const questions = state.questions;
  // console.log(state.editingAssignment.questions);
  console.log(questions);
  // question is an array. every object has marks. calculate total marks
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Pencil className="w-5 h-5 mr-2" />
            {category === "manual" ? "Questions" : "Generated Questions"}
          </div>
          {category === "manual" && <QuestionTypeButtons dispatch={dispatch} />}
          <div className="flex gap-3">
            <Badge variant="outline" className="px-4 py-2">
              {totalMarks} Total marks
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              {questions.length} Questions
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <AnimatePresence>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id || index}
                question={question}
                index={index}
                onUpdate={(index, field, value) =>
                  dispatch({
                    type: "UPDATE_QUESTION",
                    payload: { index, field, value },
                  })
                }
                onDelete={() =>
                  dispatch({
                    type: "DELETE_QUESTION",
                    payload: index,
                  })
                }
                isEditing={!!state.editingAssignment}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
