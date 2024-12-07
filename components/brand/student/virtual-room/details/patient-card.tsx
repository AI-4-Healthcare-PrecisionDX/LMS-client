import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scenario } from "./types";

const PatientHeader = ({ patient }: { patient: Scenario }) => (
  <header className="flex flex-col items-start justify-between p-1 px-4 py-2 mb-4 space-y-4 bg-white rounded-md md:flex-row md:items-center md:space-y-0 dark:bg-gray-800">
    <div className="flex items-center space-x-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Patient" />
        <AvatarFallback>PT</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{patient.patient_name}</h1>
        <p className="text-muted-foreground">Case ID: {patient.scenario_id}</p>
      </div>
    </div>
  </header>
);

export default PatientHeader;
