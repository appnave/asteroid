const globalAllowedProps = require('../utils/global-allowed-props.js')

const {
  getApi,
  getComponentList,
  toTag,
  toComponent
} = require('../utils/helpers.js')

module.exports = {
  meta: {
    docs: {
      category: 'Propriedades',
      description: 'Desabilita o uso de propriedades inválidas.',
      recommended: true,
      url: ''
    },
    fixable: null,
    messages: {
      disallowedProperty: '\'{{ property }}\' não é uma propriedade válida de \'{{ component }}.\''
    },
    type: 'problem'
  },

  create: function (context) {
    const components = getComponentList(toTag)

    // Public
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const { rawName } = element

        if (!components.includes(rawName)) {
          return
        }

        const componentName = toComponent(rawName)
        const api = getApi(componentName)

        const reports = []
        const allowedProps = [
          ...globalAllowedProps,
          ...Object.keys(api.props || {})
        ]

        function report (node, property) {
          reports.push(
            context.report({
              data: { component: componentName, property },
              messageId: 'disallowedProperty',
              node
            })
          )
        }

        for (const attribute of element.startTag.attributes) {
          const { key } = attribute

          if (attribute.directive) {
            if (
              key.name.name === 'bind' &&
              key.argument !== null &&
              !allowedProps.includes(key.argument.name)
            ) {
              report(key, key.argument.name)
            }
          } else if (!allowedProps.includes(key.name)) {
            report(key, key.name)
          }
        }

        if (reports.length) {
          return reports
        }
      }
    })
  }
}
