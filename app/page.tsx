"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLogin } from "@/hooks/useLogin";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
    <span className="ml-2">Loading...</span>
  </div>
);

export default function Login() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { mutate: login, isPending, error: loginError } = useLogin();

  // Navigation effect
  React.useEffect(() => {
    if (isAuthenticated && user?.role) {
      router.push(`/${user.role}`);
    }
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const credentials = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    if (!credentials.username || !credentials.password) {
      return;
    }

    login(credentials);
  };

  // Error handling
  const getErrorMessage = () => {
    if (!loginError) return null;
    if (axios.isAxiosError(loginError)) {
      return (
        loginError.response?.data?.detail ||
        loginError.response?.data?.message ||
        "Invalid username or password"
      );
    }
    return "An unexpected error occurred";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] shadow-2xl bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              DiagonTech AI
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                id="username"
                name="username"
                label="Username"
                type="text"
                disabled={isPending}
                autoComplete="username"
              />
              <InputField
                id="password"
                name="password"
                label="Password"
                type="password"
                disabled={isPending}
                autoComplete="current-password"
              />
              {getErrorMessage() && (
                <Alert
                  variant="destructive"
                  className="mt-4 bg-red-900 border-red-800"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-200 text-center">
                    {getErrorMessage()}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                type="submit"
                disabled={isPending}
              >
                {isPending ? <LoadingSpinner /> : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const InputField = ({
  id,
  name,
  label,
  type = "text",
  disabled = false,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
  autoComplete?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-300">
      {label}
    </Label>
    <Input
      id={id}
      name={name}
      type={type}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={`Enter your ${label.toLowerCase()}`}
      required
      className="w-full px-3 py-2 bg-gray-700 border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);
