// src/types/models.ts

// --- 1. Master Data Types (Static Config) ---

export type Dimension =
  | 'Management' // Drug management administration (Standards 1-4)
  | 'Service' // Pharmaceutical care services (Standards 5-8)
  | 'System' // Drug system management (Standards 9-11)
  | 'SupplyChain'; // Drug and supply chain management (Standards 12-15)

export interface EvaluationCriterion {
  id: string; // e.g., "1-1-1" (Std-Level-Item)
  text: string; // Criterion text, e.g. "Establish a PTC committee..."
  note?: string; // Additional notes (optional)
  isCritical?: boolean; // Whether this criterion is mandatory (default: true)
}

export interface StandardLevel {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  description?: string; // Overview description of the level (optional)
  criteria: EvaluationCriterion[];
}

export interface Standard {
  id: number; // 1 - 15
  code: string; // e.g., "1"
  title: string; // Standard title, e.g. "Drug system management"
  goal: string; // Goal (from the PDF)
  dimension: Dimension;
  levels: StandardLevel[];
}

// --- 2. User Data Types (Dynamic State) ---

export interface HospitalInfo {
  name: string;
  region: string;
  province: string;
  district: string;
  bedCount: number;
  hospitalSize: string; // A, S, M1, M2, F1, F2, F3

  // Personnel Info (Part 1, Items 3-5)
  staff: {
    pharmacists: number;
    assistants: number;
    others: number;
  };

  // Service Stats (Part 1, Items 6-7)
  stats: {
    opdVisits: number;
    opdPrescriptions: number;
    ipdAdmissions: number;
    ipdPatientDays: number;
  };
}

export interface StandardProgress {
  currentLevel: number; // Achieved score (computed from checked criteria)
  checkedCriteria: string[]; // Array of checked criterion IDs ["1-1-1", "1-2-1"]
  notes?: string; // Evaluator's additional notes
}

export interface AssessmentState {
  id: string; // Unique ID of this assessment round
  lastUpdated: string; // ISO Date string
  isComplete: boolean;
  hospitalInfo: HospitalInfo;
  progress: Record<number, StandardProgress>; // Key is Standard ID (1-15)
}
