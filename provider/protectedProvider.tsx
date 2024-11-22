"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Loading from "@/app/(dashboard)/loading";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isInitializing, isAuthenticated } = useAuth();

  if (isInitializing) {
    return Loading();
  }
  if (!isAuthenticated) {
    redirect('/')
  }

  return <>{children}</>;
};

export default ProtectedRoute;
