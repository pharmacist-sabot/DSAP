<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  block?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  block: false,
});

const variantClasses = {
  primary: 'border border-transparent bg-brand text-white shadow-sm hover:-translate-y-px hover:bg-brand-hover hover:shadow-[var(--shadow-soft)] active:translate-y-0 active:bg-[var(--color-brand-active)]',
  secondary: 'border border-brand bg-white text-brand hover:bg-[var(--color-info-soft)] hover:text-[#084298] active:bg-[#d8e7ff]',
  ghost: 'border border-transparent bg-transparent text-[var(--color-steel)] hover:bg-[var(--color-cloud)] hover:text-[var(--color-ink)]',
  danger: 'border border-transparent bg-[var(--color-error)] text-white hover:-translate-y-px hover:bg-[#bb2d3b] active:translate-y-0',
};

const sizeClasses = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-[6px] font-medium whitespace-nowrap transition-all duration-150 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#86b7fe] focus-visible:ring-4 focus-visible:ring-[rgba(13,110,253,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
    :class="[variantClasses[variant], sizeClasses[size], block ? 'w-full' : 'w-auto']"
  >
    <slot />
  </button>
</template>
