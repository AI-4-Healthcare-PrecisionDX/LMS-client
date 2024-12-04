import { Card, CardContent, CardHeader } from "@/components/ui/card";
import api from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";

const getPatientCase = async (threadId: string) => {
  const response = await api.get(`/clinical-practice/thread/${threadId}`);
  return response.data;
};

export default function PatientInfo({ virtualRoom }: { virtualRoom: string }) {
  const {
    data: patientCase,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["patient-case", virtualRoom],
    queryFn: () => getPatientCase(virtualRoom),
  });
  if (isLoading) {
    return (
      <Card className="flex-1 patient-vitals">
        <CardContent className="flex items-center justify-center min-h-[100px]">
          <p>Loading patient information...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex-1 patient-vitals">
        <CardContent className="flex items-center justify-center min-h-[100px]">
          <p className="text-red-500">
            Error loading patient information. Please try again later.
          </p>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="flex-1 patient-vitals">
      <CardHeader>
        <h2 className="text-lg font-bold">Patient Medical Condition</h2>
      </CardHeader>
      <CardContent>
        <div>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {patientCase.patient_name}
          </p>
          <p>
            <span className="font-semibold">Age:</span>{" "}
            {patientCase.patient_age}
          </p>
          <p>
            <span className="font-semibold">Gender:</span>{" "}
            {patientCase.patient_gender}
          </p>
          <p>
            <span className="font-semibold">Chief Complaint:</span>{" "}
            {patientCase.patient_chief_complaint}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
