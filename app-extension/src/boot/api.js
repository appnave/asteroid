import { camelizeKeys, decamelizeKeys } from 'humps'

import asteroidConfig from 'asteroid-config'

function getBaseURL (isProduction) {
  // Permite sobrescrever a URL base da API via query string, útil para ambiente de preview.
  const previewURL = new URLSearchParams(window.location.search).get('$base')

  // TODO: Validar variavel de ambiente se é produção.
  if (previewURL && !isProduction) {
    try {
      const { hostname, protocol } = new URL(previewURL)

      // Somente permite URLs seguras (https) e do domínio nave.dev.br para evitar possíveis ataques de SSRF.
      if (protocol === 'https:' && hostname.endsWith('.nave.dev.br')) return previewURL
    } catch {}
  }

  // Caso não haja uma URL de preview válida, utiliza a URL base definida nas variáveis de ambiente ou locahost.
  return process.env.SERVER_BASE_URL || '/'
}

export default async ({ app, router }) => {
  const api = app.config.globalProperties.$axios
  const isProduction = process.env.ENVIRONMENT === 'production'

  // Defaults
  api.defaults.baseURL = getBaseURL(isProduction)

  if (!isProduction) {
    /**
     * Permite que parâmetros de query string iniciados com $ sejam propagados para todas as rotas,
     * útil para ambiente de preview.
     */
    router.beforeEach((to, from, next) => {
      // Extrai os parâmetros de query string iniciados com $ da rota de origem (from).
      const dollarParams = Object.fromEntries(Object.entries(from.query).filter(([key]) => key.startsWith('$')))

      /**
       * Valida se há algum parâmetro de query string iniciado com $ que esteja presente
       * na rota de origem (from) mas ausente na rota de destino (to).
       */
      const hasMissingDollarParams = Object.keys(dollarParams).some(key => !(key in to.query))

      if (hasMissingDollarParams) {
        next({ ...to, query: { ...dollarParams, ...to.query } })
      } else {
        next()
      }
    })

    api.interceptors.request.use(config => {
      if (!config.params) return config

      /**
        * Remove os parâmetros de query string iniciados com $ antes de enviar a requisição para a API, pois eles
        * são utilizados apenas para controlar a chave do back end por exemplo.
        */
      config.params = Object.fromEntries(Object.entries(config.params).filter(([key]) => !key.startsWith('$')))

      return config
    })
  }

  api.defaults.timeout = asteroidConfig.api.serverTimeout

  // Transformers
  api.defaults.transformResponse = [
    ...api.defaults.transformResponse,

    data => camelizeKeys(data, (key, convert) =>
      /^\D+$/.test(key) ? convert(key) : key
    )
  ]

  api.defaults.transformRequest = [
    data => {
      if (data instanceof FormData) {
        return data
      }

      return decamelizeKeys(data, (key, convert, options) =>
        /^\D+$/.test(key) ? convert(key, options) : key
      )
    },

    ...api.defaults.transformRequest
  ]

  /**
   * Adicionado para que componentes que utilize o Composition API possam ter acesso a instancia do
   * axios que contém as configurações necessárias da aplicação, uma vez que a utilização de provide
   * é a forma recomendada para trabalhar com variavéis globais.
  */
  app.provide('axios', api)
}
