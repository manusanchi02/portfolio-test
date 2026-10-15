<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ResponsiveImage from '../components/common/ResponsiveImage.vue'
import { getProjectBySlug } from '../composables/useContent.js'
import { blockRegistry } from '../registry/blocks.js'

const route = useRoute()
const project = computed(() => getProjectBySlug(route.params.slug))
</script>

<template>
  <article v-if="project">
    <ResponsiveImage class="project-banner" :image="project.banner" eager />
    <div class="container py-4">
      <h1 class="mb-4">{{ project.title }}</h1>
      <div class="d-flex flex-column gap-4">
        <template v-for="(block, index) in project.blocks" :key="index">
          <component
            :is="blockRegistry[block.type].component"
            v-if="blockRegistry[block.type]"
            v-bind="blockRegistry[block.type].getProps(block)"
          />
        </template>
      </div>
      <p class="mt-5 mb-0"><RouterLink to="/">Torna ai progetti</RouterLink></p>
    </div>
  </article>
  <div v-else class="container py-5">
    <h1>Progetto non trovato</h1>
    <p><RouterLink to="/">Torna ai progetti</RouterLink></p>
  </div>
</template>

<style scoped lang="scss">
.project-banner {
  display: block;
  width: 100%;
  aspect-ratio: var(--banner-aspect-ratio);
  object-fit: cover;
}
</style>
