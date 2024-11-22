"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

// Function to generate distinctly different colors
const getDistinctColor = (index, totalItems) => {
  const hue = (index * (360 / totalItems)) % 360; // Spread out hues evenly
  return `hsl(${hue}, 70%, 50%)`;
};

// Sample book data
const books = [
  { id: 1, title: "Book 1", completed: 80, notCompleted: 20 },
  { id: 2, title: "Book 2", completed: 60, notCompleted: 40 },
  { id: 3, title: "Book 3", completed: 95, notCompleted: 5 },
];

// Initial chart data for the first book
const generateChartData = (book) => [
  {
    status: "Complete",
    percentage: book.completed,
    fill: getDistinctColor(0, 2),
  },
  {
    status: "Incomplete",
    percentage: book.notCompleted,
    fill: getDistinctColor(1, 2),
  },
];

const chartConfig = {
  completed: {
    label: "Complete",
  },
  notCompleted: {
    label: "Incomplete",
  },
};

export default function PieChartDemo() {
  const [selectedBook, setSelectedBook] = React.useState(books[0]);
  const chartData = generateChartData(selectedBook);

  const totalPercentage = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.percentage, 0);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Book Completion Rate</CardTitle>
            <CardDescription>
              Select a book to see its completion status
            </CardDescription>
          </div>
          <div>
            <Select
              onValueChange={(value) =>
                setSelectedBook(
                  books.find((book) => book.id === parseInt(value)),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {
                            chartData.find((data) => data.status === "Complete")
                              .percentage
                          }
                          %
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Completion
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
