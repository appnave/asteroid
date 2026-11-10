import { handleProcess } from 'asteroid'

/**
 * Guarda a URL base resolvida na primeira chamada, para que axios e Laravel Echo
 * utilizem sempre a mesma URL, mesmo que a query string mude durante a navegação.
 */
let resolvedBaseURL = null

/**
 * Retorna a URL base da API.
 *
 * Fora de produção, permite sobrescrever a URL base via query string "$base", útil para ambiente de preview.
 *
 * @returns {string}
 */
export function getBaseURL () {
  if (resolvedBaseURL) return resolvedBaseURL

  resolvedBaseURL = resolveBaseURL()

  return resolvedBaseURL
}

function resolveBaseURL () {
  // TODO: Validar variavel de ambiente se é produção.
  const isProduction = handleProcess(() => import.meta.env.ENVIRONMENT === 'production', false)
  const previewURL = new URLSearchParams(window.location.search).get('$base')

  if (previewURL && !isProduction) {
    try {
      const { hostname, protocol } = new URL(previewURL)

      // Somente permite URLs seguras (https) e do domínio nave.dev.br para evitar possíveis ataques de SSRF.
      if (protocol === 'https:' && hostname.endsWith('.nave.dev.br')) return previewURL
    } catch {}
  }

  // Caso não haja uma URL de preview válida, utiliza a URL base definida nas variáveis de ambiente ou locahost.
  return handleProcess(() => import.meta.env.SERVER_BASE_URL, '/')
}
