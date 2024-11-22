import { Action, State } from "./types";
import { filterSections } from "./utils";

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "SET_SECTIONS":
        return {
          ...state,
          sections: action.payload,
          filteredSections: action.payload,
        };
      case "SET_SEARCH_TERM":
        return {
          ...state,
          searchTerm: action.payload,
          filteredSections: filterSections(
            state.sections,
            action.payload,
            state.selectedCourse,
            state.selectedTeacher,
          ),
          currentPage: 1,
        };
      case "SET_CURRENT_PAGE":
        return { ...state, currentPage: action.payload };
      case "SET_SELECTED_COURSE":
        return {
          ...state,
          selectedCourse: action.payload,
          filteredSections: filterSections(
            state.sections,
            state.searchTerm,
            action.payload,
            state.selectedTeacher,
          ),
          currentPage: 1,
        };
      case "SET_SELECTED_TEACHER":
        return {
          ...state,
          selectedTeacher: action.payload,
          filteredSections: filterSections(
            state.sections,
            state.searchTerm,
            state.selectedCourse,
            action.payload,
          ),
          currentPage: 1,
        };
      default:
        return state;
    }
  };