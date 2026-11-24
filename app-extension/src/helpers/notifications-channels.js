import { useNotifications } from 'asteroid'

import { PROCESS_CHANNEL_NAME } from './laravel-echo.js'

export function setNotificationsChannelListener () {
  const {
    incrementUnreadNotificationsCount,
    sendNotify,
    triggerNotification
  } = useNotifications()

  const notificationsChannel = new BroadcastChannel('notifications')

  notificationsChannel.onmessage = ({ data: { notification } }) => {
    // aciona o hook "onNotificationReceived".
    triggerNotification(notification)

    // dispara o "Notify" do Quasar.
    sendNotify(notification)

    // incrementa o contador "unreadNotificationsCount".
    incrementUnreadNotificationsCount()
  }
}

export function setProcessChannelListener () {
  const { setRealtimeConnectionState, triggerProcessFinished } = useNotifications()

  /**
   * É outro objeto com o mesmo nome do canal usado pela aba líder, então a aba líder
   * também recebe as mensagens (um BroadcastChannel não recebe as próprias mensagens).
   */
  const processChannel = new BroadcastChannel(PROCESS_CHANNEL_NAME)

  const handlers = {
    // aciona o hook "onProcessFinished".
    processFinished: triggerProcessFinished,

    // atualiza o "realtimeConnectionState".
    connectionState: setRealtimeConnectionState
  }

  processChannel.onmessage = ({ data: { type, payload } }) => handlers[type]?.(payload)

  // pergunta à aba líder o estado atual da conexão.
  processChannel.postMessage({ type: 'requestConnectionState' })
}

export function setNotificationsUtilsChannel () {
  const { setUnreadNotificationsCount } = useNotifications()

  const notificationsUtilsChannel = new BroadcastChannel('notifications--utils')

  notificationsUtilsChannel.onmessage = ({ data: { type } }) => {
    /**
     * Se o botão "Marcar todas como lida" for acionado, então é zerado o "unreadNotificationsCount"
     * em todas as abas.
     */
    if (type === 'markAllAsRead') setUnreadNotificationsCount(0)
  }
}
