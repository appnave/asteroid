import { inject, ref, shallowRef } from 'vue'

import promiseHandler from '../helpers/promise-handler.js'
import getErrorMessage from '../helpers/get-error-message.js'
import NotifyError from '../plugins/notify-error/NotifyError.js'
import NotifySuccess from '../plugins/notify-success/NotifySuccess.js'

/**
 * Composable para lidar com requisições
 *
 * @param {object} [request]
 * @param {object} [request.axiosConfig] - Config do axios (ex.: { method, url, params, data }).
 * @param {object} [request.promiseHandlerConfig] - Config do promiseHandler.
 * @param {string} [request.promiseHandlerConfig.successMessage] - Mensagem do notify de sucesso, só é exibido caso
 * informada. Prioriza o "status.text" retornado pelo back.
 * @param {boolean} [request.promiseHandlerConfig.useLoading=true] - Exibe o loading do Quasar na tela durante a
 * requisição.
 * @param {object} [request.promiseHandlerConfig.loadingConfig] - Configurações do loading do Quasar.
 * @param {function} [request.promiseHandlerConfig.onLoading] - Callback chamado com o estado de loading.
 * @param {object} [options]
 * @param {boolean} [options.immediate=false] - Executa a requisição ao criar o composable.
 *
 * @example
 * const { isLoading, execute } = useRequestHandler({
 *   axiosConfig: { method: 'post', url: 'sales/123/retry' },
 *   promiseHandlerConfig: { successMessage: 'Proposta reenviada com sucesso.', useLoading: false }
 * })
 *
 * const { data, error } = await execute({ data: payload })
 */
export default function useRequestHandler ({ axiosConfig = {}, promiseHandlerConfig = {} } = {}, { immediate = false } = {}) {
  /**
   * As mensagens são tratadas pelo composable (erro pelo helper "getErrorMessage"), por isso apenas as
   * configurações de loading são repassadas ao promiseHandler.
   */
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
   * Executa a requisição.
   *
   * @param {object} [executeAxiosConfig] - Config do axios mesclada à config inicial (ex.: { url, data, params }).
   * @returns {Promise<{ data: *, error: * }>}
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
