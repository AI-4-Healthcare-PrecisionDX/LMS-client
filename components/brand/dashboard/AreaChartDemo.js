"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export const description = "An area chart with gradient fill";

// Updated chartData with book data
const chartData = {
  2023: {
    "Fundamentals of Anatomy and Physiology": [
      { month: "January", desktop: 186, mobile: 180 },
      { month: "February", desktop: 305, mobile: 285 },
      { month: "March", desktop: 237, mobile: 290 },
      { month: "April", desktop: 73, mobile: 100 },
      { month: "May", desktop: 209, mobile: 175 },
      { month: "June", desktop: 214, mobile: 285 },
      { month: "July", desktop: 214, mobile: 180 },
      { month: "August", desktop: 214, mobile: 80 },
      { month: "September", desktop: 284, mobile: 235 },
      { month: "October", desktop: 224, mobile: 190 },
      { month: "November", desktop: 214, mobile: 285 },
      { month: "December", desktop: 214, mobile: 290 },
    ],
    "Anatomy & Physiology": [
      { month: "January", desktop: 100, mobile: 70 },
      { month: "February", desktop: 150, mobile: 75 },
      { month: "March", desktop: 130, mobile: 78 },
      { month: "April", desktop: 80, mobile: 72 },
      { month: "May", desktop: 170, mobile: 80 },
      { month: "June", desktop: 140, mobile: 75 },
      { month: "July", desktop: 180, mobile: 178 },
      { month: "August", desktop: 190, mobile: 180 },
      { month: "September", desktop: 210, mobile: 282 },
      { month: "October", desktop: 200, mobile: 184 },
      { month: "November", desktop: 220, mobile: 185 },
      { month: "December", desktop: 210, mobile: 186 },
    ],
  },
  2024: {
    "Fundamentals of Anatomy and Physiology": [
      { month: "January", desktop: 200, mobile: 185 },
      { month: "February", desktop: 310, mobile: 188 },
      { month: "March", desktop: 250, mobile: 190 },
      { month: "April", desktop: 80, mobile: 175 },
      { month: "May", desktop: 220, mobile: 178 },
      { month: "June", desktop: 230, mobile: 280 },
      { month: "July", desktop: 230, mobile: 285 },
      { month: "August", desktop: 230, mobile: 187 },
      { month: "September", desktop: 230, mobile: 289 },
      { month: "October", desktop: 230, mobile: 190 },
      { month: "November", desktop: 230, mobile: 285 },
      { month: "December", desktop: 230, mobile: 187 },
    ],
    "Anatomy & Physiology": [
      { month: "January", desktop: 186, mobile: 180 },
      { month: "February", desktop: 305, mobile: 285 },
      { month: "March", desktop: 237, mobile: 290 },
      { month: "April", desktop: 73, mobile: 100 },
      { month: "May", desktop: 209, mobile: 175 },
      { month: "June", desktop: 214, mobile: 285 },
      { month: "July", desktop: 214, mobile: 180 },
      { month: "August", desktop: 214, mobile: 80 },
      { month: "September", desktop: 284, mobile: 235 },
      { month: "October", desktop: 224, mobile: 190 },
      { month: "November", desktop: 214, mobile: 285 },
      { month: "December", desktop: 214, mobile: 290 },
    ],
  },
};

const chartConfig = {
  desktop: {
    label: "Effort",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Outcome",
    color: "hsl(var(--chart-2))",
  },
};

export default function AreaChartDemo() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedBook, setSelectedBook] = useState(
    "Fundamentals of Anatomy and Physiology",
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Activities</CardTitle>
          </div>
          <div className="flex gap-4">
            {/* Year Selection */}
            <Select
              onValueChange={(value) => setSelectedYear(value)}
              value={selectedYear}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>

            {/* Book Selection */}
            <Select
              onValueChange={(value) => setSelectedBook(value)}
              value={selectedBook}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Book" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fundamentals of Anatomy and Physiology">
                  Fundamentals of Anatomy and Physiology
                </SelectItem>
                <SelectItem value="Anatomy & Physiology">
                  Anatomy & Physiology
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData[selectedYear][selectedBook]}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              id="fillDesktop"
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              id="fillMobile"
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
