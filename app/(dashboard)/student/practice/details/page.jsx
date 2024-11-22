"use client";

import { useReducer, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ClipboardList,
  FileText,
  Stethoscope,
  Pill,
  Activity,
  Star,
  MoveLeft,
} from "lucide-react";
import { patientCasePracticeDetails } from "@/data";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertCircle } from "lucide-react";
import CaseModal from "@/components/brand/student/practice/CaseModal";

const initialState = {
  activeTab: "overview",
  patientData: patientCasePracticeDetails,
  evaluations: {
    conversation: {
      score: 4,
      feedback:
        "Excellent communication skills demonstrated. The doctor showed empathy and clearly explained the diagnosis and treatment options.",
    },
    notes: {
      score: 3,
      feedback:
        "Comprehensive notes, but could be more concise. Ensure all key points are highlighted for quick reference.",
    },
    diagnosis: {
      score: 5,
      feedback:
        "Thorough and accurate diagnosis. All symptoms were carefully considered, and appropriate tests were ordered to confirm the diagnosis.",
    },
    treatment: {
      score: 4,
      feedback:
        "Well-structured treatment plan. Consider including more details on potential side effects of prescribed medications.",
    },
  },
  patientCases: [
    {
      id: 1,
      caseNumber: "C002",
      date: "2023-07-15",
      patientName: "Ayesha Rahman",
      age: 50,
      gender: "Female",
      chiefComplaint: "Shortness of breath",
      description:
        "Patient presents with a gradual onset of shortness of breath over the last 3 days. Symptoms worsened today, particularly with exertion. No history of chest pain or cough. Patient rates her discomfort 7/10. Mild relief when sitting upright.",
      physicalExamFindings:
        "Vital Signs: BP 130/85, HR 102, RR 24, Temp 36.8°C, SpO2 92% on room air. General: Patient appears in mild respiratory distress. Cardiovascular: Tachycardia, no murmurs. Lungs: Diminished breath sounds at the bases bilaterally, no wheezes. Abdomen: Soft, non-tender. Extremities: Mild ankle edema, pulses equal bilaterally.",
    },
    {
      id: 2,
      caseNumber: "C003",
      date: "2023-05-20",
      patientName: "Arif Hossain",
      age: 60,
      gender: "Male",
      chiefComplaint: "Severe headache",
      description:
        "Patient complains of a sudden, severe headache that started while watching TV. Describes it as 'the worst headache of my life' and rates it 9/10. No relief with rest or over-the-counter medication. Associated symptoms include nausea and sensitivity to light.",
      physicalExamFindings:
        "Vital Signs: BP 160/100, HR 88, RR 18, Temp 36.9°C, SpO2 98% on room air. General: Patient appears in significant discomfort. Neurological: Alert, oriented. Cardiovascular: Regular rate and rhythm. Lungs: Clear to auscultation bilaterally. Abdomen: Soft, non-tender. Extremities: No edema, pulses equal bilaterally.",
    },
    {
      id: 3,
      caseNumber: "C004",
      date: "2023-08-02",
      patientName: "Mahbubul Karim",
      age: 55,
      gender: "Male",
      chiefComplaint: "Dizziness and palpitations",
      description:
        "Patient reports a 1-day history of dizziness and palpitations, particularly when standing or walking. No chest pain or shortness of breath. Symptoms are intermittent and patient rates the discomfort 6/10. No relief with rest.",
      physicalExamFindings:
        "Vital Signs: BP 140/85, HR 110, RR 18, Temp 36.7°C, SpO2 96% on room air. General: Patient appears mildly uncomfortable. Cardiovascular: Irregularly irregular rhythm, no murmurs. Lungs: Clear to auscultation bilaterally. Abdomen: Soft, non-tender. Extremities: No edema, pulses equal bilaterally.",
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}

const items = [
  { href: "/student", label: "Home" },
  { href: "/student/practice", label: "Department List" },
  { label: "Case History" },
];

const ITEMS_TO_DISPLAY = 3;

export default function PatientInfoPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchParams = useSearchParams();

  useEffect(() => {
    const decision = searchParams.get("decision");
    if (decision === "true") {
      dispatch({ type: "SET_ACTIVE_TAB", payload: "evaluations" });
    }
  }, [searchParams]);

  const renderStars = (score) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < score ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="container px-4 pb-2 mx-auto dark:text-gray-100">
      <div className="sticky top-0 z-10 pb-2 bg-background">
        <div className="flex items-center justify-between w-full pt-4 pb-2">
          <BreadcrumbResponsive
            items={items}
            ITEMS_TO_DISPLAY={ITEMS_TO_DISPLAY}
          />
          <Link href="/student/practice">
            <Button variant="outline">
              <MoveLeft className="w-4 h-4 mr-2" />
              Back to Department List
            </Button>
          </Link>
        </div>
      </div>
      <header className="flex flex-col items-start justify-between p-1 px-4 py-2 mb-4 space-y-4 bg-white rounded-md md:flex-row md:items-center md:space-y-0 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="Patient"
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{state.patientData.name}</h1>
            <p className="text-muted-foreground">
              Patient ID: {state.patientData.id}
            </p>
          </div>
        </div>
      </header>

      <Tabs
        value={state.activeTab}
        onValueChange={(value) =>
          dispatch({ type: "SET_ACTIVE_TAB", payload: value })
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-white md:grid-cols-3 lg:grid-cols-7 dark:bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">Test Reports</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="notes">Doctor's Notes</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-1/3 font-semibold">Age:</dt>
                    <dd>{state.patientData.age} years</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 font-semibold">Gender:</dt>
                    <dd>{state.patientData.gender}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 font-semibold">Blood Type:</dt>
                    <dd>{state.patientData.bloodType}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 font-semibold">Height:</dt>
                    <dd>{state.patientData.height}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 font-semibold">Weight:</dt>
                    <dd>{state.patientData.weight}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Case Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{state.patientData.caseScenario}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Medical Test Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="scroll-area max-h-[60vh] overflow-y-auto">
                <ul className="space-y-4">
                  {state.patientData.testReports.map((report) => (
                    <li
                      key={report.id}
                      className="flex items-start p-2 space-x-4 rounded-lg hover:bg-muted"
                    >
                      <FileText className="w-6 h-6 mt-1 text-primary" />
                      <div>
                        <p className="font-semibold">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {report.date}
                        </p>
                        <p className="mt-1">{report.result}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>Doctor-Patient Conversation History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="scroll-area max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {state.patientData.conversations.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "doctor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.role === "doctor"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="mb-1 text-sm font-semibold">
                          {message.role === "doctor"
                            ? "Dr. Johnson"
                            : "Sarah Collins"}
                        </p>
                        <p>{message.content}</p>
                        <p className="mt-1 text-xs text-right opacity-70">
                          {message.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Doctor's Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="scroll-area max-h-[60vh] overflow-y-auto">
                <ul className="space-y-4">
                  {state.patientData.doctorNotes.map((note) => (
                    <li
                      key={note.id}
                      className="p-2 space-y-2 rounded-lg hover:bg-muted"
                    >
                      <div className="flex items-center space-x-2">
                        <ClipboardList className="w-6 h-6 text-primary" />
                        <p className="font-semibold">Note #{note.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {note.date}
                        </p>
                      </div>
                      <p>{note.content}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="scroll-area max-h-[60vh] overflow-y-auto">
                <ul className="space-y-4">
                  {state.patientData.diagnoses.map((diagnosis) => (
                    <li
                      key={diagnosis.id}
                      className="p-2 space-y-2 rounded-lg hover:bg-muted"
                    >
                      <div className="flex items-center space-x-2">
                        <Activity className="w-6 h-6 text-primary" />
                        <p className="font-semibold">{diagnosis.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {diagnosis.date}
                        </p>
                      </div>
                      <p>{diagnosis.details}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="scroll-area max-h-[60vh] overflow-y-auto">
                <ul className="space-y-4">
                  {state.patientData.treatments.map((treatment) => (
                    <li
                      key={treatment.id}
                      className="p-2 space-y-2 rounded-lg hover:bg-muted"
                    >
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-6 h-6 text-primary" />
                        <p className="font-semibold">
                          Treatment Plan #{treatment.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {treatment.date}
                        </p>
                      </div>
                      <p>{treatment.plan}</p>
                      <div className="mt-2">
                        <p className="font-semibold">Medications:</p>
                        <ul className="list-disc list-inside">
                          {treatment.medications.map((med, index) => (
                            <li
                              key={index}
                              className="flex items-center ml-4 space-x-2"
                            >
                              <Pill className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {med.name}: {med.dosage}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <p className="font-semibold">
                          Lifestyle Recommendations:
                        </p>
                        <ul className="list-disc list-inside">
                          {treatment.lifestyle.map((item, index) => (
                            <li key={index} className="ml-4">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>Performance Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="scroll-area max-h-[60vh] overflow-y-auto">
                <div className="space-y-6">
                  {Object.entries(state.evaluations).map(([key, value]) => (
                    <Card key={key} className="p-4">
                      <CardTitle className="mb-2 text-lg font-semibold capitalize">
                        {key} Evaluation
                      </CardTitle>
                      <div className="flex items-center mb-2 space-x-2">
                        <span className="font-medium">Score:</span>
                        <div className="flex">{renderStars(value.score)}</div>
                      </div>
                      <p>
                        <span className="font-medium">Feedback:</span>{" "}
                        {value.feedback}
                      </p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div>
        <h2 className="my-4 text-xl font-semibold">Explore Similar Cases</h2>
        <div className="grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
          {state.patientCases.map((patientCase) => (
            <Card key={patientCase.id} className="flex flex-col h-full">
              <CardContent className="flex-grow p-0">
                <div className="p-4 text-white bg-primary dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      {patientCase.caseNumber}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {patientCase.date}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{patientCase.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {patientCase.age} years, {patientCase.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium">Chief Complaint</p>
                      <p className="text-sm">{patientCase.chiefComplaint}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-sm line-clamp-2">
                        {patientCase.description.slice(0, 45)} ...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Physical Exam</p>
                      <p className="text-sm line-clamp-2">
                        {patientCase.physicalExamFindings.slice(0, 45)} ...
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 mt-auto bg-secondary">
                <div className="flex items-center justify-between w-full">
                  <CaseModal patientCase={patientCase} />
                  <Link href="/student/practice/virtual-room">
                    <Button
                      className="transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
                      variant="default"
                    >
                      Test Your Skills
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
