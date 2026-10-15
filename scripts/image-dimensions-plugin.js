import { join } from 'node:path'
import { collectImageDimensions } from './lib/image-dimensions.js'

const VIRTUAL_ID = 'virtual:image-dimensions'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

export default function imageDimensionsPlugin() {
  let publicDir

  return {
    name: 'image-dimensions',
    configResolved(config) {
      publicDir = config.publicDir
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      const dimensions = collectImageDimensions(publicDir)
      const usable = Object.fromEntries(Object.entries(dimensions).filter(([, size]) => size))
      return `export default ${JSON.stringify(usable)}`
    },
    configureServer(server) {
      const uploadsDir = join(publicDir, 'uploads')
      server.watcher.add(uploadsDir)
      const reload = (file) => {
        if (!file.startsWith(uploadsDir)) return
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', reload).on('change', reload).on('unlink', reload)
    },
  }
}
