import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Evaluation } from "./types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const EvaluationsTab = ({ evaluation }: { evaluation: Evaluation }) => {
  const communicationData = {
    labels: ["Relevance", "Accuracy", "Clarity", "Empathy"],
    datasets: [
      {
        label: "Communication Skills",
        data: [
          evaluation.conversation_relevance_of_replies_score,
          evaluation.conversation_medical_accuracy_of_replies_score,
          evaluation.conversation_communication_clarity_score,
          evaluation.conversation_empathy_and_professionalism_score,
        ],
        backgroundColor: "rgba(2, 132, 199, 0.8)", // sky-700
      },
    ],
  };

  const diagnosisData = {
    labels: ["Relevance", "Accuracy"],
    datasets: [
      {
        label: "Diagnosis Skills",
        data: [
          evaluation.diagnosis_relevance_score,
          evaluation.diagnosis_accuracy_score,
        ],
        backgroundColor: "rgba(217, 119, 6, 0.8)", // amber-600
      },
    ],
  };

  const treatmentData = {
    labels: ["Relevance", "Effectiveness"],
    datasets: [
      {
        label: "Treatment Skills",
        data: [
          evaluation.treatment_relevance_score,
          evaluation.treatment_effectiveness_score,
        ],
        backgroundColor: "rgba(5, 150, 105, 0.8)", // emerald-600
      },
    ],
  };

  const notesData = {
    labels: ["Clarity", "Completeness"],
    datasets: [
      {
        label: "Notes Quality",
        data: [
          evaluation.notes_clarity_score,
          evaluation.notes_completeness_score,
        ],
        backgroundColor: "rgba(190, 24, 93, 0.8)", // pink-700
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  return (
    <div className="grid gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="text-xl font-bold">Overall Assessment</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">
                  {evaluation.overall_score}
                </span>
                <span className="text-lg">/10</span>
              </div>
              <div className="relative w-full h-full">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray={`${(evaluation.overall_score / 10) * 251.2} 251.2`}
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-lg font-semibold text-center">
              Overall Performance
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                  Time Management
                </h4>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-200">
                {evaluation.time_management}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h4 className="font-semibold text-amber-700 dark:text-amber-300">
                  Overall Feedback
                </h4>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-200">
                {evaluation.overall_constructive_feedback}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Additional Notes
                </h4>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-200">
                {evaluation.additional_notes}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <h3 className="text-lg font-bold">Communication Skills</h3>
          </div>
          <div className="h-[200px]">
            <Bar data={communicationData} options={options} />
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold mb-2">Feedback:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {evaluation.conversation_constructive_feedback}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="text-lg font-bold">Diagnosis Skills</h3>
          </div>
          <div className="h-[200px]">
            <Bar data={diagnosisData} options={options} />
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold mb-2">Feedback:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {evaluation.diagnosis_constructive_feedback}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <h3 className="text-lg font-bold">Treatment Skills</h3>
          </div>
          <div className="h-[200px]">
            <Bar data={treatmentData} options={options} />
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold mb-2">Feedback:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {evaluation.treatment_constructive_feedback}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-bold">Notes Quality</h3>
          </div>
          <div className="h-[200px]">
            <Bar data={notesData} options={options} />
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold mb-2">Feedback:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {evaluation.notes_constructive_feedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsTab;
