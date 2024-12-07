import { Action, State } from "./types";

export const evaluationsInitialState = {
  activeTab: "overview",
};

export function evaluationsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}
