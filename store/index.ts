import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { questions_essay, questions_mcq } from "@/data";
import { Book, User } from "@/types";

export const examTypeAtom = atom("mcq");
export const timeLimitAtom = atom(60); // Default to 60 minutes

export const questionsAtom = atom((get) => {
  const examType = get(examTypeAtom);
  switch (examType) {
    case "mcq":
      return questions_mcq;
    case "essay":
      return questions_essay;
    case "mix":
      return [...questions_mcq.slice(0, 5), ...questions_essay.slice(5, 10)];
    default:
      return questions_mcq;
  }
});

export const answersAtom = atom<{ [key: number]: string | null }>({});

export const resultsAtom = atom((get) => {
  const questions = get(questionsAtom);
  const answers = get(answersAtom);
  return questions.map((question) => ({
    ...question,
    userAnswer: answers[question.id] || null,
    isCorrect: question.answer === answers[question.id],
    isAnswered:
      answers[question.id] !== undefined && answers[question.id] !== null,
    correctAnswer: question.answer,
  }));
});

export const bookAtom = atom<Book | null>(null);

// New atoms for persisting chapter and section selections
export const selectedChaptersAtom = atom([]);
export const selectedSectionsAtom = atom([]);

// Define atoms with localStorage as the storage provider
export const userAtom = atomWithStorage<User | null>("user", null);
export const isAuthenticatedAtom = atomWithStorage<boolean>(
  "isAuthenticated",
  false,
);
export const isLoggedInAtom = atomWithStorage<boolean>("isLoggedIn", false);
export const userRoleAtom = atomWithStorage<string | null>("userRole", null);
export const aiGeneratedQuestionsAtom = atomWithStorage(
  "aiGeneratedQuestions",
  [
    {
      type: "question_bank",
      mcq: true,
      difficulty: "easy",
      question: "",
      options: [],
      correct_answers: [],
      explanation: "",
    },
  ],
);

export const selectedPdfAtom = atom<{
  url: string | null;
  name: string;
  pdfBytes?: Uint8Array;
}>({
  url: null,
  name: "",
  pdfBytes: undefined,
});

export const questionConfigAtom = atom({
  patternCounts: {
    questionBank: { mcq: 0, broad: 0 },
    adaptiveLearning: { mcq: 0, broad: 0 },
    applicationBased: { mcq: 0, broad: 0 },
    writingAssignment: { mcq: 0, broad: 0 },
    scenarioBased: { mcq: 0, broad: 0 },
  },
  expandedPattern: null,
  isQuestionsGenerated: false,
});

// Doctor Note
export const doctorNoteAtom = atom<string>("");