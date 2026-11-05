import asteroidConfig from 'asteroid-config'
import hasParentByClassName from '../helpers/private/has-parent-by-class-name.js'

import { Notify } from 'quasar'
import { getCurrentScope, onScopeDispose, ref } from 'vue'

import naveNotificationSound from '../assets/sounds/nave-notification.mp3'

const callbackFunctions = {
  onNotificationReceived: []
}

export function onNotificationReceived (callbackFn) {
  callbackFunctions.onNotificationReceived.push(callbackFn)
}

/**
 * Callbacks registrados para o evento "process.finished".
 * O "Set" evita registrar o mesmo callback duas vezes.
 */
const processFinishedCallbacks = new Set()

/**
 * Registra um callback para o evento "process.finished", se chamado dentro de um escopo
 * (setup/created de componente), o callback é removido automaticamente ao desmontar.
 *
 * @param {(data: { identifier: string, isSuccessful: boolean }) => void} callbackFn
 * @returns {() => void} função para remover o callback manualmente.
 */
export function onProcessFinished (callbackFn) {
  processFinishedCallbacks.add(callbackFn)

  const off = () => processFinishedCallbacks.delete(callbackFn)

  if (getCurrentScope()) onScopeDispose(off)

  return off
}

const unreadNotificationsCount = ref(0)

/**
 * Estado da conexão websocket repassado pela aba líder
 * (unknown, connecting, connected, unavailable, failed, disconnected).
 * Fica "unknown" até a aba líder responder.
 */
const realtimeConnectionState = ref('unknown')

export default function () {
  const isNotificationsEnabled = asteroidConfig.framework.featureToggle?.useNotifications

  const isProcessEventsEnabled = !!(
    isNotificationsEnabled &&
    asteroidConfig.framework.featureToggle?.useProcessEvents
  )

  function triggerNotification (notification) {
    callbackFunctions.onNotificationReceived.forEach(fn => fn((notification)))
  }

  function triggerProcessFinished (data) {
    processFinishedCallbacks.forEach(fn => fn(data))
  }

  function setRealtimeConnectionState (state) {
    realtimeConnectionState.value = state
  }

  function setUnreadNotificationsCount (value) {
    unreadNotificationsCount.value = value
  }

  function incrementUnreadNotificationsCount () {
    unreadNotificationsCount.value++
  }

  /**
   * @param {{
   *  message: string
   *  title: string
   *  link?: string
   * }} config
   */
  function sendNotify (config = {}) {
    const { link } = config

    const classes = ['bg-white', 'boot-notification', 'q-py-sm', 'text-grey-8']

    if (link) classes.push(...['boot-notification--has-link', 'cursor-pointer'])

    const closeNotify = Notify.create({
      actions: [{
        icon: 'sym_r_close',
        class: 'boot-notification__close-button qas-btn qas-btn--tertiary qas-btn--tertiary-grey-10'
      }],

      attrs: {
        onClick: event => onNotifyClick({ event, link, closeNotify })
      },

      classes: classes.join(' '),
      html: true,
      icon: 'sym_r_info',
      iconColor: 'primary',
      message: getHTMLMessage(config),
      multiLine: true,
      position: 'bottom-right',
      timeout: 30000
    })

    sendNotificationSound()

    /**
     * Função que é chamada quando o usuário clica na notificação, se a notificação
     * tem link, então ele vai ser redirecionado para o link em uma nova aba, caso
     * não tenha link, nada acontece.
     */
    function onNotifyClick ({ event, link, closeNotify }) {
      if (!link) return

      if (hasParentByClassName('boot-notification__close-button', event.srcElement)) return

      window.open(link)

      closeNotify()
    }

    /**
     * Função que retorna um HTML para seguir estilos propostos pelo design.
     */
    function getHTMLMessage ({ message, title, icon = 'info' } = {}) {
      return (`
         <div>
           <header class="row items-center">
             <h5 class="text-grey-10 text-h5 boot-notification__title">
               ${title}
             </h5>
           </header>

           <div class="q-mt-sm text-grey-8 text-body1">
             ${message}
           </div>
         </div>
      `)
    }

    /**
     * Função que toca o som de notificação.
     */
    function sendNotificationSound () {
      const audio = new Audio(naveNotificationSound)

      // o áudio agora é reproduzível; reproduza-o se as permissões permitirem
      audio.addEventListener('canplaythrough', audio.play)
    }
  }

  return {
    // const
    isNotificationsEnabled,
    isProcessEventsEnabled,

    // computed
    realtimeConnectionState,
    unreadNotificationsCount,

    // functions
    incrementUnreadNotificationsCount,
    sendNotify,
    setRealtimeConnectionState,
    setUnreadNotificationsCount,
    triggerNotification,
    triggerProcessFinished
  }
}
