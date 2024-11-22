"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
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

const diversityData = {
  gender: {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  },
  ethnicity: {
    labels: ["White", "Asian", "Others"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#FFCE56", "#36A2EB", "#FF6384"],
      },
    ],
  },
  socioEconomic: {
    labels: ["Low-Income", "Others"],
    datasets: [
      {
        data: [20, 80],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  },
};

const chartConfig = [];

export default function PieChartComponentFilter() {
  const [filter, setFilter] = useState("gender");

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const chartData = diversityData[filter].datasets[0].data.map(
    (value, index) => ({
      name: diversityData[filter].labels[index],
      value: value,
      fill: diversityData[filter].datasets[0].backgroundColor[index],
    }),
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Diversity in Admissions</CardTitle>
        {/* Dropdown filter for category selection using Shadcn Select */}
        <Select onValueChange={handleFilterChange} defaultValue={filter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gender">Gender</SelectItem>
            <SelectItem value="ethnicity">Ethnicity</SelectItem>
            <SelectItem value="socioEconomic">Socio-Economic</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Pie Chart based on selected filter */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" label nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
