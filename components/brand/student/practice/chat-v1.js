"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Clock, Send, HelpCircle, Menu, X } from "lucide-react";

const difficulties = ["Easy", "Medium", "Hard"];

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default function MedicalLearningAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Welcome to the Medical Learning Assistant! Please select a difficulty and enter a disease name to begin the scenario.",
    },
  ]);
  const [input, setInput] = useState("");
  const [disease, setDisease] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [phase, setPhase] = useState("initial");
  const [chatHistory, setChatHistory] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (phase !== "initial" && phase !== "complete") {
        setTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "" && selectedAnswer === null) return;
    setIsLoading(true);

    if (phase === "initial") {
      setDisease(input);
      setPhase("scenario");
      const aiScenario = `A patient presents with symptoms of ${input}. They report experiencing [AI-generated symptoms]. The patient has a history of [AI-generated history].`;
      const newMessages = [
        ...messages,
        { role: "student", content: input },
        { role: "ai", content: aiScenario },
      ];
      setMessages(newMessages);
      setChatHistory([
        ...chatHistory,
        { disease: input, messages: newMessages },
      ]);
    } else if (phase === "clarification") {
      const newMessages = [
        ...messages,
        { role: "student", content: input },
        {
          role: "ai",
          content:
            "Thank you for your question. [AI response to the clarification question would go here]",
        },
      ];
      setMessages(newMessages);
      setChatHistory(
        chatHistory.map((chat, index) =>
          index === chatHistory.length - 1
            ? { ...chat, messages: newMessages }
            : chat,
        ),
      );
    } else if (phase === "quiz") {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      const evaluation = isCorrect
        ? "Correct! Your reasoning is sound."
        : `Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}. [AI-generated explanation]`;

      setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));
      const newMessages = [
        ...messages,
        {
          role: "student",
          content: currentQuestion.options[selectedAnswer],
        },
        { role: "ai", content: evaluation },
      ];
      setMessages(newMessages);
      setChatHistory(
        chatHistory.map((chat, index) =>
          index === chatHistory.length - 1
            ? { ...chat, messages: newMessages }
            : chat,
        ),
      );

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setPhase("complete");
      }
    }

    setInput("");
    setSelectedAnswer(null);
    setIsLoading(false);
  };

  const startQuiz = () => {
    setPhase("quiz");
    const aiQuestions = [
      {
        question:
          "What is the most likely diagnosis based on the presented symptoms?",
        options: [`${disease}`, "Option B", "Option C", "Option D"],
        correctAnswer: 0,
      },
      {
        question: "What is the next best step in management for this patient?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
      },
      {
        question:
          "Considering the patient's history, what additional test would be most appropriate?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 1,
      },
    ];
    setQuestions(aiQuestions);
    const newMessages = [
      ...messages,
      { role: "ai", content: aiQuestions[0].question },
    ];
    setMessages(newMessages);
    setChatHistory(
      chatHistory.map((chat, index) =>
        index === chatHistory.length - 1
          ? { ...chat, messages: newMessages }
          : chat,
      ),
    );
  };

  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  const loadPreviousChat = (index) => {
    const previousChat = chatHistory[index];
    setDisease(previousChat.disease);
    setMessages(previousChat.messages);
    setPhase("scenario");
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Card className="flex-1 max-w-3xl mx-auto my-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-indigo-950 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-zinc-600 text-white p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Medical Learning Assistant
              </CardTitle>
              <div className="w-6" /> {/* Spacer for alignment */}
            </div>
            <div className="flex justify-between items-center mt-4">
              <Select onValueChange={setDifficulty} value={difficulty}>
                <SelectTrigger className="w-[140px] bg-white text-gray-900">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center bg-white text-gray-900 px-3 py-1 rounded-full">
                <Clock className="mr-2 h-4 w-4" />
                <span>{formatTime(timer)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 p-3 rounded-lg ${
                    message.role === "ai"
                      ? "bg-blue-100 text-cyan-800 dark:bg-blue-900 dark:text-blue-100"
                      : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                  }`}
                >
                  <strong>{message.role === "ai" ? "AI:" : "You:"}</strong>{" "}
                  {message.content}
                </motion.div>
              ))}
            </ScrollArea>

            {phase === "initial" && (
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a disease name..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-grow bg-white"
                />
                <Button onClick={handleSendMessage} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Start"
                  )}
                </Button>
              </div>
            )}

            {phase === "scenario" && (
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setPhase("clarification")}
                  variant="outline"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ask for Clarification
                </Button>
                <Button onClick={startQuiz}>Start Quiz</Button>
              </div>
            )}

            {phase === "clarification" && (
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about the scenario..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
                <Button onClick={startQuiz}>Start Quiz</Button>
              </div>
            )}

            {phase === "quiz" && (
              <>
                <Progress value={progressPercentage} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {questions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-colors ${
                            selectedAnswer === index
                              ? "bg-indigo-200 dark:bg-indigo-800"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setSelectedAnswer(index)}
                        >
                          <CardContent className="p-4">
                            <p className="text-sm font-medium">{option}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ),
                  )}
                </div>
                {selectedAnswer !== null && (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Submit Answer"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}

            {phase === "complete" && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <p className="mb-2">
                  Your score: {score}/{questions.length}
                </p>
                <p>Time taken: {formatTime(timer)}</p>
                <Button
                  onClick={() => {
                    setPhase("initial");
                    setMessages([
                      {
                        role: "ai",
                        content:
                          "Welcome to the Medical Learning Assistant! Please select a difficulty and enter a disease name to begin a new scenario.",
                      },
                    ]);
                    setDisease("");
                    setQuestions([]);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setTimer(0);
                  }}
                  className="mt-4"
                >
                  Start New Scenario
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
