"use client";

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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a label";

const chartData = [
  // { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 95, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 5, fill: "var(--color-firefox)" },
  // { browser: "edge", visitors: 95, fill: "var(--color-edge)" },
];

const chartConfig = {
  firefox: {
    label: "Incidents",
    color: "hsl(var(--chart-3))",
  },
  safari: {
    label: "No Incidents",
    color: "hsl(var(--chart-2))",
  },
};

export default function Conduct() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Staff Conduct</CardTitle>
        <CardDescription>
          Conduct data is monitored through incident reports, and the compliance
          rate is calculated by dividing the number of compliant staff by the
          total staff and multiplying by 100.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
