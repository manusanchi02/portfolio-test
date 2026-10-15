<script setup>
import SmartLink from '../common/SmartLink.vue'

defineProps({
  siteName: { type: String, required: true },
  socialLinks: { type: Array, required: true },
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-top py-4 mt-5">
    <div class="container d-flex flex-column flex-md-row justify-content-between gap-2">
      <ul class="list-inline mb-0">
        <li v-for="link in socialLinks" :key="link.label" class="list-inline-item">
          <SmartLink :url="link.url" :external="link.external">{{ link.label }}</SmartLink>
        </li>
      </ul>
      <p class="mb-0">&copy; {{ year }} {{ siteName }}</p>
    </div>
  </footer>
</template>
