import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { collectImageDimensions } from './lib/image-dimensions.js'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentFiles = ['site', 'home', 'projects', 'instagram', 'about']
const TODO_URL = '#TODO-url'

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

const ajv = new Ajv({ allErrors: true, verbose: true })
addFormats(ajv)
ajv.addSchema(readJson(join(rootDir, 'schemas', 'common.schema.json')))

const errors = []
const todoUrls = []

const formatPath = (instancePath) =>
  instancePath
    .split('/')
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? `[${part}]` : `.${part}`))
    .join('')
    .replace(/^\./, '') || '(root)'

function describeError(error) {
  const location = formatPath(error.instancePath)
  switch (error.keyword) {
    case 'required':
      return `${location}: missing required field "${error.params.missingProperty}"`
    case 'additionalProperties':
      return `${location}: unknown field "${error.params.additionalProperty}"`
    case 'enum':
      return `${location}: must be one of ${error.params.allowedValues.join(', ')} (got "${error.data}")`
    case 'pattern':
      return `${location}: value "${error.data}" does not match the expected format (${error.params.pattern})`
    default:
      return `${location}: ${error.message}`
  }
}

function validateAgainstSchema(name, data) {
  const validate = ajv.compile(readJson(join(rootDir, 'schemas', `${name}.schema.json`)))
  if (validate(data)) return true
  for (const error of validate.errors.filter((e) => e.keyword !== 'if')) {
    errors.push(`src/content/${name}.json: ${describeError(error)}`)
  }
  return false
}

function collectImages(name, data) {
  const images = []
  const visit = (value, path) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}[${index}]`))
    } else if (value && typeof value === 'object') {
      if (typeof value.src === 'string' && 'alt' in value) images.push({ path, src: value.src })
      for (const [key, child] of Object.entries(value)) visit(child, path ? `${path}.${key}` : key)
    }
  }
  visit(data, '')
  return images.map((image) => ({ ...image, file: `src/content/${name}.json` }))
}

function collectTodoUrls(name, data) {
  const visit = (value, path) => {
    if (typeof value === 'string' && value.includes(TODO_URL)) todoUrls.push(`src/content/${name}.json: ${path}`)
    else if (Array.isArray(value)) value.forEach((item, index) => visit(item, `${path}[${index}]`))
    else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) visit(child, path ? `${path}.${key}` : key)
    }
  }
  visit(data, '')
}

function checkUnique(file, values, label, pathOf) {
  const seen = new Map()
  values.forEach((value, index) => {
    if (seen.has(value)) {
      errors.push(`${file}: ${pathOf(index)}: duplicate ${label} "${value}" (also at ${pathOf(seen.get(value))})`)
    } else {
      seen.set(value, index)
    }
  })
}

const dimensions = collectImageDimensions(join(rootDir, 'public'))
const toSiteRelativePath = (src) => src.replace(/^\/+/, '')
const allImages = []

for (const name of contentFiles) {
  const file = `src/content/${name}.json`
  let data
  try {
    data = readJson(join(rootDir, file))
  } catch (error) {
    errors.push(`${file}: cannot read or parse the file (${error.message})`)
    continue
  }
  if (!validateAgainstSchema(name, data)) continue

  collectTodoUrls(name, data)
  allImages.push(...collectImages(name, data))

  if (name === 'projects') {
    checkUnique(file, data.map((p) => p.slug), 'slug', (i) => `[${i}].slug`)
  }
  if (name === 'home') {
    checkUnique(file, data.sections.map((s) => s.id), 'section id', (i) => `sections[${i}].id`)
  }
}

for (const image of allImages) {
  const sitePath = toSiteRelativePath(image.src)
  if (!(sitePath in dimensions)) {
    errors.push(`${image.file}: ${image.path}.src: file public/${sitePath} does not exist`)
  } else if (!dimensions[sitePath]) {
    errors.push(`${image.file}: ${image.path}.src: public/${sitePath} is not a readable WebP image`)
  }
}

if (todoUrls.length > 0) {
  console.warn(`Missing URLs (${TODO_URL}):`)
  todoUrls.forEach((entry) => console.warn(`  - ${entry}`))
}

if (errors.length > 0) {
  console.error('\nContent validation failed:')
  errors.forEach((message) => console.error(`  - ${message}`))
  process.exit(1)
}

console.log('Content is valid.')
