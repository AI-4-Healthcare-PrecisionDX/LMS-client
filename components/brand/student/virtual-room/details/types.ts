// Types
export interface ThreadMessage {
  scenario_thread_message_id: string;
  role: string;
  content: string;
}

export interface Evaluation {
  conversation_relevance_of_replies_score: number;
  conversation_medical_accuracy_of_replies_score: number;
  conversation_communication_clarity_score: number;
  conversation_empathy_and_professionalism_score: number;
  conversation_constructive_feedback: string;
  diagnosis_relevance_score: number;
  diagnosis_accuracy_score: number;
  diagnosis_constructive_feedback: string;
  treatment_relevance_score: number;
  treatment_effectiveness_score: number;
  treatment_constructive_feedback: string;
  notes_clarity_score: number;
  notes_completeness_score: number;
  notes_constructive_feedback: string;
  overall_score: number;
  time_management: string;
  overall_constructive_feedback: string;
  additional_notes: string;
}

export interface Thread {
  diagnosis: string;
  treatment: string;
  doctor_notes: string;
}

export interface Scenario {
  scenario_id: string;
  patient_name: string;
  patient_age: number;
  patient_chief_complaint: string;
  detailed_description: string;
}

export interface ScenarioData {
  scenario: Scenario;
  thread: Thread;
  thread_messages: ThreadMessage[];
  evaluation: Evaluation;
}

// State Management
export interface State {
  activeTab: string;
}

export type Action = { type: "SET_ACTIVE_TAB"; payload: string };
