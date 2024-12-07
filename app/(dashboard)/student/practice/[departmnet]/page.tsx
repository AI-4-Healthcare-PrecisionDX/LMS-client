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
import { Brain, CheckCircle2, Clock, Info } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useReducer } from "react";

type Thread = {
  name: string | null;
  doctor_notes: string | null;
  diagnosis: string | null;
  treatment: string | null;
  scenario_thread_id: string;
};

type Scenario = {
  scenario_id: string;
  scenario_title: string;
  patient_name: string;
  patient_age: string;
  patient_gender: string;
  patient_chief_complaint: string;
};

type ScenarioWithThread = {
  thread: Thread;
  scenario: Scenario;
};

type ApiResponse = {
  department_scenarios: Scenario[];
  evaluated_scenarios: ScenarioWithThread[];
  unevaluated_scenarios: ScenarioWithThread[];
};

const initialState = {
  selectedScenario: null as Scenario | null,
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

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["scenarios", params.departmnet],
    queryFn: async () => {
      const response = await api.get(
        `/clinical-practice/department/${params.departmnet}/scenarios`,
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
          {error instanceof Error ? error.message : "Please try again later"}
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

  if (
    !data ||
    (!data.department_scenarios.length &&
      !data.evaluated_scenarios.length &&
      !data.unevaluated_scenarios.length)
  ) {
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
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <Link
              href="/student/practice"
              className="hover:text-primary transition-colors"
            >
              Practice
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {params.departmnet.toString().replace(/-/g, " ")}
            </span>
          </li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
        Clinical Scenarios
      </h1>
      <h2 className="text-2xl font-semibold mb-4 dark:text-white flex items-center gap-2">
        <Brain className="w-6 h-6 text-blue-500" />
        Available Scenarios ({data.department_scenarios.length})
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.department_scenarios.map((scenario) => (
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
                Age: {scenario.patient_age} | Gender: {scenario.patient_gender}
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
                      <p>Gender: {scenario.patient_gender}</p>
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
                Start Case
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {data.evaluated_scenarios.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white flex items-center gap-2 mt-4">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Completed Cases ({data.evaluated_scenarios.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {data.evaluated_scenarios.map(({ scenario, thread }) => (
              <Card key={thread.scenario_thread_id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {thread.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300">
                    Patient: {scenario.patient_name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Age: {scenario.patient_age} | Gender:{" "}
                    {scenario.patient_gender}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Info className="w-4 h-4 mr-2" />
                        View Decision
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>My Decision</DialogTitle>
                      </DialogHeader>
                      {thread.doctor_notes && (
                        <div>
                          <h4 className="font-semibold">My Notes</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {thread.doctor_notes}
                          </p>
                        </div>
                      )}
                      {thread.diagnosis && (
                        <div>
                          <h4 className="font-semibold">My Diagnosis</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {thread.diagnosis}
                          </p>
                        </div>
                      )}
                      {thread.treatment && (
                        <div>
                          <h4 className="font-semibold">My Treatment</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {thread.treatment}
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/student/practice/${params.departmnet}/${thread.scenario_thread_id}/details`,
                      )
                    }
                  >
                    View Evaluation
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {data.unevaluated_scenarios.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            On Going Cases ({data.unevaluated_scenarios.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {data.unevaluated_scenarios.map(({ scenario, thread }) => (
              <Card key={thread.scenario_thread_id} className="flex flex-col">
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
                    Age: {scenario.patient_age} | Gender:{" "}
                    {scenario.patient_gender}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/student/practice/${params.departmnet}/${thread.scenario_thread_id}`,
                      )
                    }
                  >
                    Continue Case
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
