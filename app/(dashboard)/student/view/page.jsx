"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function View() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="px-12">
      <div className="h-[90vh]">
        <Viewer
          fileUrl="/pdfs/book1.pdf"
          plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </div>
  );
}
