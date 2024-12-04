"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";

import api from "@/lib/axios-config";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function MaterialView({ pdfs, onPDFsChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const uploadToLibrary = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("pdf_file", file);
    formData.append("material_type", file.type);
    formData.append("material_title", file.name);

    try {
      const response = await api.post("/utils/library/file_upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? (progressEvent.loaded / progressEvent.total) * 100
            : 0;
          setUploadProgress(progress);
        },
      });

      return {
        library_id: response.data.library_id, // Make sure this matches the API response
        name: file.name,
        file_url: response.data.file_url,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true);
      setUploadProgress(0);
      const uploadedPDFs = [];
      const errors = [];

      for (const file of acceptedFiles) {
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name} exceeds 10MB limit`);
          continue;
        }

        try {
          const uploadedPdf = await uploadToLibrary(file);
          uploadedPDFs.push(uploadedPdf);
        } catch (err) {
          errors.push(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedPDFs.length > 0) {
        // Combine existing PDFs with new ones
        const updatedPDFs = [...pdfs, ...uploadedPDFs];
        onPDFsChange(updatedPDFs);
        toast.success(`Successfully uploaded ${uploadedPDFs.length} PDFs`);
      }

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
      }

      setUploading(false);
      setUploadProgress(0);
    },
    [pdfs, onPDFsChange, uploadToLibrary],
  );
  const removePDF = useCallback(
    (index) => {
      const newPDFs = [...pdfs];
      newPDFs.splice(index, 1);
      onPDFsChange(newPDFs);
      toast.success("PDF removed successfully");
    },
    [pdfs, onPDFsChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    disabled: uploading,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div>
      <Card className="mb-6 bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Upload area */}
            <div
              {...getRootProps()}
              className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400 animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF (MAX. 10MB)
                  </p>
                </>
              )}
              {uploading && (
                <Progress
                  value={uploadProgress}
                  className="h-1 w-full absolute bottom-0 rounded-b-lg"
                />
              )}
            </div>

            {/* Display PDFs */}
            <AnimatePresence>
              {pdfs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ScrollArea className="h-48 w-full rounded-md border p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pdfs.map((pdf, index) => (
                        <motion.div
                          key={pdf.library_id}
                          layout
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 group-hover:border-blue-500 transition-colors">
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => setSelectedPdf(pdf)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => removePDF(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 truncate">
                            {pdf.name}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* PDF Preview Dialog */}
      <Dialog
        open={Boolean(selectedPdf)}
        onOpenChange={() => setSelectedPdf(null)}
      >
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedPdf?.name}</DialogTitle>
          </DialogHeader>
          {selectedPdf && (
            <div className="flex flex-col items-center h-full">
              <div className="flex-1 w-full overflow-auto">
                <Document
                  file={selectedPdf.file_url}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="flex justify-center"
                >
                  <Page
                    pageNumber={pageNumber}
                    className="max-w-full"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>
              <div className="flex items-center gap-4 p-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
                  }
                  disabled={pageNumber >= (numPages || 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
