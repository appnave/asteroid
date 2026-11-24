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

/**
 * Compila um arquivo markdown (com front matter) para uma string de SFC Vue.
 */
const getVueComponent = function (source) {
  // Separa o front matter (YAML/TOML) do corpo markdown
  const { data, content } = parseFrontMatter(source)

  // Renderiza o markdown para HTML puro; é essa string HTML que vai para dentro do <template> do SFC
  let rendered = markdown.render(content)

  const imports = []
  let importIndex = 0

  /**
   * Troca cada `require('assets/foo.png')` do HTML por uma variável
   * placeholder (__asset_N) e registra o import ESM correspondente,
   * para o Vite resolver o asset no <script setup>.
   */
  rendered = rendered.replace(/require\(['"]([^'"]+)['"]\)/g, (_, assetPath) => {
    const varName = `__asset_${importIndex++}`

    imports.push(`import ${varName} from '${assetPath}'`)

    return varName
  })

  const importsBlock = imports.length ? imports.join('\n') + '\n' : ''

  // Monta o SFC - HTML final
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
