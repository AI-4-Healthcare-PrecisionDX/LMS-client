"use client";
import React from "react";
import { useAtomValue } from "jotai";
import { resultsAtom } from "@/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, X, Book, HelpCircle, MoveLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import Link from "next/link";

const ExamResult = () => {
  const results = useAtomValue(resultsAtom);

  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const incorrectAnswers = results.filter(
    (r) => r.isAnswered && !r.isCorrect,
  ).length;
  const notAnswered = results.filter((r) => !r.isAnswered).length;

  const chartData = [
    { name: "Correct", value: correctAnswers, color: "#4ade80" },
    { name: "Incorrect", value: incorrectAnswers, color: "#f87171" },
    { name: "Not Answered", value: notAnswered, color: "#94a3b8" },
  ];

  const items = [
    { href: "/student", label: "Home" },
    { href: "/student/exam-v2", label: "Book List" },
    { href: "/student/exam-v2/chapter", label: "Chapter List" },
    { label: "Exam Result" },
  ];

  const ITEMS_TO_DISPLAY = 3;

  const TopicDialog = ({ topic }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Book className="w-4 h-4 mr-2" /> Show Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Topic</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>{topic}</p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 pb-2 dark:text-gray-100">
      <div className="sticky top-0 bg-background pb-2 z-10">
        <div className="flex justify-between w-full items-center pt-4">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
          <Link href="/student/exam-v2">
            <Button variant="outline">
              <MoveLeft className="w-4 h-4 mr-2" />
              Back to Book List
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">Exam Results</h1>
      </div>

      <div className="mx-auto space-y-8 p-1">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  Performance Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Questions">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center">
                <h3 className="text-lg font-semibold text-center">
                  Performance Breakdown
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Correct Answers: {correctAnswers}</span>
                  </li>
                  <li className="flex items-center">
                    <X className="w-5 h-5 text-red-500 mr-2" />
                    <span>Incorrect Answers: {incorrectAnswers}</span>
                  </li>
                  <li className="flex items-center">
                    <HelpCircle className="w-5 h-5 text-slate-500 mr-2" />
                    <span>Not Answered: {notAnswered}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">Total Questions:</span>
                    <span>{results.length}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4">
            <div className="w-full text-center space-y-1">
              <p className="text-lg font-semibold">
                Score: {correctAnswers}/{results.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Percentage:{" "}
                {((correctAnswers / results.length) * 100).toFixed(2)}%
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Detailed Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-6">
              {results.map((result) => (
                <li key={result.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <p className="font-semibold">{result.question}</p>
                      {result.isAnswered ? (
                        <p
                          className={`mt-1 font-semibold ${result.isCorrect ? "text-green-600" : "text-red-600"}`}
                        >
                          Your Answer: {result.userAnswer}
                        </p>
                      ) : (
                        <p className="mt-1 text-slate-600">Not Answered</p>
                      )}
                      {(!result.isCorrect || !result.isAnswered) && (
                        <p className="mt-1 font-semibold text-green-600">
                          Correct Answer: {result.correctAnswer}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center ml-4">
                      {result.isAnswered ? (
                        result.isCorrect ? (
                          <Check className="w-6 h-6 text-green-500" />
                        ) : (
                          <X className="w-6 h-6 text-red-500" />
                        )
                      ) : (
                        <HelpCircle className="w-6 h-6 text-slate-500" />
                      )}
                      <TopicDialog topic={result.concept} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamResult;
