<template>
  <span
    class="status-badge"
    :class="[`status-badge--${status}`, `status-badge--${variant}`]"
  >
    <span class="status-badge__icon-wrap">
      <component
        :is="iconComponent"
        class="status-badge__icon"
        :size="variant === 'compact' ? 13 : 15"
        :stroke-width="2.25"
      />
    </span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Check, Clock3, TriangleAlert, X } from "lucide-vue-next";
import type { ServiceStatus } from "@/types";

const props = defineProps<{
  status: ServiceStatus;
  label?: string;
  variant?: "default" | "compact";
}>();

const label = computed(() => {
  if (props.label) {
    return props.label;
  }

  switch (props.status) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "outage":
      return "Outage";
    default:
      return "Collecting";
  }
});

const iconComponent = computed(() => {
  switch (props.status) {
    case "operational":
      return Check;
    case "degraded":
      return TriangleAlert;
    case "outage":
      return X;
    default:
      return Clock3;
  }
});
</script>

<style scoped lang="scss">
.status-badge {
  --status-tint: rgba(255, 255, 255, 0.04);
  --status-border: rgba(255, 255, 255, 0.08);

  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  width: fit-content;
  min-height: 1.95rem;
  padding: 0.28rem 0.72rem 0.28rem 0.38rem;
  font-size: 0.74rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--color-base-0);
  background: linear-gradient(180deg, var(--status-tint), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--status-border);
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);

  &__icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.2rem;
    height: 1.2rem;
    background: color-mix(in srgb, currentColor 14%, transparent);
    border-radius: 999px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  &__icon {
    flex: none;
  }

  &--operational {
    --status-tint: rgba(75, 243, 100, 0.08);
    --status-border: rgba(75, 243, 100, 0.14);
    color: var(--color-status-operational);
  }

  &--degraded {
    --status-tint: rgba(243, 192, 135, 0.1);
    --status-border: rgba(243, 192, 135, 0.16);
    color: var(--color-status-degraded);
  }

  &--outage {
    --status-tint: rgba(236, 74, 82, 0.1);
    --status-border: rgba(236, 74, 82, 0.16);
    color: var(--color-status-outage);
  }

  &--unknown {
    --status-tint: rgba(207, 212, 222, 0.06);
    --status-border: rgba(207, 212, 222, 0.1);
    color: var(--color-base-200);
  }

  &--compact {
    min-height: 1.45rem;
    padding: 0.1rem 0.46rem 0.1rem 0.18rem;
    gap: 0.3rem;
    font-size: 0.66rem;
    letter-spacing: 0.08em;
  }

  &--compact &__icon-wrap {
    width: 0.92rem;
    height: 0.92rem;
  }
}
</style>
