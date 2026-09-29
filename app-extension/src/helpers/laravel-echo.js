import { isLocalDevelopment, handleProcess } from 'asteroid'

import Echo from 'laravel-echo'
import * as PusherModule from 'pusher-js'

import { camelizeKeys } from 'humps'

const Pusher = PusherModule.default || PusherModule.Pusher || PusherModule

/**
 * Função para setar configuração do Laravel Echo.
 *
 * @param {string} accessToken
 */
export function setLaravelEcho (accessToken) {
  window.Pusher = Pusher

  const isLocal = isLocalDevelopment()
  const serverBaseURL = handleProcess(() => import.meta.env.SERVER_BASE_URL, '/')
  const normalizedServerBaseURL = serverBaseURL === '/'
    ? ''
    : serverBaseURL.replace(/\/$/, '')

  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: isLocal ? 'app-key' : handleProcess(() => import.meta.env.ABLY_KEY, ''),
    wsHost: isLocal ? 'localhost' : 'realtime-pusher.ably.io',
    wsPort: isLocal ? 6001 : 443,
    disableStats: true,
    encrypted: true,
    cluster: isLocal ? 'mt1' : 'eu',
    authEndpoint: `${normalizedServerBaseURL}/broadcasting/auth`,
    enabledTransports: ['ws', 'wss'],
    auth: {
      headers: {
        Authorization: accessToken
      }
    },

    // Propriedades que só devem ser adicionas em localhost
    ...(isLocal && { wssPort: 6001, forceTLS: false })
  })
}

/**
 * Função para setar o listener que vai enviar as mensagens via BroadcastChannel.postMessage
 * para as demais abas.
 *
 * @param {{
 *  user: { uuid: string },
 *  channel: BroadcastChannel
 * }} options
 */
export function setLaravelEchoListener ({ user, channel } = {}) {
  window.Echo.private(`notifications.${user.uuid}`).listen('.notification', message => {
    /**
     * Como é um websocket, não passa pelo axios interceptor, logo é necessário
     * transformar a resposta em camelCase manualmente.
     */
    channel.postMessage({ notification: camelizeKeys(message) })
  })
}
