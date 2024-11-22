"use client";

import { useState, useRef } from "react";
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
import { Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/axios-config";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFileUpload from "@/hooks/use-upload";
import { toast } from "sonner";

interface CourseMaterial {
  library_item_id: string;
}

interface CourseMaterielsProps {
  courseMaterials: CourseMaterial[];
  courseID: string;
}

export function CourseMateriels({
  courseMaterials,
  courseID,
}: CourseMaterielsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<CourseMaterial | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { getLibraryFileByLibraryID, uploadFile } = useFileUpload();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: signedUrl,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ["signedUrl", selectedMaterial?.library_item_id],
    queryFn: () => getLibraryFileByLibraryID(selectedMaterial!.library_item_id),
    enabled: !!selectedMaterial,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadFile({
        pdfFile: file,
        materialType: "Lecture",
        materialTitle: file.name,
        visibility: false,
        author: user?.first_name + " " + user?.last_name,
      });
      await api.put(`/course/${courseID}`, {
        course_materials: [
          ...courseMaterials.map((material) => material.library_item_id),
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

  const handleMaterialClick = (material: CourseMaterial) => {
    setSelectedMaterial(material);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      uploadMutation.mutate(file);
    } else {
      toast.info("File must be a pdf");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Course Materials</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Upload New Material <Upload className="h-4 w-4 ml-2" />
        </Button>
        <Input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <DialogHeader>
          <DialogTitle>Course Materials</DialogTitle>
          <DialogDescription>
            Click on a material to view or download it.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] w-full pr-4">
          {courseMaterials.map((material) => (
            <Button
              key={material.library_item_id}
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => handleMaterialClick(material)}
            >
              {material.library_item_id}
            </Button>
          ))}
        </ScrollArea>
        {isFetching && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {fetchError && (
          <p className="text-sm text-red-500 mt-2">
            Failed to fetch signed URL
          </p>
        )}
        {signedUrl && (
          <div className="mt-4">
            <object
              data={signedUrl.file_url}
              type="application/pdf"
              className="w-full h-[400px]"
              aria-label="Course Material"
            >
              <p>
                Your browser does not support PDFs.{" "}
                <a href={signedUrl.file_url}>Download the PDF</a>.
              </p>
            </object>
          </div>
        )}
        {uploadMutation.isPending && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {uploadMutation.isError && (
          <p className="text-sm text-red-500 mt-2">Failed to upload file</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
