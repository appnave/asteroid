import { onUnmounted } from 'vue'

/**
 * Composable para gerenciar cancelamento de requisições HTTP
 *
 * @param {Object} options
 * @param {import('vue').Ref<boolean>} options.useAbortOnUnmounted - Indica se deve abortar requisições ao desmontar o componente (default: true)
 */
export default function useAbortController ({ useAbortOnUnmounted } = {}) {
  let abortController = new AbortController()
  let hasActiveRequest = false

  // functions
  /**
   * Cria um novo AbortSignal, cancelando automaticamente a requisição anterior
   * @returns {Object} Objeto contendo o signal e o controller
   */
  function createAbortSignal () {
    // Só aborta se houver uma requisição ativa
    if (hasActiveRequest) {
      abortController.abort()
    }

    // Cria um novo controller
    abortController = new AbortController()
    hasActiveRequest = true

    // Retorna uma referência local ao controller para verificações posteriores
    return {
      signal: abortController.signal,
      controller: abortController
    }
  }

  /**
   * Aborta manualmente a requisição atual
   */
  function abortCurrentRequest () {
    abortController.abort()
  }

  /**
   * Verifica se o controller fornecido ainda é o controller mais recente
   * @param {AbortController} controller - Controller para verificar
   * @returns {boolean} true se for o controller atual, false caso contrário
   */
  function isCurrentRequest (controller) {
    return controller === abortController
  }

  // hooks
  /**
   * Limpa qualquer requisição pendente quando o componente for desmontado
   */
  onUnmounted(() => {
    const shouldAbortOnUnmounted = useAbortOnUnmounted?.value ?? true

    if (shouldAbortOnUnmounted && hasActiveRequest) {
      abortController.abort()
    }
  })

  return {
    createAbortSignal,
    abortCurrentRequest,
    isCurrentRequest
  }
}
