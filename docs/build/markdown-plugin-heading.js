export default function (markdown) {
  const tag = 'doc-heading'
  // const contentReduce = (acc, token) => acc + token.content

  markdown.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    // const content = tokens[idx + 1].children.reduce(contentReduce, '')

    token.attrSet(':level', token.tag.replace('h', ''))
    token.tag = tag

    return self.renderToken(tokens, idx, options)
  }

  markdown.renderer.rules.heading_close = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.tag = tag

    return self.renderToken(tokens, idx, options)
  }
}
