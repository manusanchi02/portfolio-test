<script setup>
import ResponsiveImage from '../common/ResponsiveImage.vue'

defineProps({
  image: { type: Object, required: true },
})
</script>

<template>
  <figure class="mb-0">
    <ResponsiveImage class="img-fluid" :image="image" />
  </figure>
</template>
