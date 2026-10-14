import { inject, ref, shallowRef } from 'vue'

import promiseHandler from '../helpers/promise-handler.js'
import getErrorMessage from '../helpers/get-error-message.js'
import NotifyError from '../plugins/notify-error/NotifyError.js'
import NotifySuccess from '../plugins/notify-success/NotifySuccess.js'

/**
 * Composable para lidar com requisições.
 *
 * @param {object} [request]
 * @param {object} [request.axiosConfig] - Config do axios.
 * @param {object} [request.promiseHandlerConfig] - { successMessage, useLoading, loadingConfig, onLoading }.
 * @param {object} [options]
 * @param {boolean} [options.immediate=false] - Executa a requisição ao criar o composable.
 */
export default function useRequestHandler (request = {}, options = {}) {
  const { axiosConfig = {}, promiseHandlerConfig = {} } = request
  const { immediate = false } = options

  const {
    successMessage,
    useLoading,
    loadingConfig,
    onLoading
  } = promiseHandlerConfig

  const axios = inject('axios')

  const data = shallowRef(null)
  const error = shallowRef(null)
  const isLoading = ref(false)

  /**
   * @param {object} [executeAxiosConfig] - Mesclada à config inicial do axios.
   */
  async function execute (executeAxiosConfig = {}) {
    const normalizedAxiosConfig = { ...axiosConfig, ...executeAxiosConfig }

    const response = await promiseHandler(() => axios.request(normalizedAxiosConfig), {
      useLoading,
      loadingConfig,

      onLoading: value => {
        isLoading.value = value
        onLoading?.(value)
      }
    })

    data.value = response.data
    error.value = response.error

    if (response.error) {
      NotifyError(getErrorMessage(response.error))

      return response
    }

    if (successMessage) NotifySuccess(response.data?.data?.status?.text || successMessage)

    return response
  }

  if (immediate) execute()

  return {
    data,
    error,
    isLoading,
    execute
  }
}
