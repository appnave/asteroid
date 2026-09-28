const fs = require('fs')
const { camelCase, kebabCase, upperFirst } = require('lodash')
const path = require('path')

const uiPackage = '@appnave/quasar-ui-asteroid'
const apiCache = {}

function getApi (name) {
  if (!apiCache[name]) {
    const { found } = getVersion()

    if (found) {
      const api = require(`${uiPackage}/dist/api/${name}.json`)

      for (const mixin of api.mixins || []) {
        try {
          const { props } = require(
            mixin.startsWith('quasar')
              ? '@appnave/quasar-ui-asteroid/node_modules/' + mixin
              : mixin
          )
          Object.assign(api.props, props)
        } catch {}
      }

      apiCache[name] = api
    } else {
      throw new Error(`${uiPackage} is not installed`)
    }
  }

  return apiCache[name]
}

function getComponentList (modifier = string => string) {
  const api = path.resolve('node_modules/@appnave/quasar-ui-asteroid/dist/api')
  return fs.readdirSync(api).map(file => modifier(path.parse(file).name))
}

function getVersion () {
  const data = {
    found: false,
    version: '3.0.0'
  }

  try {
    const { version } = require(`${uiPackage}/package.json`)

    data.found = true
    data.version = version
  } catch (error) {}

  return data
}

function toComponent (name) {
  return upperFirst(camelCase(name))
}

function toTag (name) {
  return kebabCase(name)
}

module.exports = {
  getApi,
  getComponentList,
  getVersion,
  toComponent,
  toTag
}
