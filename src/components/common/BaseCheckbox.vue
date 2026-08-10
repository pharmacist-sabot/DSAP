<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  label: string;
  id: string;
  description?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

const inputId = computed(() => `checkbox-${props.id}`);

function handleChange(event: Event) {
  const { target } = event;

  if (target instanceof HTMLInputElement) {
    emit('update:modelValue', target.checked);
  }
}
</script>

<template>
  <label
    :for="inputId"
    class="group flex items-start gap-3 rounded-[8px] border p-4 transition-all duration-150"
    :class="[
      modelValue
        ? 'border-brand bg-[var(--color-info-soft)] shadow-[var(--shadow-soft)]'
        : 'border-[var(--color-border)] bg-white hover:border-[#c5d4ea] hover:bg-[var(--color-cloud)]',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
  >
    <span class="relative mt-0.5 flex items-center">
      <input
        :id="inputId"
        type="checkbox"
        class="peer sr-only"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
      >
      <span
        class="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border bg-white transition-all duration-150 peer-focus-visible:border-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-0 peer-focus-visible:outline-[#86b7fe] peer-focus-visible:ring-4 peer-focus-visible:ring-[rgba(13,110,253,0.18)]"
        :class="modelValue ? 'border-brand bg-brand text-white' : 'border-[#ced4da] text-transparent'"
      >
        <svg
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </span>

    <span class="min-w-0 flex-1">
      <span class="block text-sm leading-6" :class="modelValue ? 'font-medium text-[var(--color-ink)]' : 'text-[var(--color-steel)]'">
        {{ label }}
      </span>
      <span v-if="description" class="mt-1 block text-xs leading-5 text-[var(--color-subtle)]">
        {{ description }}
      </span>
    </span>
  </label>
</template>
