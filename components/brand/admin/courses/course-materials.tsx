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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/axios-config";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import useFileUpload from "@/hooks/use-upload";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { CourseMaterial } from "./types";

interface CourseMaterielsProps {
  courseMaterials: CourseMaterial[];
  courseID: string;
}

export function CourseMateriels({
  courseMaterials,
  courseID,
}: CourseMaterielsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<CourseMaterial | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { getLibraryFileByLibraryID, uploadFile } = useFileUpload();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadFile({
        pdfFile: file,
        materialType: "Lecture",
        materialTitle: file.name,
        visibility: false,
        author: `${user?.first_name} ${user?.last_name}`,
      });
      await api.put(`/course/${courseID}`, {
        course_materials: [
          ...courseMaterials.map(
            (material) => material.library_item.library_id,
          ),
          response.library_id,
        ],
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Material uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      uploadMutation.mutate(file);
    } else {
      toast.info("File must be a pdf");
    }
  };

  const renderUploadButton = () => (
    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
      Upload New Material <Upload className="h-4 w-4 ml-2" />
    </Button>
  );

  const renderMaterialList = () => (
    <ScrollArea className="max-h-[500px] w-full pr-4">
      {courseMaterials.map((material) => (
        <Button
          key={material.library_item.library_id}
          variant="outline"
          className="w-full justify-start mb-2"
          onClick={() => handleMaterialClick(material)}
        >
          {material.library_item.material_title}

          <Badge variant="outline">{material.library_item.material_type}</Badge>
        </Button>
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
              <div className="flex gap-4">
                {renderUploadButton()}
                <Input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="flex-1">{renderMaterialList()}</div>

            {uploadMutation.isPending && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {uploadMutation.isError && (
              <p className="text-sm text-red-500 mt-2">Failed to upload file</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="w-screen h-screen max-w-none m-0 p-6">
          <DialogHeader>
            <DialogTitle>View PDF</DialogTitle>
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
