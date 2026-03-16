<template>
  <article class="service-status-card">
    <div class="service-status-card__header">
      <div class="service-status-card__title-wrap">
        <div>
          <h2 class="service-status-card__title">{{ service.name }}</h2>
          <p class="service-status-card__description">{{ service.description }}</p>
        </div>
        <p class="service-status-card__target">{{ service.target }}</p>
      </div>

      <StatusBadge :status="service.currentStatus" variant="compact" />
    </div>

    <div class="service-status-card__bars-header">
      <p>Uptime over the past 90 days.</p>
      <p>Daily availability snapshot.</p>
    </div>

    <UptimeBars :bars="service.dailyBars" :chart-label="`${service.name} 90 day uptime`" />

    <div class="service-status-card__footer">
      <div class="service-status-card__range">
        <span>90 days ago</span>
        <span>{{ uptime90d }}</span>
        <span>Today</span>
      </div>

      <div class="service-status-card__metrics">
        <span>{{ responseTime }}</span>
        <span>{{ lastCheckedAt }}</span>
      </div>
    </div>

    <p v-if="service.latestError" class="service-status-card__error">
      {{ service.latestError }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ServiceStatusData } from "@/types";
import { formatPercent, formatRelativeTime, formatResponseTime } from "@/utils/format";
import StatusBadge from "./StatusBadge.vue";
import UptimeBars from "./UptimeBars.vue";

const props = defineProps<{
  service: ServiceStatusData;
}>();

const uptime90d = computed(() =>
  `${formatPercent(props.service.uptime90d)} uptime`,
);
const responseTime = computed(() =>
  `Current latency ${formatResponseTime(props.service.responseTime)}`,
);
const lastCheckedAt = computed(() =>
  `Checked ${formatRelativeTime(props.service.lastCheckedAt)}`,
);
</script>

<style scoped lang="scss">
.service-status-card {
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px -40px var(--color-shadow);

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  &__title-wrap {
    display: grid;
    gap: 0.3rem;
  }

  &__title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  &__description,
  &__target,
  &__bars-header,
  &__footer,
  &__error {
    margin: 0;
  }

  &__description {
    color: var(--color-base-200);
    font-size: 0.95rem;
    font-weight: 500;
  }

  &__target {
    font-family: var(--font-mono);
    color: var(--color-base-300);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__bars-header,
  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    color: var(--color-base-300);
    font-size: 0.88rem;
    font-weight: 500;
  }

  &__range,
  &__metrics {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  &__range span:nth-child(2) {
    color: var(--color-base-0);
  }

  &__error {
    color: var(--color-status-outage);
    font-size: 0.88rem;
    font-weight: 500;
  }

  @media (width < 720px) {
    &__header,
    &__bars-header,
    &__footer,
    &__range,
    &__metrics {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
