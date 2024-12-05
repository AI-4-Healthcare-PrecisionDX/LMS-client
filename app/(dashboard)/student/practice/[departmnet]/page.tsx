"use client";

export const runtime = "edge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
import { Brain, Info } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useReducer } from "react";

const initialState = {
  selectedScenario: null as Scenario | null,
};

type Scenario = {
  scenario_id: string;
  scenario_title: string;
  patient_name: string;
  patient_age: number;
  patient_chief_complaint: string;
};

type State = typeof initialState;
type Action = { type: "SET_SELECTED_SCENARIO"; payload: Scenario };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SELECTED_SCENARIO":
      return { ...state, selectedScenario: action.payload };
    default:
      return state;
  }
}

export default function DepartmentScenarios() {
  const params = useParams();
  const router = useRouter();
  const [, dispatch] = useReducer(reducer, initialState);

  const {
    data: scenarios = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["scenarios", params.departmnet],
    queryFn: async () => {
      const response = await api.get(
        `/clinical-practice/department/${params.departmnet}/scenarios?skip=0&limit=100`,
      );
      return response.data;
    },
  });

  const handleStartTest = async (scenario: Scenario) => {
    try {
      const response = await api.post(
        `/clinical-practice/${scenario.scenario_id}`,
      );
      const { scenario_thread_id } = response.data;
      router.push(
        `/student/practice/${params.departmnet}/${scenario_thread_id}`,
      );
    } catch (error) {
      console.error("Error starting test:", error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-red-500 text-xl font-semibold mb-4">
          Error loading scenarios
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          {error.message || "Please try again later"}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading scenarios...
        </p>
      </div>
    );
  }

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-xl font-semibold mb-4 dark:text-white">
          No Scenarios Available
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          There are currently no clinical scenarios available for this
          department.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
        Clinical Scenarios
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario: Scenario) => (
          <Card key={scenario.scenario_id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {scenario.scenario_title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
              <p className="text-gray-600 dark:text-gray-300">
                Patient: {scenario.patient_name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Age: {scenario.patient_age}
              </p>
            </CardContent>

            <CardFooter className="flex justify-between gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Info className="w-4 h-4 mr-2" />
                    Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{scenario.scenario_title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Patient Information</h4>
                      <p>Name: {scenario.patient_name}</p>
                      <p>Age: {scenario.patient_age}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Chief Complaint</h4>
                      <p>{scenario.patient_chief_complaint}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                className="flex-1"
                onClick={() => {
                  dispatch({
                    type: "SET_SELECTED_SCENARIO",
                    payload: scenario,
                  });
                  handleStartTest(scenario);
                }}
              >
                <Brain className="w-4 h-4 mr-2" />
                Test Skills
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
