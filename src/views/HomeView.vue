<script setup lang="ts">
import { RouterLink } from 'vue-router';

import BaseButton from '@/components/common/BaseButton.vue';
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 text-center max-w-3xl mx-auto">
    <div class="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner">
      🏥
    </div>

    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
      ระบบประเมินมาตรฐาน<br>
      <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-teal-500">
        ความปลอดภัยด้านยา
      </span>
    </h1>

    <p class="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl">
      แบบประเมินตนเองสำหรับโรงพยาบาลสังกัดสำนักงานปลัดกระทรวงสาธารณสุข (ฉบับปรับปรุงใหม่ พ.ศ.2565) ครอบคลุม 4 มิติ 15 มาตรฐาน
    </p>

    <div class="flex gap-4 flex-col sm:flex-row">
      <RouterLink v-slot="{ navigate }" to="/assess/standard/1" custom>
        <BaseButton class="px-8 py-3 text-lg shadow-lg shadow-blue-200" @click="navigate">
          เริ่มทำแบบประเมิน
        </BaseButton>
      </RouterLink>

      <a href="#" class="px-8 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
        คู่มือการใช้งาน
      </a>
    </div>

    <!-- Stats Preview (Optional) -->
    <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center w-full">
      <div>
        <div class="text-3xl font-bold text-gray-900">
          4
        </div>
        <div class="text-sm text-gray-500 mt-1">
          มิติการประเมิน
        </div>
      </div>
      <div>
        <div class="text-3xl font-bold text-gray-900">
          15
        </div>
        <div class="text-sm text-gray-500 mt-1">
          มาตรฐาน
        </div>
      </div>
      <div>
        <div class="text-3xl font-bold text-gray-900">
          5
        </div>
        <div class="text-sm text-gray-500 mt-1">
          ระดับขั้นบันได
        </div>
      </div>
      <div>
        <div class="text-3xl font-bold text-gray-900">
          Auto
        </div>
        <div class="text-sm text-gray-500 mt-1">
          บันทึกอัตโนมัติ
        </div>
      </div>
    </div>
  </div>
</template>
