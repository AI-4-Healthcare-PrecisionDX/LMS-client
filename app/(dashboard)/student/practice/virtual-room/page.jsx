"use client";
import React, { useState, useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { VolumeUpIcon } from "@heroicons/react/outline";
import DecisionPoint from "@/components/brand/student/virtual-room/decision-points";
import {
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUp,
  CirclePlay,
  Mic,
  Send,
  Square,
} from "lucide-react"; // Import the Mic icon from lucide-react
import DoctorNote from "@/components/brand/student/virtual-room/doctor-note";
import { TourProvider, useTour } from "@reactour/tour";
import CaseFloatingMOdal from "@/components/brand/student/practice/CaseFloatingModal";

const dummyAIResponses = [
  "Sure, I've been having these terrible headaches for about two years now. They're always on one side of my head, and they come with nausea and this awful sensitivity to light. It gets so bad sometimes that I have to just sit in a dark room.",
  "Well, I first noticed them after I started a new job that was pretty stressful. But back then, they were just occasional. Over the last year or so, they've been getting more frequent—about twice a month now.",
  "Yes, stress is a big one, and sometimes if I don't get enough sleep, it seems to make them worse. I've also noticed that if I have a glass of wine, it can sometimes trigger a headache the next day.",
  "Yes, sometimes I get blurry vision or see little zigzag lines about 30 minutes before the pain hits.",
  "I've tried over-the-counter pain meds like ibuprofen, but they don't do much. Sometimes they dull the pain a little, but I still feel miserable for hours.",
  "That would be great. I just want to stop them from getting worse.",
  "I can definitely try that. I think tracking them would help me understand what's going on better.",
  " I'm okay with getting the blood tests done to rule out anything else. I'll let you know if anything changes with my symptoms or if the headaches become more frequent. Thank you for being thorough!",
  "Thank you so much! I hope so too. I'll follow your advice and look forward to feeling better soon.",
];

const patientCase = {
  id: 1,
  caseNumber: "C004",
  date: "2023-06-01",
  patientName: "Sarah Collins",
  age: 34,
  gender: "Female",
  chiefComplaint: "Recurrent severe headaches",
  description:
    "Sarah reports experiencing severe, throbbing headaches on one side of her head for the past two years. The pain is often accompanied by nausea, sensitivity to light, and occasionally blurred vision. The headaches occur about twice a month, lasting 6-12 hours, and are often triggered by stress or lack of sleep. She rates the pain as 9/10 during episodes. Over-the-counter pain medications provide minimal relief.",
  physicalExamFindings:
    "Vital Signs: BP 150/90, HR 98, RR 20, Temp 37.2°C, SpO2 97% on room air. General: Patient appears uncomfortable and anxious. Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops. Lungs: Clear to auscultation bilaterally. No wheezes or crackles. Abdomen: Soft, non-tender, non-distended. Extremities: No edema, pulses equal bilaterally.",
};

const testReports = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    date: "2023-06-10",
    result: "Within normal ranges",
  },
  {
    id: 2,
    name: "Thyroid Function Test",
    date: "2023-06-10",
    result: "TSH: 2.5 mIU/L (Normal)",
  },
  {
    id: 3,
    name: "Vitamin D Level",
    date: "2023-06-10",
    result: "25 ng/mL (Insufficient)",
  },
  {
    id: 4,
    name: "MRI Brain Scan",
    date: "2023-06-15",
    result: "No structural abnormalities detected",
  },
  {
    id: 5,
    name: "Electroencephalogram (EEG)",
    date: "2023-06-20",
    result: "Normal brain wave patterns",
  },
];

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

const SpeechBubble = ({ message }) => (
  <div
    className={`bg-white max-w-[200px] max-h-[100px] overflow-y-auto p-2 rounded-lg shadow-md text-md dark:bg-gray-600 dark:text-white`}
  >
    {message}
  </div>
);

function MedicalConsultation() {
  const textareaRef = useRef(null);
  const [start, setStart] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [doctorMessage, setDoctorMessage] = useState("");
  const [doctorInput, setDoctorInput] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [responseIndex, setResponseIndex] = useState(0);
  const [showDoctorInput, setShowDoctorInput] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [patientVitals, setPatientVitals] = useState({
    heartRate: "72 bpm",
    bloodPressure: "120/80 mmHg",
    temperature: "98.6°F",
    oxygenSaturation: "98%",
  });
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const [audioData, setAudioData] = useState([]);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const [patientExpression, setPatientExpression] = useState("sick");
  const [isStreaming, setIsStreaming] = useState(false);
  const { setIsOpen } = useTour();
  if (typeof window !== "undefined") {
    if (localStorage.getItem("virtualRoomTour") === null) {
      localStorage.setItem("virtualRoomTour", "true");
      setIsOpen(true);
    }
  }

  const handleDoctorInput = (e) => {
    setDoctorInput(e.target.value);
  };

  const sendDoctorMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isRecording) return;
      if (doctorInput.trim() === "") return;
      setDoctorInput((prevInput) => prevInput + " " + transcript);
      setDoctorMessage(doctorInput);
      setDoctorInput("");
      setShowDoctorInput(false);
      streamAIResponse();
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopRecording();
    }
  };

  const streamAIResponse = () => {
    setIsStreaming(true);
    setAiResponse("");
    const response = dummyAIResponses[responseIndex];
    let index = -1;

    // Create a new SpeechSynthesisUtterance instance
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.rate = 0.9; // Slightly slow down the speech rate
    setSpeechSynthesis(utterance);

    // Text streaming
    const streamText = () => {
      const textIntervalId = setInterval(() => {
        if (index < response.length - 1) {
          setAiResponse((prev) => prev + response[index]);
          index++;
        } else {
          clearInterval(textIntervalId);
        }
      }, 50);
    };

    // Expression changing
    const changeExpression = () => {
      let expressionChangeCounter = 0;
      const expressionIntervalId = setInterval(() => {
        expressionChangeCounter++;
        if (expressionChangeCounter % 3 === 0) {
          setPatientExpression((prev) => {
            if (prev === "sick") return "shut";
            if (prev === "shut") return "sick";
            return "sick";
          });
        }
      }, 50);

      return expressionIntervalId;
    };

    // Start text streaming
    streamText();

    // Start expression changes
    const expressionIntervalId = changeExpression();

    // Start speaking
    window.speechSynthesis.speak(utterance);

    // Handle speech end
    utterance.onend = () => {
      setSpeechSynthesis(null);
      clearInterval(expressionIntervalId);
      setIsStreaming(false);
      setShowDoctorInput(true);
      setDoctorMessage("");
      setPatientExpression("sick");
      setResponseIndex(
        (prevIndex) => (prevIndex + 1) % dummyAIResponses.length,
      );
    };
  };
  const pauseResumeSpeech = () => {
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeechSynthesis(null);
  };

  const handleDoctorClick = () => {
    if (showDoctorInput) {
      setShowDoctorInput(false);
      return;
    }
    setStart(true);
    setShowDoctorInput(true);
    setDoctorMessage("");
  };

  const sendDoctorInput = () => {
    if (isRecording) return;
    if (doctorInput.trim() === "") return;
    setDoctorMessage(doctorInput);
    setDoctorInput("");
    setShowDoctorInput(false);
    streamAIResponse();
    setIsRecording(false);
    stopRecording();
  };

  const handleDiagnosisInput = (e) => {
    setDiagnosis(e.target.value);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);
      drawWaveform();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setDoctorInput((prev) => prev + " " + transcript);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      cancelAnimationFrame(animationRef.current);

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Stop all tracks on the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }
    }
  };

  const drawWaveform = () => {
    if (!analyserRef.current) return;

    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyserRef.current.getByteTimeDomainData(dataArray);
      setAudioData([...dataArray]);
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        stopRecording();
      };
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showDoctorInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showDoctorInput]);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <p>
          You can click Start/Continue conversation or Doctor Image to interact
          with Virtual Patient
        </p>
        <Button
          onClick={() => setIsOpen(true)}
          className="start-tour"
          variant="outline"
        >
          <CirclePlay />
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-2 py-2">
        <div className="col-span-8 ">
          <Card
            className="flex-1"
            style={{
              backgroundImage: "url('/assets/bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <CardContent className="h-[65vh] flex items-end justify-center p-2">
              <div className="flex flex-col items-center justify-between">
                {aiResponse && <SpeechBubble message={aiResponse} />}
                <Image
                  src={
                    isStreaming
                      ? `/assets/patient_${patientExpression}.png`
                      : "/assets/patient_sick.png"
                  }
                  width={200}
                  height={200}
                  alt="Patient"
                />
              </div>
              <div>
                <Image
                  src="/assets/table.png"
                  width={150}
                  height={150}
                  alt="Table"
                />
              </div>
              <div className="flex flex-col items-center justify-between">
                {doctorMessage && <SpeechBubble message={doctorMessage} />}
                {showDoctorInput && !isStreaming && start && (
                  <div className="flex flex-col items-center w-full gap-1 mb-2">
                    <Textarea
                      ref={textareaRef}
                      className="max-w-[200px] flex-grow p-2 rounded border bg-white text-gray-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={doctorInput}
                      onChange={handleDoctorInput}
                      onKeyPress={sendDoctorMessage}
                      placeholder="Type your message and press Enter..."
                      maxRows={3}
                      rows={3}
                      style={{ resize: "none" }}
                    />
                    <div className="max-w-[200px] flex items-center gap-1">
                      {isRecording ? (
                        <Square
                          size={30}
                          className="text-red-500 cursor-pointer"
                          onClick={stopRecording}
                        />
                      ) : (
                        <Mic
                          size={30}
                          className="text-blue-500 cursor-pointer mic-input"
                          onClick={startRecording}
                        />
                      )}

                      <svg viewBox="0 0 256 64" className="w-full space-x-1">
                        <path
                          d={`M 0 32 ${
                            audioData && audioData.length > 0
                              ? audioData
                                  .map(
                                    (value, index) =>
                                      `L ${index * 2} ${32 - (value - 128) / 4}`,
                                  )
                                  .join(" ")
                              : `L 512 32`
                          }`}
                          fill="none"
                          stroke="blue"
                          strokeWidth="1"
                        />
                      </svg>

                      <Send
                        size={30}
                        className={
                          doctorInput.trim() === ""
                            ? "disabled text-green-300 send-button"
                            : "text-green-500 cursor-pointer send-button"
                        }
                        onClick={sendDoctorInput}
                      />
                    </div>
                  </div>
                )}
                <Image
                  src="/assets/doctor_sitting.png"
                  width={200}
                  height={200}
                  alt="Doctor"
                  className={`scale-x-[-1] doctor-input ${isStreaming ? "" : "cursor-pointer"}`}
                  onClick={isStreaming ? undefined : handleDoctorClick}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={`mx-auto dark:text-white ${isStreaming ? "disabled:opacity-50 animate-pulse" : ""}`}
                onClick={isStreaming ? undefined : handleDoctorClick}
                disabled={isStreaming}
              >
                {start ? "Continue Conversation" : "Start Conversation"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-4 ">
          <Card className="flex-1 patient-vitals">
            <CardHeader>
              <h2 className="text-lg font-bold">Patient Medical Condition</h2>
            </CardHeader>
            <CardContent>
              <ul>
                {Object.entries(patientVitals).map(([key, value]) => (
                  <li key={key} className="mb-1">
                    <span className="font-semibold">{key}:</span> {value}
                  </li>
                ))}
              </ul>
              <CaseFloatingMOdal
                patientCase={patientCase}
                testReports={testReports}
              />
            </CardContent>
          </Card>
          <DoctorNote />
        </div>
      </div>
      <DecisionPoint />
    </div>
  );
}

export default function MedicalConsultationTour() {
  const handleNextStep = ({
    currentStep,
    stepsLength,
    setIsOpen,
    setCurrentStep,
  }) => {
    const currentSelector = steps[currentStep].selector;
    const elementToClick = document.querySelector(currentSelector);
    const clickableSteps = [1];
    if (clickableSteps.includes(currentStep) && elementToClick) {
      elementToClick.click();
    }

    const last = currentStep === stepsLength - 1;
    if (last) {
      setIsOpen(false);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };
  const handlePrevStep = ({ currentStep, setCurrentStep }) => {
    const first = currentStep === 0;
    if (!first) {
      setCurrentStep((s) => s - 1);
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
      <MedicalConsultation />
    </TourProvider>
  );
}
