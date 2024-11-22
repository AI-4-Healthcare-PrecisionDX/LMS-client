"use client";

import Loading from "@/app/(dashboard)/loading";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

import { ReactNode } from "react";

export default function RoleCheckProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isInitializing, userRole } = useAuth();
  const pathname = usePathname();
  const currentRole = pathname.split("/")[1];
  const router = useRouter();

  if (isInitializing) {
    return Loading();
  }

  if (userRole !== currentRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <img src="/assets/logo_final.png" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Access Denied 🚫
          </h1>
          <p className="text-gray-300 mb-4">
            You do not have the necessary permissions to access this page.
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              router.push(`/${userRole}`);
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
