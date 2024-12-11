"use client";

import QuestionCard from "@/components/brand/teacher/assessment/assessmentModal/QuestionCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useReducer, useState } from "react";
import { z } from "zod";

interface Book {
  id: string;
  title: string;
  file_url: string;
}

interface TableOfContents {
  chapters: {
    title: string;
    sections: string[];
  }[];
}

interface Question {
  type: string;
  mcq: boolean;
  difficulty: string;
  question: string;
  options: string[];
  correct_answers: string[];
  explanation: string;
}

interface FormattedQuestion {
  question_type: "mcq" | "broad";
  question_text: string;
  marks: number;
  options_for_mcq: string[];
  expected_answer: string[];
  explanation: string;
  pattern_type: string;
  difficulty: string;
}

interface AIResponse {
  questions: Question[];
  metadata: {
    total_questions: number;
    configuration: {
      total_mcq_questions: number;
      total_broad_questions: number;
      [key: string]: number;
    };
  };
}

const questionConfigSchema = z.object({
  question_bank_mcq: z.number().min(0).max(20),
  question_bank_broad: z.number().min(0).max(20),
  adaptive_learning_mcq: z.number().min(0).max(20),
  adaptive_learning_broad: z.number().min(0).max(20),
  application_based_mcq: z.number().min(0).max(20),
  application_based_broad: z.number().min(0).max(20),
  writing_assignment_mcq: z.number().min(0).max(20),
  writing_assignment_broad: z.number().min(0).max(20),
  scenario_based_mcq: z.number().min(0).max(20),
  scenario_based_broad: z.number().min(0).max(20),
  total_mcq_questions: z.number().min(1).max(50),
  total_broad_questions: z.number().min(1).max(50),
});

type QuestionConfig = z.infer<typeof questionConfigSchema>;

type ConfigAction =
  | { type: "SET_FIELD"; field: keyof QuestionConfig; value: number }
  | { type: "RESET" };

const initialConfig: QuestionConfig = {
  question_bank_mcq: 5,
  question_bank_broad: 5,
  adaptive_learning_mcq: 1,
  adaptive_learning_broad: 0,
  application_based_mcq: 0,
  application_based_broad: 0,
  writing_assignment_mcq: 0,
  writing_assignment_broad: 0,
  scenario_based_mcq: 0,
  scenario_based_broad: 0,
  total_mcq_questions: 6,
  total_broad_questions: 5,
};

function configReducer(
  state: QuestionConfig,
  action: ConfigAction,
): QuestionConfig {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET":
      return initialConfig;
    default:
      return state;
  }
}

const AIGeneratePage = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedQuestions, setGeneratedQuestions] =
    useState<AIResponse | null>(null);
  const [config, dispatch] = useReducer(configReducer, initialConfig);
  const [configErrors, setConfigErrors] = useState<z.ZodError | null>(null);

  const { data: books, isLoading: loadingBooks } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data } = await api.get<Book[]>("/books");
      return data;
    },
  });

  const { data: toc, isLoading: loadingTOC } = useQuery({
    queryKey: ["toc", selectedBook?.id],
    queryFn: async () => {
      const { data } = await api.get<TableOfContents>(
        `/books/${selectedBook?.id}/toc`,
      );
      return data;
    },
    enabled: !!selectedBook,
  });

  const generateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post<AIResponse>(
        "/llm/assignment_questions",
        formData,
      );
      return data;
    },
    onSuccess: (data) => {
      setGeneratedQuestions(data);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfigChange = (field: keyof QuestionConfig, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      dispatch({ type: "SET_FIELD", field, value: numValue });
    }
  };

  const handleGenerate = async () => {
    try {
      const validatedConfig = questionConfigSchema.parse(config);
      setConfigErrors(null);

      const formData = new FormData();
      if (selectedFile) {
        formData.append("pdf_file", selectedFile);
      }

      Object.entries(validatedConfig).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      generateMutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setConfigErrors(error);
      }
    }
  };

  const formatQuestions = (questions: Question[]): FormattedQuestion[] => {
    return questions.map((q) => ({
      question_type: q.mcq ? "mcq" : "broad",
      question_text: q.question,
      marks: q.difficulty === "easy" ? 2 : q.difficulty === "medium" ? 5 : 10,
      options_for_mcq: q.mcq ? q.options : [],
      expected_answer: q.mcq ? q.correct_answers : [q.correct_answers[0]],
      explanation: q.explanation,
      pattern_type: q.type,
      difficulty: q.difficulty,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Question Generator</h1>

      <div className="space-y-6">
        {/* Book Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Book</CardTitle>
            <CardDescription>Choose a book or upload your PDF</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingBooks ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading books...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books?.map((book) => (
                    <Button
                      key={book.id}
                      variant={
                        selectedBook?.id === book.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedBook(book)}
                      className="w-full"
                    >
                      {book.title}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf-upload">Or upload your own PDF</Label>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Question Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key.replace(/_/g, " ").toUpperCase()}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) =>
                      handleConfigChange(
                        key as keyof QuestionConfig,
                        e.target.value,
                      )
                    }
                  />
                  {configErrors?.errors.find((err) => err.path[0] === key) && (
                    <p className="text-red-500 text-sm">
                      {
                        configErrors.errors.find((err) => err.path[0] === key)
                          ?.message
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        {selectedBook && (
          <Card>
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTOC ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading contents...
                </div>
              ) : (
                <div className="space-y-4">
                  {toc?.chapters.map((chapter, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="font-semibold">{chapter.title}</h3>
                      <ul className="list-disc list-inside pl-4">
                        {chapter.sections.map((section, sIdx) => (
                          <li key={sIdx}>{section}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={
            generateMutation.isPending || (!selectedBook && !selectedFile)
          }
          className="w-full"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            "Generate Questions"
          )}
        </Button>

        {/* Generated Questions */}
        {generatedQuestions && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>
                Total Questions: {generatedQuestions.metadata.total_questions}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {formatQuestions(generatedQuestions.questions).map(
                  (question, index) => (
                    <QuestionCard
                      key={index}
                      question={question}
                      index={index}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIGeneratePage;
