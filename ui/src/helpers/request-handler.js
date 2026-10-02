import promiseHandler from './promise-handler.js'
import NotifySuccess from '../plugins/notify-success/NotifySuccess.js'
import NotifyError from '../plugins/notify-error/NotifyError.js'

const defaultNotifyMessages = {
  error: 'Não conseguimos concluir a solicitação. Por favor, tente novamente em alguns minutos.',
  serverError: 'Ops… Tivemos uma instabilidade. Por favor, tente novamente em alguns minutos.',
  validationError: 'Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente.'
}

/**
 * Função para lidar com requisições HTTP, utilizando o promiseHandler e priorizando as mensagens retornadas pelo back.
 *
 * @param {Promise|Function|Promise[]} promise
 * @param {object} config={successMessage, errorMessage, useForm, useLoading, loadingConfig, onLoading}
 * @example requestHandler(axios.post('url', payload), { errorMessage: 'Erro', successMessage: 'Sucesso' })
 */
export default async function (promise, config = {}) {
  const {
    errorMessage,
    successMessage,
    useForm = false,

    ...promiseHandlerConfig
  } = config

  // As mensagens são tratadas aqui, por isso não são repassadas ao promiseHandler.
  const { data, error } = await promiseHandler(promise, promiseHandlerConfig)

  if (error) {
    NotifyError(getErrorMessage(error, { errorMessage, useForm }))

    return { data, error }
  }

  if (successMessage) NotifySuccess(data?.data?.status?.text || successMessage)

  return { data, error }
}

/**
 * @param {object} error
 * @param {{ errorMessage: string; useForm: boolean; }} param
 * @param {string} param.errorMessage - mensagem de erro usada caso não haja mensagem do back.
 * @param {boolean} param.useForm - indica se é um form, pra exibir a mensagem de validação dos campos.
 */
function getErrorMessage (error, { errorMessage, useForm }) {
  const { status, data } = error?.response || {}

  /**
   * Sem resposta (timeout, rede) ou status 5xx: mensagem genérica de instabilidade, pois o texto do back
   * nesses casos é genérico ou técnico (fora de produção retorna a mensagem da exceção).
   */
  if (!status || status >= 500) return defaultNotifyMessages.serverError

  // Mensagem retornada pelo back.
  if (data?.status?.text) return data.status.text

  const hasFieldError = !!Object.keys(data?.errors || {}).length

  // Formulário com erros de campo: mensagem padrão de validação.
  if (useForm && hasFieldError) return defaultNotifyMessages.validationError

  // "errorMessage" informada ou a mensagem padrão.
  return errorMessage || defaultNotifyMessages.error
}
