"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export default function MaxStreak({ streak, maxStreak }) {
  return (
    <Card className="">
      <CardContent className="flex gap-4 p-4">
        <div className="flex flex-col align-items-center justify-center gap-4">
          <div className="grid gap-0.5">
            <div className="text-sm font-bold text-muted-foreground">
              Streak
            </div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {streak}
              <span className="text-sm font-normal text-muted-foreground">
                Days
              </span>
            </div>
          </div>
          <div className="grid gap-0.5">
            <div className="text-sm font-bold text-muted-foreground">Max</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {maxStreak}
              <span className="text-sm font-normal text-muted-foreground">
                Days
              </span>
            </div>
          </div>
        </div>
        <ChartContainer
          config={{
            move: {
              label: "Move",
              color: "hsl(var(--chart-1))",
            },
            exercise: {
              label: "Exercise",
              color: "hsl(var(--chart-2))",
            },
            stand: {
              label: "Stand",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="mx-auto aspect-square w-40 max-w-[80%]"
        >
          <RadialBarChart
            margin={{
              left: -10,
              right: -10,
              top: -10,
              bottom: -10,
            }}
            data={[
              {
                activity: "stand",
                value: (8 / 12) * 100,
                fill: "var(--color-stand)",
              },
              {
                activity: "exercise",
                value: (46 / 60) * 100,
                fill: "var(--color-exercise)",
              },
              {
                activity: "move",
                value: (245 / 360) * 100,
                fill: "var(--color-move)",
              },
            ]}
            innerRadius="20%"
            barSize={24}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              dataKey="value"
              tick={false}
            />
            <RadialBar dataKey="value" background cornerRadius={5} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
