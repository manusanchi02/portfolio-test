import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import imageDimensions from './scripts/image-dimensions-plugin.js'

function normalizeBase(value) {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function readVisibleProjectSlugs() {
  const projects = JSON.parse(readFileSync(new URL('./src/content/projects.json', import.meta.url), 'utf8'))
  return projects.filter((project) => project.visible).map((project) => project.slug)
}

export default defineConfig({
  base: normalizeBase(process.env.VITE_BASE || '/'),
  plugins: [vue(), imageDimensions()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    includedRoutes: (paths) => [
      ...paths.filter((path) => !path.includes(':')),
      ...readVisibleProjectSlugs().map((slug) => `/projects/${slug}`),
    ],
  },
})
