"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  GraduationCap,
  Minus,
  Plus,
} from "lucide-react";
import { useState } from "react";

const patterns = [
  { key: "questionBank", label: "Question Bank", icon: BookOpen },
  { key: "adaptiveLearning", label: "Adaptive Learning", icon: GraduationCap },
  { key: "applicationBased", label: "Application-based", icon: CheckCircle2 },
  { key: "writingAssignment", label: "Writing Assignment", icon: Edit3 },
  { key: "scenarioBased", label: "Scenario-based", icon: AlertCircle },
];

const questionTypes = [
  { key: "mcq", label: "Multiple Choice Questions", icon: CheckCircle2 },
  { key: "broad", label: "Broad Questions", icon: Edit3 },
];

export default function QuestionConfigurationCard() {
  const [state, setState] = useState({
    patternCounts: Object.fromEntries(
      patterns.map((p) => [p.key, { mcq: 0, broad: 0 }]),
    ),
    expandedPattern: null,
    isQuestionsGenerated: false,
  });

  const totalPatternQuestions = Object.values(state.patternCounts).reduce(
    (acc, counts) => acc + counts.mcq + counts.broad,
    0,
  );

  const totalQuestionTypeCounts = Object.values(state.patternCounts).reduce(
    (acc, counts) => ({
      mcq: acc.mcq + counts.mcq,
      broad: acc.broad + counts.broad,
    }),
    { mcq: 0, broad: 0 },
  );

  const handleTogglePattern = (key: string) => {
    setState((prev) => ({
      ...prev,
      expandedPattern: prev.expandedPattern === key ? null : key,
    }));
  };

  const handleIncrementQuestion = (pattern: string, type: string) => {
    setState((prev) => ({
      ...prev,
      patternCounts: {
        ...prev.patternCounts,
        [pattern]: {
          ...prev.patternCounts[pattern],
          [type]: prev.patternCounts[pattern][type] + 1,
        },
      },
    }));
  };

  const handleDecrementQuestion = (pattern: string, type: string) => {
    setState((prev) => ({
      ...prev,
      patternCounts: {
        ...prev.patternCounts,
        [pattern]: {
          ...prev.patternCounts[pattern],
          [type]: Math.max(0, prev.patternCounts[pattern][type] - 1),
        },
      },
    }));
  };

  const handleGenerateQuestions = () => {
    setState((prev) => ({
      ...prev,
      isQuestionsGenerated: true,
    }));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Question Configuration
          </div>
          <Badge variant="outline">
            Total Questions: {totalPatternQuestions}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">Question Patterns</Label>
            <div className="space-y-3">
              {patterns.map(({ key, label, icon: Icon }) => (
                <motion.div
                  key={key}
                  className={`p-3 rounded-lg border ${state.expandedPattern === key
                    ? "border-primary bg-primary/5"
                    : "border-gray-200"
                    } cursor-pointer transition-all hover:border-primary`}
                  onClick={() => handleTogglePattern(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        {state.patternCounts[key].mcq +
                          state.patternCounts[key].broad}{" "}
                        Questions
                      </Badge>
                      {state.expandedPattern === key ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {state.expandedPattern === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 space-y-2"
                      >
                        {questionTypes.map(
                          ({
                            key: typeKey,
                            label: typeLabel,
                            icon: TypeIcon,
                          }) => (
                            <div
                              key={typeKey}
                              className="flex items-center justify-between bg-background p-2 rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <TypeIcon className="w-4 h-4" />
                                <span className="text-sm">{typeLabel}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDecrementQuestion(key, typeKey);
                                  }}
                                  disabled={
                                    state.patternCounts[key][typeKey] === 0
                                  }
                                  className="h-7 w-7 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium text-sm">
                                  {state.patternCounts[key][typeKey]}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleIncrementQuestion(key, typeKey);
                                  }}
                                  className="h-7 w-7 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Question Types (Auto-calculated)
            </Label>
            <div className="space-y-3">
              {questionTypes.map(({ key, label, icon: Icon }) => (
                <motion.div
                  key={key}
                  className="p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        {totalQuestionTypeCounts[key]} Questions
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Button
            className="w-full mt-4"
            size="lg"
            onClick={handleGenerateQuestions}
            disabled={state.isQuestionsGenerated || totalPatternQuestions === 0}
          >
            {state.isQuestionsGenerated
              ? "Questions Generated"
              : "Generate Questions"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
