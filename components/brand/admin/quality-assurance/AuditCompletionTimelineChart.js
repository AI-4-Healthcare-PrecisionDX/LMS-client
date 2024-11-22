"use client";

import React, { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
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

export const description = "An area chart with icons";

// Sample data for different years
const allChartData = {
  2024: [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
    { month: "July", desktop: 214 },
    { month: "August", desktop: 214 },
    { month: "September", desktop: 214 },
    { month: "October", desktop: 214 },
    { month: "November", desktop: 214 },
    { month: "December", desktop: 214 },
  ],
  2023: [
    { month: "January", desktop: 200 },
    { month: "February", desktop: 350 },
    { month: "March", desktop: 280 },
    { month: "April", desktop: 90 },
    { month: "May", desktop: 240 },
    { month: "June", desktop: 220 },
    { month: "July", desktop: 214 },
    { month: "August", desktop: 214 },
    { month: "September", desktop: 214 },
    { month: "October", desktop: 214 },
    { month: "November", desktop: 214 },
    { month: "December", desktop: 214 },
  ],
  // Add more years as needed
};

const chartConfig = {
  desktop: {
    label: "Completed Audits",
    color: "hsl(var(--chart-1))",
  },
};

export default function AuditCompletionTimelineChart() {
  // State for selected year
  const [selectedYear, setSelectedYear] = useState("2024");

  // Data for the selected year
  const chartData = allChartData[selectedYear];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Audit Completion Timeline</CardTitle>
          </div>
          <div>
            <Select
              defaultValue={selectedYear}
              onValueChange={(e) => setSelectedYear(e)}
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
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
