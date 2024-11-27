"use client";
export const runtime = "edge";
import api from "@/lib/axios-config";
import { useParams } from "next/navigation";
import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

// Set the worker for pdf.js (use a CDN or local path)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function View() {
  const params = useParams();
  const id = params?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    const fetchPDF = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch the PDF URL from your API
        const response = await api.get(
          `/utils/library_course_section/file/${id}`,
        );
        const pdfData = response.data;
        const pdfFileUrl = pdfData.file_url;

        // Use PDF.js to load the PDF
        const pdf = await pdfjsLib.getDocument(pdfFileUrl).promise;

        // Render the first page of the PDF (you can modify this to render multiple pages)
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (canvas && context) {
          const viewport = page.getViewport({ scale: 1.5 }); // You can adjust the scale for zoom
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render the page on the canvas
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          setPdfUrl(pdfFileUrl); // Set the PDF URL if needed for any other logic
        }
      } catch (err) {
        console.error("Error fetching PDF:", err);
        setError("Failed to load PDF file");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPDF();
    }
  }, [id]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      ) : pdfUrl ? (
        <div className="h-full w-full overflow-auto">
          {/* Render the PDF as a canvas */}
          <canvas ref={canvasRef}></canvas>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>No PDF file available</p>
        </div>
      )}
    </div>
  );
}
