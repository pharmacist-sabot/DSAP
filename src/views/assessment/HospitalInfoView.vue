<script setup lang="ts">
import { ArrowRight, Building2, ClipboardList, Hospital, Users } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { computed, reactive, watch } from 'vue';
import { RouterLink } from 'vue-router';
import BaseButton from '@/components/common/BaseButton.vue';
import { useAssessmentStore } from '@/stores/assessment';
import type { HospitalInfo } from '@/types/models';
import {
  cloneHospitalInfo,
  countFilledHospitalFields,
  hospitalSizeOptions,
  regionOptions,
} from '@/utils/assessment';

const store = useAssessmentStore();
const { assessmentState } = storeToRefs(store);

const form = reactive(cloneHospitalInfo(assessmentState.value.hospitalInfo));

function getSanitizedNumber(value: number | string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function snapshotHospitalInfo(): HospitalInfo {
  return {
    name: form.name.trim(),
    region: form.region,
    province: form.province.trim(),
    district: form.district.trim(),
    bedCount: getSanitizedNumber(form.bedCount),
    hospitalSize: form.hospitalSize,
    staff: {
      pharmacists: getSanitizedNumber(form.staff.pharmacists),
      assistants: getSanitizedNumber(form.staff.assistants),
      others: getSanitizedNumber(form.staff.others),
    },
    stats: {
      opdVisits: getSanitizedNumber(form.stats.opdVisits),
      opdPrescriptions: getSanitizedNumber(form.stats.opdPrescriptions),
      ipdAdmissions: getSanitizedNumber(form.stats.ipdAdmissions),
      ipdPatientDays: getSanitizedNumber(form.stats.ipdPatientDays),
    },
  };
}

watch(form, () => {
  store.updateHospitalInfo(snapshotHospitalInfo());
}, { deep: true });

const filledFieldsCount = computed(() => countFilledHospitalFields(snapshotHospitalInfo()));
const trackedFieldsCount = 13;

const completionPercent = computed(() =>
  Math.round((filledFieldsCount.value / trackedFieldsCount) * 100),
);

const overviewItems = computed(() => [
  { label: 'ข้อมูลที่กรอกแล้ว', value: `${filledFieldsCount.value}/${trackedFieldsCount}` },
  { label: 'ความครบถ้วนโดยประมาณ', value: `${completionPercent.value}%` },
  { label: 'จำนวนเภสัชกร', value: `${getSanitizedNumber(form.staff.pharmacists)} คน` },
  { label: 'ขนาดโรงพยาบาล', value: form.hospitalSize || '-' },
]);
</script>

<template>
  <div class="space-y-6">
    <section class="panel-card p-6 sm:p-7">
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
        <div class="space-y-4">
          <div class="section-kicker">
            Part 1 · Hospital profile
          </div>
          <div>
            <h1 class="text-3xl font-bold tracking-[-0.01em] text-[var(--color-navy)]">
              ข้อมูลทั่วไปของโรงพยาบาล
            </h1>
            <p class="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-subtle)]">
              กรอกข้อมูลพื้นฐานเพื่อใช้เป็นบริบทประกอบการประเมินมาตรฐาน ทั้งด้านขนาดองค์กร ทรัพยากรบุคคล และปริมาณบริการ ข้อมูลส่วนนี้จะถูกบันทึกอัตโนมัติทันทีที่แก้ไข
            </p>
          </div>
        </div>

        <aside class="panel-card-muted p-5">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-brand shadow-[var(--shadow-soft)]">
              <ClipboardList class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold text-[var(--color-steel)]">
                Data readiness
              </div>
              <div class="text-xs text-[var(--color-subtle)]">
                เตรียมข้อมูลก่อนเข้าสู่การประเมินมาตรฐาน
              </div>
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="font-medium text-[var(--color-steel)]">ความครบถ้วนของข้อมูล</span>
                <span class="metric-value font-semibold text-brand">{{ completionPercent }}%</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-white">
                <div class="h-full rounded-full bg-brand transition-all duration-200" :style="{ width: `${completionPercent}%` }" />
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div v-for="item in overviewItems" :key="item.label" class="rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-3">
                <div class="text-xs uppercase tracking-[0.08em] text-[var(--color-subtle)]">
                  {{ item.label }}
                </div>
                <div class="metric-value mt-2 text-sm font-semibold text-[var(--color-navy)]">
                  {{ item.value }}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
      <form class="panel-card space-y-8 p-6 sm:p-7" @submit.prevent>
        <section class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--color-cloud)] text-brand">
              <Hospital class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-[var(--color-ink)]">
                ข้อมูลหน่วยงาน
              </h2>
              <p class="text-sm text-[var(--color-subtle)]">
                ระบุชื่อโรงพยาบาล พื้นที่รับผิดชอบ และขนาดองค์กร
              </p>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="input-label" for="hospital-name">ชื่อโรงพยาบาล</label>
              <input id="hospital-name" v-model="form.name" class="input-field" type="text" placeholder="เช่น โรงพยาบาลตัวอย่าง">
            </div>

            <div>
              <label class="input-label" for="region">เขต/ภูมิภาค</label>
              <select id="region" v-model="form.region" class="input-field">
                <option value="">
                  เลือกภูมิภาค
                </option>
                <option v-for="region in regionOptions" :key="region" :value="region">
                  {{ region }}
                </option>
              </select>
            </div>

            <div>
              <label class="input-label" for="hospital-size">ขนาดโรงพยาบาล</label>
              <select id="hospital-size" v-model="form.hospitalSize" class="input-field">
                <option value="">
                  เลือกขนาดโรงพยาบาล
                </option>
                <option v-for="size in hospitalSizeOptions" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>

            <div>
              <label class="input-label" for="province">จังหวัด</label>
              <input id="province" v-model="form.province" class="input-field" type="text" placeholder="จังหวัด">
            </div>

            <div>
              <label class="input-label" for="district">อำเภอ/เขต</label>
              <input id="district" v-model="form.district" class="input-field" type="text" placeholder="อำเภอหรือเขต">
            </div>

            <div>
              <label class="input-label" for="bed-count">จำนวนเตียง</label>
              <input id="bed-count" v-model.number="form.bedCount" class="input-field" type="number" min="0" placeholder="0">
            </div>
          </div>
        </section>

        <section class="space-y-5 border-t border-[var(--color-border)] pt-8">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--color-cloud)] text-brand">
              <Users class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-[var(--color-ink)]">
                ข้อมูลบุคลากร
              </h2>
              <p class="text-sm text-[var(--color-subtle)]">
                ระบุจำนวนกำลังคนหลักในระบบยา
              </p>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-3">
            <div>
              <label class="input-label" for="pharmacists">เภสัชกร</label>
              <input id="pharmacists" v-model.number="form.staff.pharmacists" class="input-field" type="number" min="0" placeholder="0">
            </div>
            <div>
              <label class="input-label" for="assistants">ผู้ช่วย/เจ้าพนักงาน</label>
              <input id="assistants" v-model.number="form.staff.assistants" class="input-field" type="number" min="0" placeholder="0">
            </div>
            <div>
              <label class="input-label" for="others">บุคลากรอื่น ๆ</label>
              <input id="others" v-model.number="form.staff.others" class="input-field" type="number" min="0" placeholder="0">
            </div>
          </div>
        </section>

        <section class="space-y-5 border-t border-[var(--color-border)] pt-8">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--color-cloud)] text-brand">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-[var(--color-ink)]">
                ปริมาณบริการ
              </h2>
              <p class="text-sm text-[var(--color-subtle)]">
                ใช้เพื่อสะท้อน workload และบริบทของโรงพยาบาล
              </p>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="input-label" for="opd-visits">จำนวนผู้รับบริการ OPD</label>
              <input id="opd-visits" v-model.number="form.stats.opdVisits" class="input-field" type="number" min="0" placeholder="0">
            </div>
            <div>
              <label class="input-label" for="opd-prescriptions">จำนวนใบสั่งยา OPD</label>
              <input id="opd-prescriptions" v-model.number="form.stats.opdPrescriptions" class="input-field" type="number" min="0" placeholder="0">
            </div>
            <div>
              <label class="input-label" for="ipd-admissions">จำนวนรับผู้ป่วยใน</label>
              <input id="ipd-admissions" v-model.number="form.stats.ipdAdmissions" class="input-field" type="number" min="0" placeholder="0">
            </div>
            <div>
              <label class="input-label" for="ipd-patient-days">จำนวนวันนอนรวมผู้ป่วยใน</label>
              <input id="ipd-patient-days" v-model.number="form.stats.ipdPatientDays" class="input-field" type="number" min="0" placeholder="0">
            </div>
          </div>
        </section>

        <div class="flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:justify-between">
          <p class="text-sm leading-6 text-[var(--color-subtle)]">
            หากยังมีข้อมูลไม่ครบ สามารถกลับมาแก้ไขภายหลังได้ทุกเวลา
          </p>
          <div class="flex flex-col gap-3 sm:flex-row">
            <RouterLink v-slot="{ navigate }" to="/assess/summary" custom>
              <BaseButton variant="secondary" @click="navigate">
                ดูสรุปผล
              </BaseButton>
            </RouterLink>
            <RouterLink v-slot="{ navigate }" to="/assess/standard/1" custom>
              <BaseButton @click="navigate">
                ไปยังมาตรฐานที่ 1
                <ArrowRight class="h-4 w-4" />
              </BaseButton>
            </RouterLink>
          </div>
        </div>
      </form>

      <aside class="space-y-4">
        <section class="panel-card p-5">
          <div class="text-sm font-semibold text-[var(--color-steel)]">
            คำแนะนำการกรอกข้อมูล
          </div>
          <div class="mt-3 space-y-3 text-sm leading-6 text-[var(--color-subtle)]">
            <p>1. กรอกเฉพาะข้อมูลที่พร้อมใช้งานจริงในรอบการประเมินปัจจุบัน</p>
            <p>2. ตัวเลขสามารถเริ่มจากค่าประมาณเพื่อใช้งานภายในก่อน แล้วค่อยปรับภายหลัง</p>
            <p>3. ระบบจะบันทึกทุกการเปลี่ยนแปลงให้อัตโนมัติ</p>
          </div>
        </section>

        <section class="panel-card-muted p-5">
          <div class="text-sm font-semibold text-[var(--color-steel)]">
            Snapshot ปัจจุบัน
          </div>
          <dl class="mt-4 space-y-3 text-sm">
            <div class="flex items-center justify-between gap-4">
              <dt class="text-[var(--color-subtle)]">
                ชื่อโรงพยาบาล
              </dt>
              <dd class="font-medium text-[var(--color-ink)]">
                {{ form.name || '-' }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="text-[var(--color-subtle)]">
                พื้นที่
              </dt>
              <dd class="font-medium text-[var(--color-ink)]">
                {{ form.province || '-' }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="text-[var(--color-subtle)]">
                ขนาด
              </dt>
              <dd class="font-medium text-[var(--color-ink)]">
                {{ form.hospitalSize || '-' }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="text-[var(--color-subtle)]">
                จำนวนเตียง
              </dt>
              <dd class="metric-value font-medium text-[var(--color-ink)]">
                {{ getSanitizedNumber(form.bedCount) }}
              </dd>
            </div>
          </dl>
        </section>
      </aside>
    </section>
  </div>
</template>
