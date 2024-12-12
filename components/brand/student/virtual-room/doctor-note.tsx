"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { doctorNoteAtom } from "@/store";
import { useSetAtom } from "jotai";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function DoctorNote() {
  const [note, setNote] = useState("");
  const setDoctorNote = useSetAtom(doctorNoteAtom);

  const debouncedSetDoctorNote = useCallback(
    (value: string) => {
      setDoctorNote(value);
    },
    [setDoctorNote],
  );

  const debouncedHandler = useMemo(
    () => debounce(debouncedSetDoctorNote, 500),
    [debouncedSetDoctorNote],
  );

  useEffect(() => {
    return () => {
      debouncedHandler.cancel();
    };
  }, [debouncedHandler]);

  return (
    <Card className="mt-2 take-note">
      <CardHeader>
        <h2 className="text-xl font-bold">Doctor's Notes</h2>
      </CardHeader>
      <CardContent>
        <Textarea
          className="w-full min-h-[125px]"
          placeholder="Enter notes here..."
          value={note}
          onChange={(e) => {
            const newValue = e.target.value;
            setNote(newValue);
            debouncedHandler(newValue);
          }}
          style={{ resize: "none" }}
        />
      </CardContent>
    </Card>
  );
}
