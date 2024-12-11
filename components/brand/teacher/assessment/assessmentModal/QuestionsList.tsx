"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios-config";
import { aiGeneratedQuestionsAtom } from "@/store";
import { AnimatePresence } from "framer-motion";
import { useAtomValue } from "jotai";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Question } from "../types";
import { MaterialView } from "./MaterialUpload";
import QuestionCard from "./QuestionCard";
import QuestionTypeButtons from "./QuestionTypeButtons";

export type QuestionPatternType =
  | "question_bank"
  | "adaptive_learning"
  | "application_based"
  | "writing_assignment"
  | "scenario_based";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface AiGeneratedQuestion {
  type: QuestionPatternType;
  mcq: boolean;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correct_answers: string[];
  explanation: string;
}

interface PDF {
  library_id: string;
  name: string;
  file_url: string;
}

interface Material {
  library_item_id: string;
}

interface AssignmentState {
  editingAssignment?: {
    assignment_materials?: Material[];
  };
  questions?: Question[];
}

interface DispatchAction {
  type: "SET_QUESTIONS" | "SET_MATERIALS";
  payload: FormattedQuestion[] | PDF[];
}

interface FormattedQuestion {
  question_type: "mcq" | "broad";
  question_text: string;
  marks: number;
  options_for_mcq: string[];
  expected_answer: string[];
  explanation: string;
  pattern_type: QuestionPatternType;
  difficulty: DifficultyLevel;
}

export default function QuestionsList({
  state,
  dispatch,
  category,
  isGenerated,
}: {
  state: AssignmentState;
  dispatch: (action: DispatchAction) => void;
  category: string;
  isGenerated: boolean;
}) {
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const aiGeneratedQuestions = useAtomValue<AiGeneratedQuestion[]>(
    aiGeneratedQuestionsAtom,
  );

  const [questionAi, setQuestionAi] = useState<FormattedQuestion[]>([]);

  useEffect(() => {
    const loadExistingPDFs = async () => {
      if (
        state.editingAssignment?.assignment_materials &&
        state.editingAssignment.assignment_materials.length > 0
      ) {
        try {
          const existingPDFs = await Promise.all(
            state.editingAssignment.assignment_materials.map(
              async (material) => {
                const materialId = material.library_item_id;

                try {
                  const response = await api.get(
                    `/utils/library/${materialId}`,
                  );
                  return {
                    library_id: materialId,
                    name: response.data.material_title,
                    file_url: response.data.file_url,
                  };
                } catch (error) {
                  console.error(`Error fetching PDF ${materialId}:`, error);
                  toast.error("Failed to load some existing materials");
                  return null;
                }
              },
            ),
          );

          const validPDFs = existingPDFs.filter(
            (pdf): pdf is PDF => pdf !== null,
          );

          setPDFs(validPDFs);
          dispatch({
            type: "SET_MATERIALS",
            payload: validPDFs,
          });
        } catch (error) {
          console.error("Error loading existing PDFs:", error);
          toast.error("Failed to load some existing materials");
        }
      }
    };

    if (state.editingAssignment) {
      loadExistingPDFs();
    }
  }, [state.editingAssignment, dispatch]);

  useEffect(() => {
    if (aiGeneratedQuestions.length > 0) {
      const formattedQuestions = aiGeneratedQuestions.map((q) => ({
        question_type: q.mcq ? "mcq" : "broad",
        question_text: q.question,
        marks: q.difficulty === "easy" ? 2 : q.difficulty === "medium" ? 5 : 10,
        options_for_mcq: q.mcq ? q.options : [],
        expected_answer: q.mcq ? q.correct_answers : [q.correct_answers[0]],
        explanation: q.explanation,
        pattern_type: q.type,
        difficulty: q.difficulty,
      })) as FormattedQuestion[];

      setQuestionAi(formattedQuestions);

      dispatch({
        type: "SET_QUESTIONS",
        payload: formattedQuestions,
      });
    }
  }, [aiGeneratedQuestions, dispatch]);

  const questions = state.questions || [];
  const totalMarks = questions.reduce(
    (sum: number, q: Question) => sum + (Number(q.marks) || 0),
    0,
  );

  const handlePDFsChange = (newPDFs: PDF[]) => {
    setPDFs(newPDFs);
    dispatch({
      type: "SET_MATERIALS",
      payload: newPDFs,
    });
  };

  return isGenerated ? (
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
            <Badge variant="outline" className="px-4 py-2">
              {aiGeneratedQuestions.length} Generated Questions
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MaterialView pdfs={pdfs} onPDFsChange={handlePDFsChange} />
        <ScrollArea className="h-[600px] pr-4">
          <AnimatePresence>
            {questionAi.map((question, index) => (
              <QuestionCard
                key={`ai-${index}`}
                question={question}
                index={index}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            ))}

            {questions.map((question, index) => (
              <QuestionCard
                key={question.question_id || `manual-${index}`}
                question={question}
                index={index}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  ) : (
    <div>
      <p>No questions generated</p>
    </div>
  );
}
