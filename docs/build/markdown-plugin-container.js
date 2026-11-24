import container from 'markdown-it-container'

function createContainer (className, defaultTitle) {
  return [container, className, {
    render (tokens, idx) {
      const token = tokens[idx]
      const title = token.info.trim().slice(className.length).trim()

      if (token.nesting === 1) {
        return `<doc-note title="${title || defaultTitle}" type="${className}">\n`
      }

      return '</doc-note>\n'
    }
  }]
}

export default function (markdown) {
  markdown
    .use(...createContainer('danger', 'Cuidado'))
    .use(...createContainer('info', 'Informação'))
    .use(...createContainer('tip', 'Dica'))
    .use(...createContainer('warning', 'Atenção'))
}
