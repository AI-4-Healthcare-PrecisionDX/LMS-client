const initialAssignments = [
  {
    id: 1,
    assignment_title: "Math Homework",
    startTime: "2023-06-01",
    deadline: "2023-06-15",
    totalMarks: 100,
    submitted: 15,
  },
  {
    id: 2,
    assignment_title: "Science Project",
    startTime: "2023-06-05",
    deadline: "2023-06-20",
    totalMarks: 150,
    submitted: 10,
  },
  {
    id: 3,
    assignment_title: "History Essay",
    startTime: "2023-06-10",
    deadline: "2023-06-25",
    totalMarks: 80,
    submitted: 20,
  },
];

const initialStudents = [
  {
    id: 1,
    studentName: "John Doe",
    submitted: true,
    marks: null,
    submission: "Test fe dfv",
    fileUpload: true,
    file: "http://localhost:3000/teacher/course-details/1",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    submitted: false,
    marks: null,
    submission: "",
    fileUpload: false,
    file: "",
  },
];

// Initial State
export const initialState = {
  assignments: initialAssignments,
  isModalOpen: false,
  currentStep: 1,
  newAssignment: {},
  editingAssignment: null,
  sortBy: "startTime",
  isSubmissionModalOpen: false,
  selectedAssignment: null,
  students: initialStudents,
  studentMarks: {},
  // Add more initial state properties here
  assignment_title: "",
  startTime: new Date(),
  deadline: new Date(),
  activeTab: "setup",
  questions: [],
  patternCounts: {
    questionBank: 2,
    adaptiveLearning: 2,
    applicationBased: 2,
    writingAssignment: 2,
    scenarioBased: 2,
  },
  questionTypeCounts: {
    mcq: 5,
    broadQuestion: 5,
  },
  selectedPattern: null,
  isQuestionsGenerated: false,
  // add for viva
  totalQuestions: 4,
  students: [],
  selectedStudent: null,
  marksPerQuestion: {},
  comments: "",
  totalMarks: 0,
};

const updateQuestionField = (question, field, value) => {
  // Handle special cases for options array
  if (field === "options") {
    return {
      ...question,
      options: [...value],
      // Reset correctAnswer if it's no longer in the options
      correctAnswer: value.includes(question.correctAnswer)
        ? question.correctAnswer
        : "",
    };
  }

  // Handle correctAnswer update
  if (field === "correctAnswer" && !question.options?.includes(value)) {
    return question; // Don't update if the correct answer isn't in options
  }

  // Handle marks validation
  if (field === "marks") {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      return question; // Don't update if invalid
    }
    return { ...question, marks: numValue };
  }

  // Default case for simple field updates
  return {
    ...question,
    [field]: value,
  };
};

// Action Types
export const ACTIONS = {
  SET_MODAL_OPEN: "SET_MODAL_OPEN",
  SET_CURRENT_STEP: "SET_CURRENT_STEP",
  SET_NEW_ASSIGNMENT: "SET_NEW_ASSIGNMENT",
  SET_EDITING_ASSIGNMENT: "SET_EDITING_ASSIGNMENT",
  SET_SORT_BY: "SET_SORT_BY",
  SET_SUBMISSION_MODAL_OPEN: "SET_SUBMISSION_MODAL_OPEN",
  SET_SELECTED_ASSIGNMENT: "SET_SELECTED_ASSIGNMENT",
  SET_STUDENT_MARKS: "SET_STUDENT_MARKS",
  ADD_ASSIGNMENT: "ADD_ASSIGNMENT",
  UPDATE_ASSIGNMENT: "UPDATE_ASSIGNMENT",
  DELETE_ASSIGNMENT: "DELETE_ASSIGNMENT",
  RESET_STATE: "RESET_STATE",
  UPDATE_QUESTION: "UPDATE_QUESTION",
  SET_ASSIGNMENT_TITLE: "SET_ASSIGNMENT_TITLE",
  SET_START_TIME: "SET_START_TIME",
  SET_DEADLINE: "SET_DEADLINE",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  INCREMENT_PATTERN: "INCREMENT_PATTERN",
  DECREMENT_PATTERN: "DECREMENT_PATTERN",
  GENERATE_QUESTIONS: "GENERATE_QUESTIONS",
  DELETE_QUESTION: "DELETE_QUESTION",
  ADD_QUESTION: "ADD_QUESTION",
  // ADD more action types here (SET_TOTAL_QUESTIONS, UPDATE_VIVA_QUESTION, DELETE_QUESTION, ADD_QUESTION, SET_MARKS, SET_COMMENT )
  SET_TOTAL_QUESTIONS: "SET_TOTAL_QUESTIONS",
  GENERATE_VIVA_QUESTIONS: "GENERATE_VIVA_QUESTIONS",
  UPDATE_VIVA_QUESTION: "UPDATE_VIVA_QUESTION",
  ADD_VIVA_QUESTION: "ADD_VIVA_QUESTION",
  SET_MARKS: "SET_MARKS",
  SET_COMMENT: "SET_COMMENT",
};

// Reducer
export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MODAL_OPEN:
      return { ...state, isModalOpen: action.payload };
    case ACTIONS.SET_CURRENT_STEP:
      return { ...state, currentStep: action.payload };
    case ACTIONS.SET_NEW_ASSIGNMENT:
      return {
        ...state,
        newAssignment: { ...state.newAssignment, ...action.payload },
      };
    case ACTIONS.SET_EDITING_ASSIGNMENT:
      return { ...state, editingAssignment: action.payload };
    case ACTIONS.SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    case ACTIONS.SET_SUBMISSION_MODAL_OPEN:
      return { ...state, isSubmissionModalOpen: action.payload };
    case ACTIONS.SET_SELECTED_ASSIGNMENT:
      return { ...state, selectedAssignment: action.payload };
    case ACTIONS.SET_STUDENT_MARKS:
      return {
        ...state,
        studentMarks: { ...state.studentMarks, ...action.payload },
      };
    case ACTIONS.ADD_ASSIGNMENT:
      return { ...state, assignments: [...state.assignments, action.payload] };
    case ACTIONS.UPDATE_ASSIGNMENT:
      return {
        ...state,
        assignments: state.assignments.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a,
        ),
      };
    case ACTIONS.DELETE_ASSIGNMENT:
      return {
        ...state,
        assignments: state.assignments.filter((a) => a.id !== action.payload),
      };
    case ACTIONS.RESET_STATE:
      return { ...initialState, assignments: state.assignments };
    case ACTIONS.SET_ASSIGNMENT_TITLE:
      return { ...state, assignment_title: action.payload };
    case ACTIONS.SET_START_TIME:
      return { ...state, startTime: action.payload };
    case ACTIONS.SET_DEADLINE:
      return { ...state, deadline: action.payload };
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case ACTIONS.INCREMENT_PATTERN: {
      const newPatternCounts = {
        ...state.patternCounts,
        [action.payload]: state.patternCounts[action.payload] + 1,
      };
      const totalQuestions = Object.values(newPatternCounts).reduce(
        (a, b) => a + b,
        0,
      );
      return {
        ...state,
        patternCounts: newPatternCounts,
        questionTypeCounts: {
          mcq: Math.ceil(totalQuestions / 2),
          broadQuestion: Math.floor(totalQuestions / 2),
        },
        isQuestionsGenerated: false,
      };
    }
    case ACTIONS.DECREMENT_PATTERN: {
      if (state.patternCounts[action.payload] <= 0) return state;
      const newPatternCounts = {
        ...state.patternCounts,
        [action.payload]: state.patternCounts[action.payload] - 1,
      };
      const totalQuestions = Object.values(newPatternCounts).reduce(
        (a, b) => a + b,
        0,
      );
      return {
        ...state,
        patternCounts: newPatternCounts,
        questionTypeCounts: {
          mcq: Math.ceil(totalQuestions / 2),
          broadQuestion: Math.floor(totalQuestions / 2),
        },
        isQuestionsGenerated: false,
      };
    }
    case ACTIONS.SET_TOTAL_QUESTIONS: {
      const newQuestions = Array.from(
        { length: parseInt(action.payload) },
        (_, i) => ({
          id: `q${i + 1}`,
          question: "",
          expectedAnswer: "",
          marks: 5,
        }),
      );
      const newMarksPerQuestion = {};
      newQuestions.forEach((q) => {
        newMarksPerQuestion[q.id] = 0;
      });
      return {
        ...state,
        totalQuestions: parseInt(action.payload),
        questions: newQuestions,
        marksPerQuestion: newMarksPerQuestion,
      };
    }
    case ACTIONS.GENERATE_QUESTIONS: {
      const questions = [];
      let questionNumber = 1;

      // Generate questions for each pattern and its question types
      for (const pattern of Object.keys(state.patternCounts)) {
        // Generate MCQ questions for this pattern
        for (let i = 0; i < state.patternCounts[pattern].mcq; i++) {
          questions.push({
            id: `q${questionNumber}`,
            type: "mcq",
            pattern: pattern,
            question: `Sample ${pattern} MCQ Question ${questionNumber}`,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: "Option 1",
            marks: 5,
          });
          questionNumber++;
        }

        // Generate broad questions for this pattern
        for (let i = 0; i < state.patternCounts[pattern].broad; i++) {
          questions.push({
            id: `q${questionNumber}`,
            type: "broad",
            pattern: pattern,
            question: `Sample ${pattern} Broad Question ${questionNumber}`,
            marks: 10,
            expectedAnswer: "Sample answer",
            rubric: "Sample rubric",
          });
          questionNumber++;
        }
      }

      return {
        ...state,
        questions,
        isQuestionsGenerated: true,
        activeTab: "questions",
      };
    }
    case ACTIONS.GENERATE_VIVA_QUESTIONS:
      return {
        ...state,
        questions: Array.from({ length: state.totalQuestions }, (_, i) => ({
          id: `q${i + 1}`,
          question: `Sample Question ${i + 1}`,
          expectedAnswer: "Sample expected answer",
          marks: 5,
        })),
      };
    case ACTIONS.UPDATE_VIVA_QUESTION:
      const { index, field, value } = action.payload;
      const updatedQuestions = [...state.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return { ...state, questions: updatedQuestions };
    case ACTIONS.ADD_VIVA_QUESTION:
      return {
        ...state,
        questions: [
          ...state.questions,
          {
            id: `q${state.questions.length + 1}`,
            question: "",
            expectedAnswer: "",
            marks: 5,
          },
        ],
      };
    case ACTIONS.SET_MARKS:
      const { questionId, marks } = action.payload;
      return {
        ...state,
        marksPerQuestion: {
          ...state.marksPerQuestion,
          [questionId]: parseInt(marks),
        },
      };
    case ACTIONS.SET_COMMENT:
      return { ...state, comments: action.payload };
    case ACTIONS.UPDATE_QUESTION: {
      const { index, field, value } = action.payload;
      if (index < 0 || index >= state.questions.length) {
        console.error("Invalid question index:", index);
        return state;
      }
      const updatedQuestions = state.questions.map((question, i) =>
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
          (_, index) => index !== action.payload,
        ),
      };
    case ACTIONS.ADD_QUESTION: {
      const newQuestion = {
        id: `q${state.questions.length + 1}`,
        type: action.payload,
        pattern: "questionBank",
        question: "",
        marks: action.payload === "mcq" ? 5 : 10,
        ...(action.payload === "mcq"
          ? { options: ["", "", "", ""], correctAnswer: "" }
          : { expectedAnswer: "", rubric: "" }),
      };
      return {
        ...state,
        questions: [...state.questions, newQuestion],
      };
    }
    default:
      return state;
  }
}
