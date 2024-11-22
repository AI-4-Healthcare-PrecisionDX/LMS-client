"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Stethoscope,
  XCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const patientCase = {
  id: 1,
  caseNumber: "C001",
  description:
    "A 45-year-old male presents to the emergency department with sudden onset of severe chest pain radiating to the left arm.",
  history:
    "The pain started 2 hours ago while he was at rest. He describes the pain as crushing and rates it 8/10 on the pain scale. He has a history of hypertension and smoking. No previous cardiac events.",
  physicalExam:
    "Vital Signs: BP 150/90, HR 98, RR 20, Temp 37.2°C, SpO2 97% on room air. Patient appears anxious and in distress. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear to auscultation bilaterally.",
  labResults:
    "ECG shows ST-segment elevation in leads V1-V4. Troponin I is elevated at 0.5 ng/mL (normal <0.04 ng/mL). CBC and basic metabolic panel are within normal limits.",
};

const questions = [
  {
    id: 1,
    text: "What is the most likely diagnosis based on the patient's presentation?",
    options: [
      "Acute Myocardial Infarction",
      "Stable Angina",
      "Pulmonary Embolism",
      "Gastroesophageal Reflux Disease",
    ],
    correctAnswer: 0,
    explanation:
      "The patient's presentation of sudden onset severe chest pain, risk factors (hypertension, smoking), and the ECG findings of ST-segment elevation strongly suggest an Acute Myocardial Infarction (AMI). The elevated troponin level further supports this diagnosis.",
  },
  {
    id: 2,
    text: "Which of the following is the most appropriate initial management step?",
    options: [
      "Administer aspirin and call for immediate coronary angiography",
      "Start beta-blockers and observe",
      "Administer thrombolytics",
      "Perform a stress test",
    ],
    correctAnswer: 0,
    explanation:
      "In a case of suspected AMI, the immediate administration of aspirin and arranging for coronary angiography (with likely primary percutaneous coronary intervention) is the standard of care. Aspirin helps prevent further clot formation, while timely coronary angiography allows for definitive diagnosis and treatment.",
  },
  {
    id: 3,
    text: "What additional test would be most helpful in confirming the diagnosis?",
    options: [
      "Chest X-ray",
      "D-dimer",
      "Serial troponin measurements",
      "Echocardiogram",
    ],
    correctAnswer: 2,
    explanation:
      "While the initial troponin is elevated, serial troponin measurements are crucial in confirming the diagnosis of AMI. Troponin levels typically rise and fall in a characteristic pattern in AMI, peaking at about 24 hours and remaining elevated for 7-14 days.",
  },
];

export default function CaseStudyPage() {
  const [assessmentState, setAssessmentState] = useState({
    currentQuestionIndex: 0,
    userAnswers: [],
    isCompleted: false,
    showExplanation: false,
  });

  const currentQuestion = questions[assessmentState.currentQuestionIndex];

  const handleAnswerSelection = (selectedAnswer) => {
    setAssessmentState((prevState) => ({
      ...prevState,
      userAnswers: [...prevState.userAnswers, selectedAnswer],
      showExplanation: true,
    }));
  };

  const handleNextQuestion = () => {
    if (assessmentState.currentQuestionIndex < questions.length - 1) {
      setAssessmentState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        showExplanation: false,
      }));
    } else {
      setAssessmentState((prevState) => ({
        ...prevState,
        isCompleted: true,
      }));
    }
  };

  const calculateScore = () => {
    return assessmentState.userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index]?.correctAnswer ? 1 : 0);
    }, 0);
  };

  const resetAssessment = () => {
    setAssessmentState({
      currentQuestionIndex: 0,
      userAnswers: [],
      isCompleted: false,
      showExplanation: false,
    });
  };

  return (
    <div className="p-4">
      <Link
        href="/practice"
        className="mb-6 border rounded-lg px-4 bg-white py-2 inline-flex"
      >
        <ArrowLeft className="mr-2" />
        Back to Case
      </Link>
      <h1 className="text-3xl font-bold mb-6">Medical Case Study</h1>

      <Tabs defaultValue="case" className="mb-6">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="case">Case Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="exam">Physical Exam</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
        </TabsList>
        <TabsContent value="case">
          <Card>
            <CardHeader>
              <CardTitle>Patient Case: {patientCase.caseNumber}</CardTitle>
              <CardDescription>
                Review the case details before answering the questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{patientCase.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Patient History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patientCase.history}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exam">
          <Card>
            <CardHeader>
              <CardTitle>Physical Examination</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patientCase.physicalExam}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patientCase.labResults}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {!assessmentState.isCompleted && currentQuestion ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2" />
              Question {assessmentState.currentQuestionIndex + 1} of{" "}
              {questions.length}
            </CardTitle>
            <CardDescription>
              <Progress
                value={
                  ((assessmentState.currentQuestionIndex + 1) /
                    questions.length) *
                  100
                }
                className="mt-2"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-lg font-medium">{currentQuestion.text}</p>
            <RadioGroup
              onValueChange={(value) => handleAnswerSelection(parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          {assessmentState.showExplanation && (
            <CardFooter className="flex flex-col items-start">
              <div className="mb-4 p-4 bg-muted rounded-lg w-full">
                <h4 className="font-semibold mb-2 flex items-center">
                  {assessmentState.userAnswers[
                    assessmentState.currentQuestionIndex
                  ] === currentQuestion.correctAnswer ? (
                    <CheckCircle2 className="text-green-500 mr-2" />
                  ) : (
                    <XCircle className="text-red-500 mr-2" />
                  )}
                  Explanation
                </h4>
                <p>{currentQuestion.explanation}</p>
              </div>
              <Button onClick={handleNextQuestion} className="w-full">
                {assessmentState.currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "View Results"}
              </Button>
            </CardFooter>
          )}
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2" />
              Assessment Results
            </CardTitle>
            <CardDescription>
              Review your performance and learn from the explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold mb-2">
                {calculateScore()} / {questions.length}
              </p>
              <p className="text-xl">Correct Answers</p>
            </div>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <Accordion type="single" collapsible className="w-full">
                {questions.map((question, index) => (
                  <AccordionItem key={question.id} value={`question-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center">
                        {assessmentState.userAnswers[index] ===
                        question.correctAnswer ? (
                          <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <XCircle className="text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <span>Question {index + 1}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="font-medium mb-2">{question.text}</p>
                      <p className="mb-1">
                        Your answer:{" "}
                        {question.options[assessmentState.userAnswers[index]]}
                      </p>
                      <p className="mb-2 font-medium text-green-600">
                        Correct answer:{" "}
                        {question.options[question.correctAnswer]}
                      </p>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="font-medium mb-1">Explanation:</p>
                        <p>{question.explanation}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button onClick={resetAssessment} className="w-full">
              Retake Assessment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
