"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MoveLeft } from "lucide-react";
import { cards, questions_mcq } from "@/data";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import Link from "next/link";

const items = [
  { href: "/student", label: "Home" },
  { href: "/student/exam-v2", label: "Book List" },
  { href: "/student/exam-v2/chapter", label: "Chapter List" },
  { label: "Flashcard" },
];

const ITEMS_TO_DISPLAY = 3;

export default function Flashcard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const { theme } = useTheme();

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handlePrevious = () => {
    setCurrentCard((prev) => (prev > 0 ? prev - 1 : prev));
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentCard((prev) =>
      prev < questions_mcq.length - 1 ? prev + 1 : prev,
    );
    setIsFlipped(false);
  };

  return (
    <div className="container mx-auto px-4 pb-2">
      <div className="flex justify-between w-full items-center pt-4">
        <BreadcrumbResponsive
          items={items}
          ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
        />
        <Link href="/student/exam-v2/chapter">
          <Button variant="outline">
            <MoveLeft className="w-4 h-4 mr-2" />
            Back to Chapter List
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full mx-auto p-4 space-y-6">
        <Card
          className="w-full h-[50vh] max-w-4xl cursor-pointer relative overflow-hidden"
          onClick={handleFlip}
        >
          <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${
              isFlipped ? "opacity-0" : "opacity-100"
            }`}
          >
            <h2 className="text-2xl font-bold text-center p-6">
              {questions_mcq[currentCard].question}
            </h2>
          </div>
          <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${
              isFlipped ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-lg text-center p-6">
              {questions_mcq[currentCard].answer}
            </p>
          </div>
        </Card>

        <div className="text-center font-bold p-2 rounded">
          Click the card to flip it
        </div>

        <div className="flex justify-between items-center w-full max-w-md">
          <Button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">
            {currentCard + 1} / {questions_mcq.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={currentCard === questions_mcq.length - 1}
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
