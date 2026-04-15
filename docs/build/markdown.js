import MarkdownIt from 'markdown-it'

import markdownPluginCode from './markdown-plugin-code.js'
import markdownPluginContainer from './markdown-plugin-container.js'
import markdownPluginHeading from './markdown-plugin-heading.js'
import markdownPluginTable from './markdown-plugin-table.js'

const markdownOptions = {
  html: true,
  typographer: true
}

const markdown = new MarkdownIt(markdownOptions)
  .use(markdownPluginCode)
  .use(markdownPluginContainer)
  .use(markdownPluginHeading)
  .use(markdownPluginTable)

import matter from 'gray-matter'
import toml from 'toml'

const getVueComponent = function (source) {
  const { data, content } = parseFrontMatter(source)

  let rendered = markdown.render(content)

  // Convert require('assets/...') to ESM imports for Vite compatibility.
  // In webpack, require() worked inline in Vue templates.
  // In Vite, we extract them as imports and reference variables in the template.
  const imports = []
  let importIndex = 0

  rendered = rendered.replace(/require\(['"]([^'"]+)['"]\)/g, (match, assetPath) => {
    const varName = `__asset_${importIndex++}`
    imports.push(`import ${varName} from '${assetPath}'`)
    return varName
  })

  const importsBlock = imports.length ? imports.join('\n') + '\n' : ''

  return `
    <template>
      <doc-page v-bind="attrs">${rendered}</doc-page>
    </template>

    <script setup>
      ${importsBlock}import { computed } from 'vue'
      const attrs = computed(() => (${JSON.stringify(data)}))
    </script>
  `
}

const parseFrontMatter = function (content) {
  return matter(content, {
    engines: {
      excerpt: false,
      toml: toml.parse.bind(toml)
    },

    excerpt_separator: '<!-- more -->'
  })
}

export { getVueComponent, parseFrontMatter }
