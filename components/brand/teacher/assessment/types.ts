// Type for Assignment Materials
type AssignmentMaterial = {
    assignment_material_id: string;
    library_item_id: string;
    description: string;
    name: string;
    created_at: string;
    updated_at: string;
};

// Type for Questions
export interface Question {
    question_id?: string;
    question_type: string;
    question_text: string;
    marks: number;
    options_for_mcq?: string[];
    expected_answer: string[];
    // Add AI-specific fields
    explanation?: string;
    pattern_type?: string;
    difficulty?: string;
    isAIGenerated?: boolean;
    isEditable?: boolean;
}

// Type for Assignment
type Assignment = {
    assignment_id: string;
    assignment_type: string;
    assignment_title: string;
    assignment_description: string;
    number_of_questions: number;
    total_marks: number;
    start_time: string; // ISO 8601 formatted date
    deadline: string; // ISO 8601 formatted date
    section_id: string;
    assignment_materials: AssignmentMaterial[];
    questions: Question[];
};

type Assignments = Assignment[];



export type { Assignment, AssignmentMaterial, Assignments };

