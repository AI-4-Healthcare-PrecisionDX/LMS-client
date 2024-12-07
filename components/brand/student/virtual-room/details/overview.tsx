import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scenario } from "./types";

const OverviewTab = ({ scenario }: { scenario: Scenario }) => (
  <div className="grid gap-6 md:grid-cols-2">
    <Card className="border rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Patient Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="w-1/3 font-medium text-gray-600 dark:text-gray-400">
              Name:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {scenario.patient_name}
            </span>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="w-1/3 font-medium text-gray-600 dark:text-gray-400">
              Age:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {scenario.patient_age} years
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="border rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Main Concern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
          <p className="text-gray-900 dark:text-gray-100">
            {scenario.patient_chief_complaint}
          </p>
        </div>
      </CardContent>
    </Card>

    <Card className="md:col-span-2 border rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Full Case Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
          <p className="leading-relaxed text-gray-900 dark:text-gray-100">
            {scenario.detailed_description}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default OverviewTab;
