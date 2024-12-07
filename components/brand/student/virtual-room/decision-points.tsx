import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios-config";
import { doctorNoteAtom } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const decisionSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment: z.string().min(1, "Treatment plan is required"),
  doctor_notes: z.string().optional(),
});

type DecisionFormData = z.infer<typeof decisionSchema>;

const initialState = {
  diagnosis: "",
  treatment: "",
  doctor_notes: "",
};

function reducer(
  state: typeof initialState,
  action: { type: string; payload?: string },
) {
  switch (action.type) {
    case "SET_DIAGNOSIS":
      return { ...state, diagnosis: action.payload! };
    case "SET_TREATMENT":
      return { ...state, treatment: action.payload! };
    case "SET_DOCTOR_NOTE":
      return { ...state, doctor_note: action.payload! };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function DecisionPoint({
  virtualRoom,
}: {
  virtualRoom: string;
}) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const router = useRouter();
  const params = useParams();
  const doctorNote = useAtomValue(doctorNoteAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DecisionFormData>({
    resolver: zodResolver(decisionSchema),
    defaultValues: initialState,
  });

  const submitDecision = useMutation({
    mutationFn: async (data: DecisionFormData) => {
      const response = await api.post(
        `/clinical-practice/${virtualRoom}/evaluation`,
        {
          ...data,
          doctor_notes: doctorNote,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      dispatch({ type: "RESET" });
      toast.success("Decision submitted successfully");
      router.push(
        `/student/practice/${params.departmnet}/${virtualRoom}/details`,
      );
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      if (error.response?.data?.detail === "Not enough messages") {
        toast.info(
          "Please, do not submit a decision without a conversation with the patient.",
        );
      } else {
        toast.error(error.response?.data?.detail);
      }
    },
  });

  const onSubmit = (data: DecisionFormData) => {
    submitDecision.mutate(data);
  };

  return (
    <Card className="decision-points">
      <CardHeader>
        <CardTitle>Decision Points</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Diagnosis</h3>
              <Textarea
                placeholder="Enter your diagnosis..."
                {...register("diagnosis")}
                onChange={(e) =>
                  dispatch({ type: "SET_DIAGNOSIS", payload: e.target.value })
                }
              />
              {errors.diagnosis && (
                <p className="text-red-500 text-sm">
                  {errors.diagnosis.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Treatment</h3>
              <Textarea
                placeholder="Enter your treatment plan..."
                {...register("treatment")}
                onChange={(e) =>
                  dispatch({ type: "SET_TREATMENT", payload: e.target.value })
                }
              />
              {errors.treatment && (
                <p className="text-red-500 text-sm">
                  {errors.treatment.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="submit-decision dark:text-white"
              type="submit"
              disabled={submitDecision.isPending}
            >
              {submitDecision.isPending ? "Submitting..." : "Submit Decision"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
