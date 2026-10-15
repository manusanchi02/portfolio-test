import ProjectGrid from '../components/sections/ProjectGrid.vue'
import InstagramFeed from '../components/sections/InstagramFeed.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import { getAbout, getLatestInstagramPosts, getVisibleProjects } from '../composables/useContent.js'

export const sectionRegistry = {
  'project-grid': {
    component: ProjectGrid,
    getProps: (section) => ({ section, projects: getVisibleProjects() }),
  },
  'instagram-feed': {
    component: InstagramFeed,
    getProps: (section) => ({ section, posts: getLatestInstagramPosts() }),
  },
  about: {
    component: AboutSection,
    getProps: (section) => ({ section, about: getAbout() }),
  },
}
