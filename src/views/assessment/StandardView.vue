<script setup lang="ts">
import { ArrowLeft, ArrowRight, ClipboardCheck, ShieldCheck } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LevelCard from '@/components/assessment/LevelCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { useAssessmentStore } from '@/stores/assessment';
import { dimensionMeta, getTotalCriteria } from '@/utils/assessment';

const route = useRoute();
const router = useRouter();
const store = useAssessmentStore();
const { standards, assessmentState } = storeToRefs(store);

const currentStandardId = computed(() => Number(route.params.id));

const currentStandard = computed(() =>
  standards.value.find(standard => standard.id === currentStandardId.value),
);

const currentProgress = computed(() =>
  assessmentState.value.progress[currentStandardId.value] || { checkedCriteria: [] },
);

const achievedLevel = computed(() =>
  store.getStandardLevel(currentStandardId.value),
);

const totalCriteriaCount = computed(() =>
  currentStandard.value ? getTotalCriteria(currentStandard.value) : 0,
);

const checkedCriteriaCount = computed(() =>
  currentProgress.value.checkedCriteria.length,
);

const completionPercent = computed(() => {
  if (!totalCriteriaCount.value) {
    return 0;
  }

  return Math.round((checkedCriteriaCount.value / totalCriteriaCount.value) * 100);
});

const currentDimension = computed(() =>
  currentStandard.value ? dimensionMeta[currentStandard.value.dimension] : null,
);

function handleToggle(criteriaId: string) {
  store.toggleCriterion(currentStandardId.value, criteriaId);
}

function goNext() {
  if (currentStandardId.value < standards.value.length) {
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
  <div v-if="currentStandard" class="space-y-6 pb-10">
    <section class="panel-card p-6 sm:p-7">
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <span class="section-kicker">
              {{ currentDimension?.label }}
            </span>
            <span class="status-chip bg-[var(--color-cloud)] text-[var(--color-steel)]">
              Standard {{ currentStandard.code }}
            </span>
          </div>

          <div>
            <h1 class="text-3xl font-bold tracking-[-0.01em] text-[var(--color-navy)]">
              {{ currentStandard.title }}
            </h1>
            <p class="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-subtle)]">
              {{ currentDimension?.description }}
            </p>
          </div>

          <div class="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-cloud)] p-5">
            <div class="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-steel)]">
              <ShieldCheck class="h-4 w-4 text-brand" />
              เป้าหมายของมาตรฐาน
            </div>
            <p class="text-sm leading-6 text-[var(--color-ink)]">
              {{ currentStandard.goal }}
            </p>
          </div>
        </div>

        <aside class="panel-card-muted p-5">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-brand shadow-[var(--shadow-soft)]">
              <ClipboardCheck class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold text-[var(--color-steel)]">
                Progress snapshot
              </div>
              <div class="text-xs text-[var(--color-subtle)]">
                ความคืบหน้าของมาตรฐานนี้
              </div>
            </div>
          </div>

          <div class="mt-5 space-y-4">
            <div class="rounded-[8px] border border-[var(--color-border)] bg-white p-4">
              <div class="text-xs uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                ระดับปัจจุบัน
              </div>
              <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
                {{ achievedLevel }}/5
              </div>
            </div>

            <div class="rounded-[8px] border border-[var(--color-border)] bg-white p-4">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-[var(--color-steel)]">เกณฑ์ที่เลือก</span>
                <span class="metric-value font-semibold text-brand">{{ checkedCriteriaCount }}/{{ totalCriteriaCount }}</span>
              </div>
              <div class="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-cloud)]">
                <div class="h-full rounded-full bg-brand transition-all duration-200" :style="{ width: `${completionPercent}%` }" />
              </div>
              <div class="metric-value mt-2 text-xs text-[var(--color-subtle)]">
                {{ completionPercent }}% ของเกณฑ์ทั้งหมดในมาตรฐานนี้
              </div>
            </div>

            <div class="rounded-[8px] border border-[var(--color-border)] bg-white p-4 text-sm leading-6 text-[var(--color-subtle)]">
              การให้คะแนนเป็นแบบ waterfall: หากระดับหนึ่งยังไม่ครบ ระบบจะไม่ข้ามไปให้ระดับถัดไป
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="space-y-5">
      <LevelCard
        v-for="lvl in currentStandard.levels"
        :key="lvl.level"
        :level="lvl.level"
        :description="lvl.description"
        :criteria="lvl.criteria"
        :checked-criteria="currentProgress.checkedCriteria"
        :is-passed="achievedLevel >= lvl.level && lvl.level > 0"
        @toggle="handleToggle"
      />
    </section>

    <section class="sticky bottom-4 z-20">
      <div class="panel-card p-4 sm:p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BaseButton variant="secondary" @click="goPrev">
            <ArrowLeft class="h-4 w-4" />
            ย้อนกลับ
          </BaseButton>

          <div class="text-center text-sm text-[var(--color-subtle)]">
            ระดับปัจจุบัน <span class="metric-value text-lg font-bold text-brand">{{ achievedLevel }}</span> จาก 5
          </div>

          <BaseButton @click="goNext">
            {{ currentStandardId < standards.length ? 'มาตรฐานถัดไป' : 'ไปยังสรุปผล' }}
            <ArrowRight class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="panel-card p-8 text-center text-[var(--color-subtle)]">
    ไม่พบข้อมูลมาตรฐานที่ระบุ
  </div>
</template>
