"use client";

import { useReducer } from "react";
import {
  Plus,
  X,
  User,
  Calendar,
  FileText,
  Stethoscope,
  PlusCircle,
  AlertCircle,
  MoveLeft,
  CircleChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PastCase from "@/components/brand/student/practice/past-case";
import { BreadcrumbResponsive } from "@/components/BreadCrumb";
import CaseModal from "@/components/brand/student/practice/CaseModal";

const initialState = {
  patientCases: [
    {
      id: 1,
      caseNumber: "C004",
      date: "2023-06-01",
      patientName: "Sarah Collins",
      age: 34,
      gender: "Female",
      chiefComplaint: "Recurrent severe headaches",
      description:
        "Sarah reports experiencing severe, throbbing headaches on one side of her head for the past two years. The pain is often accompanied by nausea, sensitivity to light, and occasionally blurred vision. The headaches occur about twice a month, lasting 6–12 hours, and are often triggered by stress or lack of sleep. She rates the pain as 9/10 during episodes. Over-the-counter pain medications provide minimal relief.",
      physicalExamFindings:
        "Vital Signs: BP 150/90, HR 98, RR 20, Temp 37.2°C, SpO2 97% on room air. General: Patient appears uncomfortable and anxious. Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops. Lungs: Clear to auscultation bilaterally. No wheezes or crackles. Abdomen: Soft, non-tender, non-distended. Extremities: No edema, pulses equal bilaterally.",
    },
    {
      id: 2,
      caseNumber: "C005",
      date: "2023-06-02",
      patientName: "Michael Stevens",
      age: 52,
      gender: "Male",
      chiefComplaint: "Chest discomfort and high blood pressure",
      description:
        "Michael reports experiencing occasional chest discomfort over the past month, especially during physical exertion or when climbing stairs. The pain is mild but worrisome. He was recently diagnosed with hypertension, and his blood pressure has been consistently high, around 160/95, despite attempts at dietary changes. He has a family history of heart disease—his father had a heart attack at age 55.",
      physicalExamFindings: "No neurological deficits observed.",
    },
    {
      id: 3,
      caseNumber: "C006",
      date: "2023-06-03",
      patientName: "Daniel Harris",
      age: 60,
      gender: "Male",
      chiefComplaint: "Chronic cough and shortness of breath",
      description:
        "Daniel has been experiencing a chronic, productive cough for the past year, along with increasing shortness of breath, especially during exertion. He smoked for 30 years but quit 5 years ago. His symptoms have progressively worsened, and he often feels fatigued. He reports occasional wheezing but denies chest pain or fever.",
      physicalExamFindings:
        "Limited range of motion in lumbar spine. No edema. Pulses equal bilaterally. No wheezes or crackles.",
    },
  ],
  previousPatientCases: [
    {
      id: 1,
      caseNumber: "C001",
      date: "2023-06-01",
      patientName: "John Doe",
      age: 45,
      gender: "Male",
      chiefComplaint: "Chest pain",
      description:
        "Patient reports sudden onset of chest pain radiating to the left arm. Pain started approximately 2 hours ago while patient was at rest. Patient describes the pain as crushing and rates it 8/10 on the pain scale. No relief with rest or over-the-counter pain medication.",
      physicalExamFindings:
        "Vital Signs: BP 150/90, HR 98, RR 20, Temp 37.2°C, SpO2 97% on room air. General: Patient appears uncomfortable and anxious. Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops. Lungs: Clear to auscultation bilaterally. No wheezes or crackles. Abdomen: Soft, non-tender, non-distended. Extremities: No edema, pulses equal bilaterally.",
    },
    {
      id: 2,
      caseNumber: "C002",
      date: "2023-06-02",
      patientName: "Jane Smith",
      age: 32,
      gender: "Female",
      chiefComplaint: "Migraine",
      description:
        "Patient complains of severe headache with nausea and vomiting. Pain is unilateral, pulsating, and aggravated by physical activity. Patient reports photophobia and phonophobia during episodes. Symptoms last 4-72 hours.",
      physicalExamFindings:
        "No neurological deficits observed. No focal neurological signs. No papilledema. No meningeal signs.",
    },
    {
      id: 3,
      caseNumber: "C003",
      date: "2023-06-03",
      patientName: "Bob Johnson",
      age: 58,
      gender: "Male",
      chiefComplaint: "Lower back pain",
      description:
        "Patient experiencing persistent lower back pain for the past 6 months. Pain is worse with prolonged sitting or standing. No history of trauma or injury. Pain radiates to the right leg and is associated with numbness and tingling. Pain is relieved with lying down.",
      physicalExamFindings:
        "Limited range of motion in lumbar spine with pain on flexion. No edema. Pulses equal bilaterally. No wheezes or crackles.",
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_CASE":
      return {
        ...state,
        patientCases: [...state.patientCases, action.payload],
      };
    default:
      return state;
  }
}

const items = [
  { href: "/student", label: "Home" },
  { href: "/student/practice", label: "Department List" },
  { label: "Case List" },
];

const ITEMS_TO_DISPLAY = 3;

export default function PatientCasePage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCase = {
      id: state.patientCases.length + 1,
      caseNumber: formData.get("caseNumber"),
      date: formData.get("date"),
      patientName: formData.get("patientName"),
      age: Number(formData.get("age")),
      gender: formData.get("gender"),
      chiefComplaint: formData.get("chiefComplaint"),
      description: formData.get("patientDescription"),
      physicalExamFindings: formData.get("physicalExamFindings"),
    };
    dispatch({ type: "ADD_CASE", payload: newCase });
  };

  const handleBack = () => {};

  return (
    <div className="container px-4 pb-2 mx-auto dark:text-gray-100">
      <div className="sticky top-0 z-10 pb-2 bg-background">
        <div className="flex items-center justify-between w-full pt-4">
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
      <div className="flex items-center justify-between mt-2 mb-6">
        <h1 className="text-3xl font-bold">Patient Cases</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
        {state.patientCases.map((patientCase) => (
          <Card key={patientCase.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 text-white bg-primary dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {patientCase.caseNumber}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="text-xs dark:bg-gray-950"
                  >
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
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
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
            <CardFooter className="p-4 bg-secondary">
              <div className="flex items-center justify-between w-full">
                <CaseModal patientCase={patientCase} />
                <Link href="/student/practice/virtual-room">
                  <Button className="dark:text-white">Test Your Skills</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="my-4 text-xl font-semibold"> Past Cases </h2>
        <div className="grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
          {state.previousPatientCases.map((patientCase) => (
            <PastCase key={patientCase.id} patientCase={patientCase} />
          ))}
        </div>
      </div>
    </div>
  );
}
