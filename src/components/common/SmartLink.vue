<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: { type: String, required: true },
  external: { type: Boolean, default: false },
})

const HAS_PROTOCOL = /^[a-z][a-z0-9+.-]*:/i

const isHashOnly = computed(() => props.url.startsWith('#'))
const isRouterTarget = computed(() => !props.external && !HAS_PROTOCOL.test(props.url) && !isHashOnly.value)
const opensNewTab = computed(() => props.external && !isHashOnly.value)
</script>

<template>
  <RouterLink v-if="isRouterTarget" :to="url"><slot /></RouterLink>
  <a
    v-else
    :href="url"
    :target="opensNewTab ? '_blank' : null"
    :rel="opensNewTab ? 'noopener noreferrer' : null"
  >
    <slot />
  </a>
</template>
