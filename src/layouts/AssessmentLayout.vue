<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';

import AppHeader from '@/components/common/AppHeader.vue';
import { useAssessmentStore } from '@/stores/assessment';

const store = useAssessmentStore();
const { standards } = storeToRefs(store);
const route = useRoute();

function getLevel(stdId: number) {
  return store.getStandardLevel(stdId);
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />

    <div class="flex flex-1 container mx-auto px-4 py-6 gap-6">
      <!-- Sidebar (Desktop) -->
      <aside class="w-72 hidden md:block shrink-0">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
          <div class="p-4 border-b border-gray-100 bg-gray-50">
            <h2 class="font-bold text-gray-700">
              รายการประเมิน
            </h2>
            <div class="text-xs text-gray-500 mt-1">
              15 มาตรฐานความปลอดภัย
            </div>
          </div>

          <nav class="max-h-[calc(100vh-200px)] overflow-y-auto">
            <ul class="py-2">
              <li v-for="std in standards" :key="std.id">
                <RouterLink
                  :to="`/assess/standard/${std.id}`"
                  class="flex items-center justify-between px-4 py-3 text-sm transition-colors border-l-4"
                  :class="[
                    route.params.id === String(std.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  ]"
                >
                  <div class="truncate pr-2">
                    <span class="mr-2 font-mono text-xs opacity-70">{{ std.id }}.</span>
                    {{ std.title }}
                  </div>

                  <!-- Level Badge -->
                  <span
                    class="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                    :class="getLevel(std.id) > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'"
                  >
                    {{ getLevel(std.id) }}
                  </span>
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>
