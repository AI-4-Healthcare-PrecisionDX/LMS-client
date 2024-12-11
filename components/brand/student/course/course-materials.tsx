"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import useFileUpload from "@/hooks/use-upload";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { toast } from "sonner";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { CourseMaterial } from "./types";

interface CourseMaterielsProps {
  courseMaterials: CourseMaterial[];
}

export function CourseMateriels({ courseMaterials }: CourseMaterielsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<CourseMaterial | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const { getLibraryFileByLibraryID } = useFileUpload();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleMaterialClick = async (material: CourseMaterial) => {
    setSelectedMaterial(material);
    setIsLoadingPdf(true);
    try {
      const url = await getLibraryFileByLibraryID(
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
    <ScrollArea className="max-h-[500px] w-full pr-4">
      {courseMaterials.map((material) => (
        <div key={material.library_item.library_id} className="flex mb-2 gap-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleMaterialClick(material)}
          >
            {material.library_item.material_title}
          </Button>
        </div>
      ))}
    </ScrollArea>
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">View Course Materials</Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] h-[90vh] max-w-none m-0 p-6">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <DialogHeader>
                <DialogTitle>Course Materials</DialogTitle>
                <DialogDescription>
                  Click on a material to view or download it.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex-1">{renderMaterialList()}</div>
          </div>
        </DialogContent>
      </Dialog>

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
