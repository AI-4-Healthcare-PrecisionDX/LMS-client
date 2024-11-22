"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

export const description = "A bar chart with chapter success and failure data";

// Function to generate color based on label length
const getDistinctColor = (index, totalItems) => {
  const hue = (index * (360 / totalItems)) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

// Sample test result data per book
const bookData = {
  "Oral and Maxillofacial Surgery for the Clinician": [
    { chapter: "Chapter 1", success: 10, failure: 2 },
    { chapter: "Chapter 2", success: 8, failure: 3 },
    { chapter: "Chapter 3", success: 7, failure: 1 },
  ],
  "Basic Cardiac Rhythms-Identification and Response": [
    { chapter: "Chapter 1", success: 15, failure: 5 },
    { chapter: "Chapter 2", success: 12, failure: 4 },
    { chapter: "Chapter 3", success: 14, failure: 6 },
  ],
};

// Chart configuration
const chartConfig = {
  success: { label: "Success" },
  failure: { label: "Failure" },
};

export default function ChartDemo() {
  const [selectedBook, setSelectedBook] = useState(
    "Oral and Maxillofacial Surgery for the Clinician",
  );
  const chartData = bookData[selectedBook];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Chapter Test Results</CardTitle>
            <CardDescription>
              Select a book to view its chapter test results
            </CardDescription>
          </div>
          <div>
            <Select
              onValueChange={(value) => setSelectedBook(value)}
              defaultValue={selectedBook}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oral and Maxillofacial Surgery for the Clinician">
                  Oral and Maxillofacial Surgery for the Clinician
                </SelectItem>
                <SelectItem value="Basic Cardiac Rhythms-Identification and Response">
                  Basic Cardiac Rhythms-Identification and Response
                </SelectItem>
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
              dataKey="chapter"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            {/* <YAxis tickLine={false} axisLine={false} /> */}
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="success" fill="#4caf50" radius={8} name="Success" />
            <Bar dataKey="failure" fill="#f44336" radius={8} name="Failure" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
