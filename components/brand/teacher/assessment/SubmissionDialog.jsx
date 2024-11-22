import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopyIcon, DownloadIcon } from "lucide-react";
import { useEffect, useReducer } from "react";
import { ACTIONS, initialState, reducer } from "./reducer";

export default function SubmissionDialog({
  isOpen,
  onClose,
  assignment,
  students,
  onSubmitMarks,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isOpen) {
      const initialMarks = {};
      students.forEach((student) => {
        initialMarks[student.id] = state.studentMarks[student.id] || 0;
      });
      dispatch({ type: ACTIONS.SET_STUDENT_MARKS, payload: initialMarks });
    }
  }, [isOpen, students]);

  const handleMarksChange = (studentId, marks) => {
    dispatch({
      type: ACTIONS.SET_STUDENT_MARKS,
      payload: { [studentId]: marks },
    });
  };

  const handleSave = () => {
    onSubmitMarks(state.studentMarks);
    onClose();
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard!");
  };

  const handleFileDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  if (!assignment) return null;

  const totalSubmitted = students.filter((student) => student.submitted).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{`Submissions for ${assignment.name}`}</DialogTitle>
          <DialogDescription>
            {`${totalSubmitted} out of ${students.length} students have submitted.`}
            <br />
            Total Marks: {assignment.totalMarks}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex flex-col space-y-2 mb-5">
              <div className="flex justify-between items-center">
                <span>{student.studentName}</span>
                <span>{student.submitted ? "Submitted" : "Not Submitted"}</span>
                <Input
                  type="number"
                  placeholder="Marks"
                  value={state.studentMarks[student.id]}
                  onChange={(e) =>
                    handleMarksChange(student.id, e.target.value)
                  }
                  className="w-20 border rounded-md p-1"
                />
              </div>

              <div className="relative">
                <Textarea
                  value={student.submission || ""}
                  readOnly
                  disabled={!student.submitted}
                  className={`w-full p-2 border rounded-md ${
                    student.submitted ? "" : "bg-gray-200"
                  }`}
                  placeholder="No submission"
                  rows={3}
                />
                {student.submitted && (
                  <Button
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyText(student.submission)}
                  >
                    <ClipboardCopyIcon className="w-5 h-5 text-white-500" />
                  </Button>
                )}
              </div>

              {student.fileUpload && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleFileDownload(student.file)}
                    className="w-40 mt-2 p-2 rounded-md flex items-center space-x-2"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Download File</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSave}>Save Marks</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
