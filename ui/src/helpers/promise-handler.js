import { Loading } from 'quasar'
import NotifySuccess from '../plugins/notify-success/NotifySuccess.js'
import NotifyError from '../plugins/notify-error/NotifyError.js'

const defaultNotifyMessages = {
  validationError: 'Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente.'
}

/** Função para lidar com promises, por exemplo requests.
 *
 * @param {Promise} promise
 * @param {object} config={successMessage, errorMessage, useLoading, loadingConfig, onLoading}
 * @example promiseHandle(new Promise(), { errorMessage: 'Erro', successMessage: 'Sucesso' })
 */
export default async function (promise, config = {}) {
  const {
    errorMessage,
    successMessage,
    loadingConfig = {},
    useLoading = true,

    // callback
    onLoading
  } = config

  onLoading && onLoading(true)
  useLoading && Loading.show(loadingConfig)

  const promiseToBeExec = typeof promise === 'function' ? promise() : promise

  try {
    const data = await (Array.isArray(promise) ? Promise.all(promise) : promiseToBeExec)

    // retorna mensagem do back ou a mensagem passada.
    if (successMessage) NotifySuccess(data?.data?.status?.text || successMessage)

    return { data, error: null }
  } catch (error) {
    const hasFieldError = !!Object.keys(error?.response?.data?.errors || {}).length
    const defaultMessage = hasFieldError ? defaultNotifyMessages.validationError : errorMessage

    // retorna mensagem do back ou a mensagem padrão, só não exibe o notify caso não exista nenhuma mensagem.
    const resolvedErrorMessage = error?.response?.data?.status?.text || defaultMessage

    if (resolvedErrorMessage) NotifyError(resolvedErrorMessage)

    return { data: null, error }
  } finally {
    onLoading && onLoading(false)
    useLoading && Loading.hide()
  }
}
