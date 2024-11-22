"use client";

import api from "@/lib/axios-config";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function View() {
  const params = useParams();
  const id = params?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/utils/library_course_section/file/${id}`,
        );
        const pdfData = response.data;
        console.log(pdfData);
        const proxyUrl = `/teacher/api/getPdf?url=${encodeURIComponent(pdfData.file_url)}`;
        setPdfUrl(proxyUrl);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Failed to load PDF file");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPDF();
    }
  }, [id]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-screen w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      ) : pdfUrl ? (
        <div className="h-full">
          <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>No PDF file available</p>
        </div>
      )}
    </div>
  );
}
