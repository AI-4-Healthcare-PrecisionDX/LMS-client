"use client";
import ChartDemo from "@/components/brand/dashboard/ChartDemo";
import { AcademicCapIcon, DocumentIcon } from "@heroicons/react/outline";
import AreaChartDemo from "@/components/brand/dashboard/AreaChartDemo";
import MaxStreak from "@/components/brand/dashboard/MaxStreak";
import { BookOpenIcon } from "lucide-react";
import TaskDemo from "@/components/brand/dashboard/TaskDemo";
import StudyPlan from "@/components/brand/dashboard/StudyPlan";
import DashboardCard from "@/components/brand/dashboard/DashboardCard";
import ChatSystem from "@/components/brand/student/chatsystem/chatsystem";

export default function Dashboard() {
  return (
    <div>
      <h1 className="p-4 text-3xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Test Taken"
          value="20"
          icon={<AcademicCapIcon className="w-8 h-8 text-blue-500" />}
          change={85}
          color="light-blue"
          gradient="rgb(204, 255, 255)"
          subsection="The total number of tests taken across all books and chapters."
        />
        <DashboardCard
          title="Total Books Covered"
          value="3"
          icon={<BookOpenIcon className="w-8 h-8 text-purple-500" />}
          change={-1}
          color="light-purple"
          gradient="rgb(255, 204, 255)"
          subsection="The number of books that have been covered."
        />
        <DashboardCard
          title="Total Chapters Covered"
          value="32"
          icon={<DocumentIcon className="w-8 h-8 text-green-500" />}
          change={17}
          color="light-green"
          gradient="rgb(204, 255, 204)"
          subsection="The total number of chapters covered across all books."
        />
        {/* <DashboardCard
                    title="Total Expense"
                    value="$30,000"
                    icon={<DollarSign className="w-8 h-8 text-red-500" />}
                    change={5000}
                    color="light-red"
                /> */}
        <MaxStreak
          streak={1}
          maxStreak={3}
          // gradient="rgb(255, 199, 138)"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col">
          <div className="col-span-1 p-4 rounded-lg shadow-card">
            <TaskDemo />
          </div>
          {/* Add the ApexChart component */}
          <div className="col-span-1 p-4 rounded-lg shadow-card">
            <StudyPlan />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="col-span-1 p-4 rounded-lg shadow-card">
            <AreaChartDemo />
          </div>
          {/* Add additional charts using ApexChartComponent */}
          <div className="col-span-1 p-4 rounded-lg shadow-card">
            <ChartDemo />
          </div>
        </div>
      </div>
      <ChatSystem />
    </div>
  );
}
