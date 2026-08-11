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
 * Compila um arquivo markdown (com front matter em YAML/TOML) para uma
 * string de componente Vue de arquivo único (SFC).
 *
 * Chamadas `require('assets/...')` deixadas no HTML renderizado do markdown
 * (ex.: inseridas por uma regra de imagem/asset do markdown-it) são
 * reescritas como imports ESM, já que o Vite não suporta `require()` em
 * runtime:
 *   - cada ocorrência é substituída em `rendered` por uma variável
 *     placeholder gerada (`__asset_0`, `__asset_1`, ...);
 *   - um `import __asset_N from '<assetPath>'` correspondente é acumulado
 *     em `imports`, para ser injetado depois no bloco `<script setup>` do
 *     SFC, permitindo que o Vite resolva e empacote o asset, com o
 *     placeholder atuando como a variável usada no template.
 *
 * @param {string} source - Conteúdo bruto do arquivo markdown, incluindo o front matter.
 * @returns {string} Um SFC Vue (`<template>` + `<script setup>`) como string.
 */
const getVueComponent = function (source) {
  const { data, content } = parseFrontMatter(source)

  let rendered = markdown.render(content)

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
