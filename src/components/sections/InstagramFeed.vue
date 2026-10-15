<script setup>
import ResponsiveImage from '../common/ResponsiveImage.vue'
import SmartLink from '../common/SmartLink.vue'

defineProps({
  section: { type: Object, required: true },
  posts: { type: Array, required: true },
})
</script>

<template>
  <section :id="section.id" class="py-4" :aria-labelledby="`${section.id}-title`">
    <div class="container">
      <h2 :id="`${section.id}-title`" class="h4 mb-3">{{ section.title }}</h2>
      <ul class="row row-cols-2 row-cols-md-4 g-2 g-md-3 list-unstyled mb-0">
        <li v-for="post in posts" :key="post.url + post.date" class="col">
          <SmartLink :url="post.url" :external="true">
            <div class="ratio ratio-1x1">
              <ResponsiveImage class="object-fit-cover" :image="post.image" />
            </div>
          </SmartLink>
          <p class="small mt-2 mb-0">{{ post.caption }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
