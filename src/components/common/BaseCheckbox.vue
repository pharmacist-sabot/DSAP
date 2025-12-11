<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  label: string;
  id: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const inputId = computed(() => `checkbox-${props.id}`);

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
}
</script>

<template>
  <div
    class="flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none group"
    :class="[
      modelValue
        ? 'bg-blue-50 border-blue-200 shadow-sm'
        : 'bg-white border-gray-200 hover:border-gray-300',
      disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
    ]"
    @click="toggle"
  >
    <!-- Custom Checkbox Box -->
    <div class="relative flex items-center">
      <input
        :id="inputId"
        type="checkbox"
        class="peer sr-only"
        :checked="modelValue"
        :disabled="disabled"
      >
      <div
        class="h-5 w-5 border-2 border-gray-300 rounded bg-white transition-colors peer-checked:bg-blue-600 peer-checked:border-blue-600"
      >
        <!-- Checkmark Icon -->
        <svg
          v-if="modelValue"
          class="h-4 w-4 text-white mx-auto mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>

    <!-- Label Text -->
    <label
      :for="inputId"
      class="text-sm text-gray-700 cursor-pointer flex-1 leading-relaxed"
      :class="{ 'font-medium text-gray-900': modelValue }"
    >
      {{ label }}
    </label>
  </div>
</template>
