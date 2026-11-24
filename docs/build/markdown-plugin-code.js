import { escapeHtml, unescapeAll } from 'markdown-it/lib/common/utils.mjs'

export default function (markdown) {
  markdown.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    const info = token.info ? unescapeAll(token.info).trim() : ''
    const content = escapeHtml(token.content)

    if (info) {
      const language = info.split(/(\s+)/g)[0]
      return `<doc-code code="${content}" language="${language}" />`
    }

    return `<doc-code code="${content}" />`
  }

  markdown.renderer.rules.code_inline = (tokens, idx) => {
    const token = tokens[idx]
    return `<doc-token token="${escapeHtml(token.content)}" />`
  }
}
