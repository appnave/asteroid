import { onUnmounted } from 'vue'

/**
 * Composable para gerenciar cancelamento de requisições HTTP
 *
 * @param {Object} options
 * @param {import('vue').Ref<boolean>} options.useAbortOnUnmounted - Indica se deve abortar requisições ao desmontar o componente (default: true)
 *
 * @property {Function} createAbortSignal - Cria um novo signal e retorna objeto com signal e controller
 * @property {Function} abortCurrentRequest - Aborta a requisição atual
 * @property {Function} isCurrentRequest - Verifica se um controller ainda é o mais recente
 */
export default function useAbortController ({ useAbortOnUnmounted } = {}) {
  let abortController = new AbortController()

  /**
   * Cria um novo AbortSignal, cancelando automaticamente a requisição anterior
   * @returns {Object} Objeto contendo o signal e o controller
   */
  function createAbortSignal () {
    // Aborta a requisição anterior, se existir
    abortController.abort()

    // Cria um novo controller
    abortController = new AbortController()

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

  // Limpa qualquer requisição pendente quando o componente for desmontado
  onUnmounted(() => {
    const shouldAbortOnUnmounted = useAbortOnUnmounted?.value ?? true

    if (shouldAbortOnUnmounted) {
      abortController.abort()
    }
  })

  return {
    createAbortSignal,
    abortCurrentRequest,
    isCurrentRequest
  }
}
