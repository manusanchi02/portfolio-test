import { getProjectBySlug, getSite } from './composables/useContent.js'
import { toSiteRelativePath } from './utils/image-path.js'

const CONTENT_LANGUAGE = 'it'
const siteUrl = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')

function absoluteImageUrl(src) {
  return siteUrl ? `${siteUrl}/${toSiteRelativePath(src)}` : null
}

export function buildHead(route) {
  const site = getSite()
  const project = route.name === 'project' ? getProjectBySlug(route.params.slug) : null

  const title = project ? `${project.title} | ${site.name}` : site.name
  const description = project?.summary || site.description
  const image = project ? absoluteImageUrl(project.banner.src) : null

  const meta = [
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ]
  if (image) meta.push({ property: 'og:image', content: image })

  return { htmlAttrs: { lang: CONTENT_LANGUAGE }, title, meta }
}
