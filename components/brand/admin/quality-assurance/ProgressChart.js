"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

export const description = "A multiple line chart";

// Data for current year
const currentYearData = [
  {
    period: "Q1",
    graduationRates: 75,
    boardExamPassRates: 80,
    researchCount: 5,
    competencyAssessments: 90,
  },
  {
    period: "Q2",
    graduationRates: 78,
    boardExamPassRates: 85,
    researchCount: 10,
    competencyAssessments: 85,
  },
  {
    period: "Q3",
    graduationRates: 82,
    boardExamPassRates: 82,
    researchCount: 8,
    competencyAssessments: 88,
  },
  {
    period: "Q4",
    graduationRates: 85,
    boardExamPassRates: 87,
    researchCount: 12,
    competencyAssessments: 92,
  },
  {
    period: "Year-End",
    graduationRates: 90,
    boardExamPassRates: 89,
    researchCount: 15,
    competencyAssessments: 94,
  },
];

// Data for predicted year
const predictedData = [
  {
    period: "Q1",
    graduationRates: 91,
    boardExamPassRates: 90,
    researchCount: 6,
    competencyAssessments: 93,
  },
  {
    period: "Q2",
    graduationRates: 92,
    boardExamPassRates: 92,
    researchCount: 11,
    competencyAssessments: 91,
  },
  {
    period: "Q3",
    graduationRates: 94,
    boardExamPassRates: 93,
    researchCount: 9,
    competencyAssessments: 95,
  },
  {
    period: "Q4",
    graduationRates: 95,
    boardExamPassRates: 95,
    researchCount: 13,
    competencyAssessments: 96,
  },
  {
    period: "Year-End",
    graduationRates: 96,
    boardExamPassRates: 96,
    researchCount: 18,
    competencyAssessments: 97,
  },
  {
    period: "Next Year Q1",
    graduationRates: 97,
    boardExamPassRates: 97,
    researchCount: 7,
    competencyAssessments: 98,
  },
  {
    period: "Next Year Q2",
    graduationRates: 98,
    boardExamPassRates: 98,
    researchCount: 12,
    competencyAssessments: 99,
  },
  {
    period: "Next Year Q3",
    graduationRates: 99,
    boardExamPassRates: 99,
    researchCount: 10,
    competencyAssessments: 99,
  },
  {
    period: "Next Year Q4",
    graduationRates: 100,
    boardExamPassRates: 100,
    researchCount: 14,
    competencyAssessments: 100,
  },
  {
    period: "Year-End",
    graduationRates: 100,
    boardExamPassRates: 100,
    researchCount: 20,
    competencyAssessments: 100,
  },
];

// Unique colors for each metric
const chartConfig = {
  graduationRates: {
    label: "Graduation Rates",
    color: "hsl(var(--chart-1))",
  },
  boardExamPassRates: {
    label: "Board Exam Pass Rates",
    color: "hsl(var(--chart-2))",
  },
  researchCount: {
    label: "Research Publication Count",
    color: "hsl(var(--chart-3))",
  },
  competencyAssessments: {
    label: "Clinical Competency Assessments",
    color: "hsl(var(--chart-4))",
  },
};

export default function ProgressChart() {
  const [data, setData] = useState(currentYearData);
  const [viewMode, setViewMode] = useState("Current Year Data");

  const toggleViewMode = () => {
    if (viewMode === "Current Year Data") {
      setData(predictedData);
      setViewMode("Predicted Data");
    } else {
      setData(currentYearData);
      setViewMode("Current Year Data");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Progress Over Time</CardTitle>
            <CardDescription>{viewMode}</CardDescription>
          </div>
          <div>
            <Button onClick={toggleViewMode}>
              Switch to{" "}
              {viewMode === "Current Year Data"
                ? "Predicted Data"
                : "Current Year Data"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="graduationRates"
              type="monotone"
              stroke="var(--color-graduationRates)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="boardExamPassRates"
              type="monotone"
              stroke="var(--color-boardExamPassRates)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="researchCount"
              type="monotone"
              stroke="var(--color-researchCount)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="competencyAssessments"
              type="monotone"
              stroke="var(--color-competencyAssessments)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
