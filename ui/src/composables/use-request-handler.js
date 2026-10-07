import { inject, ref, shallowRef } from 'vue'

import promiseHandler from '../helpers/promise-handler.js'
import getErrorMessage from '../helpers/get-error-message.js'
import NotifyError from '../plugins/notify-error/NotifyError.js'
import NotifySuccess from '../plugins/notify-success/NotifySuccess.js'

/**
 * Composable para lidar com requisições do axios feitas manualmente (fora dos componentes de view), utilizando o
 * promiseHandler e exibindo a mensagem de erro retornada pelo back (ver helper "getErrorMessage").
 * Para outros tipos de promise, utilize o promiseHandler.
 *
 * Pode ser utilizado no "setup" ou no "data" de componentes Options API.
 *
 * @param {object} [request] - Config do axios (ex.: { method, url, params, data }).
 * @param {object} [config]
 * @param {string} [config.successMessage] - Mensagem do notify de sucesso, só é exibido caso informada.
 * @param {string} [config.errorMessage] - Mensagem de erro caso o back não retorne "status.text". Quando não
 * informada, utiliza a mensagem padrão da ação ("get": fetch, "delete": delete, demais métodos: save).
 * @param {boolean} [config.useForm=false] - Exibe a mensagem padrão de validação quando há erros de campo.
 * @param {boolean} [config.useNotifyError=true] - Exibe o notify de erro.
 * @param {boolean} [config.useLoading=true] - Exibe o loading do Quasar na tela durante a requisição.
 * @param {object} [config.loadingConfig] - Configurações do loading do Quasar.
 * @param {function} [config.onLoading] - Callback chamado com o estado de loading.
 *
 * @example
 * const { isLoading, execute } = useRequestHandler(
 *   { method: 'post', url: 'sales/123/retry' },
 *   { successMessage: 'Proposta reenviada com sucesso.', useLoading: false }
 * )
 *
 * const { data, error } = await execute({ data: payload })
 */
export default function useRequestHandler (request = {}, config = {}) {
  const {
    errorMessage,
    successMessage,
    useForm = false,
    useNotifyError = true,

    ...promiseHandlerConfig
  } = config

  const axios = inject('axios')

  const data = shallowRef(null)
  const error = shallowRef(null)
  const isLoading = ref(false)

  /**
   * Executa a requisição.
   *
   * @param {object} [requestConfig] - Config do axios mesclada à config inicial (ex.: { url, data, params }).
   * @returns {Promise<{ data: *, error: * }>}
   */
  async function execute (requestConfig = {}) {
    const normalizedRequestConfig = { ...request, ...requestConfig }

    const response = await promiseHandler(() => axios.request(normalizedRequestConfig), {
      ...promiseHandlerConfig,

      onLoading: value => {
        isLoading.value = value
        promiseHandlerConfig.onLoading?.(value)
      }
    })

    data.value = response.data
    error.value = response.error

    if (response.error) {
      const message = getErrorMessage(response.error, { fallback: errorMessage, useForm })

      if (useNotifyError && message) NotifyError(message)

      return response
    }

    if (successMessage) NotifySuccess(response.data?.data?.status?.text || successMessage)

    return response
  }

  return {
    data,
    error,
    isLoading,
    execute
  }
}
