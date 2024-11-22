import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  FileText,
  Stethoscope,
  User2,
} from "lucide-react";

export default function PastCase({ patientCase }) {
  return (
    <Card key={patientCase.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-primary dark:bg-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
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
            <User2 className="w-5 h-5 text-muted-foreground" />
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
      <CardFooter>
        <Link href="/student/practice/details">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
