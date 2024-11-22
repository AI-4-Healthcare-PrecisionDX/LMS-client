"use client";
import AreaChartComponent from "@/components/brand/admin/dashboard/AreaChartComponent";
import CardInfo from "@/components/brand/admin/dashboard/CardInfo";
import Conduct from "@/components/brand/admin/dashboard/Conduct";
import CPD from "@/components/brand/admin/dashboard/CPD";
import Establishment from "@/components/brand/admin/dashboard/Establishment";
import Participation from "@/components/brand/admin/dashboard/Participation";
import Performance from "@/components/brand/admin/dashboard/Performance";
import PieChartComponent from "@/components/brand/admin/dashboard/PieChartComponent";
import PieChartComponentFilter from "@/components/brand/admin/students/PieChartComponentFilter";
import Qualification from "@/components/brand/admin/dashboard/Qualification";
import AdmissionsByDepartmentChart from "@/components/brand/admin/students/AdmissionsByDepartmentChart";
import ComplaintsResolutionChart from "@/components/brand/admin/students/ComplaintsResolutionChart";
import ApplicationSuccessRateChart from "@/components/brand/admin/students/ApplicationSuccessRateChart";
import AdmissionTrendChart from "@/components/brand/admin/students/AdmissionTrendChart";
import StudentIntakeTrendChart from "@/components/brand/admin/students/StudentIntakeTrendChart";

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

const SeatfillChartData = [
  { browser: "chrome", visitors: 250, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 50, fill: "var(--color-safari)" },
];

const SeatfillChartConfig = {
  chrome: {
    label: "Filled",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Not Filled",
    color: "hsl(var(--chart-2))",
  },
};

const ReApplicationChartData = [
  { browser: "firefox", visitors: 50, fill: "var(--color-firefox)" },
  { browser: "chrome", visitors: 50, fill: "var(--color-chrome)" },
];

const ReApplicationChartConfig = {
  firefox: {
    label: "Rejected",
    color: "hsl(var(--chart-3))",
  },
  chrome: {
    label: "Successful",
    color: "hsl(var(--chart-1))",
  },
};

const InternationalChartData = [
  { browser: "firefox", visitors: 70, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 30, fill: "var(--color-edge)" },
];

const InternationalChartConfig = {
  firefox: {
    label: "Local Students",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "International Students",
    color: "hsl(var(--chart-4))",
  },
};

const SelectionProcessStagesChartData = [
  { browser: "chrome", visitors: 300, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 150, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 100, fill: "var(--color-edge)" },
];

const SelectionProcessStagesChartConfig = {
  chrome: {
    label: "Application",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Interview",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Offer Made",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Offer Accepted",
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

export default function StudentsAdmin() {
  return (
    <div>
      <h1 className="p-4 text-3xl font-semibold">
        Admin Dashboard - Students Statistics
      </h1>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-4">
        <CardInfo title="Total Student Intake" value="230" />
        {/* <CardInfo title="Re-applicants" value="50" /> */}
        <CardInfo title="Deferred Entry" value="10" />
        {/* <CardInfo title="Transfer Students" value="10" /> */}
        <CardInfo title="Complaints" value="20" />
        <CardInfo title="App. to Admission Ratio" value="1 : 5" />
      </div>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        <PieChartComponent
          title={"Seats vs Filled"}
          chartConfig={SeatfillChartConfig}
          chartData={SeatfillChartData}
        />
        <PieChartComponent
          title={"International vs Local"}
          chartConfig={InternationalChartConfig}
          chartData={InternationalChartData}
        />
        <StudentIntakeTrendChart />
        <PieChartComponent
          title={"Re-application Success Rate"}
          chartConfig={ReApplicationChartConfig}
          chartData={ReApplicationChartData}
        />
        <PieChartComponent
          title={"Selection Process Stages"}
          chartConfig={SelectionProcessStagesChartConfig}
          chartData={SelectionProcessStagesChartData}
        />
        <PieChartComponentFilter />
        <ApplicationSuccessRateChart />
        <AdmissionsByDepartmentChart />
        <ComplaintsResolutionChart />
        <AdmissionTrendChart />
      </div>
    </div>
  );
}
