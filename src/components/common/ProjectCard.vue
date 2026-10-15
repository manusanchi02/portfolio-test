<script setup>
import ResponsiveImage from './ResponsiveImage.vue'

defineProps({
  project: { type: Object, required: true },
  eager: { type: Boolean, default: false },
})
</script>

<template>
  <RouterLink class="project-card" :to="`/projects/${project.slug}`">
    <div class="project-card__media">
      <ResponsiveImage class="project-card__image" :image="project.banner" :eager="eager" />
    </div>
    <span class="project-card__title">{{ project.title }}</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.project-card {
  position: relative;
  display: block;
  color: inherit;
  text-decoration: none;
}

.project-card__media {
  aspect-ratio: var(--banner-aspect-ratio);
  overflow: hidden;
}

.project-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (hover: hover) {
  .project-card__title {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    text-align: center;
    color: var(--banner-overlay-fg);
    background-color: var(--banner-overlay-bg);
    opacity: 0;
  }

  .project-card:hover .project-card__title,
  .project-card:focus-visible .project-card__title {
    opacity: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    .project-card__title {
      transition: opacity 0.2s ease-in-out;
    }
  }
}

@media (hover: none) {
  .project-card__title {
    display: block;
    padding-top: 0.5rem;
  }
}
</style>
