<script setup>
import ProjectCard from '../common/ProjectCard.vue'

defineProps({
  section: { type: Object, required: true },
  projects: { type: Array, required: true },
})

const EAGER_IMAGES_COUNT = 3
</script>

<template>
  <section :id="section.id" class="py-4" :aria-labelledby="`${section.id}-title`">
    <div class="container">
      <h2 :id="`${section.id}-title`" class="visually-hidden">{{ section.title }}</h2>
      <ul class="row row-cols-2 row-cols-md-3 g-2 g-md-3 list-unstyled mb-0">
        <li v-for="(project, index) in projects" :key="project.slug" class="col">
          <ProjectCard :project="project" :eager="index < EAGER_IMAGES_COUNT" />
        </li>
      </ul>
    </div>
  </section>
</template>
