import BasicDetailsCard from "./BasicDetailsCard";
import QuestionConfigurationCard from "./QuestionConfigurationCard";

export default function AssignmentSetup({ state, dispatch, category, selectedPdf }: { state: any, dispatch: any, category: string, selectedPdf: string }) {
  return category === "manual" ? (
    <BasicDetailsCard state={state} dispatch={dispatch} category={category} />
  ) : (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
      <BasicDetailsCard state={state} dispatch={dispatch} category={category} />
      <QuestionConfigurationCard selectedPdf={selectedPdf} />
    </div>
  );
}