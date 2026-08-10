import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { type ComputedRef, computed, type Ref, ref } from 'vue';
import rawStandards from '@/data/standards.json' with { type: 'json' };
import type { AssessmentState, HospitalInfo, Standard } from '@/types/models';
import { createInitialAssessmentState } from '@/utils/assessment';

/**
 * Calculate the current level achieved for the given standard.
 * Logic: Level N is achieved only when all criteria of Level N are met,
 * and Level N-1 must be achieved first (waterfall logic).
 */
function calculateAchievedLevel(standard: Standard, checkedCriteria: string[]): number {
  let achievedLevel = 0;

  // Loop through each level (1 -> 5), skipping Level 0
  for (const lvl of standard.levels.filter((level) => level.level !== 0)) {
    const allCriteriaIds = lvl.criteria.map((c) => c.id);
    const isLevelComplete = allCriteriaIds.every((id) => checkedCriteria.includes(id));

    if (isLevelComplete) {
      achievedLevel = lvl.level;
    } else {
      // Stop immediately if this level is not met (no skipping levels)
      break;
    }
  }

  return achievedLevel;
}

function createGetStandardLevel(
  state: Ref<AssessmentState>,
  standards: Ref<Standard[]>,
): ComputedRef<(standardId: number) => number> {
  return computed(() => (standardId: number) => {
    const progress = state.value.progress?.[standardId];
    const standard = standards.value.find((s) => s.id === standardId);

    if (!(progress && standard)) {
      return 0;
    }

    return calculateAchievedLevel(standard, progress.checkedCriteria);
  });
}

// Create an empty progress object for all 15 standards if missing
function ensureProgressInitialized(state: Ref<AssessmentState>, standards: Ref<Standard[]>) {
  for (const std of standards.value) {
    if (!state.value.progress[std.id]) {
      state.value.progress[std.id] = {
        currentLevel: 0,
        checkedCriteria: [],
        notes: '',
      };
    }
  }
}

function applyCriterionToggle(
  state: Ref<AssessmentState>,
  getStandardLevel: ComputedRef<(standardId: number) => number>,
  standardId: number,
  criterionId: string,
) {
  const progress = state.value.progress[standardId];
  if (!progress) {
    return;
  }

  const index = progress.checkedCriteria.indexOf(criterionId);
  if (index === -1) {
    // Add
    progress.checkedCriteria.push(criterionId);
  } else {
    // Remove
    progress.checkedCriteria.splice(index, 1);
  }

  // Update timestamp
  state.value.lastUpdated = new Date().toISOString();

  // currentLevel is recomputed automatically via the getter in the UI
  progress.currentLevel = getStandardLevel.value(standardId);
}

export const useAssessmentStore = defineStore('assessment', () => {
  // State (master data + user data, auto-saved via useStorage)
  const standards = ref<Standard[]>(rawStandards as Standard[]);
  const assessmentState = useStorage<AssessmentState>(
    'dsap-assessment-v1',
    createInitialAssessmentState(),
  );

  // Getter: waterfall level calculation
  const getStandardLevel = createGetStandardLevel(assessmentState, standards);

  // Actions
  function initialize() {
    ensureProgressInitialized(assessmentState, standards);
  }

  function toggleCriterion(standardId: number, criterionId: string) {
    applyCriterionToggle(assessmentState, getStandardLevel, standardId, criterionId);
  }

  function updateHospitalInfo(info: Partial<HospitalInfo>) {
    assessmentState.value.hospitalInfo = {
      ...assessmentState.value.hospitalInfo,
      ...info,
    };
    assessmentState.value.lastUpdated = new Date().toISOString();
  }

  function resetAssessment() {
    assessmentState.value = createInitialAssessmentState();
    initialize();
  }

  // Initialize data on first load
  initialize();

  return {
    standards,
    assessmentState,
    getStandardLevel,
    toggleCriterion,
    updateHospitalInfo,
    resetAssessment,
  };
});
