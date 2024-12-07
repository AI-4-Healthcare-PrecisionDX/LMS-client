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

// Doctor Note
export const doctorNoteAtom = atom<string>("");
