<template>
  <main class="status-home-skeleton">
    <section class="status-home-skeleton__hero">
      <div class="status-home-skeleton__hero-copy">
        <span class="status-home-skeleton__eyebrow status-home-skeleton__block" />
        <span class="status-home-skeleton__title status-home-skeleton__block" />
        <span class="status-home-skeleton__title status-home-skeleton__title--short status-home-skeleton__block" />
        <span class="status-home-skeleton__line status-home-skeleton__block" />
        <span class="status-home-skeleton__line status-home-skeleton__line--short status-home-skeleton__block" />
        <div class="status-home-skeleton__status-row">
          <span class="status-home-skeleton__badge status-home-skeleton__block" />
          <span class="status-home-skeleton__timestamp status-home-skeleton__block" />
        </div>
      </div>

      <div class="status-home-skeleton__metrics-shell">
        <span class="status-home-skeleton__shell-title status-home-skeleton__block" />
        <span class="status-home-skeleton__shell-copy status-home-skeleton__block" />
        <div class="status-home-skeleton__metric status-home-skeleton__metric--wide">
          <span class="status-home-skeleton__metric-label status-home-skeleton__block" />
          <span class="status-home-skeleton__metric-value status-home-skeleton__block" />
          <span class="status-home-skeleton__metric-bar status-home-skeleton__block" />
        </div>
        <div class="status-home-skeleton__metric-grid">
          <div class="status-home-skeleton__metric">
            <span class="status-home-skeleton__metric-label status-home-skeleton__block" />
            <span class="status-home-skeleton__metric-value status-home-skeleton__block" />
          </div>
          <div class="status-home-skeleton__metric">
            <span class="status-home-skeleton__metric-label status-home-skeleton__block" />
            <span class="status-home-skeleton__metric-value status-home-skeleton__block" />
          </div>
        </div>
      </div>
    </section>

    <section class="status-home-skeleton__section">
      <div class="status-home-skeleton__section-heading">
        <div class="status-home-skeleton__section-copy">
          <span class="status-home-skeleton__eyebrow status-home-skeleton__block" />
          <span class="status-home-skeleton__section-title status-home-skeleton__block" />
        </div>
        <span class="status-home-skeleton__section-note status-home-skeleton__block" />
      </div>

      <article
        v-for="card in [1, 2, 3]"
        :key="`service-${card}`"
        class="status-home-skeleton__service-card"
      >
        <div class="status-home-skeleton__service-header">
          <div class="status-home-skeleton__service-copy">
            <span class="status-home-skeleton__service-title status-home-skeleton__block" />
            <span class="status-home-skeleton__service-line status-home-skeleton__block" />
            <span
              class="status-home-skeleton__service-line status-home-skeleton__service-line--short status-home-skeleton__block"
            />
          </div>
          <span class="status-home-skeleton__service-badge status-home-skeleton__block" />
        </div>
        <span class="status-home-skeleton__service-meta status-home-skeleton__block" />
        <div class="status-home-skeleton__bars">
          <span
            v-for="bar in 36"
            :key="bar"
            class="status-home-skeleton__bar status-home-skeleton__block"
          />
        </div>
        <div class="status-home-skeleton__service-footer">
          <span class="status-home-skeleton__footer-line status-home-skeleton__block" />
          <span class="status-home-skeleton__footer-line status-home-skeleton__footer-line--short status-home-skeleton__block" />
        </div>
      </article>
    </section>

    <section class="status-home-skeleton__section">
      <div class="status-home-skeleton__section-heading">
        <div class="status-home-skeleton__section-copy">
          <span class="status-home-skeleton__eyebrow status-home-skeleton__block" />
          <span class="status-home-skeleton__section-title status-home-skeleton__block" />
        </div>
        <span class="status-home-skeleton__section-note status-home-skeleton__section-note--wide status-home-skeleton__block" />
      </div>

      <div class="status-home-skeleton__incident-grid">
        <article
          v-for="card in [1, 2]"
          :key="`incident-${card}`"
          class="status-home-skeleton__incident-card"
        >
          <div class="status-home-skeleton__service-header">
            <div class="status-home-skeleton__service-copy">
              <span class="status-home-skeleton__incident-eyebrow status-home-skeleton__block" />
              <span class="status-home-skeleton__service-title status-home-skeleton__block" />
            </div>
            <span class="status-home-skeleton__service-badge status-home-skeleton__block" />
          </div>
          <span class="status-home-skeleton__service-line status-home-skeleton__block" />
          <span class="status-home-skeleton__service-line status-home-skeleton__service-line--short status-home-skeleton__block" />
          <span class="status-home-skeleton__section-note status-home-skeleton__block" />
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.status-home-skeleton {
  display: grid;
  gap: var(--space-2xl);
  width: min(calc(100% - 2rem), var(--page-width));
  margin: 0 auto;
  padding: 3rem 0;

  &__block {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
  }

  &__block::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 45%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    content: "";
  }

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
    gap: var(--space-xl);
    padding: 2rem;
    background:
      linear-gradient(135deg, rgba(75, 243, 100, 0.12), transparent 42%),
      linear-gradient(180deg, rgba(30, 39, 57, 0.96), rgba(12, 16, 23, 0.96));
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-xl);
    box-shadow: 0 30px 80px -40px var(--color-shadow);
  }

  &__hero-copy,
  &__section,
  &__metrics-shell,
  &__metric,
  &__service-card,
  &__incident-card,
  &__section-copy,
  &__service-copy {
    display: grid;
  }

  &__hero-copy {
    gap: 0.9rem;
  }

  &__eyebrow {
    width: 9rem;
    height: 0.85rem;
  }

  &__title {
    width: 26rem;
    max-width: 100%;
    height: 3.8rem;
    border-radius: 1rem;
  }

  &__title--short {
    width: 18rem;
  }

  &__line {
    width: 24rem;
    max-width: 100%;
    height: 1rem;
  }

  &__line--short {
    width: 17rem;
  }

  &__status-row {
    display: flex;
    gap: 0.9rem;
    align-items: center;
    margin-top: 0.4rem;
  }

  &__badge {
    width: 8.5rem;
    height: 2rem;
  }

  &__timestamp {
    width: 7rem;
    height: 1rem;
  }

  &__metrics-shell {
    gap: 0.9rem;
    padding: 1.35rem;
    background:
      radial-gradient(circle at top right, rgba(75, 243, 100, 0.12), transparent 32%),
      linear-gradient(180deg, rgba(30, 39, 57, 0.92), rgba(17, 23, 34, 0.96));
    border: 1px solid var(--color-border-soft);
    border-radius: calc(var(--radius-xl) - 4px);
  }

  &__shell-title {
    width: 8rem;
    height: 0.8rem;
  }

  &__shell-copy {
    width: 17rem;
    max-width: 100%;
    height: 1rem;
  }

  &__metric-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
  }

  &__metric {
    gap: 0.8rem;
    min-height: 8rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(207, 212, 222, 0.08);
    border-radius: 16px;
  }

  &__metric--wide {
    min-height: auto;
  }

  &__metric-label {
    width: 7rem;
    height: 0.8rem;
  }

  &__metric-value {
    width: 6rem;
    height: 2.25rem;
    border-radius: 0.85rem;
  }

  &__metric-bar {
    width: 100%;
    height: 0.45rem;
  }

  &__section {
    gap: 1.5rem;
  }

  &__section-heading,
  &__service-header,
  &__service-footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  &__section-heading {
    align-items: end;
  }

  &__section-copy,
  &__service-copy {
    gap: 0.45rem;
  }

  &__section-title {
    width: 18rem;
    max-width: 100%;
    height: 2.2rem;
    border-radius: 0.9rem;
  }

  &__section-note {
    width: 14rem;
    height: 1rem;
  }

  &__section-note--wide {
    width: 20rem;
    max-width: 100%;
  }

  &__service-card,
  &__incident-card {
    gap: 1.15rem;
    padding: 1.5rem;
    background: var(--color-surface-primary);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-lg);
  }

  &__incident-grid {
    display: grid;
    gap: 1rem;
  }

  &__service-title {
    width: 10rem;
    height: 1.6rem;
    border-radius: 0.7rem;
  }

  &__incident-eyebrow {
    width: 7rem;
    height: 0.75rem;
  }

  &__service-line {
    width: 25rem;
    max-width: 100%;
    height: 0.95rem;
  }

  &__service-line--short {
    width: 18rem;
  }

  &__service-badge {
    width: 7rem;
    height: 1.55rem;
  }

  &__service-meta {
    width: 10rem;
    height: 0.8rem;
  }

  &__bars {
    display: grid;
    grid-template-columns: repeat(36, minmax(0, 1fr));
    gap: 0.2rem;
  }

  &__bar {
    aspect-ratio: 1 / 3.6;
    min-height: 1.75rem;
    border-radius: 999px;
  }

  &__footer-line {
    width: 8rem;
    height: 0.9rem;
  }

  &__footer-line--short {
    width: 10rem;
  }

  @media (width < 900px) {
    &__hero {
      grid-template-columns: 1fr;
    }
  }

  @media (width < 720px) {
    padding: 2rem 0;

    &__hero {
      padding: 1.4rem;
    }

    &__section-heading,
    &__service-header,
    &__service-footer {
      flex-direction: column;
      align-items: flex-start;
    }

    &__metric-grid {
      grid-template-columns: 1fr;
    }
  }
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
