import { BasicDetailsCard } from "./BasicDetailsCard";
import QuestionConfigurationCard from "./QuestionConfigurationCard";

export default function AssignmentSetup({ state, dispatch, category }) {
  return category === "manual" ? (
    <BasicDetailsCard state={state} dispatch={dispatch} />
  ) : (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
      <BasicDetailsCard state={state} dispatch={dispatch} />
      <QuestionConfigurationCard state={state} dispatch={dispatch} />
    </div>
  );
}
