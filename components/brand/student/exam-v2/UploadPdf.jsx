"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
const TOC = dynamic(() => import("@/components/brand/student/TOC"), {
  ssr: false,
});
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UploadContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="dark:text-white upload-content-button">
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] h-full p-0 sm:max-w-none sm:max-h-none sm:p-4">
        <ScrollArea>
          <TOC />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
