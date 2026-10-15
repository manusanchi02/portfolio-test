<script setup>
import { getHomeSections, getSite } from '../composables/useContent.js'
import { sectionRegistry } from '../registry/sections.js'

const site = getSite()
const sections = getHomeSections()
</script>

<template>
  <h1 class="visually-hidden">{{ site.name }}</h1>
  <template v-for="section in sections" :key="section.id">
    <component
      :is="sectionRegistry[section.type].component"
      v-if="sectionRegistry[section.type]"
      v-bind="sectionRegistry[section.type].getProps(section)"
    />
  </template>
</template>
