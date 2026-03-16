<template>
  <div class="status-home-view">
    <PageHeader
      v-if="statusData"
      :website-url="statusData.site.websiteUrl"
      :subscribe-url="statusData.site.subscribeUrl"
    />

    <main class="status-home-view__main">
      <section v-if="loading && !statusData" class="status-home-view__empty">
        Loading status data...
      </section>

      <section v-else-if="error && !statusData" class="status-home-view__empty">
        {{ error }}
      </section>

      <template v-else-if="statusData">
        <OverallStatusBanner
          :overall="statusData.overall"
          :metrics="statusData.metrics"
          :generated-at="statusData.generatedAt"
        />

        <section class="status-home-view__section">
          <div class="status-home-view__section-heading">
            <div>
              <p class="status-home-view__eyebrow">Services</p>
              <h2>Monitored components</h2>
            </div>
            <p>Checks run every {{ statusData.site.pollIntervalMinutes }} minutes.</p>
          </div>

          <div class="status-home-view__services">
            <ServiceStatusCard
              v-for="service in statusData.services"
              :key="service.slug"
              :service="service"
            />
          </div>
        </section>

        <section class="status-home-view__section">
          <div class="status-home-view__section-heading">
            <div>
              <p class="status-home-view__eyebrow">Incidents</p>
              <h2>Recent incident history</h2>
            </div>
            <p>
              Incidents and maintenance are synced from GitHub issues so updates stay in version control.
            </p>
          </div>

          <div v-if="statusData.incidents.length > 0" class="status-home-view__incidents">
            <IncidentCard
              v-for="incident in statusData.incidents.slice(0, 6)"
              :key="incident.id"
              :incident="incident"
            />
          </div>

          <div v-else class="status-home-view__empty-card">
            No incidents have been logged yet.
          </div>
        </section>
      </template>
    </main>

    <SiteFooter
      v-if="statusData"
      :name="statusData.site.name"
      :description="statusData.site.description"
      :website-url="statusData.site.websiteUrl"
      :subscribe-url="statusData.site.subscribeUrl"
    />
  </div>
</template>

<script setup lang="ts">
import IncidentCard from "@/components/IncidentCard.vue";
import OverallStatusBanner from "@/components/OverallStatusBanner.vue";
import PageHeader from "@/components/PageHeader.vue";
import ServiceStatusCard from "@/components/ServiceStatusCard.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import { useStatusData } from "@/composables/useStatusData";

const { statusData, loading, error } = useStatusData();
</script>

<style scoped lang="scss">
.status-home-view {
  min-height: 100vh;

  &__main {
    display: grid;
    gap: var(--space-2xl);
    width: min(calc(100% - 2rem), var(--page-width));
    margin: 0 auto;
    padding: 3rem 0;
  }

  &__section {
    display: grid;
    gap: 1.5rem;
  }

  &__section-heading {
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    align-items: end;
  }

  &__section-heading h2,
  &__section-heading p,
  &__eyebrow {
    margin: 0;
  }

  &__section-heading h2 {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    letter-spacing: -0.03em;
  }

  &__section-heading > p {
    max-width: 30rem;
    color: var(--color-base-300);
    font-weight: 500;
  }

  &__eyebrow {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-brand-100);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__services,
  &__incidents {
    display: grid;
    gap: 1rem;
  }

  &__empty,
  &__empty-card {
    padding: 2rem;
    background: var(--color-surface-primary);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-lg);
  }

  &__empty-card {
    color: var(--color-base-300);
  }

  @media (width < 720px) {
    &__main {
      padding: 2rem 0;
    }

    &__section-heading {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
