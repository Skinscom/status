<template>
  <article class="incident-card">
    <div class="incident-card__header">
      <div>
        <p class="incident-card__eyebrow">
          {{ incident.kind === "maintenance" ? "Scheduled Maintenance" : "Incident" }}
        </p>
        <h3 class="incident-card__title">{{ incident.title }}</h3>
      </div>
      <StatusBadge :status="statusTone" :label="statusLabel" variant="compact" />
    </div>

    <p class="incident-card__summary">{{ incident.summary }}</p>

    <div class="incident-card__meta">
      <span>{{ startedAt }}</span>
      <span v-if="incident.affectedServices.length > 0">
        Affects {{ incident.affectedServices.join(", ") }}
      </span>
    </div>

    <ul v-if="incident.updates.length > 0" class="incident-card__updates">
      <li v-for="update in incident.updates.slice(0, 3)" :key="update.id">
        <span class="incident-card__update-label">{{ update.label }}</span>
        <span class="incident-card__update-body">{{ update.body }}</span>
      </li>
    </ul>

    <a class="incident-card__link" :href="incident.url" target="_blank" rel="noreferrer">
      View incident details
    </a>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Incident, ServiceStatus } from "@/types";
import { sentenceCase } from "@/utils/format";
import StatusBadge from "./StatusBadge.vue";

const props = defineProps<{
  incident: Incident;
}>();

const statusTone = computed<ServiceStatus>(() => {
  if (["resolved", "completed"].includes(props.incident.status)) {
    return "operational";
  }

  if (["scheduled", "monitoring"].includes(props.incident.status)) {
    return "degraded";
  }

  return "outage";
});

const statusLabel = computed(() => sentenceCase(props.incident.status));
const startedAt = computed(() =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(props.incident.startedAt)),
);
</script>

<style scoped lang="scss">
.incident-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);

  &__header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  &__eyebrow,
  &__summary,
  &__meta {
    margin: 0;
  }

  &__eyebrow {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-base-300);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__title {
    margin: 0.2rem 0 0;
    font-size: 1.15rem;
    letter-spacing: -0.02em;
  }

  &__summary {
    color: var(--color-base-200);
    font-weight: 500;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    color: var(--color-base-300);
    font-size: 0.88rem;
  }

  &__updates {
    display: grid;
    gap: 0.65rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__updates li {
    display: grid;
    gap: 0.2rem;
    padding-left: 1rem;
    border-left: 1px solid var(--color-border-soft);
  }

  &__update-label {
    font-size: 0.76rem;
    color: var(--color-brand-100);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__update-body {
    color: var(--color-base-200);
    font-size: 0.92rem;
    font-weight: 500;
  }

  &__link {
    color: var(--color-base-0);
    width: fit-content;
  }
}
</style>
