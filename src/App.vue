<script setup>
import NavBar from './components/layout/NavBar.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import { getMenuItems, getSite } from './composables/useContent.js'

const site = getSite()
const menuItems = getMenuItems()
const socialLinks = site.social ?? []
</script>

<template>
  <a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
  <NavBar :site-name="site.name" :menu-items="menuItems" :social-links="socialLinks" />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter :site-name="site.name" :social-links="socialLinks" />
</template>
