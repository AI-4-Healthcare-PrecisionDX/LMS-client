import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import QuestionCard from "./QuestionCard";
import QuestionTypeButtons from "./QuestionTypeButtons";

export default function QuestionsList({ state, dispatch, category }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Pencil className="w-5 h-5 mr-2" />
            {category === "manual" ? "Questions" : "Generated Questions"}
          </div>
          {category === "manual" && <QuestionTypeButtons dispatch={dispatch} />}
          <Badge variant="outline" className="px-4 py-2">
            {state.questions.length} Questions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <AnimatePresence>
            {state.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onUpdate={(index, field, value) =>
                  dispatch({
                    type: "UPDATE_QUESTION",
                    payload: {
                      index,
                      field,
                      value,
                    },
                  })
                }
                onDelete={() =>
                  dispatch({
                    type: "DELETE_QUESTION",
                    payload: index,
                  })
                }
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
