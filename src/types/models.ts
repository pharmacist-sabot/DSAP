// src/types/models.ts

// --- 1. Master Data Types (Static Config) ---

export type Dimension
  = | 'Management' // ด้านการบริหารระบบยา (หมวด 1-4)
    | 'Service' // ด้านการบริการและบริบาล (หมวด 5-8)
    | 'System' // ด้านการจัดการระบบยา (หมวด 9-11)
    | 'SupplyChain'; // ด้านการบริหารยาและเวชภัณฑ์ (หมวด 12-15)

export type EvaluationCriterion = {
  id: string; // e.g., "1-1-1" (Std-Level-Item)
  text: string; // ข้อความเกณฑ์ เช่น "จัดตั้งคณะกรรมการ PTC..."
  note?: string; // หมายเหตุเพิ่มเติม (ถ้ามี)
  isCritical?: boolean; // ข้อนี้จำเป็นต้องผ่านหรือไม่ (default: true)
};

export type StandardLevel = {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  description?: string; // คำอธิบายภาพรวมของเลเวลนั้น (ถ้ามี)
  criteria: EvaluationCriterion[];
};

export type Standard = {
  id: number; // 1 - 15
  code: string; // e.g., "1"
  title: string; // ชื่อหมวด เช่น "การจัดการระบบด้านยา"
  goal: string; // เป้าหมาย (จากใน PDF)
  dimension: Dimension;
  levels: StandardLevel[];
};

// --- 2. User Data Types (Dynamic State) ---

export type HospitalInfo = {
  name: string;
  region: string;
  province: string;
  district: string;
  bedCount: number;
  hospitalSize: string; // A, S, M1, M2, F1, F2, F3

  // Personnel Info (Part 1 ข้อ 3-5)
  staff: {
    pharmacists: number;
    assistants: number;
    others: number;
  };

  // Service Stats (Part 1 ข้อ 6-7)
  stats: {
    opdVisits: number;
    opdPrescriptions: number;
    ipdAdmissions: number;
    ipdPatientDays: number;
  };
};

export type StandardProgress = {
  currentLevel: number; // คะแนนที่ได้ (คำนวณจาก criteria ที่ติ๊ก)
  checkedCriteria: string[]; // Array ของ ID ที่ติ๊กแล้ว ["1-1-1", "1-2-1"]
  notes?: string; // บันทึกเพิ่มเติมของผู้ประเมิน
};

export type AssessmentState = {
  id: string; // Unique ID ของการประเมินรอบนี้
  lastUpdated: string; // ISO Date string
  isComplete: boolean;
  hospitalInfo: HospitalInfo;
  progress: Record<number, StandardProgress>; // Key is Standard ID (1-15)
};
