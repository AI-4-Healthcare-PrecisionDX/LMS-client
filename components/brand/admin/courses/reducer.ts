import { Action, State } from "./types";

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_DEPARTMENT":
      return { ...state, selectedDepartment: action.payload };
    case "SET_YEAR":
      return { ...state, selectedYear: action.payload };
    default:
      return state;
  }
}
