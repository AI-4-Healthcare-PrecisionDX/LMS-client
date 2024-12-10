"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import useFileUpload from "@/hooks/use-upload";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { toast } from "sonner";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { CourseMaterial, TemplateCourse } from "./types";

interface CourseMaterielsProps {
  templateCourse: TemplateCourse;
}

export function CourseMateriels({ templateCourse }: CourseMaterielsProps) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<CourseMaterial | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const { getLibraryFileForCourseByLibraryID } = useFileUpload();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleMaterialClick = async (material: CourseMaterial) => {
    setSelectedMaterial(material);
    setIsLoadingPdf(true);
    try {
      const url = await getLibraryFileForCourseByLibraryID(
        material.library_item.library_id,
      );
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

  const renderMaterialList = () => (
    <div className="w-full pr-4">
      {templateCourse.course_materials.map((material: CourseMaterial) => (
        <div
          key={material.library_item.library_id}
          className="flex items-center p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <svg
                className="h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {material.library_item.material_title}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{material.library_item.material_type}</span>
                  <span>•</span>
                  <span>By {material.library_item.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(
                      material.library_item.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="ml-4"
            onClick={() => handleMaterialClick(material)}
          >
            View
          </Button>
        </div>
      ))}
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-[600px]">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="ml-2">Loading PDF...</p>
    </div>
  );

  const renderPdfViewer = () => (
    <div className="h-[600px]">
      <Viewer fileUrl={pdfUrl || ""} plugins={[defaultLayoutPluginInstance]} />
    </div>
  );

  return (
    <>
      <div className="flex-1">{renderMaterialList()}</div>

      {/* PDF Viewer Dialog */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="w-screen h-screen max-w-none m-0 p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedMaterial?.library_item.material_type}
            </DialogTitle>
            <DialogDescription>
              {selectedMaterial?.library_item.material_title}
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
