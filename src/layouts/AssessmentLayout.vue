<script setup lang="ts">
import { ClipboardList, FileText, LayoutDashboard } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import AppHeader from '@/components/common/AppHeader.vue';
import { useAssessmentStore } from '@/stores/assessment';
import { dimensionMeta, formatThaiDate, getTotalCriteria } from '@/utils/assessment';

const store = useAssessmentStore();
const router = useRouter();
const { assessmentState, standards } = storeToRefs(store);
const route = useRoute();

function getLevel(stdId: number) {
  return store.getStandardLevel(stdId);
}

const groupedStandards = computed(() =>
  (Object.entries(dimensionMeta) as [keyof typeof dimensionMeta, (typeof dimensionMeta)[keyof typeof dimensionMeta]][]).map(([dimension, meta]) => ({
    dimension,
    ...meta,
    items: standards.value.filter(standard => standard.dimension === dimension),
  })),
);

const assessedStandards = computed(() =>
  standards.value.filter(standard => getLevel(standard.id) > 0).length,
);

const checkedCriteriaCount = computed(() =>
  Object.values(assessmentState.value.progress).reduce((total, progress) => total + progress.checkedCriteria.length, 0),
);

const totalCriteriaCount = computed(() =>
  standards.value.reduce((total, standard) => total + getTotalCriteria(standard), 0),
);

const navigationOptions = computed(() => [
  { value: '/assess/info', label: 'ข้อมูลโรงพยาบาล' },
  ...standards.value.map(standard => ({
    value: `/assess/standard/${standard.id}`,
    label: `${standard.code}. ${standard.title}`,
  })),
  { value: '/assess/summary', label: 'สรุปผลการประเมิน' },
]);

function navigateFromSelect(event: Event) {
  const { target } = event;

  if (target instanceof HTMLSelectElement) {
    router.push(target.value);
  }
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-cloud)]">
    <AppHeader />

    <div class="shell-container py-6 lg:py-8">
      <section class="panel-card mb-6 p-5 sm:p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-2">
            <div class="section-kicker">
              Assessment workspace
            </div>
            <h1 class="text-2xl font-semibold tracking-[-0.01em] text-[var(--color-navy)]">
              พื้นที่ประเมินมาตรฐานความปลอดภัยด้านยา
            </h1>
            <p class="text-sm leading-6 text-[var(--color-subtle)]">
              ทำงานต่อได้ทันทีจากจุดเดิม ระบบจะคำนวณระดับตามลำดับขั้นและบันทึกความคืบหน้าให้อัตโนมัติ
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="panel-card-muted min-w-[150px] p-4">
              <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                มาตรฐานที่เริ่มแล้ว
              </div>
              <div class="metric-value mt-2 text-2xl font-bold text-[var(--color-navy)]">
                {{ assessedStandards }}/{{ standards.length }}
              </div>
            </div>
            <div class="panel-card-muted min-w-[150px] p-4">
              <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                เกณฑ์ที่เลือก
              </div>
              <div class="metric-value mt-2 text-2xl font-bold text-[var(--color-navy)]">
                {{ checkedCriteriaCount }}/{{ totalCriteriaCount }}
              </div>
            </div>
            <div class="panel-card-muted min-w-[150px] p-4">
              <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                อัปเดตล่าสุด
              </div>
              <div class="mt-2 text-sm font-medium text-[var(--color-steel)]">
                {{ formatThaiDate(assessmentState.lastUpdated) }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="mb-4 lg:hidden">
        <label for="assessment-nav" class="input-label">ไปยังส่วนที่ต้องการ</label>
        <select
          id="assessment-nav"
          class="input-field"
          :value="route.fullPath"
          @change="navigateFromSelect"
        >
          <option v-for="option in navigationOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
        <aside class="hidden lg:block">
          <div class="sticky top-24 space-y-4">
            <div class="panel-card overflow-hidden">
              <div class="border-b border-[var(--color-border)] bg-[var(--color-cloud)] px-5 py-4">
                <h2 class="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-steel)]">
                  Navigation
                </h2>
                <p class="mt-1 text-xs leading-5 text-[var(--color-subtle)]">
                  เดินตามลำดับข้อมูลทั่วไป → มาตรฐาน → สรุปผล
                </p>
              </div>

              <nav class="max-h-[calc(100vh-180px)] overflow-y-auto px-3 py-3">
                <RouterLink
                  to="/assess/info"
                  class="mb-2 flex items-center gap-3 rounded-[8px] px-3 py-3 text-sm font-medium"
                  :class="route.path === '/assess/info'
                    ? 'bg-[var(--color-info-soft)] text-[#084298]'
                    : 'text-[var(--color-steel)] hover:bg-[var(--color-cloud)]'"
                >
                  <FileText class="h-4 w-4" />
                  ข้อมูลโรงพยาบาล
                </RouterLink>

                <div v-for="group in groupedStandards" :key="group.dimension" class="mt-4">
                  <div class="px-3 pb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                    {{ group.label }}
                  </div>

                  <RouterLink
                    v-for="std in group.items"
                    :key="std.id"
                    :to="`/assess/standard/${std.id}`"
                    class="mb-1 flex items-center justify-between gap-3 rounded-[8px] px-3 py-3 text-sm"
                    :class="route.params.id === String(std.id)
                      ? 'bg-[var(--color-info-soft)] text-[#084298]'
                      : 'text-[var(--color-steel)] hover:bg-[var(--color-cloud)]'"
                  >
                    <div class="min-w-0">
                      <div class="truncate font-medium">
                        {{ std.code }}. {{ std.title }}
                      </div>
                      <div class="mt-1 text-xs text-[var(--color-subtle)]">
                        {{ group.shortLabel }}
                      </div>
                    </div>
                    <span
                      class="metric-value inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold"
                      :class="getLevel(std.id) > 0
                        ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                        : 'bg-[var(--color-cloud)] text-[var(--color-subtle)]'"
                    >
                      {{ getLevel(std.id) }}
                    </span>
                  </RouterLink>
                </div>

                <RouterLink
                  to="/assess/summary"
                  class="mt-4 flex items-center gap-3 rounded-[8px] px-3 py-3 text-sm font-medium"
                  :class="route.path === '/assess/summary'
                    ? 'bg-[var(--color-info-soft)] text-[#084298]'
                    : 'text-[var(--color-steel)] hover:bg-[var(--color-cloud)]'"
                >
                  <LayoutDashboard class="h-4 w-4" />
                  สรุปผลการประเมิน
                </RouterLink>
              </nav>
            </div>

            <div class="panel-card-muted p-4">
              <div class="flex items-start gap-3">
                <ClipboardList class="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div class="text-sm font-semibold text-[var(--color-steel)]">
                    หลักการให้คะแนน
                  </div>
                  <p class="mt-1 text-xs leading-5 text-[var(--color-subtle)]">
                    ระบบจะปลดล็อกระดับถัดไปเมื่อเกณฑ์ของระดับก่อนหน้าครบทั้งหมดเท่านั้น
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main class="min-w-0">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
