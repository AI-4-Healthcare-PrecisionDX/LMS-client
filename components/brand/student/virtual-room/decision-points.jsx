import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function DecisionPoint() {
  const [diagnosis, setDiagnosis] = React.useState("");
  const [treatment, setTreatment] = React.useState("");
  const router = useRouter();

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    router.push("/student/practice/details?decision=true");
  };
  return (
    <Card className="decision-points">
      <CardHeader>
        <CardTitle>Decision Points</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDecisionSubmit} className="space-y-4">
          <Tabs defaultValue="diagnosis">
            <TabsList>
              <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
              <TabsTrigger value="treatment">Treatment</TabsTrigger>
            </TabsList>
            <TabsContent value="diagnosis">
              <Textarea
                placeholder="Enter your diagnosis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </TabsContent>
            <TabsContent value="treatment">
              <Textarea
                placeholder="Enter your treatment plan..."
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
              />
            </TabsContent>
          </Tabs>
          <div className="flex justify-center">
            <Button className="submit-decision dark:text-white" type="submit">
              Submit Decision
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
