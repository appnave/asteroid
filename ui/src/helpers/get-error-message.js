import errorMessages from '../shared/error-messages.js'

/**
 * Retorna a mensagem de erro que deve ser exibida ao usuário a partir do erro de uma requisição do axios.
 *
 * @param {object} error - Erro da requisição (axios).
 */
export default function getErrorMessage (error) {
  const { status, data } = error?.response || {}

  const method = error?.config?.method
  const isFormRequest = ['post', 'put', 'patch'].includes(method)
  const defaultMessage = getDefaultMessage(method, isFormRequest)

  if (!status || status >= 500) return defaultMessage

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
 */
function getDefaultMessage (method, isFormRequest) {
  if (isFormRequest) return errorMessages.save

  if (method === 'delete') return errorMessages.delete

  return errorMessages.fetch
}
