"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardCard({
  title,
  value,
  icon,
  change,
  color,
  gradient,
  subsection,
}) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-xs font-medium">
            {subsection}
          </CardDescription>
        </div>
        {icon}
        {/* <DollarSign className="w-4 h-4 text-muted-foreground" /> */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${change > 0 ? "text-green-600" : "text-red-500"}`}
        >
          {change > 0 ? "▲" : "▼"} {Math.abs(change)}% avg. score in last 7 days
        </p>
      </CardContent>
    </Card>
  );
}
