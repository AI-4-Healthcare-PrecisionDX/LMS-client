"use client";
export const runtime = "edge";
import ConversationsTab from "@/components/brand/student/virtual-room/details/convertions";
import DiagnosisTab from "@/components/brand/student/virtual-room/details/diagnosis-tab";
import EvaluationsTab from "@/components/brand/student/virtual-room/details/evaluation";
import OverviewTab from "@/components/brand/student/virtual-room/details/overview";
import PatientHeader from "@/components/brand/student/virtual-room/details/patient-card";
import {
  evaluationsInitialState,
  evaluationsReducer,
} from "@/components/brand/student/virtual-room/details/reducer";
import { ScenarioData } from "@/components/brand/student/virtual-room/details/types";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useReducer } from "react";

const items = [
  { href: "/student", label: "Home" },
  { href: "/student/practice", label: "Department List" },
  { label: "Case History" },
];

const ITEMS_TO_DISPLAY = 3;

// Main Component
export default function PatientInfoPage() {
  const [state, dispatch] = useReducer(
    evaluationsReducer,
    evaluationsInitialState,
  );
  const searchParams = useSearchParams();
  const params = useParams();

  const { data, isLoading } = useQuery<ScenarioData>({
    queryKey: ["scenario-details", params.virtualRoom],
    queryFn: async () => {
      const response = await api.get(
        `/clinical-practice/${params.virtualRoom}/details`,
      );
      return response.data;
    },
  });

  useEffect(() => {
    const decision = searchParams.get("decision");
    if (decision === "true") {
      dispatch({ type: "SET_ACTIVE_TAB", payload: "evaluations" });
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-8 h-8 animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-8 h-8 text-gray-400"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <div className="space-y-3">
          <div className="w-[200px] h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-[300px] h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 pb-2 mx-auto text-gray-900 dark:text-gray-100">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between w-full">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
          <Link href="/student/practice">
            <Button variant="outline">
              <MoveLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 border-b dark:border-gray-700">
          <PatientHeader patient={data.scenario} />
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Messages:
              </span>
              <span className="text-sm font-medium dark:text-gray-200">
                {data.thread_messages.length}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Overall Score:
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {data.evaluation.overall_score}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs
          value={state.activeTab}
          onValueChange={(value) =>
            dispatch({ type: "SET_ACTIVE_TAB", payload: value })
          }
          className="w-full"
        >
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 mb-6 shadow-sm dark:bg-gray-800/50">
            <TabsTrigger
              value="overview"
              className="rounded-md px-6 font-medium"
            >
              Patient Overview
            </TabsTrigger>
            <TabsTrigger
              value="conversations"
              className="rounded-md px-6 font-medium"
            >
              Case Discussion
            </TabsTrigger>
            <TabsTrigger
              value="diagnosis"
              className="rounded-md px-6 font-medium"
            >
              Clinical Notes
            </TabsTrigger>
            <TabsTrigger
              value="evaluations"
              className="rounded-md px-6 font-medium"
            >
              Performance Review
            </TabsTrigger>
          </TabsList>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <TabsContent value="overview">
              <OverviewTab scenario={data.scenario} />
            </TabsContent>

            <TabsContent value="conversations">
              <ConversationsTab messages={data.thread_messages} />
            </TabsContent>

            <TabsContent value="diagnosis">
              <DiagnosisTab thread={data.thread} />
            </TabsContent>

            <TabsContent value="evaluations">
              <EvaluationsTab evaluation={data.evaluation} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
