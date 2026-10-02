import { Loading } from 'quasar'
import NotifySuccess from '../plugins/notify-success/NotifySuccess.js'
import NotifyError from '../plugins/notify-error/NotifyError.js'

/** Função para lidar com promises, por exemplo requests.
 *
 * @param {Promise} promise
 * @param {object} config={successMessage, errorMessage, useLoading, loadingConfig, onLoading}
 * @example promiseHandle(new Promise(), { errorMessage: 'Erro', successMessage: 'Sucesso' })
 */
export default async function (promise, config = {}) {
  const {
    errorMessage,
    loadingConfig = {},
    successMessage,
    useLoading = true,

    // callback
    onLoading
  } = config

  onLoading && onLoading(true)
  useLoading && Loading.show(loadingConfig)

  const promiseToBeExec = typeof promise === 'function' ? promise() : promise

  try {
    const data = await (Array.isArray(promise) ? Promise.all(promise) : promiseToBeExec)

    if (successMessage) NotifySuccess(successMessage)

    return { data, error: null }
  } catch (error) {
    if (errorMessage) NotifyError(errorMessage)

    return { data: null, error }
  } finally {
    onLoading && onLoading(false)
    useLoading && Loading.hide()
  }
}
