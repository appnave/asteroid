import errorMessages from '../shared/error-messages.js'

/**
 * Retorna a mensagem de erro que deve ser exibida ao usuário a partir do erro de uma requisição,
 * priorizando a mensagem retornada pelo back ("status.text").
 *
 * @param {object} error - Erro da requisição (axios).
 * @param {{ defaultMessage?: string, useForm?: boolean }} [options]
 * @param {string} [options.defaultMessage] - Mensagem utilizada caso o back não retorne "status.text".
 * @param {boolean} [options.useForm=false] - Indica se é um formulário, para exibir a mensagem de validação dos campos.
 * @returns {string|undefined}
 *
 * @example getErrorMessage(error, { defaultMessage: 'Não conseguimos reenviar a proposta.' })
 */
export default function getErrorMessage (error, { defaultMessage, useForm = false } = {}) {
  const { status, data } = error?.response || {}

  // Sem resposta (timeout, rede) ou status 5xx: mensagem genérica de instabilidade.
  if (!status || status >= 500) return errorMessages.serverError

  // Mensagem retornada pelo back em "status.text".
  if (data?.status?.text) return data.status.text

  const hasFieldError = !!Object.keys(data?.errors || {}).length

  // Caso seja um formulário e tenha erros de campo, retorna a mensagem padrão de validação.
  if (useForm && hasFieldError) return errorMessages.validation

  // Mensagem padrão informada (undefined caso não informada).
  return defaultMessage
}
