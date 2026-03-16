<template>
  <div class="uptime-bars" role="img" :aria-label="chartLabel">
    <div
      v-for="bar in bars"
      :key="bar.date"
      class="uptime-bars__bar"
      :class="`uptime-bars__bar--${bar.status}`"
      :title="buildTooltip(bar)"
    />
  </div>
</template>

<script setup lang="ts">
import type { DailyBar } from "@/types";

const props = defineProps<{
  bars: DailyBar[];
  chartLabel: string;
}>();

function buildTooltip(bar: DailyBar) {
  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(bar.date));

  return `${date}: ${bar.label}`;
}
</script>

<style scoped lang="scss">
.uptime-bars {
  display: grid;
  grid-template-columns: repeat(90, minmax(0, 1fr));
  gap: 0.2rem;
  width: 100%;

  &__bar {
    aspect-ratio: 1 / 3.8;
    min-height: 2.1rem;
    background: var(--color-status-unknown);
    border-radius: 999px;
    transition:
      transform 0.15s ease,
      opacity 0.15s ease;

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }

    &--operational {
      background: var(--color-status-operational);
    }

    &--degraded {
      background: var(--color-status-degraded);
    }

    &--outage {
      background: var(--color-status-outage);
    }
  }
}
</style>
