"use client";
import AreaChartComponent from "@/components/brand/admin/dashboard/AreaChartComponent";
import CardInfo from "@/components/brand/admin/dashboard/CardInfo";
import Conduct from "@/components/brand/admin/dashboard/Conduct";
import CPD from "@/components/brand/admin/dashboard/CPD";
import Establishment from "@/components/brand/admin/dashboard/Establishment";
import Participation from "@/components/brand/admin/dashboard/Participation";
import Performance from "@/components/brand/admin/dashboard/Performance";
import PieChartComponent from "@/components/brand/admin/dashboard/PieChartComponent";
import Qualification from "@/components/brand/admin/dashboard/Qualification";
import ChatSystem from "@/components/brand/admin/chatsystem/chatsystem";
const LevelChartData = [
  { browser: "chrome", visitors: 40, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 35, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 25, fill: "var(--color-firefox)" },
];

const LevelChartConfig = {
  chrome: {
    label: "Professors",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Lecturers",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Assistants",
    color: "hsl(var(--chart-3))",
  },
};

const DistributionChartData = [
  { browser: "chrome", visitors: 30, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 20, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 25, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 25, fill: "var(--color-edge)" },
];

const DistributionChartConfig = {
  chrome: {
    label: "Medicine",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Surgery",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Peditrics",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Radiology",
    color: "hsl(var(--chart-4))",
  },
};

const TimeAllocationChartData = [
  { browser: "chrome", visitors: 60, fill: "var(--color-chrome)" },
  // { browser: "safari", visitors: 95, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 40, fill: "var(--color-firefox)" },
  // { browser: "edge", visitors: 95, fill: "var(--color-edge)" },
];

const TimeAllocationChartConfig = {
  firefox: {
    label: "Research",
    color: "hsl(var(--chart-3))",
  },
  chrome: {
    label: "Teaching",
    color: "hsl(var(--chart-1))",
  },
};

const chartData = [
  { quarter: "2019", desktop: 65 },
  { quarter: "2020", desktop: 70 },
  { quarter: "2021", desktop: 75 },
  { quarter: "2022", desktop: 80 },
  { quarter: "2023", desktop: 85 },
];

const chartConfig = {
  desktop: {
    label: "Performance Improvement Over Time",
    color: "hsl(var(--chart-2))",
  },
};

const ExperienceChartData = [
  { quarter: "1-3 Years", desktop: 20 },
  { quarter: "4-6 Years", desktop: 30 },
  { quarter: "7-10 Years", desktop: 25 },
  { quarter: "11+ Years", desktop: 25 },
];

const ExperienceChartConfig = {
  desktop: {
    label: "Experience Levels",
    color: "hsl(var(--chart-2))",
  },
};

const BudgetUtilizationChartData = [
  { quarter: "Q1", desktop: 20 },
  { quarter: "Q2", desktop: 40 },
  { quarter: "Q3", desktop: 60 },
  { quarter: "Q4", desktop: 80 },
];

const BudgetUtilizationChartConfig = {
  desktop: {
    label: "Development Program Budget Utilization",
    color: "hsl(var(--chart-2))",
  },
};

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="p-4 text-3xl font-semibold">
        Admin Dashboard - Medical College
      </h1>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-4">
        <CardInfo title="Total Number of Academic Staff" value="150" />
        <CardInfo title="Staff-Student Ratio" value="1 : 20" />
        {/* <CardInfo title="Performance Evaluation Score" value="85%" /> */}
        <CardInfo title="Number of Staff Under Review" value="5" />
        <CardInfo title="Active Research Staff" value="40%" />
        {/* <CardInfo title="Compliance with Conduct Code" value="95%" /> */}
        <CardInfo
          title="Percentage of Staff in Professional Development Programs"
          value="75%"
        />
        <CardInfo title="Number of Development Sessions Conducted" value="30" />
        <CardInfo title="Budget Allocated for Development" value="$100,000" />
        <CardInfo title="Completion Rate of Development Programs" value="90%" />
      </div>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        <Qualification />
        <AreaChartComponent
          title={"Experience Levels"}
          chartConfig={ExperienceChartConfig}
          chartData={ExperienceChartData}
        />
        <Performance />
        <Conduct />
        <PieChartComponent
          title={"Staff Distribution by Department"}
          chartConfig={DistributionChartConfig}
          chartData={DistributionChartData}
        />
        <Establishment />
        <AreaChartComponent
          title={"Performance Improvement Over Time"}
          chartConfig={chartConfig}
          chartData={chartData}
        />
        <Participation />
        <CPD />
        <PieChartComponent
          title={"Teaching vs Research Time Allocation"}
          chartConfig={TimeAllocationChartConfig}
          chartData={TimeAllocationChartData}
        />
        <AreaChartComponent
          title={"Development Program Budget Utilization"}
          chartConfig={BudgetUtilizationChartConfig}
          chartData={BudgetUtilizationChartData}
        />
        <PieChartComponent
          title={"Staff by Level/Rank"}
          chartConfig={LevelChartConfig}
          chartData={LevelChartData}
        />
      </div>
      <ChatSystem />
    </div>
  );
}
