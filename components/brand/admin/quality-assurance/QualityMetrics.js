"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const description = "A bar chart with percentage data";

// Function to generate distinct color for each bar
const getDistinctColor = (index, totalItems) => {
  const hue = (index * (360 / totalItems)) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

// Sample test result data per year
const bookData = {
  2024: [
    { data: "Educational", percentage: 10 },
    { data: "Administrative", percentage: 8 },
    { data: "Research", percentage: 7 },
  ],
  2023: [
    { data: "Educational", percentage: 15 },
    { data: "Administrative", percentage: 12 },
    { data: "Research", percentage: 14 },
  ],
};

// Chart configuration
const chartConfig = {
  // percentage: { label: "percentage" },
};

export default function QualityMetrics() {
  const [selectedBook, setSelectedBook] = useState("2024");
  const chartData = bookData[selectedBook];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>
              Educational vs Administrative Quality Improvements
            </CardTitle>
          </div>
          <div>
            <Select
              onValueChange={(value) => setSelectedBook(value)}
              defaultValue={selectedBook}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="data"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const { data, percentage } = payload[0].payload;
                  return (
                    <div className="flex gap-1 p-2 rounded bg-card">
                      <p>{data}</p>-----
                      <p>{percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="percentage" radius={8}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getDistinctColor(index, chartData.length)}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
