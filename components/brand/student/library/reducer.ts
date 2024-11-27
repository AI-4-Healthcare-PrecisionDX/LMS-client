import { addEntryToToc, deleteEntriesFromToc, updateEntryInToc } from "./lib";
import { Action, State } from "./types";

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TOC":
      return { ...state, toc: action.payload };
    case "SET_FILE_NAME":
      return { ...state, fileName: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "TOGGLE_EXPAND":
      return {
        ...state,
        expandedItems: {
          ...state.expandedItems,
          [action.payload]: !state.expandedItems[action.payload],
        },
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload };
    case "SET_JSON_DATA":
      return { ...state, jsonData: action.payload };
    case "SET_API_RESPONSE":
      return { ...state, apiResponse: action.payload };
    case "ADD_ENTRY":
      return {
        ...state,
        toc: addEntryToToc(
          state.toc,
          action.payload.parentId,
          action.payload.newEntry,
        ),
      };
    case "UPDATE_ENTRY":
      return {
        ...state,
        toc: updateEntryInToc(
          state.toc,
          action.payload.id,
          action.payload.field,
          action.payload.value,
        ),
      };
    case "DELETE_ENTRIES":
      return {
        ...state,
        toc: deleteEntriesFromToc(state.toc, action.payload),
        selectedItems: [],
      };
    case "SET_IS_PRIVATE":
      return { ...state, isPrivate: action.payload };
    default:
      return state;
  }
}
