import { isLocalDevelopment, handleProcess } from 'asteroid'

import Echo from 'laravel-echo'
import * as PusherModule from 'pusher-js'

import { camelizeKeys } from 'humps'

const Pusher = PusherModule.default || PusherModule.Pusher || PusherModule

export const PROCESS_CHANNEL_NAME = 'notifications--process'

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
 *  channel: BroadcastChannel,
 *  useProcessEvents?: boolean
 * }} options
 */
export function setLaravelEchoListener ({ user, channel, useProcessEvents } = {}) {
  const echoChannel = window.Echo.private(`notifications.${user.uuid}`).listen('.notification', message => {
    /**
     * Como é um websocket, não passa pelo axios interceptor, logo é necessário
     * transformar a resposta em camelCase manualmente.
     */
    channel.postMessage({ notification: camelizeKeys(message) })
  })

  if (useProcessEvents) setProcessEventsListener(echoChannel)
}

/**
 * Função para escutar o evento "process.finished" e o estado da conexão, repassando
 * para as demais abas via BroadcastChannel "notifications--process".
 *
 * @param {import('laravel-echo').Channel} echoChannel
 */
function setProcessEventsListener (echoChannel) {
  const processChannel = new BroadcastChannel(PROCESS_CHANNEL_NAME)

  echoChannel.listen('.process.finished', data => {
    processChannel.postMessage({ type: 'processFinished', payload: camelizeKeys(data) })
  })

  // Estado da conexão (connecting, connected, unavailable, failed, disconnected).
  const { connection } = window.Echo.connector.pusher

  const postConnectionState = () => {
    processChannel.postMessage({ type: 'connectionState', payload: connection.state })
  }

  connection.bind('state_change', postConnectionState)

  // Abas abertas depois da conexão perguntam o estado atual, e a aba líder responde.
  processChannel.onmessage = ({ data }) => {
    if (data.type === 'requestConnectionState') postConnectionState()
  }
}
