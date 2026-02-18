import useNotifications from '@bildvitta/quasar-ui-asteroid/src/composables/use-notifications.js'

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
