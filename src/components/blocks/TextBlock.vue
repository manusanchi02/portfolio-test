<script setup>
defineProps({
  text: { type: String, required: true },
})
</script>

<template>
  <div class="row">
    <p class="col-lg-8" v-html="text"></p>
  </div>
</template>
