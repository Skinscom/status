<template>
  <div class="metric-pill">
    <span class="metric-pill__eyebrow">{{ eyebrow }}</span>
    <strong class="metric-pill__value">{{ value }}</strong>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string;
  value: string;
}>();
</script>

<style scoped lang="scss">
.metric-pill {
  display: grid;
  gap: 0.35rem;
  min-width: 10rem;
  padding: 1rem 1.125rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);

  &__eyebrow {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-base-300);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__value {
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
