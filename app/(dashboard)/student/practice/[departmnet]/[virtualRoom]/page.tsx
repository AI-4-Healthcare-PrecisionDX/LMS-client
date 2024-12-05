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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
      className={`bg-white max-w-[200px] max-h-[100px] overflow-y-auto p-2 rounded-lg shadow-md text-md dark:bg-gray-600 dark:text-white`}
    >
      {message}
    </div>
  );
};

function MedicalConsultation({ virtualRoom }: { virtualRoom: string }) {
  const textareaRef = useRef(null);
  const [start, setStart] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [doctorMessage, setDoctorMessage] = useState("");
  const [doctorInput, setDoctorInput] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [responseIndex, setResponseIndex] = useState(0);
  const [showDoctorInput, setShowDoctorInput] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const [audioData, setAudioData] = useState([]);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const [patientExpression, setPatientExpression] = useState("sick");
  const [isStreaming, setIsStreaming] = useState(false);
  const { setIsOpen } = useTour();
  if (typeof window !== "undefined") {
    if (localStorage.getItem("virtualRoomTour") === null) {
      localStorage.setItem("virtualRoomTour", "true");
      setIsOpen(true);
    }
  }

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

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      setDoctorInput("");
      setShowDoctorInput(false);
      setAiResponse("");

      let fullResponse = "";
      let currentUtterance = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setIsStreaming(false);
              setShowDoctorInput(true);
              setDoctorMessage("");
              setPatientExpression("sick");
              return;
            }

            // Cancel previous utterance if still speaking
            if (currentUtterance) {
              window.speechSynthesis.cancel();
            }

            // Create new utterance for this chunk
            currentUtterance = new SpeechSynthesisUtterance(data);
            currentUtterance.rate = 0.9;
            window.speechSynthesis.speak(currentUtterance);

            fullResponse += data;
            streamAIResponse(fullResponse);
          }
        }
      }
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    },
  });

  const sendDoctorMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isRecording) return;
      if (doctorInput.trim() === "") return;
      setDoctorInput((prevInput) => prevInput + " " + transcript);
      setDoctorMessage(doctorInput);
      setDoctorInput("");
      setShowDoctorInput(false);
      setIsRecording(false);
      stopRecording();

      postMessage(doctorInput);
    }
  };

  const streamAIResponse = (response: string) => {
    setIsStreaming(true);
    let currentIndex = 0;

    // Create a new SpeechSynthesisUtterance instance
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.rate = 0.9; // Slightly slow down the speech rate
    setSpeechSynthesis(null); // Reset previous utterance first
    setSpeechSynthesis(utterance as unknown as null); // Type cast to match state type

    // Text streaming with consistent speed
    const streamInterval = setInterval(() => {
      if (currentIndex < response.length) {
        setAiResponse(response.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
      }
    }, 30); // Adjust timing for smooth animation

    // Expression changing
    const expressionInterval = setInterval(() => {
      setPatientExpression((prev) => (prev === "sick" ? "shut" : "sick"));
    }, 150);

    // Start speaking
    window.speechSynthesis.speak(utterance);

    // Handle speech end
    utterance.onend = () => {
      setSpeechSynthesis(null);
      clearInterval(expressionInterval);
      clearInterval(streamInterval);
      setAiResponse(response); // Ensure full text is displayed
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
    setIsRecording(false);
    stopRecording();

    postMessage(doctorInput);
  };

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     streamRef.current = stream;
  //     const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  //     audioContextRef.current = new AudioContextClass();
  //     if (audioContextRef.current) {
  //       const analyser = audioContextRef.current.createAnalyser();
  //       analyserRef.current = analyser as AnalyserNode
  //       const source = (audioContextRef.current as AudioContext).createMediaStreamSource(stream);
  //       source.connect(analyser);
  //     }
  //     if (recognitionRef.current && 'start' in recognitionRef.current) {
  //       (recognitionRef.current as { start: () => void }).start();
  //     }

  //     setIsRecording(true);
  //     // drawWaveform();
  //   } catch (error) {
  //     console.error("Error accessing microphone:", error);
  //   }
  // };

  const stopRecording = () => {
    if (isRecording) {
      setDoctorInput((prev) => prev + " " + transcript);
      if (recognitionRef.current && "stop" in recognitionRef.current) {
        (recognitionRef.current as { stop: () => void }).stop();
      }
      setIsRecording(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        (audioContextRef.current as AudioContext).close();
      }

      // Stop all tracks on the stream
      if (streamRef.current) {
        (streamRef.current as MediaStream)
          .getTracks()
          .forEach((track: MediaStreamTrack) => {
            track.stop();
          });
        streamRef.current = null;
      }
    }
  };

  // const drawWaveform = () => {
  //   if (!analyserRef.current) return;

  //   const analyser = analyserRef.current as AnalyserNode;
  //   analyser.fftSize = 256;
  //   const bufferLength = analyser.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);

  //   const draw = () => {
  //     if (!analyserRef.current) return;
  //     const analyser = analyserRef.current as AnalyserNode;
  //     analyser.getByteTimeDomainData(dataArray);
  //     setAudioData(Array.from(dataArray));
  //     animationRef.current = requestAnimationFrame(draw);
  //   };

  //   draw();
  // };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
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

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      ((window as any).webkitSpeechRecognition as {
        new (): SpeechRecognitionInstance;
      });

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition =
        recognitionRef.current as unknown as SpeechRecognitionInstance;
      if (recognition) {
        recognition.continuous = true;
        recognition.interimResults = true;
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const currentTranscript = Array.from(Object.values(event.results))
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: { error: string }) => {
        console.error("Speech recognition error", event.error);
        stopRecording();
      };
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showDoctorInput && textareaRef.current) {
      (textareaRef.current as HTMLTextAreaElement).focus();
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
                      onChange={(e) => setDoctorInput(e.target.value)}
                      onKeyPress={sendDoctorMessage}
                      placeholder="Type your message and press Enter..."
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
                          onClick={() => {}} // Removed startRecording since it's not defined
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
          <PatientInfo virtualRoom={virtualRoom} />
          <DoctorNote />
        </div>
      </div>
      <DecisionPoint />
    </div>
  );
}

export default function MedicalConsultationTour({
  params,
}: {
  params: { virtualRoom: string };
}) {
  const { virtualRoom } = params;

  return (
    <Tour>
      <MedicalConsultation virtualRoom={virtualRoom} />
    </Tour>
  );
}
