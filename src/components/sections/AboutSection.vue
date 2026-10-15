<script setup>
import ResponsiveImage from '../common/ResponsiveImage.vue'
import SmartLink from '../common/SmartLink.vue'

defineProps({
  section: { type: Object, required: true },
  about: { type: Object, required: true },
})
</script>

<template>
  <section :id="section.id" class="py-4" :aria-labelledby="`${section.id}-title`">
    <div class="container">
      <h2 :id="`${section.id}-title`" class="h4 mb-3">{{ section.title }}</h2>
      <div class="row g-4">
        <div class="col-12 col-md-4">
          <ResponsiveImage class="img-fluid" :image="about.photo" />
        </div>
        <div class="col-12 col-md-8">
          <p v-html="about.text"></p>
          <ul class="list-unstyled mb-0">
            <li v-for="link in about.links" :key="link.label">
              <SmartLink :url="link.url" :external="link.external">{{ link.label }}</SmartLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
