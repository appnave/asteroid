import { getVueComponent } from './markdown.js'

/**
 * Vite plugin that transforms .md files into Vue SFC components.
 * Replaces the webpack pipeline: ware-loader (markdown→Vue SFC) + vue-loader.
 */
export const markdownPlugin = {
  name: 'vite-plugin-asteroid-markdown',
  enforce: 'pre',

  transform (source, id) {
    if (!id.endsWith('.md')) return null

    const vueSfc = getVueComponent(source)

    return {
      code: vueSfc,
      map: null
    }
  }
}
