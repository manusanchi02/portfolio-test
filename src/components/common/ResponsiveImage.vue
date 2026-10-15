<script setup>
import { computed } from 'vue'
import imageDimensions from 'virtual:image-dimensions'
import { toSiteRelativePath } from '../../utils/image-path.js'

const props = defineProps({
  image: { type: Object, required: true },
  eager: { type: Boolean, default: false },
})

const sitePath = computed(() => toSiteRelativePath(props.image.src))
const url = computed(() => `${import.meta.env.BASE_URL}${sitePath.value}`)
const knownSize = computed(() => imageDimensions[sitePath.value] ?? {})
const width = computed(() => props.image.width ?? knownSize.value.width)
const height = computed(() => props.image.height ?? knownSize.value.height)
</script>

<template>
  <img
    :src="url"
    :alt="image.alt"
    :width="width"
    :height="height"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : null"
    decoding="async"
  />
</template>
