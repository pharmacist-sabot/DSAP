<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import AssessmentLayout from '@/layouts/AssessmentLayout.vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();

const layouts = {
  default: DefaultLayout,
  blank: BlankLayout,
  assessment: AssessmentLayout,
};

const currentLayout = computed(() => {
  const layoutName = (route.meta.layout as keyof typeof layouts) || 'default';
  const layoutComponent = layouts[layoutName];

  return layoutComponent || DefaultLayout;
});
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
