import errorMessages from '../shared/error-messages.js'

/**
 * Retorna a mensagem de erro que deve ser exibida ao usuário a partir do erro de uma requisição do axios,
 * priorizando a mensagem retornada pelo back ("status.text"). Quando o back não retorna mensagem, utiliza a
 * mensagem padrão com base no método da requisição ("error.config.method").
 *
 * @param {object} error - Erro da requisição (axios).
 * @returns {string}
 *
 * @example getErrorMessage(error)
 */
export default function getErrorMessage (error) {
  const { status, data } = error?.response || {}

  const method = error?.config?.method
  const isFormRequest = ['post', 'put', 'patch'].includes(method)
  const defaultMessage = getDefaultMessage(method, isFormRequest)

  /**
   * Sem resposta (timeout, rede) ou status 5xx: mensagem padrão da ação, pois o texto do back nesses casos é
   * genérico ou técnico (fora de produção retorna a mensagem da exceção).
   */
  if (!status || status >= 500) return defaultMessage

  // Mensagem retornada pelo back em "status.text".
  if (data?.status?.text) return data.status.text

  // Formulário (POST, PUT ou PATCH) com erro de validação: mensagem padrão de validação dos campos.
  if (isFormRequest && status === 422) return errorMessages.validation

  return defaultMessage
}

/**
 * Mensagem padrão da ação com base no método da requisição.
 *
 * @param {string} [method] - Método HTTP da requisição.
 * @param {boolean} isFormRequest - Indica se é uma requisição de formulário (POST, PUT ou PATCH).
 * @returns {string}
 */
function getDefaultMessage (method, isFormRequest) {
  if (isFormRequest) return errorMessages.save

  if (method === 'delete') return errorMessages.delete

  return errorMessages.fetch
}
