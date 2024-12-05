"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios-config";
import { AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MaterialView } from "./MaterialUpload";
import QuestionCard from "./QuestionCard";
import QuestionTypeButtons from "./QuestionTypeButtons";

export default function QuestionsList({ state, dispatch, category }) {
  const [pdfs, setPDFs] = useState([]);
  // console.log(
  //   "state.editingAssignment.assignment_materials",
  //   state.editingAssignment.assignment_materials,
  // );
  useEffect(() => {
    // Load existing PDFs when editing
    const loadExistingPDFs = async () => {
      if (state.editingAssignment?.assignment_materials?.length > 0) {
        try {
          const existingPDFs = await Promise.all(
            state.editingAssignment.assignment_materials.map(
              async (material) => {
                // Extract the library_item_id from the material object
                const materialId = material.library_item_id;

                try {
                  const response = await api.get(
                    `/utils/library/${materialId}`,
                  );
                  return {
                    library_id: materialId,
                    name: response.data.material_title,
                    file_url: response.data.file_url,
                  };
                } catch (error) {
                  console.error(`Error fetching PDF ${materialId}:`, error);
                  toast.error("Failed to load some existing materials");
                  return null;
                }
              },
            ),
          );

          // Filter out any failed fetches
          const validPDFs = existingPDFs.filter((pdf) => pdf !== null);
          console.log("existingPDFs", validPDFs);

          setPDFs(validPDFs);
          // Also update the materials in the state
          dispatch({
            type: "SET_MATERIALS",
            payload: validPDFs,
          });
        } catch (error) {
          console.error("Error loading existing PDFs:", error);
          toast.error("Failed to load some existing materials");
        }
      }
    };

    if (state.editingAssignment) {
      loadExistingPDFs();
    }
  }, [state.editingAssignment]);

  const questions = state.questions || [];
  const totalMarks = questions.reduce(
    (sum, q) => sum + (parseInt(q.marks) || 0),
    0,
  );

  const handlePDFsChange = (newPDFs) => {
    setPDFs(newPDFs);
    // Make sure this dispatch is being called with the correct payload
    dispatch({
      type: "SET_MATERIALS",
      payload: newPDFs,
    });
    console.log("Updated PDFs:", newPDFs); // Debug log
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Pencil className="w-5 h-5 mr-2" />
            {category === "manual" ? "Questions" : "Generated Questions"}
          </div>
          {category === "manual" && <QuestionTypeButtons dispatch={dispatch} />}
          <div className="flex gap-3">
            <Badge variant="outline" className="px-4 py-2">
              {totalMarks} Total marks
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              {questions.length} Questions
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MaterialView
          pdfs={pdfs}
          onPDFsChange={handlePDFsChange}
          isEditing={!!state.editingAssignment}
        />
        <ScrollArea className="h-[600px] pr-4">
          <AnimatePresence>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id || index}
                question={question}
                index={index}
                onUpdate={(index, field, value) =>
                  dispatch({
                    type: "UPDATE_QUESTION",
                    payload: { index, field, value },
                  })
                }
                onDelete={() =>
                  dispatch({
                    type: "DELETE_QUESTION",
                    payload: index,
                  })
                }
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
