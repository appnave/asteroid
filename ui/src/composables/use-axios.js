import { useAbortController } from './private'
import { NotifySuccess, NotifyError } from '../plugins'

import { inject, ref, shallowRef, onMounted } from 'vue'

/**
 * @param {string} url
 * @param {Object} options
 * @param {import('axios').AxiosRequestConfig} options.axiosConfig - Configuração do axios
 * @param {{
 *  errorMessage?: string | (error: *) => string,
 *  successMessage?: string | () => string,
 *  axiosInstance?: import('axios').AxiosInstance,
 *  immediate?: boolean,
 *  shallow?: boolean,
 *  onSuccess?: (data: import('axios').AxiosResponse) => void,
 *  onError?: (error: import('axios').AxiosError) => void
 * }} options.config - Configuração do composable
 */
export default function useAxios (url, { axiosConfig = {}, config = {} } = {}) {
  axiosConfig.method = axiosConfig.method || 'GET' // seta o padrão.

  const {
    axiosInstance,
    errorMessage,
    immediate,
    onError,
    onSuccess,
    shallow = true,
    successMessage
  } = config

  // globals
  const axios = axiosInstance || inject('axios')

  /** @private */
  const isGetRequest = ref(axiosConfig.method === 'GET')

  // composables
  const { createAbortSignal } = useAbortController({ useAbortOnUnmounted: isGetRequest })

  // refs
  const isLoading = ref(false)
  const isFinished = ref(false)
  const isSucceeded = ref(false)

  const data = shallow ? shallowRef(undefined) : ref(undefined)
  const error = shallow ? shallowRef(undefined) : ref(undefined)

  // hooks
  onMounted(() => {
    if (immediate) execute()
  })

  // functions
  /**
   * @param {import('axios').axiosConfig} config
   */
  async function execute (config = {}) {
    const normalizedConfig = {
      url,
      ...axiosConfig,
      ...config
    }

    isGetRequest.value = normalizedConfig.method === 'GET'

    const signal = isGetRequest.value ? createAbortSignal().signal : undefined

    isLoading.value = true
    isFinished.value = false
    isSucceeded.value = false

    data.value = undefined
    error.value = undefined

    try {
      const response = await axios.request({ ...normalizedConfig, signal })

      data.value = response.data
      isSucceeded.value = true

      onSuccess?.(response.data)

      const isSuccessMessageFunction = typeof successMessage === 'function'

      if (isSuccessMessageFunction) {
        const message = successMessage(response.data)

        NotifySuccess(message)

        return
      }

      if (successMessage) {
        NotifySuccess(successMessage)
      }
    } catch (errorData) {
      error.value = errorData?.response?.data

      onError?.(errorData)

      const isErrorMessageFunction = typeof errorMessage === 'function'

      if (isErrorMessageFunction) {
        const message = errorMessage?.(error.value)

        NotifyError(message)

        return
      }

      if (errorMessage) {
        NotifyError(errorMessage)
      }
    } finally {
      isLoading.value = false
      isFinished.value = true
    }
  }

  return {
    data,
    error,
    isSucceeded,
    isLoading,
    isFinished,
    execute
  }
}

// { data, error, isLoading, isFinished, execute, abort } = useAxios('url', { method: 'GET' }, { immediate: true })
// { data, error, isLoading, isFinished, execute, abort } = useAxios(['url', { method: 'GET' }, { immediate: true }])

// function updateXPTO () {
//   useAxios('', {  }, {  })

//   if (error.value) {
//     // Tratar erro
//     console.error('Erro na requisição:', error.value)
//   } else {
//     // Usar os dados recebidos
//     console.log('Dados recebidos:', data.value)
//   }
// }

// useAxios('11', {
//   config: {
//     errorMessage: error => error.
//   }
// })
