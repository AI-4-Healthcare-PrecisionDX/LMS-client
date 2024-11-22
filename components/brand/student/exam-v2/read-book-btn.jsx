"use client";
import React from "react";

import { Button } from "@/components/ui/button";
export default function ReadBookBtn() {
  return (
    <Button
      className="w-full transition-all duration-300"
      variant="secondary"
      onClick={() => window.open(`/view`, "_blank")}
    >
      Read Book
    </Button>
  );
}
