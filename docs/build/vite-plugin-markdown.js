import { getVueComponent } from './markdown.js'

/**
 * Vite plugin that transforms .md files into Vue SFC components.
 * Replaces the previous markdown pipeline based on loader chaining.
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
