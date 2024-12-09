import { Assignment, Section } from "./types";

// State management
type State = {
  section: Section | null;
  selectedAssignment: Assignment | null;
};

type Action =
  | { type: "SET_SECTION"; payload: Section }
  | { type: "SET_SELECTED_ASSIGNMENT"; payload: Assignment | null };

export const initialState: State = {
  section: null,
  selectedAssignment: null,
};

export function courseReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SECTION":
      return { ...state, section: action.payload };
    case "SET_SELECTED_ASSIGNMENT":
      return { ...state, selectedAssignment: action.payload };
    default:
      return state;
  }
}
