import useNotifications, { onProcessFinished } from './use-notifications.js'

import { onScopeDispose, toValue, watch } from 'vue'

/**
 * Escuta o evento "process.finished" (fim de processos assíncronos) para os identifiers da tela.
 *
 * O identifier vem somente no payload do websocket, então a tela deve montar os identifiers
 * que lhe interessam a partir do próprio contexto (ex.: `contract:preview:${saleId}`).
 *
 * Como o evento é efêmero, se a conexão cair ou a aba ficar em segundo plano, o "onSync" é
 * chamado ao reconectar/voltar para a aba, desde que exista processo em andamento ("isWaiting").
 *
 * Depende das opções "useNotifications" e "useProcessEvents" do "asteroidConfig.framework.featureToggle".
 *
 * @param {{
 *  identifiers?: import('vue').MaybeRefOrGetter<string | string[]>,
 *  match?: (identifier: string) => boolean,
 *  isWaiting?: import('vue').MaybeRefOrGetter<boolean>,
 *  onSuccess?: (data: { identifier: string, isSuccessful: boolean }) => void,
 *  onError?: (data: { identifier: string, isSuccessful: boolean }) => void,
 *  onSync?: () => void
 * }} options
 *
 * @example
 * useProcessListener({
 *   identifiers: [`contract:preview:${saleId}`, `contract:send-to-signature:${saleId}`],
 *   isWaiting: () => sale.value.legalDocumentStatus === 'processing',
 *   onSuccess: ({ identifier }) => refresh(),
 *   onError: () => NotifyError('Falha ao processar.'),
 *   onSync: refresh
 * })
 */
export default function useProcessListener ({
  identifiers,
  match,
  isWaiting = false,
  onSuccess,
  onError,
  onSync
} = {}) {
  const { isProcessEventsEnabled, realtimeConnectionState } = useNotifications()

  if (!isProcessEventsEnabled) {
    if (import.meta.env.DEV) {
      console.warn('[useProcessListener] As opções "useNotifications" e "useProcessEvents" precisam estar ativadas no asteroid.config.js.')
    }

    return
  }

  // evento recebido, confere se é um dos identifiers da tela.
  onProcessFinished(data => {
    if (!hasMatch(data.identifier)) return

    data.isSuccessful ? onSuccess?.(data) : onError?.(data)
  })

  // reconectou, recarrega os dados pois algum evento pode ter sido perdido.
  watch(realtimeConnectionState, (state, oldState) => {
    const hasReconnected = state === 'connected' && !['connected', 'unknown'].includes(oldState)

    if (hasReconnected) sync()
  })

  // usuário voltou para a aba, recarrega os dados uma vez.
  function onVisibilityChange () {
    if (document.visibilityState === 'visible') sync()
  }

  document.addEventListener('visibilitychange', onVisibilityChange)

  onScopeDispose(() => document.removeEventListener('visibilitychange', onVisibilityChange))

  function hasMatch (identifier) {
    if (typeof match === 'function') return match(identifier)

    return [].concat(toValue(identifiers) || []).includes(identifier)
  }

  function sync () {
    if (toValue(isWaiting)) onSync?.()
  }
}
