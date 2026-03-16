<template>
  <svg
    class="response-sparkline"
    viewBox="0 0 240 64"
    preserveAspectRatio="none"
    role="img"
    :aria-label="label"
  >
    <defs>
      <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#4bf364" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#a7caf3" stop-opacity="0.9" />
      </linearGradient>
    </defs>
    <path class="response-sparkline__area" :d="areaPath" />
    <path class="response-sparkline__line" :d="linePath" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  points: Array<number | null>;
  label: string;
}>();

const normalizedPoints = computed(() => {
  const fallback = props.points.map((value) => value ?? 0);
  const max = Math.max(...fallback, 1);

  return props.points.map((value, index) => {
    const x = (index / Math.max(props.points.length - 1, 1)) * 240;
    const y =
      value === null
        ? 52
        : 56 - Math.max((value / max) * 46, 4);

    return { x, y };
  });
});

const linePath = computed(() => {
  return normalizedPoints.value
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
});

const areaPath = computed(() => {
  const points = normalizedPoints.value;
  if (points.length === 0) {
    return "";
  }

  return `${linePath.value} L 240 60 L 0 60 Z`;
});
</script>

<style scoped lang="scss">
.response-sparkline {
  width: 100%;
  height: 4rem;

  &__area {
    fill: rgba(75, 243, 100, 0.08);
  }

  &__line {
    fill: none;
    stroke: url(#sparkline-gradient);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3;
  }
}
</style>
