"use client";

import "./styles.css";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  Book,
  Clock,
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  List,
  PlayCircle,
  StopCircle,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/search/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { Position, Button as PdfButton, Tooltip } from "@react-pdf-viewer/core";
import { useAtomValue, useAtom } from "jotai";
import {
  examTypeAtom,
  questionsAtom,
  answersAtom,
  timeLimitAtom,
} from "@/store";
import { useRouter } from "next/navigation";
import { playAudio, stopAudio } from "@/lib/utils";

const renderHighlightTarget = (props) => (
  <div
    style={{
      background: "#eee",
      display: "flex",
      position: "absolute",
      left: `${props.selectionRegion.left}%`,
      top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
      transform: "translate(0, 8px)",
      zIndex: 1,
    }}
  >
    <div className="flex gap-1">
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            onClick={() => playAudio(props.selectedText)}
            variant="secondary"
          >
            <PlayCircle className="size-4" />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Play audio</div>}
        offset={{ left: 0, top: -8 }}
      />
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={() => stopAudio()} variant="secondary">
            <StopCircle className="size-4" />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Stop audio</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  </div>
);

const Question = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => setDocumentLoaded(true);

  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPdf, setShowPdf] = useState(false);

  const questions = useAtomValue(questionsAtom);
  const [answers, setAnswers] = useAtom(answersAtom);

  const speechSynthesis = useRef(null);

  const examType = useAtomValue(examTypeAtom);
  const timeLimit = useAtomValue(timeLimitAtom);
  const router = useRouter();
  const isTimeAlmostUp = timeLeft <= 300;

  const handleFinish = () => {
    router.push("/student/exam-v2/chapter/question/result");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  const text = questions[currentQuestionIndex].concept;

  useEffect(() => {
    if (isDocumentLoaded) {
      highlight(text.split("\n"));
      setDocumentLoaded(false);
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [highlight, isDocumentLoaded, text]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex,
    );
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex,
    );
  };

  useEffect(() => {
    setTimeLeft(timeLimit * 60);
  }, [timeLimit]);

  const speakText = () => {
    const textToSpeak = currentQuestion.concept;
    if (textToSpeak && speechSynthesis.current) {
      const chunks = textToSpeak.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [
        textToSpeak,
      ];
      let index = 0;

      const speakChunk = () => {
        if (index < chunks.length) {
          const utterance = new SpeechSynthesisUtterance(chunks[index]);
          utterance.onend = () => {
            index++;
            speakChunk();
          };
          speechSynthesis.current.speak(utterance);
        }
      };

      speakChunk();
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] || "";

  const handleClose = () => {
    setShowPdf(false);
    stopSpeaking();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8 flex justify-center">
            <div
              className={`flex items-center space-x-4 ${
                isTimeAlmostUp ? "bg-red-500" : "bg-gray-100"
              } text-4xl font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out`}
            >
              <Clock
                size={36}
                className={isTimeAlmostUp ? "text-white" : "text-gray-800"}
              />
              <span
                className={`font-mono ${isTimeAlmostUp ? "text-white" : "text-gray-800"}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <Card className="dark:bg-gray-950 shadow-xl rounded-lg overflow-hidden dark:text-white">
            <CardHeader className="dark:bg-gray-800 bg-primary text-white p-6">
              <CardTitle className="text-2xl font-bold">
                {currentQuestion.id}. {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {currentQuestion.type === "mcq" ? (
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="answer"
                        value={option}
                        checked={currentAnswer === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`option-${index}`} className=" text-lg">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="Type your answer here..."
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="p-4 border border-gray-300 rounded-md w-full text-lg"
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between p-6 bg-gray-100 dark:bg-gray-700">
              <Button
                variant="outline"
                className="flex items-center bg-white text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-200 dark:hover:bg-primary"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Previous
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => setShowPdf(true)}
                  >
                    <Book className="mr-2 h-5 w-5" /> Show Concept
                  </Button>
                </AlertDialogTrigger>
                {showPdf && (
                  <AlertDialogContent className="w-full max-w-6xl h-[90vh] rounded-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Concept</span>
                        <div className="flex space-x-4">
                          <Button
                            variant="outline"
                            className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
                            onClick={speakText}
                          >
                            <Volume2 className="mr-2 h-5 w-5" /> Speak
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
                            onClick={stopSpeaking}
                          >
                            <VolumeX className="mr-2 h-5 w-5" /> Stop
                          </Button>
                        </div>
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="h-full overflow-auto">
                      <div style={{ height: "750px" }}>
                        <Viewer
                          fileUrl="/pdfs/book1.pdf"
                          plugins={[
                            defaultLayoutPluginInstance,
                            highlightPluginInstance,
                          ]}
                          onDocumentLoad={handleDocumentLoad}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-full transition-colors duration-200"
                        onClick={handleClose}
                      >
                        Close
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  variant="outline"
                  className="flex items-center bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors duration-200"
                  onClick={handleFinish}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center bg-white text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-200 dark:hover:bg-primary"
                  onClick={handleNextQuestion}
                >
                  Next <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="lg:hidden mt-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200 w-full"
              >
                <List className="mr-2 h-5 w-5" /> Question List
              </Button>
            </SheetTrigger>
            <SheetContent position="right" size="sm">
              <Card className="w-full h-full bg-white rounded-lg overflow-hidden">
                <CardHeader className="bg-gray-800 text-white p-6">
                  <CardTitle className="text-2xl font-bold">
                    Question List
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[80vh] overflow-y-auto p-6 bg-gray-100">
                  <ul className="space-y-4">
                    {questions.map((question, index) => (
                      <li key={question.id}>
                        <Button
                          variant={
                            index === currentQuestionIndex
                              ? "default"
                              : "outline"
                          }
                          className={`w-full text-left justify-start p-4 rounded-lg shadow-md ${
                            index === currentQuestionIndex
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-white text-gray-800 hover:bg-gray-200"
                          } transition-colors duration-200 whitespace-normal break-words text-lg`}
                          onClick={() => setCurrentQuestionIndex(index)}
                        >
                          {question.id}. {question.question}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block">
          <Card className="w-full shadow-xl h-full bg-white rounded-lg overflow-hidden ">
            <CardHeader className="dark:bg-gray-800 bg-primary text-white p-6">
              <CardTitle className="text-2xl font-bold">
                Question List
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-100 h-[calc(100vh-14rem)] overflow-y-auto py-6 space-y-4 px-4 dark:bg-gray-950">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                    index === currentQuestionIndex
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-white text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-white"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  <p className="font-semibold">
                    {question.id}. {question.question}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Question;
