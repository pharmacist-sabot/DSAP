import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { AssessmentState, HospitalInfo, Standard } from '@/types/models';

import rawStandards from '@/data/standards.json';

export const useAssessmentStore = defineStore('assessment', () => {
  // --- 1. Master Data (Reference) ---
  // โหลดข้อมูลเกณฑ์จาก JSON
  const standards = ref<Standard[]>(rawStandards as unknown as Standard[]);

  // --- 2. State (User Data) ---
  // ใช้ useStorage เพื่อ Auto-save ลง LocalStorage
  const assessmentState = useStorage<AssessmentState>('dsap-assessment-v1', {
    id: crypto.randomUUID(),
    lastUpdated: new Date().toISOString(),
    isComplete: false,
    hospitalInfo: {
      name: '',
      region: '',
      province: '',
      district: '',
      bedCount: 0,
      hospitalSize: '',
      staff: { pharmacists: 0, assistants: 0, others: 0 },
      stats: { opdVisits: 0, opdPrescriptions: 0, ipdAdmissions: 0, ipdPatientDays: 0 },
    },
    progress: {},
  });

  // --- 3. Getters (Computed) ---

  /**
   * คำนวณ Level ปัจจุบันของหมวดที่ระบุ
   * Logic: จะได้ Level N ก็ต่อเมื่อผ่าน Criteria ทั้งหมดของ Level N
   * และต้องผ่าน Level N-1 มาก่อนด้วย (Waterfall logic)
   */
  const getStandardLevel = computed(() => (standardId: number) => {
    // ต้องเช็คก่อนว่ามีข้อมูล progress หรือไม่ กัน error
    if (!assessmentState.value.progress || !assessmentState.value.progress[standardId]) {
      return 0;
    }

    const progress = assessmentState.value.progress[standardId];
    const standard = standards.value.find(s => s.id === standardId);

    if (!progress || !standard)
      return 0;

    let achievedLevel = 0;

    // วนลูปตรวจสอบทีละ Level (1 -> 5)
    for (const lvl of standard.levels) {
      if (lvl.level === 0)
        continue; // ข้าม Level 0

      // หา Criteria ทั้งหมดใน Level นี้
      const allCriteriaIds = lvl.criteria.map(c => c.id);

      // เช็คว่า user ติ๊กครบทุกข้อใน Level นี้ไหม?
      const isLevelComplete = allCriteriaIds.every(id =>
        progress.checkedCriteria.includes(id),
      );

      if (isLevelComplete) {
        achievedLevel = lvl.level;
      }
      else {
        // ถ้าไม่ผ่าน Level นี้ ให้หยุดคำนวณทันที (ไม่ให้ข้ามขั้น)
        break;
      }
    }

    return achievedLevel;
  });

  // --- 4. Actions ---

  function initialize() {
    // สร้าง Progress Object ว่างๆ สำหรับทั้ง 15 หมวด ถ้ายังไม่มี
    standards.value.forEach((std) => {
      if (!assessmentState.value.progress[std.id]) {
        assessmentState.value.progress[std.id] = {
          currentLevel: 0,
          checkedCriteria: [],
          notes: '',
        };
      }
    });
  }

  function toggleCriterion(standardId: number, criterionId: string) {
    const progress = assessmentState.value.progress[standardId];
    if (!progress)
      return;

    const index = progress.checkedCriteria.indexOf(criterionId);
    if (index === -1) {
      // Add
      progress.checkedCriteria.push(criterionId);
    }
    else {
      // Remove
      progress.checkedCriteria.splice(index, 1);
    }

    // Update timestamp
    assessmentState.value.lastUpdated = new Date().toISOString();

    // หมายเหตุ: currentLevel จะถูกคำนวณใหม่ผ่าน Getter อัตโนมัติในฝั่ง UI
    // แต่ถ้าต้องการเก็บค่า Level ล่าสุดลง State ด้วย ให้ทำตรงนี้
    progress.currentLevel = getStandardLevel.value(standardId);
  }

  function updateHospitalInfo(info: Partial<HospitalInfo>) {
    assessmentState.value.hospitalInfo = {
      ...assessmentState.value.hospitalInfo,
      ...info,
    };
    assessmentState.value.lastUpdated = new Date().toISOString();
  }

  // [Fix] ประกาศ Function นี้ให้ถูกต้อง ก่อนส่งออก
  function resetAssessment() {
    // ล้างข้อมูลใน State
    assessmentState.value = null as any;
    // ล้างข้อมูลใน LocalStorage
    localStorage.removeItem('dsap-assessment-v1');
    // รีโหลดหน้าจอเพื่อเริ่มใหม่
    location.reload();
  }

  // เรียกใช้ครั้งแรกเพื่อเตรียมข้อมูล
  initialize();

  return {
    // State
    standards,
    assessmentState,

    // Getters
    getStandardLevel,

    // Actions
    toggleCriterion,
    updateHospitalInfo,
    resetAssessment, // ส่งออก function ที่ประกาศไว้ข้างบน
  };
});
