<template>
  <section class="overall-status-banner">
    <div class="overall-status-banner__copy">
      <p class="overall-status-banner__eyebrow">Live System Status</p>
      <h1 class="overall-status-banner__title">{{ overall.title }}</h1>
      <p class="overall-status-banner__message">{{ overall.message }}</p>
      <div class="overall-status-banner__status-row">
        <StatusBadge :status="overall.status" />
        <span class="overall-status-banner__timestamp">
          Updated {{ relativeUpdatedAt }}
        </span>
      </div>
    </div>

    <div class="overall-status-banner__metrics">
      <div class="overall-status-banner__metrics-shell">
        <div class="overall-status-banner__metrics-header">
          <p class="overall-status-banner__metrics-eyebrow">Current Snapshot</p>
          <p class="overall-status-banner__metrics-caption">
            Live health summary across monitored services.
          </p>
        </div>

        <div class="overall-status-banner__metric-grid">
          <div class="overall-status-banner__metric overall-status-banner__metric--primary">
            <div class="overall-status-banner__metric-head">
              <span>Service Health</span>
              <span>{{ serviceHealth }}</span>
            </div>
            <strong class="overall-status-banner__metric-value">
              {{ metrics.operationalServices }}/{{ metrics.monitoredServices }}
            </strong>
            <div class="overall-status-banner__metric-bar" aria-hidden="true">
              <span :style="{ width: `${serviceHealthRatio}%` }" />
            </div>
          </div>

          <div class="overall-status-banner__metric">
            <div class="overall-status-banner__metric-head">
              <span>Average Latency</span>
              <span>24h</span>
            </div>
            <strong class="overall-status-banner__metric-value">
              {{ averageResponseTime }}
            </strong>
          </div>

          <div class="overall-status-banner__metric">
            <div class="overall-status-banner__metric-head">
              <span>90 Day Uptime</span>
              <span>Blended</span>
            </div>
            <strong class="overall-status-banner__metric-value">
              {{ uptime90d }}
            </strong>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { OverallStatus } from "@/types";
import { formatPercent, formatRelativeTime, formatResponseTime } from "@/utils/format";
import StatusBadge from "./StatusBadge.vue";

const props = defineProps<{
  overall: OverallStatus;
  metrics: {
    monitoredServices: number;
    operationalServices: number;
    averageResponseTime24h: number | null;
    uptime90d: number | null;
  };
  generatedAt: string;
}>();

const averageResponseTime = computed(() =>
  formatResponseTime(props.metrics.averageResponseTime24h),
);
const uptime90d = computed(() => formatPercent(props.metrics.uptime90d));
const relativeUpdatedAt = computed(() => formatRelativeTime(props.generatedAt));
const serviceHealth = computed(
  () => `${props.metrics.operationalServices}/${props.metrics.monitoredServices} healthy`,
);
const serviceHealthRatio = computed(() => {
  if (props.metrics.monitoredServices === 0) {
    return 0;
  }

  return (
    (props.metrics.operationalServices / props.metrics.monitoredServices) * 100
  );
});
</script>

<style scoped lang="scss">
.overall-status-banner {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
  gap: var(--space-xl);
  padding: 2rem;
  background:
    linear-gradient(135deg, rgba(75, 243, 100, 0.14), transparent 42%),
    linear-gradient(180deg, rgba(30, 39, 57, 0.96), rgba(12, 16, 23, 0.96));
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xl);
  box-shadow: 0 30px 80px -40px var(--color-shadow);

  &__copy {
    display: grid;
    gap: 0.9rem;
    align-content: start;
  }

  &__eyebrow {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-brand-100);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.5rem, 5vw, 4.4rem);
    line-height: 0.96;
    letter-spacing: -0.05em;
  }

  &__message {
    max-width: 42rem;
    margin: 0;
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--color-base-200);
  }

  &__status-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.875rem;
    align-items: center;
  }

  &__timestamp {
    color: var(--color-base-300);
    font-size: 0.94rem;
    font-weight: 500;
  }

  &__metrics {
    display: flex;
    align-items: stretch;
  }

  &__metrics-shell {
    position: relative;
    display: grid;
    gap: 1.1rem;
    width: 100%;
    padding: 1.35rem;
    overflow: hidden;
    background:
      radial-gradient(
        circle at top right,
        rgba(75, 243, 100, 0.12),
        transparent 32%
      ),
      linear-gradient(180deg, rgba(30, 39, 57, 0.92), rgba(17, 23, 34, 0.96));
    border: 1px solid var(--color-border-soft);
    border-radius: calc(var(--radius-xl) - 4px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 24px 50px -36px rgba(0, 0, 0, 0.55);
  }

  &__metrics-shell::after {
    position: absolute;
    inset: auto -12% -35% auto;
    width: 12rem;
    height: 12rem;
    background: radial-gradient(
      circle,
      rgba(167, 202, 243, 0.12),
      transparent 65%
    );
    content: "";
    pointer-events: none;
  }

  &__metrics-header {
    display: grid;
    gap: 0.2rem;
  }

  &__metrics-eyebrow {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.76rem;
    color: var(--color-base-300);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__metrics-caption {
    margin: 0;
    color: var(--color-base-200);
    font-size: 0.92rem;
    font-weight: 500;
  }

  &__metric-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
  }

  &__metric {
    position: relative;
    display: grid;
    gap: 0.75rem;
    min-height: 8.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(207, 212, 222, 0.08);
    border-radius: 16px;
  }

  &__metric--primary {
    grid-column: 1 / -1;
    min-height: auto;
    padding: 1.05rem;
    background:
      linear-gradient(180deg, rgba(75, 243, 100, 0.09), rgba(255, 255, 255, 0.02)),
      rgba(255, 255, 255, 0.02);
  }

  &__metric-head {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    align-items: center;
    color: var(--color-base-300);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__metric-value {
    font-size: clamp(1.4rem, 3vw, 2rem);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  &__metric-bar {
    height: 0.42rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 999px;
  }

  &__metric-bar span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #4bf364, #a7caf3);
    border-radius: inherit;
  }

  @media (width < 900px) {
    grid-template-columns: 1fr;
  }

  @media (width < 640px) {
    padding: 1.4rem;

    &__metric-grid {
      grid-template-columns: 1fr;
    }

    &__metric--primary {
      grid-column: auto;
    }
  }
}
</style>
