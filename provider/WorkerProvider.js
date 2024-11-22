"use client";

import packageJson from "../package.json";
import { Worker } from "@react-pdf-viewer/core";

const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

export default function WorkerProvider({ children }) {
  return (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
    >
      {children}
    </Worker>
  );
}
