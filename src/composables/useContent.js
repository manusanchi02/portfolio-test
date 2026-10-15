import site from '../content/site.json'
import home from '../content/home.json'
import projects from '../content/projects.json'
import instagram from '../content/instagram.json'
import about from '../content/about.json'

const DEFAULT_INSTAGRAM_POSTS_SHOWN = 3

export function getSite() {
  return site
}

export function getHomeSections() {
  return home.sections
}

export function getAbout() {
  return about
}

export function getVisibleProjects() {
  return projects.filter((project) => project.visible)
}

export function getProjectBySlug(slug) {
  return getVisibleProjects().find((project) => project.slug === slug)
}

export function getLatestInstagramPosts() {
  const limit = site.instagramPostsShown ?? DEFAULT_INSTAGRAM_POSTS_SHOWN
  return [...(instagram.posts ?? [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
}

export function getMenuItems() {
  const sectionItems = home.sections
    .filter((section) => section.showInMenu)
    .map((section) => ({ label: section.title, url: `/#${section.id}`, external: false }))
  return [...sectionItems, ...(site.extraMenuLinks ?? [])]
}
