"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function Step1({ onNext }: { onNext: (details: any) => void }) {
  const [assessmentType, setAssessmentType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Choose Assessment Type
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${assessmentType === "assignment" ? "ring-2 ring-primary" : ""
            }`}
          onClick={() => setAssessmentType("assignment")}
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Assignment</h3>
            <p className="text-muted-foreground">
              Create a written assignment for students.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${assessmentType === "viva" ? "ring-2 ring-primary" : ""
            }`}
          onClick={() => setAssessmentType("viva")}
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Viva</h3>
            <p className="text-muted-foreground">
              Conduct an oral examination.
            </p>
          </CardContent>
        </Card>
      </div>

      {assessmentType === "assignment" && (
        <>
          <h3 className="text-2xl font-bold text-center mb-4">
            Choose Category
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${category === "ai-generated" ? "ring-2 ring-primary" : ""
                }`}
              onClick={() => setCategory("ai-generated")}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">AI-Generated</h3>
                <p className="text-muted-foreground">
                  Use AI to generate assignment content.
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${category === "manual" ? "ring-2 ring-primary" : ""
                }`}
              onClick={() => setCategory("manual")}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Manual</h3>
                <p className="text-muted-foreground">
                  Create your own assignment content.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={() => onNext({ assessmentType, category })}
          disabled={
            !assessmentType || (!category && assessmentType === "assignment")
          }
          size="lg"
          className="text-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
