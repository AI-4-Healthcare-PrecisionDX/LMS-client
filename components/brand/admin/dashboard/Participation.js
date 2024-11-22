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
    { data: "Program A", percentage: 50 },
    { data: "Program B", percentage: 60 },
    { data: "Program C", percentage: 55 },
    { data: "Program D", percentage: 45 },
  ],
  2023: [
    { data: "Program A", percentage: 37 },
    { data: "Program B", percentage: 32 },
    { data: "Program C", percentage: 28 },
    { data: "Program D", percentage: 38 },
  ],
};

// Chart configuration
const chartConfig = {
  // percentage: { label: "percentage" },
};

export default function Participation() {
  const [selectedBook, setSelectedBook] = useState("2024");
  const chartData = bookData[selectedBook];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Staff Participation in Development Programs</CardTitle>
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
            {/* <YAxis
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
                        /> */}
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const { data, percentage } = payload[0].payload;
                  return (
                    <div className="bg-card p-2 rounded flex gap-1">
                      <p>{data}</p>-----
                      <p>{percentage}</p>
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
