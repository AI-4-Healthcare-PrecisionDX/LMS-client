"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6 p-8 max-w-md">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="px-6"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="px-6"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
