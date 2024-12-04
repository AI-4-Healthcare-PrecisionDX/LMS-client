import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { TourProvider } from "@reactour/tour";
import React from "react";

const steps = [
  {
    selector: ".patient-vitals",
    content: "Here you can see the patient vitals.",
  },
  {
    selector: ".doctor-input",
    content:
      "You can click the doctor to start a conversation with virtual patient.",
  },
  {
    selector: ".mic-input",
    content:
      "You can click the microphone icon to start recording your message.",
  },
  {
    selector: ".send-button",
    content: "Also, click the send button to send your message.",
  },
  {
    selector: ".take-note",
    content: "You can take notes here.",
  },
  {
    selector: ".save-note",
    content: "Click the save button to save your notes.",
  },
  {
    selector: ".decision-points",
    content: "Here you can make your decision.",
  },
  {
    selector: ".submit-decision",
    content: "Click the submit button to submit your decision.",
  },
  {
    selector: ".start-tour",
    content: "Click the start tour button to start the tour again. Thank you!",
  },
];

export default function Tour({ children }: { children: React.ReactNode }) {
  const handleNextStep = ({
    currentStep,
    stepsLength,
    setIsOpen,
    setCurrentStep,
  }: {
    currentStep: number;
    stepsLength: number;
    setIsOpen: (isOpen: boolean) => void;
    setCurrentStep: (callback: (prevStep: number) => number) => void;
  }) => {
    const currentSelector = steps[currentStep].selector;
    const elementToClick = document.querySelector(currentSelector);
    const clickableSteps = [1];
    if (
      clickableSteps.includes(currentStep) &&
      elementToClick instanceof HTMLElement
    ) {
      elementToClick.click();
    }

    const last = currentStep === stepsLength - 1;
    if (last) {
      setIsOpen(false);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };
  const handlePrevStep = ({
    currentStep,
    setCurrentStep,
  }: {
    currentStep: number;
    setCurrentStep: (callback: (prevStep: number) => number) => void;
  }) => {
    const first = currentStep === 0;
    if (!first) {
      setCurrentStep((s: number) => s - 1);
    }
  };
  return (
    <TourProvider
      steps={steps}
      disableDotsNavigation
      scrollSmooth
      onClickHighlighted={(e) => {
        e.stopPropagation();
      }}
      disableInteraction
      prevButton={({ currentStep, setCurrentStep }) => (
        <button
          onClick={() => handlePrevStep({ currentStep, setCurrentStep })}
          disabled={currentStep === 0}
          className="disabled:opacity-50"
        >
          <ChevronLeftIcon />
        </button>
      )}
      nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => (
        <button
          onClick={() =>
            handleNextStep({
              currentStep,
              stepsLength,
              setIsOpen,
              setCurrentStep,
            })
          }
          disabled={currentStep === stepsLength - 1}
          className="disabled:opacity-50"
        >
          <ChevronRightIcon />
        </button>
      )}
    >
      {children}
    </TourProvider>
  );
}
