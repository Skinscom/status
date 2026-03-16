<template>
  <header class="page-header">
    <div class="page-header__inner">
      <RouterLink class="page-header__brand" to="/">
        <img class="page-header__logo" src="/brand/logo.svg" alt="Skins.com" />
      </RouterLink>

      <nav class="page-header__nav" aria-label="Status navigation">
        <a :href="websiteUrl" class="page-header__link" target="_blank" rel="noreferrer">
          <ArrowLeft class="page-header__link-icon" :size="15" :stroke-width="2.2" />
          Back to Skins.com
        </a>
        <a
          :href="subscribeUrl"
          class="page-header__button"
          target="_blank"
          rel="noreferrer"
        >
          Subscribe to Updates
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

defineProps<{
  websiteUrl: string;
  subscribeUrl: string;
}>();
</script>

<style scoped lang="scss">
.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(18px);
  background: rgba(12, 16, 23, 0.72);
  border-bottom: 1px solid var(--color-border-soft);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    width: min(calc(100% - 2rem), var(--page-width));
    margin: 0 auto;
    padding: 1.125rem 0;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
  }

  &__logo {
    height: 1.75rem;
    width: auto;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__link {
    display: inline-flex;
    gap: 0.45rem;
    align-items: center;
    color: var(--color-base-200);
    font-size: 0.92rem;
    font-weight: 600;
    transition:
      color 0.15s ease,
      opacity 0.15s ease;

    &:hover,
    &.router-link-active {
      color: var(--color-base-0);
      opacity: 1;
    }
  }

  &__link-icon {
    flex: none;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.875rem;
    padding: 0 1rem;
    color: var(--color-base-900);
    background: var(--color-brand-100);
    border-radius: 14px;
    transition:
      transform 0.15s ease,
      background 0.15s ease;

    &:hover {
      background: var(--color-brand-50);
      transform: translateY(-1px);
    }
  }

  @media (width < 860px) {
    &__inner {
      flex-direction: column;
      align-items: stretch;
    }

    &__nav {
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &__button {
      flex: 1 1 100%;
    }
  }
}
</style>
