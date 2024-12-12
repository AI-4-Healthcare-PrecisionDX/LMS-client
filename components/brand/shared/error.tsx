import { AlertCircle } from "lucide-react";

export default function ErrorMessage({
  error,
  title,
}: {
  error: Error;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
      <pre className="text-sm text-red-500 bg-red-50 p-4 rounded-md overflow-auto max-w-lg">
        {error instanceof Error
          ? error.message
          : JSON.stringify(error, null, 2)}
      </pre>
    </div>
  );
}
