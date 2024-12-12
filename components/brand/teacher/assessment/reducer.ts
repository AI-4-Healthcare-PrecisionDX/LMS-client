import { AssignmentMaterial, Question } from "./types";

export const initialState = {
  assignments: [],
  newAssignment: {},
  assignment_title: "",
  start_time: new Date(),
  deadline: new Date(),
  assignment_materials: [],
  questions: [],
  marksPerQuestion: {},
  editingAssignment: null,
  currentStep: 1,
  isModalOpen: false,
  activeTab: "setup",
  sortBy: "start_time",
  materials: [],
  // ai-generated
  // patternCounts: {},
  // isQuestionsGenerated: false,
};

const updateQuestionField = (question: Question, field: string, value: any) => {
  // Handle special cases for MCQ options
  if (field === "options_for_mcq") {
    // Don't modify expected_answer unless necessary
    const updatedQuestion = {
      ...question,
      options_for_mcq: [...value],
    };

    // Only filter expected_answer if it contains invalid options
    if (question.expected_answer?.some((answer) => !value.includes(answer))) {
      updatedQuestion.expected_answer = question.expected_answer.filter(
        (answer) => value.includes(answer),
      );
    }

    return updatedQuestion;
  }


  // Handle expected_answer update for MCQ
  if (field === "expected_answer" && question.question_type === "mcq") {
    // Ensure value is always an array
    const answerArray = Array.isArray(value) ? value : [value];
    // Only update if all answers are in options
    if (answerArray.every((v) => question.options_for_mcq?.includes(v))) {
      return {
        ...question,
        expected_answer: answerArray,
      };
    }
    return question;
  }

  // Handle marks validation
  if (field === "marks") {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      return question;
    }
    return { ...question, marks: numValue };
  }

  // Handle expected_answer for broad questions
  if (field === "expected_answer" && question.question_type === "broad") {
    // Ensure the value is always an array
    const answerArray = Array.isArray(value) ? value : [value];
    return {
      ...question,
      expected_answer: answerArray,
    };
  }

  return {
    ...question,
    [field]: value,
  };
};

export const ACTIONS = {
  SET_MODAL_OPEN: "SET_MODAL_OPEN",
  SET_CURRENT_STEP: "SET_CURRENT_STEP",
  SET_SORT_BY: "SET_SORT_BY",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  SET_NEW_ASSIGNMENT: "SET_NEW_ASSIGNMENT",
  ADD_ASSIGNMENT: "ADD_ASSIGNMENT",
  SET_ASSIGNMENT_TITLE: "SET_ASSIGNMENT_TITLE",
  SET_START_TIME: "SET_START_TIME",
  SET_DEADLINE: "SET_DEADLINE",
  SET_EDITING_ASSIGNMENT: "SET_EDITING_ASSIGNMENT",
  UPDATE_QUESTION: "UPDATE_QUESTION",
  ADD_QUESTION: "ADD_QUESTION",
  DELETE_QUESTION: "DELETE_QUESTION",
  SET_MULTIPLE: "SET_MULTIPLE",
  ADD_ASSIGNMENT_MATERIALS: "ADD_ASSIGNMENT_MATERIALS",
  REMOVE_ASSIGNMENT_MATERIAL: "REMOVE_ASSIGNMENT_MATERIAL",
  RESET_STATE: "RESET_STATE",
  SET_QUESTIONS: "SET_QUESTIONS",
  SET_MATERIALS: "SET_MATERIALS",
  // ai-generated
  // UPDATE_PATTERN_COUNT: "UPDATE_PATTERN_COUNT",
  // SET_QUESTIONS_GENERATED: "SET_QUESTIONS_GENERATED",
};

export function reducer(state: any, action: any) {
  switch (action.type) {
    case ACTIONS.SET_MODAL_OPEN:
      return { ...state, isModalOpen: action.payload };
    case ACTIONS.SET_CURRENT_STEP:
      return { ...state, currentStep: action.payload };
    case ACTIONS.SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    case ACTIONS.SET_NEW_ASSIGNMENT:
      return {
        ...state,
        newAssignment: { ...state.newAssignment, ...action.payload },
      };
    case ACTIONS.SET_EDITING_ASSIGNMENT:
      return { ...state, editingAssignment: action.payload };
    case ACTIONS.ADD_ASSIGNMENT:
      return { ...state, assignments: [...state.assignments, action.payload] };
    case ACTIONS.SET_ASSIGNMENT_TITLE:
      return { ...state, assignment_title: action.payload };
    case ACTIONS.SET_START_TIME:
      return { ...state, start_time: action.payload };
    case ACTIONS.SET_DEADLINE:
      return { ...state, deadline: action.payload };
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case ACTIONS.ADD_QUESTION: {
      const newQuestion = {
        id: `q${state.questions.length + 1}`,
        question_type: action.payload,
        pattern: "manual",
        question_text: "",
        question_description: "",
        marks: action.payload === "mcq" ? 5 : 10,
        ...(action.payload === "mcq"
          ? {
            options_for_mcq: ["", "", "", ""],
            expected_answer: [],
          }
          : {
            expected_answer: [""],
          }),
      };
      return {
        ...state,
        questions: [...state.questions, newQuestion],
      };
    }
    case ACTIONS.UPDATE_QUESTION: {
      const { index, field, value } = action.payload;
      if (index < 0 || index >= state.questions.length) {
        console.error("Invalid question index:", index);
        return state;
      }
      const updatedQuestions = state.questions.map((question: Question, i: number) =>
        i === index ? updateQuestionField(question, field, value) : question,
      );
      return {
        ...state,
        questions: updatedQuestions,
      };
    }
    case ACTIONS.DELETE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter(
          (_: Question, index: number) => index !== action.payload,
        ),
      };
    case ACTIONS.RESET_STATE:
      return {
        ...initialState,
        sortBy: state.sortBy,
      };

    case ACTIONS.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };
    case ACTIONS.SET_MULTIPLE:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.ADD_ASSIGNMENT_MATERIALS:
      return {
        ...state,
        editingAssignment: {
          ...state.editingAssignment,
          assignment_materials: [
            ...(state.editingAssignment?.assignment_materials || []),
            ...action.payload,
          ],
        },
      };

    case ACTIONS.REMOVE_ASSIGNMENT_MATERIAL:
      return {
        ...state,
        editingAssignment: {
          ...state.editingAssignment,
          assignment_materials: (
            state.editingAssignment?.assignment_materials || []
          ).filter((material: AssignmentMaterial) => material.assignment_material_id !== action.payload),
        },
      };
    case "SET_MATERIALS":
      return {
        ...state,
        materials: action.payload,
      };
    default:
      return state;
  }
}
