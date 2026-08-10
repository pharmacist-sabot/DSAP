<script setup lang="ts">
import {
  ArrowRight,
  Building2,
  ChartNoAxesColumn,
  ClipboardCheck,
  RotateCcw,
} from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import BaseButton from '@/components/common/BaseButton.vue';
import { useAssessmentStore } from '@/stores/assessment';
import {
  countFilledHospitalFields,
  dimensionMeta,
  formatThaiDate,
  getTotalCriteria,
} from '@/utils/assessment';

const router = useRouter();
const store = useAssessmentStore();
const { assessmentState, standards } = storeToRefs(store);
const isResetArmed = ref(false);

const totalCriteriaCount = computed(() =>
  standards.value.reduce((total, standard) => total + getTotalCriteria(standard), 0),
);

const checkedCriteriaCount = computed(() =>
  Object.values(assessmentState.value.progress).reduce((total, progress) => total + progress.checkedCriteria.length, 0),
);

const assessedStandards = computed(() =>
  standards.value.filter(standard => store.getStandardLevel(standard.id) > 0).length,
);

const averageLevel = computed(() => {
  if (standards.value.length === 0) {
    return 0;
  }

  const totalLevel = standards.value.reduce((total, standard) => total + store.getStandardLevel(standard.id), 0);
  return (totalLevel / standards.value.length).toFixed(1);
});

const levelFiveStandards = computed(() =>
  standards.value.filter(standard => store.getStandardLevel(standard.id) === 5).length,
);

const hospitalInfoReadiness = computed(() =>
  countFilledHospitalFields(assessmentState.value.hospitalInfo),
);

const standardRows = computed(() =>
  standards.value.map((standard) => {
    const checkedCount = assessmentState.value.progress[standard.id]?.checkedCriteria.length || 0;
    const criteriaCount = getTotalCriteria(standard);
    const level = store.getStandardLevel(standard.id);

    return {
      ...standard,
      level,
      checkedCount,
      criteriaCount,
      dimensionLabel: dimensionMeta[standard.dimension].label,
      percent: criteriaCount > 0 ? Math.round((checkedCount / criteriaCount) * 100) : 0,
    };
  }),
);

const dimensionRows = computed(() =>
  (Object.entries(dimensionMeta) as [keyof typeof dimensionMeta, (typeof dimensionMeta)[keyof typeof dimensionMeta]][]).map(([dimension, meta]) => {
    const items = standardRows.value.filter(row => row.dimension === dimension);
    const average = items.length > 0
      ? (items.reduce((total, row) => total + row.level, 0) / items.length).toFixed(1)
      : '0.0';

    return {
      ...meta,
      count: items.length,
      average,
      completed: items.filter(item => item.level > 0).length,
    };
  }),
);

const hospitalSummary = computed(() => [
  { label: 'ชื่อโรงพยาบาล', value: assessmentState.value.hospitalInfo.name || '-' },
  { label: 'ภูมิภาค', value: assessmentState.value.hospitalInfo.region || '-' },
  { label: 'จังหวัด', value: assessmentState.value.hospitalInfo.province || '-' },
  { label: 'อำเภอ/เขต', value: assessmentState.value.hospitalInfo.district || '-' },
  { label: 'ขนาดโรงพยาบาล', value: assessmentState.value.hospitalInfo.hospitalSize || '-' },
  { label: 'จำนวนเตียง', value: assessmentState.value.hospitalInfo.bedCount > 0 ? `${assessmentState.value.hospitalInfo.bedCount}` : '-' },
]);

function getLevelBadgeClasses(level: number) {
  if (level >= 4) {
    return 'bg-[var(--color-success-soft)] text-[var(--color-success)]';
  }

  if (level >= 2) {
    return 'bg-[var(--color-warning-soft)] text-[#9a6700]';
  }

  if (level >= 1) {
    return 'bg-[var(--color-info-soft)] text-[#084298]';
  }

  return 'bg-[var(--color-cloud)] text-[var(--color-subtle)]';
}

function requestReset() {
  if (!isResetArmed.value) {
    isResetArmed.value = true;
    return;
  }

  store.resetAssessment();
  isResetArmed.value = false;
  router.push('/assess/info');
}

function cancelReset() {
  isResetArmed.value = false;
}
</script>

<template>
  <div class="space-y-6">
    <section class="panel-card p-6 sm:p-7">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div class="space-y-4">
          <div class="section-kicker">
            Summary dashboard
          </div>
          <div>
            <h1 class="text-3xl font-bold tracking-[-0.01em] text-[var(--color-navy)]">
              สรุปผลการประเมินภาพรวม
            </h1>
            <p class="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-subtle)]">
              ตรวจสอบความพร้อมของข้อมูลโรงพยาบาล ระดับที่ได้ในแต่ละมิติ และความคืบหน้ารายมาตรฐานจากหน้าจอเดียว
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <RouterLink v-slot="{ navigate }" to="/assess/info" custom>
            <BaseButton variant="secondary" @click="navigate">
              แก้ไขข้อมูลโรงพยาบาล
            </BaseButton>
          </RouterLink>
          <BaseButton v-if="!isResetArmed" variant="ghost" @click="requestReset">
            <RotateCcw class="h-4 w-4" />
            เริ่มใหม่
          </BaseButton>
          <BaseButton v-else variant="danger" @click="requestReset">
            ยืนยันล้างข้อมูล
          </BaseButton>
          <BaseButton v-if="isResetArmed" variant="ghost" @click="cancelReset">
            ยกเลิก
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="panel-card p-5">
        <div class="text-xs uppercase tracking-[0.08em] text-[var(--color-subtle)]">
          มาตรฐานที่เริ่มแล้ว
        </div>
        <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
          {{ assessedStandards }}/{{ standards.length }}
        </div>
        <div class="mt-1 text-sm text-[var(--color-subtle)]">
          มีระดับมากกว่า 0
        </div>
      </article>

      <article class="panel-card p-5">
        <div class="text-xs uppercase tracking-[0.08em] text-[var(--color-subtle)]">
          ค่าเฉลี่ยระดับ
        </div>
        <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
          {{ averageLevel }}
        </div>
        <div class="mt-1 text-sm text-[var(--color-subtle)]">
          จากคะแนนเต็ม 5
        </div>
      </article>

      <article class="panel-card p-5">
        <div class="text-xs uppercase tracking-[0.08em] text-[var(--color-subtle)]">
          เกณฑ์ที่เลือก
        </div>
        <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
          {{ checkedCriteriaCount }}/{{ totalCriteriaCount }}
        </div>
        <div class="mt-1 text-sm text-[var(--color-subtle)]">
          รวมทุกมาตรฐาน
        </div>
      </article>

      <article class="panel-card p-5">
        <div class="text-xs uppercase tracking-[0.08em] text-[var(--color-subtle)]">
          ระดับ 5 ที่สำเร็จ
        </div>
        <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
          {{ levelFiveStandards }}
        </div>
        <div class="mt-1 text-sm text-[var(--color-subtle)]">
          มาตรฐานที่ถึงระดับสูงสุด
        </div>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
      <aside class="space-y-4">
        <section class="panel-card p-5">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--color-cloud)] text-brand">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold text-[var(--color-steel)]">
                Hospital profile
              </div>
              <div class="text-xs text-[var(--color-subtle)]">
                ความพร้อมของข้อมูลพื้นฐาน
              </div>
            </div>
          </div>

          <div class="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-cloud)] p-4">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium text-[var(--color-steel)]">ข้อมูลที่กรอกแล้ว</span>
              <span class="metric-value font-semibold text-brand">{{ hospitalInfoReadiness }}/13</span>
            </div>
          </div>

          <dl class="mt-4 space-y-3 text-sm">
            <div v-for="item in hospitalSummary" :key="item.label" class="flex items-center justify-between gap-4 rounded-[8px] border border-[var(--color-border)] px-4 py-3">
              <dt class="text-[var(--color-subtle)]">
                {{ item.label }}
              </dt>
              <dd class="metric-value text-right font-medium text-[var(--color-ink)]">
                {{ item.value }}
              </dd>
            </div>
          </dl>
        </section>

        <section class="panel-card-muted p-5">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-brand shadow-[var(--shadow-soft)]">
              <ClipboardCheck class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold text-[var(--color-steel)]">
                บันทึกล่าสุด
              </div>
              <div class="metric-value text-xs text-[var(--color-subtle)]">
                {{ formatThaiDate(assessmentState.lastUpdated) }}
              </div>
            </div>
          </div>
        </section>
      </aside>

      <div class="space-y-6">
        <section class="panel-card p-6">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--color-cloud)] text-brand">
              <ChartNoAxesColumn class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-[var(--color-ink)]">
                ภาพรวมรายมิติ
              </h2>
              <p class="text-sm text-[var(--color-subtle)]">
                ดูมาตรฐานที่เริ่มประเมินแล้วและค่าเฉลี่ยระดับในแต่ละมิติ
              </p>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article v-for="dimension in dimensionRows" :key="dimension.shortLabel" class="rounded-[10px] border border-[var(--color-border)] p-4">
              <div class="text-xs uppercase tracking-[0.08em] text-brand">
                {{ dimension.shortLabel }}
              </div>
              <h3 class="mt-2 text-base font-semibold text-[var(--color-ink)]">
                {{ dimension.label }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-[var(--color-subtle)]">
                {{ dimension.description }}
              </p>
              <div class="mt-4 grid gap-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-[var(--color-subtle)]">เริ่มแล้ว</span>
                  <span class="metric-value font-semibold text-[var(--color-steel)]">{{ dimension.completed }}/{{ dimension.count }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[var(--color-subtle)]">ค่าเฉลี่ยระดับ</span>
                  <span class="metric-value font-semibold text-brand">{{ dimension.average }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="panel-card overflow-hidden">
          <div class="border-b border-[var(--color-border)] bg-[var(--color-cloud)] px-6 py-4">
            <h2 class="text-xl font-semibold text-[var(--color-ink)]">
              ผลลัพธ์รายมาตรฐาน
            </h2>
            <p class="mt-1 text-sm text-[var(--color-subtle)]">
              สรุประดับปัจจุบัน ความคืบหน้าของเกณฑ์ และมิติที่เกี่ยวข้อง
            </p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-white text-[var(--color-steel)]">
                <tr>
                  <th class="px-6 py-4 font-semibold">
                    มาตรฐาน
                  </th>
                  <th class="px-6 py-4 font-semibold">
                    มิติ
                  </th>
                  <th class="px-6 py-4 font-semibold">
                    ระดับ
                  </th>
                  <th class="px-6 py-4 font-semibold">
                    เกณฑ์ที่เลือก
                  </th>
                  <th class="px-6 py-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in standardRows"
                  :key="row.id"
                  class="border-t border-[var(--color-border)] odd:bg-white even:bg-[var(--color-cloud)]"
                >
                  <td class="px-6 py-4">
                    <div class="font-medium text-[var(--color-ink)]">
                      {{ row.code }}. {{ row.title }}
                    </div>
                    <div class="metric-value mt-1 text-xs text-[var(--color-subtle)]">
                      {{ row.percent }}% ของเกณฑ์ในมาตรฐานนี้
                    </div>
                  </td>
                  <td class="px-6 py-4 text-[var(--color-subtle)]">
                    {{ row.dimensionLabel }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="status-chip" :class="getLevelBadgeClasses(row.level)">
                      Level {{ row.level }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="metric-value font-medium text-[var(--color-steel)]">
                      {{ row.checkedCount }}/{{ row.criteriaCount }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <RouterLink v-slot="{ navigate }" :to="`/assess/standard/${row.id}`" custom>
                      <BaseButton variant="ghost" size="sm" @click="navigate">
                        เปิดมาตรฐาน
                      </BaseButton>
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>

    <section class="panel-card p-5 sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-[var(--color-ink)]">
            พร้อมกลับไปประเมินต่อหรือทบทวนจุดอ่อน
          </h2>
          <p class="mt-1 text-sm text-[var(--color-subtle)]">
            เปิดมาตรฐานที่ต้องการแก้ไขจากตารางด้านบน หรือกลับไปหน้าข้อมูลโรงพยาบาลเพื่อปรับบริบทการประเมิน
          </p>
        </div>

        <RouterLink v-slot="{ navigate }" to="/assess/standard/1" custom>
          <BaseButton @click="navigate">
            ไปยังมาตรฐานแรก
            <ArrowRight class="h-4 w-4" />
          </BaseButton>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
