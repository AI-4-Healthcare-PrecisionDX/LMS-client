import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ExamConfiguration = () => {
  const [examType, setExamType] = useState("mcq");
  const [questionAmount, setQuestionAmount] = useState("10");
  const [timeLimit, setTimeLimit] = useState("60");

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 bg-gray-50 shadow-md">
      <CardHeader className="bg-gray-200">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Exam Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="exam-type"
              className="text-lg font-medium text-gray-700"
            >
              Exam Type
            </Label>
            <RadioGroup
              id="exam-type"
              value={examType}
              onValueChange={setExamType}
              className="flex flex-wrap gap-4 mt-2"
            >
              {["MCQ", "Essay", "Flashcard"].map((type) => (
                <div key={type} className="flex items-center">
                  <RadioGroupItem
                    value={type.toLowerCase()}
                    id={type.toLowerCase()}
                    className="text-gray-600 border-gray-300"
                  />
                  <Label
                    htmlFor={type.toLowerCase()}
                    className="ml-2 text-sm font-medium text-gray-600 cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <Label
                htmlFor="question-amount"
                className="text-sm font-medium text-gray-700"
              >
                Number of Questions
              </Label>
              <Select value={questionAmount} onValueChange={setQuestionAmount}>
                <SelectTrigger
                  id="question-amount"
                  className="w-full mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                >
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label
                htmlFor="time-limit"
                className="text-sm font-medium text-gray-700"
              >
                Time Limit (minutes)
              </Label>
              <Input
                id="time-limit"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                min="1"
                className="w-full mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamConfiguration;
