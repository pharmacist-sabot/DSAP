<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LevelCard from '@/components/assessment/LevelCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { useAssessmentStore } from '@/stores/assessment';

const route = useRoute();
const router = useRouter();
const store = useAssessmentStore();
const { standards, assessmentState } = storeToRefs(store);

const currentStandardId = computed(() => Number(route.params.id));

const currentStandard = computed(() =>
  standards.value.find(s => s.id === currentStandardId.value),
);

const currentProgress = computed(() =>
  assessmentState.value.progress[currentStandardId.value] || { checkedCriteria: [] },
);

const achievedLevel = computed(() =>
  store.getStandardLevel(currentStandardId.value),
);

function handleToggle(criteriaId: string) {
  store.toggleCriterion(currentStandardId.value, criteriaId);
}

function goNext() {
  if (currentStandardId.value < 15) {
    router.push(`/assess/standard/${currentStandardId.value + 1}`);
  }
  else {
    router.push('/assess/summary');
  }
}

function goPrev() {
  if (currentStandardId.value > 1) {
    router.push(`/assess/standard/${currentStandardId.value - 1}`);
  }
  else {
    router.push('/assess/info');
  }
}
</script>

<template>
  <div v-if="currentStandard" class="max-w-4xl mx-auto pb-20">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 text-sm text-gray-500 font-medium uppercase tracking-wider">
        <span>Dimension: {{ currentStandard.dimension }}</span>
        <span>•</span>
        <span>Standard {{ currentStandard.code }}</span>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ currentStandard.title }}
      </h1>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p class="text-gray-700 text-sm leading-relaxed">
          <span class="font-bold">เป้าหมาย:</span> {{ currentStandard.goal }}
        </p>
      </div>
    </div>

    <!-- Levels Loop (0 - 5) -->
    <div class="space-y-8">
      <div v-for="lvl in currentStandard.levels" :key="lvl.level">
        <!-- Render LevelCard -->
        <LevelCard
          :level="lvl.level"
          :description="lvl.description"
          :criteria="lvl.criteria"
          :checked-criteria="currentProgress.checkedCriteria"
          :is-passed="achievedLevel >= lvl.level && lvl.level > 0"
          @toggle="handleToggle"
        />
      </div>
    </div>

    <!-- Footer Navigation -->
    <div class="fixed bottom-0 right-0 left-0 md:left-72 bg-white border-t border-gray-200 p-4 z-10 shadow-lg">
      <div class="container mx-auto px-4 flex justify-between items-center max-w-4xl">
        <BaseButton variant="secondary" @click="goPrev">
          ← ย้อนกลับ
        </BaseButton>

        <div class="text-sm font-medium text-gray-600 hidden sm:block">
          คะแนนปัจจุบัน: <span class="text-brand text-lg font-bold">{{ achievedLevel }}</span> / 5
        </div>

        <BaseButton variant="primary" @click="goNext">
          ถัดไป →
        </BaseButton>
      </div>
    </div>
  </div>

  <!-- Fallback case  -->
  <div v-else class="text-center py-20 text-gray-500">
    ไม่พบข้อมูลมาตรฐานที่ระบุ
  </div>
</template>
