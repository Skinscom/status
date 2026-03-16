<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div>
        <p class="site-footer__title">{{ name }}</p>
        <p class="site-footer__copy">{{ description }}</p>
      </div>

      <div class="site-footer__links">
        <a :href="websiteUrl" target="_blank" rel="noreferrer">Skins.com</a>
        <a :href="subscribeUrl" target="_blank" rel="noreferrer">Subscribe</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
  websiteUrl: string;
  subscribeUrl: string;
}>();
</script>

<style scoped lang="scss">
.site-footer {
  padding: 0 0 3rem;

  &__inner {
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    width: min(calc(100% - 2rem), var(--page-width));
    margin: 0 auto;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border-soft);
  }

  &__title,
  &__copy {
    margin: 0;
  }

  &__title {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--color-base-300);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__copy {
    margin-top: 0.5rem;
    color: var(--color-base-200);
    font-weight: 500;
  }

  &__links {
    display: flex;
    gap: 1rem;
    color: var(--color-base-300);
  }

  @media (width < 720px) {
    &__inner {
      flex-direction: column;
    }
  }
}
</style>
