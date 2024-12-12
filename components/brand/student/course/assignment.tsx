import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFileUpload from "@/hooks/use-upload";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { format } from "date-fns";
import { CalendarIcon, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Assignment, AssignmentMaterial } from "./types";

interface AssignmentDialogState {
  type: "materials" | "assignment" | null;
  assignment: Assignment | null;
  answers: { [key: string]: string };
  submitted: boolean;
}

export default function AssignmentSection({
  assignments,
}: {
  assignments: Assignment[];
}) {
  const [dialogState, setDialogState] = useState<AssignmentDialogState>({
    type: null,
    assignment: null,
    answers: {},
    submitted: false,
  });
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<AssignmentMaterial | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const { getLibraryFileByLibraryID } = useFileUpload();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const resetDialog = () => {
    setDialogState({
      type: null,
      assignment: null,
      answers: {},
      submitted: false,
    });
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setDialogState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleMaterialClick = async (material: AssignmentMaterial) => {
    setSelectedMaterial(material);
    setIsLoadingPdf(true);
    try {
      const url = await getLibraryFileByLibraryID(material.library_item_id);
      setPdfUrl(url);
      setIsPdfOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to load material");
      setSelectedMaterial(null);
      setPdfUrl(null);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="ml-2">Loading PDF...</p>
    </div>
  );

  const renderPdfViewer = () => (
    <div className="h-[90vh]">
      <Viewer fileUrl={pdfUrl || ""} plugins={[defaultLayoutPluginInstance]} />
    </div>
  );

  const handleSubmit = () => {
    setDialogState((prev) => ({ ...prev, submitted: true }));
  };

  const handleClose = () => {
    if (Object.keys(dialogState.answers).length > 0 && !dialogState.submitted) {
      if (
        window.confirm(
          "You have unsaved answers. Are you sure you want to close?",
        )
      ) {
        resetDialog();
      }
    } else {
      resetDialog();
    }
  };

  return (
    <>
      {assignments.map((assignment) => (
        <Card
          key={assignment.assignment_id}
          className="hover:shadow-lg transition-shadow dark:border-gray-800"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold dark:text-gray-100">
                    {assignment.assignment_title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      Due {format(new Date(assignment.deadline), "PPP")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="ml-4 dark:border-gray-700 dark:hover:bg-gray-800"
                  onClick={() =>
                    setDialogState({
                      type: "assignment",
                      assignment,
                      answers: {},
                      submitted: false,
                    })
                  }
                >
                  Take Assignment
                </Button>
                {assignment.assignment_materials.length > 0 && (
                  <Button
                    variant="outline"
                    className="ml-2 dark:border-gray-700 dark:hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDialogState({
                        type: "materials",
                        assignment,
                        answers: {},
                        submitted: false,
                      });
                    }}
                  >
                    View Materials
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
              {assignment.assignment_description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-sm text-muted-foreground dark:text-gray-400">
                Pending
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={dialogState.type === "materials"}
        onOpenChange={() => resetDialog()}
      >
        <DialogContent className="max-w-2xl dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              Assignment Materials
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {dialogState.assignment?.assignment_materials.map(
              (material: AssignmentMaterial) => (
                <Card
                  key={material.assignment_material_id}
                  className="dark:border-gray-800"
                >
                  {material.library_item_id && (
                    <div className="flex items-center justify-between rounded-lg border dark:border-gray-700 p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium dark:text-gray-300">
                          {material.library_item_id || "Download PDF"}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="dark:border-gray-700 dark:hover:bg-gray-800"
                        onClick={() => handleMaterialClick(material)}
                      >
                        View Material
                      </Button>
                    </div>
                  )}
                </Card>
              ),
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogState.type === "assignment"}
        onOpenChange={handleClose}
      >
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen overflow-y-auto dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              {dialogState.assignment?.assignment_title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
                    Start Date
                  </span>
                  <span className="text-sm font-medium dark:text-gray-200">
                    {dialogState.assignment &&
                      format(
                        new Date(dialogState.assignment.start_time),
                        "PPP",
                      )}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dialogState.assignment &&
                      format(new Date(dialogState.assignment.start_time), "pp")}
                  </span>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
                    Due Date
                  </span>
                  <span className="text-sm font-medium dark:text-gray-200">
                    {dialogState.assignment &&
                      format(new Date(dialogState.assignment.deadline), "PPP")}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dialogState.assignment &&
                      format(new Date(dialogState.assignment.deadline), "pp")}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium dark:text-gray-100">
                {dialogState.assignment?.assignment_description &&
                  "Description"}
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                {dialogState.assignment?.assignment_description}
              </p>
            </div>

            <div className="space-y-6">
              {dialogState.assignment?.assignment_questions.map(
                (question, index) => (
                  <div
                    key={question.assignment_question_id}
                    className="p-4 border dark:border-gray-700 rounded-lg space-y-4"
                  >
                    <div className="space-y-2">
                      <p className="font-medium dark:text-gray-100">
                        Question {index + 1}: {question.question_text}
                        <span className="text-sm text-muted-foreground dark:text-gray-400 ml-2">
                          ({question.marks} marks)
                        </span>
                      </p>
                      {question.question_description && (
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          {question.question_description}
                        </p>
                      )}
                    </div>

                    {question.options_for_mcq.length > 0 ? (
                      <div className="space-y-2">
                        {question.options_for_mcq.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              disabled={dialogState.submitted}
                              id={`${question.assignment_question_id}-${optionIndex}`}
                              value={option}
                              checked={dialogState.answers[
                                question.assignment_question_id
                              ]?.includes(option)}
                              onChange={(e) => {
                                const currentAnswers = dialogState.answers[
                                  question.assignment_question_id
                                ]
                                  ? dialogState.answers[
                                      question.assignment_question_id
                                    ].split(",")
                                  : [];

                                let newAnswers;
                                if (e.target.checked) {
                                  newAnswers = [...currentAnswers, option];
                                } else {
                                  newAnswers = currentAnswers.filter(
                                    (ans) => ans !== option,
                                  );
                                }

                                handleAnswerChange(
                                  question.assignment_question_id,
                                  newAnswers.join(","),
                                );
                              }}
                              className="dark:border-gray-600"
                            />
                            <Label
                              htmlFor={`${question.assignment_question_id}-${optionIndex}`}
                              className="dark:text-gray-300"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Textarea
                        disabled={dialogState.submitted}
                        placeholder="Enter your answer here..."
                        value={
                          dialogState.answers[
                            question.assignment_question_id
                          ] || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            question.assignment_question_id,
                            e.target.value,
                          )
                        }
                        className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      />
                    )}
                  </div>
                ),
              )}
            </div>

            <DialogFooter>
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    {dialogState.submitted ? "Submitted" : "In Progress"}
                  </span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={dialogState.submitted}
                  className="dark:hover:bg-primary/90"
                >
                  {dialogState.submitted ? "Submitted" : "Submit Assignment"}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="w-screen h-screen max-w-none m-0 p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedMaterial?.title || selectedMaterial?.library_item_id}
            </DialogTitle>
            <DialogDescription>
              {selectedMaterial?.library_item_id}
            </DialogDescription>
          </DialogHeader>
          {isLoadingPdf ? (
            renderLoadingState()
          ) : pdfUrl ? (
            renderPdfViewer()
          ) : (
            <p>No PDF available</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
