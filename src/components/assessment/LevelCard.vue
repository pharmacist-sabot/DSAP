<script setup lang="ts">
import { computed } from 'vue';
import BaseCheckbox from '@/components/common/BaseCheckbox.vue';
import type { EvaluationCriterion } from '@/types/models';

const props = defineProps<{
  level: number;
  description?: string;
  criteria: EvaluationCriterion[];
  checkedCriteria: string[];
  isPassed: boolean;
}>();

const emit = defineEmits<(e: 'toggle', id: string) => void>();

const completedCriteriaCount = computed(() =>
  props.criteria.filter(item => props.checkedCriteria.includes(item.id)).length,
);

const progressWidth = computed(() => {
  if (props.criteria.length === 0) {
    return 100;
  }

  return Math.round((completedCriteriaCount.value / props.criteria.length) * 100);
});

const status = computed(() => {
  if (props.criteria.length === 0) {
    return {
      label: 'พื้นฐาน',
      classes: 'bg-[var(--color-cloud)] text-[var(--color-subtle)]',
      bar: 'bg-[#ced4da]',
    };
  }

  if (props.isPassed) {
    return {
      label: 'ผ่านแล้ว',
      classes: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
      bar: 'bg-[var(--color-success)]',
    };
  }

  if (completedCriteriaCount.value > 0) {
    return {
      label: 'กำลังดำเนินการ',
      classes: 'bg-[var(--color-warning-soft)] text-[#9a6700]',
      bar: 'bg-[#f59f00]',
    };
  }

  return {
    label: 'ยังไม่เริ่ม',
    classes: 'bg-[var(--color-cloud)] text-[var(--color-subtle)]',
    bar: 'bg-[#ced4da]',
  };
});
</script>

<template>
  <section class="panel-card overflow-hidden">
    <header class="border-b border-[var(--color-border)] bg-white px-5 py-5 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              :class="isPassed ? 'bg-[var(--color-success)] text-white' : 'bg-[var(--color-cloud)] text-[var(--color-steel)]'"
            >
              {{ level }}
            </span>
            <div>
              <h3 class="text-lg font-semibold text-[var(--color-ink)]">
                ระดับที่ {{ level }}
              </h3>
              <p class="text-sm text-[var(--color-subtle)]">
                <span class="metric-value">{{ completedCriteriaCount }}</span>
                / {{ criteria.length }} เกณฑ์
              </p>
            </div>
          </div>

          <p v-if="description" class="max-w-3xl text-sm leading-6 text-[var(--color-steel)]">
            {{ description }}
          </p>
        </div>

        <span class="status-chip self-start" :class="status.classes">
          {{ status.label }}
        </span>
      </div>

      <div class="mt-4 flex items-center gap-4">
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-cloud)]">
          <div class="h-full rounded-full transition-all duration-200" :class="status.bar" :style="{ width: `${progressWidth}%` }" />
        </div>
        <div class="metric-value min-w-14 text-right text-sm font-medium text-[var(--color-steel)]">
          {{ progressWidth }}%
        </div>
      </div>
    </header>

    <div class="bg-white p-5 sm:p-6">
      <div v-if="criteria.length" class="space-y-3">
        <BaseCheckbox
          v-for="item in criteria"
          :id="item.id"
          :key="item.id"
          :label="item.text"
          :description="item.note"
          :model-value="checkedCriteria.includes(item.id)"
          @update:model-value="emit('toggle', item.id)"
        />
      </div>

      <div
        v-else
        class="rounded-[8px] border border-dashed border-[var(--color-border)] bg-[var(--color-cloud)] px-4 py-5 text-sm text-[var(--color-subtle)]"
      >
        ระดับเริ่มต้น ใช้เป็น baseline ก่อนเข้าสู่เกณฑ์การพัฒนาในระดับถัดไป
      </div>
    </div>
  </section>
</template>
