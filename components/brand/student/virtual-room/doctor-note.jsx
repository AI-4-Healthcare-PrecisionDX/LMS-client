"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DoctorNote() {
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Card className="mt-2 take-note">
      <CardHeader>
        <h2 className="text-xl font-bold">Doctor's Notes</h2>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            className="w-full min-h-[125px]"
            placeholder="Enter notes here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ resize: "none" }}
          />
        ) : (
          <p className="min-h-[150px] p-2 border rounded-md">
            {note || "No notes saved."}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isEditing ? (
          <Button className="save-note dark:text-white" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button onClick={handleEdit} className="dark:text-white">
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
