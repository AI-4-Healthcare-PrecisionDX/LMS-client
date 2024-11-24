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
  assignments: [],
  students: initialStudents,
  // create assignment - manual
  newAssignment: {},
  assignment_title: "",
  start_time: new Date(),
  deadline: new Date(),
  questions: [],
  totalMarks: 0,
  // modal steps and open/close
  currentStep: 1,
  isModalOpen: false,
  // action assignment
  editingAssignment: null,
  isSubmissionModalOpen: false,
  selectedAssignment: null,
  studentMarks: {},
  patternCounts: {
    questionBank: 2,
    adaptiveLearning: 2,
    applicationBased: 2,
    writingAssignment: 2,
    scenarioBased: 2,
  },
  // tabs and sorting
  activeTab: "setup",
  sortBy: "start_time",
  //others ----------------------------
  // questionTypeCounts: {
  //   mcq: 5,
  //   broadQuestion: 5,
  // },
  selectedPattern: null,
  isQuestionsGenerated: false,
  // totalQuestions: 4,
  selectedStudent: null,
  marksPerQuestion: {},
  comments: "",
};

const updateQuestionField = (question, field, value) => {
  // Handle special cases for MCQ options
  if (field === "options_for_mcq") {
    return {
      ...question,
      options_for_mcq: [...value],
      // Reset expected_answer if it contains options that no longer exist
      expected_answer:
        question.expected_answer?.filter((answer) => value.includes(answer)) ||
        [],
    };
  }

  // Handle expected_answer update for MCQ
  if (field === "expected_answer" && question.question_type === "mcq") {
    // Ensure the expected answer is always in the options
    if (
      !Array.isArray(value) ||
      !value.every((v) => question.options_for_mcq?.includes(v))
    ) {
      return question;
    }
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

  // Default case for simple field updates
  return {
    ...question,
    [field]: value,
  };
};

// Action Types
export const ACTIONS = {
  // UI actions
  SET_MODAL_OPEN: "SET_MODAL_OPEN",
  SET_CURRENT_STEP: "SET_CURRENT_STEP",
  SET_SUBMISSION_MODAL_OPEN: "SET_SUBMISSION_MODAL_OPEN",
  SET_SORT_BY: "SET_SORT_BY",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  // create assignment - manual
  SET_NEW_ASSIGNMENT: "SET_NEW_ASSIGNMENT",
  ADD_ASSIGNMENT: "ADD_ASSIGNMENT",
  SET_ASSIGNMENT_TITLE: "SET_ASSIGNMENT_TITLE",
  SET_START_TIME: "SET_START_TIME",
  SET_DEADLINE: "SET_DEADLINE",
  SET_TOTAL_QUESTIONS: "SET_TOTAL_QUESTIONS",
  SET_MARKS: "SET_MARKS",
  // assignment actions
  SET_EDITING_ASSIGNMENT: "SET_EDITING_ASSIGNMENT",
  SET_SELECTED_ASSIGNMENT: "SET_SELECTED_ASSIGNMENT",
  SET_STUDENT_MARKS: "SET_STUDENT_MARKS",
  UPDATE_ASSIGNMENT: "UPDATE_ASSIGNMENT",
  DELETE_ASSIGNMENT: "DELETE_ASSIGNMENT",
  UPDATE_QUESTION: "UPDATE_QUESTION",
  ADD_QUESTION: "ADD_QUESTION",
  DELETE_QUESTION: "DELETE_QUESTION",
  // others
  RESET_STATE: "RESET_STATE",
  INCREMENT_PATTERN: "INCREMENT_PATTERN",
  DECREMENT_PATTERN: "DECREMENT_PATTERN",
  GENERATE_QUESTIONS: "GENERATE_QUESTIONS",
  // viva
  GENERATE_VIVA_QUESTIONS: "GENERATE_VIVA_QUESTIONS",
  UPDATE_VIVA_QUESTION: "UPDATE_VIVA_QUESTION",
  ADD_VIVA_QUESTION: "ADD_VIVA_QUESTION",
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
          a.assignment_id === action.payload.assignment_id
            ? { ...a, ...action.payload }
            : a,
        ),
      };
    case ACTIONS.DELETE_ASSIGNMENT:
      return {
        ...state,
        assignments: state.assignments.filter(
          (a) => a.assignment_id !== action.payload,
        ),
      };
    case ACTIONS.RESET_STATE:
      return { ...initialState, assignments: state.assignments };
    case ACTIONS.SET_ASSIGNMENT_TITLE:
      return { ...state, assignment_title: action.payload };
    case ACTIONS.SET_START_TIME:
      return { ...state, start_time: action.payload };
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
    case ACTIONS.GENERATE_QUESTIONS: {
      const questions = [];
      let questionNumber = 1;

      // Generate questions for each pattern and its question types
      for (const pattern of Object.keys(state.patternCounts)) {
        // Generate MCQ questions for this pattern
        for (let i = 0; i < state.patternCounts[pattern].mcq; i++) {
          questions.push({
            id: `q${questionNumber}`,
            question_type: "mcq",
            pattern: pattern,
            question_text: `Sample ${pattern} MCQ Question ${questionNumber}`,
            options_for_mcq: ["Option 1", "Option 2", "Option 3", "Option 4"],
            expected_answer: ["Option 1"],
            marks: 5,
            question_description: "",
          });
          questionNumber++;
        }

        // Generate broad questions for this pattern
        for (let i = 0; i < state.patternCounts[pattern].broad; i++) {
          questions.push({
            id: `q${questionNumber}`,
            question_type: "broad",
            pattern: pattern,
            question_text: `Sample ${pattern} Broad Question ${questionNumber}`,
            marks: 10,
            expected_answer: ["Sample expected answer"],
            question_description: "",
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
    case ACTIONS.SET_TOTAL_QUESTIONS: {
      const newQuestions = Array.from(
        { length: parseInt(action.payload) },
        (_, i) => ({
          id: `q${i + 1}`,
          question_type: "broad", // default type
          question_text: "",
          expected_answer: [""],
          marks: 5,
          question_description: "",
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
    case ACTIONS.GENERATE_VIVA_QUESTIONS:
      return {
        ...state,
        questions: Array.from({ length: state.totalQuestions }, (_, i) => ({
          id: `q${i + 1}`,
          question_type: "broad",
          question_text: `Sample Question ${i + 1}`,
          expected_answer: ["Sample expected answer"],
          marks: 5,
          question_description: "",
        })),
      };

    // Action for updating viva questions
    case ACTIONS.UPDATE_VIVA_QUESTION: {
      const { index, field, value } = action.payload;
      const updatedQuestions = [...state.questions];
      updatedQuestions[index] = updateQuestionField(
        updatedQuestions[index],
        field,
        value,
      );
      return { ...state, questions: updatedQuestions };
    }

    // Action for adding viva questions
    case ACTIONS.ADD_VIVA_QUESTION:
      return {
        ...state,
        questions: [
          ...state.questions,
          {
            id: `q${state.questions.length + 1}`,
            question_type: "broad",
            question_text: "",
            expected_answer: [""],
            marks: 5,
            question_description: "",
          },
        ],
      };

    // Action for setting marks
    case ACTIONS.SET_MARKS:
      const { questionId, marks } = action.payload;
      return {
        ...state,
        marksPerQuestion: {
          ...state.marksPerQuestion,
          [questionId]: parseInt(marks),
        },
      };

    // Action for setting comments
    case ACTIONS.SET_COMMENT:
      return { ...state, comments: action.payload };

    // Action for updating questions
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

    // Action for deleting questions
    case ACTIONS.DELETE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter(
          (_, index) => index !== action.payload,
        ),
      };
    default:
      return state;
  }
}
