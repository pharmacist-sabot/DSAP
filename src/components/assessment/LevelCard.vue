<script setup lang="ts">
import type { EvaluationCriterion } from '@/types/models';

import BaseCheckbox from '@/components/common/BaseCheckbox.vue';

defineProps<{
  level: number;
  description?: string;
  criteria: EvaluationCriterion[];
  checkedCriteria: string[];
  isPassed: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string): void;
}>();
</script>

<template>
  <div
    class="border rounded-xl overflow-hidden transition-all duration-300 mb-6"
    :class="[
      isPassed
        ? 'border-green-200 shadow-md ring-1 ring-green-100'
        : 'border-gray-200 shadow-sm',
    ]"
  >
    <!-- Header -->
    <div
      class="px-4 py-3 border-b flex items-center justify-between"
      :class="isPassed ? 'bg-green-50' : 'bg-gray-50'"
    >
      <div class="flex items-center gap-3">
        <span
          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
          :class="isPassed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'"
        >
          {{ level }}
        </span>
        <h3 class="font-semibold text-gray-800">
          ระดับที่ {{ level }}
        </h3>
      </div>
      <span v-if="isPassed" class="text-xs font-bold text-green-600 bg-white px-2 py-1 rounded-full border border-green-200">
        ผ่านเกณฑ์ ✅
      </span>
    </div>

    <!-- Content -->
    <div class="p-4 bg-white">
      <p v-if="description" class="text-sm text-gray-500 mb-4 italic">
        "{{ description }}"
      </p>

      <div class="space-y-3">
        <BaseCheckbox
          v-for="item in criteria"
          :id="item.id"
          :key="item.id"
          :label="item.text"
          :model-value="checkedCriteria.includes(item.id)"
          @update:model-value="emit('toggle', item.id)"
        />

        <!-- กรณี Level 0 ไม่มี Criteria -->
        <div v-if="criteria.length === 0" class="text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
          ระดับเริ่มต้น (ไม่ต้องดำเนินการใดๆ)
        </div>
      </div>
    </div>
  </div>
</template>
