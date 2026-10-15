<script setup>
import ResponsiveImage from '../common/ResponsiveImage.vue'

defineProps({
  images: { type: Array, required: true },
})
</script>

<template>
  <ul class="row row-cols-1 row-cols-md-2 g-3 list-unstyled mb-0">
    <li v-for="image in images" :key="image.src" class="col">
      <ResponsiveImage class="img-fluid" :image="image" />
    </li>
  </ul>
</template>
