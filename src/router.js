import HomeView from './views/HomeView.vue'
import ProjectView from './views/ProjectView.vue'

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/projects/:slug', name: 'project', component: ProjectView },
]

export function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash }
  return { top: 0 }
}
