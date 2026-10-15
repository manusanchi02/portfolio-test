import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, scrollBehavior } from './router.js'
import { buildHead } from './head.js'
import './styles/main.scss'

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior, base: import.meta.env.BASE_URL },
  ({ router, head }) => {
    let activeEntry = null
    router.afterEach((to) => {
      activeEntry?.dispose()
      activeEntry = head.push(buildHead(to))
    })
  },
)
