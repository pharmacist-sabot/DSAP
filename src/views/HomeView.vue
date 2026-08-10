<script setup lang="ts">
import {
  Activity,
  ArrowRight,
  Blocks,
  Building2,
  DatabaseZap,
  ShieldCheck,
} from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import BaseButton from '@/components/common/BaseButton.vue';
import { useAssessmentStore } from '@/stores/assessment';
import { dimensionMeta, formatThaiDate, getTotalCriteria } from '@/utils/assessment';

const store = useAssessmentStore();
const { assessmentState, standards } = storeToRefs(store);

const startedStandards = computed(() =>
  standards.value.filter(standard => store.getStandardLevel(standard.id) > 0).length,
);

const checkedCriteriaCount = computed(() =>
  Object.values(assessmentState.value.progress).reduce((total, progress) => total + progress.checkedCriteria.length, 0),
);

const totalCriteriaCount = computed(() =>
  standards.value.reduce((total, standard) => total + getTotalCriteria(standard), 0),
);

const dimensionCards = computed(() =>
  (Object.entries(dimensionMeta) as [keyof typeof dimensionMeta, (typeof dimensionMeta)[keyof typeof dimensionMeta]][]).map(([dimension, meta]) => ({
    ...meta,
    count: standards.value.filter(standard => standard.dimension === dimension).length,
  })),
);

const highlights = [
  {
    title: 'Waterfall scoring logic',
    description: 'ต้องผ่านเกณฑ์ระดับก่อนหน้าให้ครบ จึงจะได้ระดับที่สูงขึ้น ช่วยสะท้อน maturity จริงของแต่ละมาตรฐาน',
    icon: ShieldCheck,
  },
  {
    title: 'Config-driven standards',
    description: 'ทุกเกณฑ์ถูกขับเคลื่อนจากข้อมูลมาตรฐานเดียวกัน ทำให้การอัปเดตโครงสร้างและเนื้อหาทำได้เป็นระบบ',
    icon: Blocks,
  },
  {
    title: 'Persistent assessment workspace',
    description: 'บันทึกความคืบหน้าอัตโนมัติระหว่างทาง ช่วยให้ทีมกลับมาทำงานต่อได้โดยไม่ต้องเริ่มใหม่',
    icon: DatabaseZap,
  },
];

const workflowSteps = [
  {
    title: 'กรอกข้อมูลพื้นฐาน',
    description: 'เตรียมข้อมูลโรงพยาบาล ขนาด บุคลากร และปริมาณบริการ เพื่อใช้เป็นบริบทในการประเมิน',
  },
  {
    title: 'ประเมินทีละมาตรฐาน',
    description: 'ไล่ครบทั้ง 15 มาตรฐาน แบ่งตาม 4 มิติ พร้อม progress ที่ชัดเจนในแต่ละระดับ',
  },
  {
    title: 'ใช้สรุปผลวางแผนพัฒนา',
    description: 'ดูภาพรวมรายมิติ รายมาตรฐาน และความพร้อมของข้อมูล เพื่อวาง roadmap ถัดไป',
  },
];

const primaryCtaLabel = computed(() =>
  startedStandards.value > 0 ? 'ดำเนินการประเมินต่อ' : 'เริ่มทำแบบประเมิน',
);
</script>

<template>
  <div>
    <section class="bg-white">
      <div class="shell-container py-14 sm:py-18 lg:py-24">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),420px] lg:items-start">
          <div class="space-y-6">
            <div class="section-kicker">
              2022 Medication Safety Standards
            </div>

            <div class="space-y-4">
              <h1 class="section-heading max-w-4xl">
                ระบบประเมินมาตรฐานความปลอดภัยด้านยา
                <span class="block text-[var(--color-navy)]">สำหรับโรงพยาบาลแบบ data-first</span>
              </h1>
              <p class="section-lead max-w-3xl">
                ประเมินตนเองตามมาตรฐานฉบับปรับปรุงใหม่ พ.ศ. 2565 ครอบคลุม 4 มิติ 15 มาตรฐาน พร้อมการให้คะแนนแบบขั้นบันไดที่อ่านง่าย ใช้งานจริง และเหมาะกับการวางแผนพัฒนาเชิงระบบ
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <RouterLink v-slot="{ navigate }" to="/assess/info" custom>
                <BaseButton size="lg" @click="navigate">
                  {{ primaryCtaLabel }}
                  <ArrowRight class="h-4 w-4" />
                </BaseButton>
              </RouterLink>

              <a
                href="#assessment-structure"
                class="inline-flex h-12 items-center justify-center rounded-[6px] border border-brand px-6 text-base font-medium text-brand hover:bg-[var(--color-info-soft)]"
              >
                ดูโครงสร้างการประเมิน
              </a>
            </div>

            <div class="grid gap-4 pt-4 sm:grid-cols-3">
              <div class="panel-card-muted p-4">
                <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                  มิติหลัก
                </div>
                <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
                  4
                </div>
                <div class="mt-1 text-sm text-[var(--color-subtle)]">
                  Management, Service, System และ Supply Chain
                </div>
              </div>
              <div class="panel-card-muted p-4">
                <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                  มาตรฐานทั้งหมด
                </div>
                <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
                  {{ standards.length }}
                </div>
                <div class="mt-1 text-sm text-[var(--color-subtle)]">
                  พร้อมรายการเกณฑ์ย่อยที่ตรวจสอบได้จริง
                </div>
              </div>
              <div class="panel-card-muted p-4">
                <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                  ระดับการพัฒนา
                </div>
                <div class="metric-value mt-2 text-3xl font-bold text-[var(--color-navy)]">
                  5
                </div>
                <div class="mt-1 text-sm text-[var(--color-subtle)]">
                  Waterfall scoring จาก Level 1 ถึง 5
                </div>
              </div>
            </div>
          </div>

          <aside class="panel-card overflow-hidden">
            <div class="border-b border-[var(--color-border)] bg-[var(--color-cloud)] px-5 py-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <div class="text-sm font-semibold text-[var(--color-steel)]">
                    Assessment overview
                  </div>
                  <p class="mt-1 text-xs leading-5 text-[var(--color-subtle)]">
                    สถานะล่าสุดของรอบประเมินปัจจุบัน
                  </p>
                </div>
                <span class="status-chip bg-[var(--color-info-soft)] text-[#084298]">
                  <Activity class="h-3.5 w-3.5" />
                  Auto-save
                </span>
              </div>
            </div>

            <div class="space-y-5 p-5">
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="panel-card-muted p-4">
                  <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                    ประเมินแล้ว
                  </div>
                  <div class="metric-value mt-2 text-2xl font-bold text-[var(--color-navy)]">
                    {{ startedStandards }}/{{ standards.length }}
                  </div>
                  <div class="mt-1 text-sm text-[var(--color-subtle)]">
                    มาตรฐานที่มีระดับมากกว่า 0
                  </div>
                </div>

                <div class="panel-card-muted p-4">
                  <div class="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                    เกณฑ์ที่เลือก
                  </div>
                  <div class="metric-value mt-2 text-2xl font-bold text-[var(--color-navy)]">
                    {{ checkedCriteriaCount }}/{{ totalCriteriaCount }}
                  </div>
                  <div class="mt-1 text-sm text-[var(--color-subtle)]">
                    ภาพรวมทุกมาตรฐาน
                  </div>
                </div>
              </div>

              <div>
                <div class="mb-3 text-sm font-semibold text-[var(--color-steel)]">
                  มิติการประเมิน
                </div>
                <div class="space-y-3">
                  <div
                    v-for="dimension in dimensionCards"
                    :key="dimension.shortLabel"
                    class="flex items-start justify-between gap-4 rounded-[8px] border border-[var(--color-border)] px-4 py-3"
                  >
                    <div>
                      <div class="text-sm font-semibold text-[var(--color-ink)]">
                        {{ dimension.label }}
                      </div>
                      <div class="mt-1 text-xs leading-5 text-[var(--color-subtle)]">
                        {{ dimension.description }}
                      </div>
                    </div>
                    <span class="metric-value text-sm font-semibold text-brand">
                      {{ dimension.count }} มาตรฐาน
                    </span>
                  </div>
                </div>
              </div>

              <div class="rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-subtle)]">
                บันทึกล่าสุด: <span class="metric-value font-medium text-[var(--color-steel)]">{{ formatThaiDate(assessmentState.lastUpdated) }}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="shell-container py-12 sm:py-16">
      <div class="grid gap-4 lg:grid-cols-3">
        <article v-for="item in highlights" :key="item.title" class="panel-card p-6">
          <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[var(--color-cloud)] text-brand">
            <component :is="item.icon" class="h-5 w-5" />
          </div>
          <h2 class="text-xl font-semibold tracking-[-0.01em] text-[var(--color-navy)]">
            {{ item.title }}
          </h2>
          <p class="mt-3 text-sm leading-6 text-[var(--color-subtle)]">
            {{ item.description }}
          </p>
        </article>
      </div>
    </section>

    <section id="assessment-structure" class="bg-white">
      <div class="shell-container py-12 sm:py-16">
        <div class="mb-8 space-y-3">
          <div class="section-kicker">
            Assessment structure
          </div>
          <h2 class="text-3xl font-bold tracking-[-0.01em] text-[var(--color-navy)]">
            โครงสร้างเดิมครบถ้วน แต่จัดวางใหม่ให้อ่านข้อมูลได้ง่ายขึ้น
          </h2>
          <p class="max-w-3xl text-base leading-7 text-[var(--color-subtle)]">
            หน้า landing, ข้อมูลโรงพยาบาล, หน้ามาตรฐาน และหน้าสรุปผลยังคง flow เดิมของระบบ แต่ถูกออกแบบใหม่ให้เป็น technical workspace ที่ชัดเจนขึ้นทั้งบน desktop และ mobile
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="dimension in dimensionCards" :key="dimension.shortLabel" class="panel-card p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
              {{ dimension.shortLabel }}
            </div>
            <h3 class="mt-3 text-lg font-semibold text-[var(--color-ink)]">
              {{ dimension.label }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-[var(--color-subtle)]">
              {{ dimension.description }}
            </p>
            <div class="metric-value mt-4 text-sm font-semibold text-[var(--color-steel)]">
              {{ dimension.count }} มาตรฐาน
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="shell-container py-12 sm:py-16">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr),360px]">
        <div>
          <div class="mb-6 space-y-3">
            <div class="section-kicker">
              Workflow
            </div>
            <h2 class="text-3xl font-bold tracking-[-0.01em] text-[var(--color-navy)]">
              กระบวนการประเมิน 3 ช่วงที่ทำงานต่อเนื่องกัน
            </h2>
          </div>

          <div class="space-y-4">
            <article
              v-for="(step, index) in workflowSteps"
              :key="step.title"
              class="panel-card flex gap-4 p-5"
            >
              <div class="metric-value flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-info-soft)] text-base font-bold text-[#084298]">
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-[var(--color-ink)]">
                  {{ step.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-[var(--color-subtle)]">
                  {{ step.description }}
                </p>
              </div>
            </article>
          </div>
        </div>

        <aside class="panel-card p-6">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--color-cloud)] text-brand">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold text-[var(--color-steel)]">
                เหมาะสำหรับทีมโรงพยาบาล
              </div>
              <div class="text-xs text-[var(--color-subtle)]">
                ใช้งานได้ทั้งการประเมินเดี่ยวและการทบทวนร่วมกัน
              </div>
            </div>
          </div>

          <div class="space-y-4 text-sm leading-6 text-[var(--color-subtle)]">
            <p>
              ดีไซน์ใหม่เน้นความแม่นยำของข้อมูลเป็นหลัก: ใช้พื้นขาวสะอาด เส้นขอบบาง อ่านค่าได้ง่าย และใช้สีน้ำเงินเฉพาะจุดที่เป็น action หรือสถานะสำคัญ
            </p>
            <p>
              รายละเอียดเกณฑ์ถูกจัดให้อยู่ในระดับที่สแกนได้เร็วขึ้น ทั้งส่วนข้อมูลโรงพยาบาล แถบ navigation และหน้าสรุปผลที่สื่อสาร maturity ได้ชัดเจนขึ้น
            </p>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
