/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export const runtime = "edge";
import PatientInfo from "@/components/brand/student/practice/PatientInfoCard";
import Tour from "@/components/brand/student/practice/Tour";
import DecisionPoint from "@/components/brand/student/virtual-room/decision-points";
import DoctorNote from "@/components/brand/student/virtual-room/doctor-note";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTour } from "@reactour/tour";
import { useMutation } from "@tanstack/react-query";
import { CirclePlay, Mic, Send, Square } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useReducer, useRef } from "react";
import { toast } from "sonner";

// Components
const SpeechBubble = ({ message }: { message: string }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.scrollTop = bubbleRef.current.scrollHeight;
    }
  }, [message]);

  return (
    <div
      ref={bubbleRef}
      className={`bg-white max-w-[300px] max-h-[150px] overflow-y-auto p-4 rounded-2xl shadow-lg text-md dark:bg-gray-800 dark:text-white relative ${
        message.startsWith("Doctor:") ? "" : "animate-typing"
      }`}
      style={{
        borderTopLeftRadius: "0",
      }}
    >
      <div className="absolute -left-2 -top-2 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45" />
      <p className="whitespace-pre-wrap break-words leading-relaxed">
        {message}
      </p>
      <style>{`
        @keyframes typing {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }
        .animate-typing {
          animation: typing 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Types
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
  error?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
}

interface State {
  start: boolean;
  aiResponse: string;
  doctorMessage: string;
  doctorInput: string;
  showDoctorInput: boolean;
  speechSynthesis: any;
  isRecording: boolean;
  transcript: string;
  audioData: any[];
  patientExpression: string;
  isStreaming: boolean;
}

type Action =
  | { type: "SET_START"; payload: boolean }
  | { type: "SET_AI_RESPONSE"; payload: string }
  | { type: "SET_DOCTOR_MESSAGE"; payload: string }
  | { type: "SET_DOCTOR_INPUT"; payload: string }
  | { type: "SET_SHOW_DOCTOR_INPUT"; payload: boolean }
  | { type: "SET_SPEECH_SYNTHESIS"; payload: any }
  | { type: "SET_IS_RECORDING"; payload: boolean }
  | { type: "SET_TRANSCRIPT"; payload: string }
  | { type: "SET_AUDIO_DATA"; payload: any[] }
  | { type: "SET_PATIENT_EXPRESSION"; payload: string }
  | { type: "SET_IS_STREAMING"; payload: boolean }
  | { type: "RESET_DOCTOR_INPUT" }
  | { type: "RESET_CONVERSATION" };

const initialState: State = {
  start: false,
  aiResponse: "",
  doctorMessage: "",
  doctorInput: "",
  showDoctorInput: false,
  speechSynthesis: null,
  isRecording: false,
  transcript: "",
  audioData: [],
  patientExpression: "sick",
  isStreaming: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_START":
      return { ...state, start: action.payload };
    case "SET_AI_RESPONSE":
      return { ...state, aiResponse: action.payload };
    case "SET_DOCTOR_MESSAGE":
      return { ...state, doctorMessage: action.payload };
    case "SET_DOCTOR_INPUT":
      return { ...state, doctorInput: action.payload };
    case "SET_SHOW_DOCTOR_INPUT":
      return { ...state, showDoctorInput: action.payload };
    case "SET_SPEECH_SYNTHESIS":
      return { ...state, speechSynthesis: action.payload };
    case "SET_IS_RECORDING":
      return { ...state, isRecording: action.payload };
    case "SET_TRANSCRIPT":
      return { ...state, transcript: action.payload };
    case "SET_AUDIO_DATA":
      return { ...state, audioData: action.payload };
    case "SET_PATIENT_EXPRESSION":
      return { ...state, patientExpression: action.payload };
    case "SET_IS_STREAMING":
      return { ...state, isStreaming: action.payload };
    case "RESET_DOCTOR_INPUT":
      return {
        ...state,
        doctorInput: "",
        showDoctorInput: false,
        isRecording: false,
      };
    case "RESET_CONVERSATION":
      return {
        ...state,
        doctorInput: "",
        showDoctorInput: false,
        aiResponse: "",
        doctorMessage: "",
        patientExpression: "sick",
      };
    default:
      return state;
  }
}

// Main Component
function MedicalConsultation({ virtualRoom }: { virtualRoom: string }) {

  const [state, dispatch] = useReducer(reducer, initialState);

  // Refs
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Hooks
  const { setIsOpen } = useTour();

  // Tour initialization
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("virtualRoomTour") === null
    ) {
      localStorage.setItem("virtualRoomTour", "true");
      setIsOpen(true);
    }
  }, [setIsOpen]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition =
        recognitionRef.current as unknown as SpeechRecognitionInstance;

      if (recognition) {
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const currentTranscript = Array.from(Object.values(event.results))
            .map((result) => result[0].transcript)
            .join("");
          dispatch({ type: "SET_TRANSCRIPT", payload: currentTranscript });
          dispatch({ type: "SET_DOCTOR_INPUT", payload: currentTranscript });
        };

        recognition.onerror = (_event: { error: string }) => {
          
          stopRecording();
        };
      }
    }

    return () => {
      if (animationRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cancelAnimationFrame(animationRef.current);
      }
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = () => {
    if (!state.isRecording && recognitionRef.current) {
      dispatch({ type: "SET_IS_RECORDING", payload: true });
      dispatch({ type: "SET_TRANSCRIPT", payload: "" });
      dispatch({ type: "SET_DOCTOR_INPUT", payload: "" });
      (recognitionRef.current as unknown as SpeechRecognitionInstance).start();
    }
  };

  // Message posting mutation
  const { mutate: postMessage } = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clinical-practice/thread/${virtualRoom}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content }),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      dispatch({ type: "RESET_CONVERSATION" });

      let fullResponse = "";

      // Cancel any existing speech
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              dispatch({ type: "SET_IS_STREAMING", payload: false });
              dispatch({ type: "SET_SHOW_DOCTOR_INPUT", payload: true });
              dispatch({ type: "SET_DOCTOR_MESSAGE", payload: "" });
              dispatch({ type: "SET_PATIENT_EXPRESSION", payload: "sick" });
              return;
            }

            fullResponse += data;
            streamAIResponse(fullResponse);
          }
        }
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Please try again later",
      );
    },
  });

  // Helper functions
  const streamAIResponse = (response: string) => {
    dispatch({ type: "SET_IS_STREAMING", payload: true });
    let currentIndex = 0;

    // Cancel any existing speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(response);
    utteranceRef.current.rate = 0.9;
    dispatch({ type: "SET_SPEECH_SYNTHESIS", payload: utteranceRef.current });

    const streamInterval = setInterval(() => {
      if (currentIndex < response.length) {
        dispatch({
          type: "SET_AI_RESPONSE",
          payload: response.substring(0, currentIndex + 1),
        });
        currentIndex++;
      } else {
        clearInterval(streamInterval);
      }
    }, 30);

    const expressionInterval = setInterval(() => {
      dispatch({
        type: "SET_PATIENT_EXPRESSION",
        payload: state.patientExpression === "sick" ? "shut" : "sick",
      });
    }, 150);

    // Speak the current response
    window.speechSynthesis.speak(utteranceRef.current);

    utteranceRef.current.onend = () => {
      dispatch({ type: "SET_SPEECH_SYNTHESIS", payload: null });
      clearInterval(expressionInterval);
      clearInterval(streamInterval);
      dispatch({ type: "SET_AI_RESPONSE", payload: response });
      utteranceRef.current = null;
    };
  };

  const stopRecording = () => {
    if (state.isRecording) {
      if (recognitionRef.current && "stop" in recognitionRef.current) {
        (recognitionRef.current as { stop: () => void }).stop();
      }
      dispatch({ type: "SET_IS_RECORDING", payload: false });
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        (audioContextRef.current as AudioContext).close();
      }

      if (streamRef.current) {
        (streamRef.current as MediaStream)
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const handleDoctorClick = () => {
    if (state.isStreaming) return;

    if (state.showDoctorInput) {
      dispatch({ type: "SET_SHOW_DOCTOR_INPUT", payload: false });
      return;
    }
    dispatch({ type: "SET_START", payload: true });
    dispatch({ type: "SET_SHOW_DOCTOR_INPUT", payload: true });
    dispatch({ type: "SET_DOCTOR_MESSAGE", payload: "" });
  };

  const sendDoctorInput = () => {
    if (
      state.isRecording ||
      state.doctorInput.trim() === "" ||
      state.isStreaming
    )
      return;
    dispatch({ type: "SET_DOCTOR_MESSAGE", payload: state.doctorInput });
    dispatch({ type: "RESET_DOCTOR_INPUT" });
    stopRecording();
    postMessage(state.doctorInput);
  };

  const sendDoctorMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (state.isStreaming) return;
      sendDoctorInput();
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (eventSourceRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        eventSourceRef.current.close();
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (state.showDoctorInput && textareaRef.current) {
      (textareaRef.current as HTMLTextAreaElement).focus();
    }
  }, [state.showDoctorInput]);

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
                {state.aiResponse && (
                  <SpeechBubble message={state.aiResponse} />
                )}
                <Image
                  src={
                    state.isStreaming
                      ? `/assets/patient_${state.patientExpression}.png`
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
                {state.doctorMessage && (
                  <SpeechBubble message={state.doctorMessage} />
                )}
                {state.showDoctorInput && state.start && (
                  <div className="flex flex-col items-center w-full gap-1 mb-2">
                    <Textarea
                      ref={textareaRef}
                      className="max-w-[200px] flex-grow p-2 rounded border bg-white text-gray-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={state.doctorInput}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_DOCTOR_INPUT",
                          payload: e.target.value,
                        })
                      }
                      onKeyPress={sendDoctorMessage}
                      placeholder="Type your message and press Enter..."
                      rows={3}
                      style={{ resize: "none" }}
                      disabled={state.isStreaming}
                    />
                    <div className="max-w-[200px] flex items-center gap-1">
                      {state.isRecording ? (
                        <Square
                          size={30}
                          className="text-red-500 cursor-pointer"
                          onClick={stopRecording}
                        />
                      ) : (
                        <Mic
                          size={30}
                          className={`text-blue-500 ${state.isStreaming ? "opacity-50 cursor-not-allowed" : "cursor-pointer mic-input"}`}
                          onClick={
                            state.isStreaming ? undefined : startRecording
                          }
                        />
                      )}

                      <svg viewBox="0 0 256 64" className="w-full space-x-1">
                        <path
                          d={`M 0 32 ${
                            state.audioData && state.audioData.length > 0
                              ? state.audioData
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
                          state.doctorInput.trim() === "" || state.isStreaming
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
                  className={`scale-x-[-1] doctor-input ${state.isStreaming ? "" : "cursor-pointer"}`}
                  onClick={state.isStreaming ? undefined : handleDoctorClick}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={`mx-auto dark:text-white ${state.isStreaming ? "disabled:opacity-50 animate-pulse" : ""}`}
                onClick={state.isStreaming ? undefined : handleDoctorClick}
                disabled={state.isStreaming}
              >
                {state.start ? "Continue Conversation" : "Start Conversation"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-4 ">
          <PatientInfo virtualRoom={virtualRoom} />
          <DoctorNote />
        </div>
      </div>
      <DecisionPoint virtualRoom={virtualRoom} />
    </div>
  );
}

export default function MedicalConsultationTour() {
  const params = useParams();
  const virtualRoom = params.virtualRoom as string;
  return (
    <Tour>
      <MedicalConsultation virtualRoom={virtualRoom} />
    </Tour>
  );
}
