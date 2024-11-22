"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, FileText, Stethoscope, User, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DraggableResizableModal = ({ children, isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 400, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const savedPosition = JSON.parse(localStorage.getItem("modalPosition"));
      const savedSize = JSON.parse(localStorage.getItem("modalSize"));

      if (savedPosition) {
        setPosition(savedPosition);
      } else {
        const rect = modalRef.current.getBoundingClientRect();
        setPosition({
          x: Math.max(0, (window.innerWidth - rect.width) / 2),
          y: Math.max(0, (window.innerHeight - rect.height) / 2),
        });
      }

      if (savedSize) {
        setSize(savedSize);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem("modalPosition", JSON.stringify(position));
    localStorage.setItem("modalSize", JSON.stringify(size));
  }, [position, size]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - size.width)),
        y: Math.max(0, Math.min(newY, window.innerHeight - size.height)),
      });
    } else if (isResizing) {
      const newWidth = size.width + e.clientX - resizeStart.x;
      const newHeight = size.height + e.clientY - resizeStart.y;
      setSize({
        width: Math.max(
          300,
          Math.min(newWidth, window.innerWidth - position.x),
        ),
        height: Math.max(
          200,
          Math.min(newHeight, window.innerHeight - position.y),
        ),
      });
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 1000,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="p-4 cursor-move bg-gray-100 flex justify-between items-center dark:bg-gray-950"
      >
        <span className="font-semibold">Details (Move or Resize)</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="p-4 overflow-auto"
        style={{ height: "calc(100% - 60px)" }}
      >
        {children}
      </div>
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
        style={{
          background: "linear-gradient(135deg, transparent 50%, #718096 50%)",
        }}
      />
    </div>
  );
};

export default function CaseFloatingModal(props) {
  const { patientCase, testReports } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="dark:text-white">
        <FileText className="mr-2 h-4 w-4" /> View Details
      </Button>
      <DraggableResizableModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Tabs defaultValue="case-details">
          <TabsList>
            <TabsTrigger value="case-details">Case Details</TabsTrigger>
            <TabsTrigger value="test-report-details">
              Test Report Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="case-details">
            <h2 className="text-lg font-semibold mb-2">
              {patientCase.caseNumber} ({patientCase.date})
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Detailed information about the patient case
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center">
                  <User className="mr-2 h-4 w-4" /> Patient Information
                </h3>
                <Separator className="my-2 dark:bg-gray-500" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Name</div>
                  <div>{patientCase.patientName}</div>
                  <div>Age</div>
                  <div>{patientCase.age} years</div>
                  <div>Gender</div>
                  <div>{patientCase.gender}</div>
                </div>
              </div>
              <div>
                <h3 className="font-medium flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" /> Chief Complaint
                </h3>
                <Separator className="my-2 dark:bg-gray-500" />
                <p className="text-sm">{patientCase.chiefComplaint}</p>
              </div>
              <div>
                <h3 className="font-medium flex items-center">
                  <FileText className="mr-2 h-4 w-4" /> Description
                </h3>
                <Separator className="my-2 dark:bg-gray-500" />
                <p className="text-sm">{patientCase.description}</p>
              </div>
              <div>
                <h3 className="font-medium flex items-center">
                  <Stethoscope className="mr-2 h-4 w-4" /> Physical Examination
                  Findings
                </h3>
                <Separator className="my-2 dark:bg-gray-500" />
                <p className="text-sm">{patientCase.physicalExamFindings}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="test-report-details">
            <ul className="space-y-4">
              {testReports.map((report) => (
                <li
                  key={report.id}
                  className="flex items-start space-x-4 p-2 hover:bg-muted rounded-lg"
                >
                  <FileText className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Date: {report.date}
                    </p>
                    <p className="mt-1">{report.result}</p>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </DraggableResizableModal>
    </div>
  );
}
