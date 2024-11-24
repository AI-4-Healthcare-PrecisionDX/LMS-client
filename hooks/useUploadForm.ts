import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type FormData = {
  pdf_file: File | null;
  json_file?: File | null;
  material_type: string;
  material_title: string;
  material_description?: string;
  author?: string;
  visibility: boolean;
};

type FileUploadResponse = {
  library_id: string;
  material_type: string;
  material_title: string;
  material_description?: string;
  visibility: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
};

type SectionContentResponse = {
  section_id: string;
  library_item_id: string;
  title: string;
  description: string;
  section_exclusive_content_id: string;
  user_id: string;
  library_item: {
    material_type: string;
    material_title: string;
    material_description: string;
    visibility: boolean;
    created_at: string;
    updated_at: string;
    user_id: string;
  };
};

const uploadFile = async (formData: FormData): Promise<FileUploadResponse> => {
  const body = new FormData();
  if (formData.pdf_file) {
    body.append("pdf_file", formData.pdf_file);
  }
  if (formData.json_file) {
    body.append("json_file", formData.json_file);
  }
  body.append("material_type", formData.material_type);
  body.append("material_title", formData.material_title);
  if (formData.material_description) {
    body.append("material_description", formData.material_description);
  }
  if (formData.author) {
    body.append("author", formData.author);
  }
  body.append("visibility", formData.visibility.toString());

  const response = await fetch("/v1/utils/library/file_upload", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json();
};

const uploadSectionContent = async (
  sectionId: string,
  data: { library_item_id: string; title: string; description: string }
): Promise<SectionContentResponse> => {
  const response = await fetch(`/section/${sectionId}/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      section_id: sectionId,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error("Section content upload failed");
  }

  return response.json();
};

export const useUploadForm = (sectionId: string) => {
  const [formData, setFormData] = useState<FormData>({
    pdf_file: null,
    json_file: null,
    material_type: "pdf",
    material_title: "",
    material_description: "",
    author: "",
    visibility: true,
  });

  const fileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      console.log("File upload response:", data);
    },
  });

  const sectionMutation = useMutation({
    mutationFn: (data: { library_item_id: string; title: string; description: string }) =>
      uploadSectionContent(sectionId, data),
    onSuccess: (data) => {
      console.log("Section content response:", data);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fileUploadResponse = await fileMutation.mutateAsync(formData);
      await sectionMutation.mutateAsync({
        library_item_id: fileUploadResponse.library_id,
        title: fileUploadResponse.material_title,
        description: fileUploadResponse.material_description || "",
      });
      console.log("Upload successful");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isLoading: fileMutation.isPending || sectionMutation.isPending,
    isError: fileMutation.isError || sectionMutation.isError,
  };
};