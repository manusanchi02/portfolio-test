<script setup>
import { ref } from 'vue'
import SmartLink from '../common/SmartLink.vue'
import { useOffcanvas } from '../../composables/useOffcanvas.js'

defineProps({
  siteName: { type: String, required: true },
  menuItems: { type: Array, required: true },
  socialLinks: { type: Array, required: true },
})

const panel = ref(null)
const toggler = ref(null)
const { isOpen, close, toggle } = useOffcanvas({ panel, toggler })

const closeOnLinkClick = (event) => {
  if (event.target.closest('a')) close()
}
</script>

<template>
  <header class="border-bottom">
    <nav class="navbar navbar-expand-md" aria-label="Principale">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">{{ siteName }}</RouterLink>
        <button
          ref="toggler"
          class="navbar-toggler"
          type="button"
          aria-controls="main-menu"
          :aria-expanded="isOpen"
          aria-label="Apri il menu"
          @click="toggle"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          id="main-menu"
          ref="panel"
          class="offcanvas offcanvas-end"
          :class="{ show: isOpen }"
          tabindex="-1"
          aria-labelledby="main-menu-title"
          :role="isOpen ? 'dialog' : null"
          :aria-modal="isOpen ? 'true' : null"
        >
          <div class="offcanvas-header">
            <span id="main-menu-title" class="offcanvas-title h5">{{ siteName }}</span>
            <button type="button" class="btn-close" aria-label="Chiudi il menu" @click="close"></button>
          </div>
          <div class="offcanvas-body" @click="closeOnLinkClick">
            <ul class="navbar-nav flex-grow-1">
              <li v-for="item in menuItems" :key="item.url" class="nav-item">
                <SmartLink class="nav-link" :url="item.url" :external="item.external">{{ item.label }}</SmartLink>
              </li>
            </ul>
            <ul class="navbar-nav">
              <li v-for="link in socialLinks" :key="link.label" class="nav-item">
                <SmartLink class="nav-link" :url="link.url" :external="link.external">{{ link.label }}</SmartLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <div v-if="isOpen" class="offcanvas-backdrop fade show" @click="close"></div>
</template>
