"use client";

import Loading from "@/app/(dashboard)/loading";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isInitializing, isAuthenticated } = useAuth();

  if (isInitializing) {
    return Loading();
  }
  if (!isAuthenticated) {
    redirect("/");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
