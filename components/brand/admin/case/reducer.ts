import { caseAction, caseState } from "./types";

export const caseReducer = (
  state: caseState,
  action: caseAction,
): caseState => {
  switch (action.type) {
    case "SET_CASES":
      return { ...state, cases: action.payload };
    case "SET_EDITING":
      return { ...state, editingId: action.payload };
    case "SET_FORM_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "RESET_FORM":
      return {
        ...state,
        formData: {
          scenario: {
            scenario_title: "",
            patient_name: "",
            patient_age: "",
            patient_gender: "male",
            patient_chief_complaint: "",
            detailed_description: "",
            conversation_example: [],
            scenario_id: "",
          },
          scenario_examination_findings: {
            vital_signs: "",
            general_appearance: "",
            cardiovascular_findings: "",
            lungs_findings: "",
            additional_findings: "",
          },
        },
        editingId: null,
        errors: {},
      };
    default:
      return state;
  }
};
