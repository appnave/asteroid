import { handleProcess } from 'asteroid'

import Echo from 'laravel-echo'
import * as PusherModule from 'pusher-js'

import { camelizeKeys } from 'humps'

import { getBaseURL } from './get-base-url.js'

const Pusher = PusherModule.default || PusherModule.Pusher || PusherModule

export const PROCESS_CHANNEL_NAME = 'notifications--process'

/**
 * Retorna a key pública do Reverb ("REVERB_APP_KEY"), ou string vazia caso não exista.
 *
 * @returns {string}
 */
export function getReverbKey () {
  return handleProcess(() => import.meta.env.REVERB_APP_KEY, '')
}

/**
 * Indica se a aplicação está configurada para utilizar o Reverb ("REVERB_APP_KEY" definida).
 *
 * @returns {boolean}
 */
export function isReverbEnabled () {
  return !!getReverbKey()
}

/**
 * Retorna as opções de conexão do provedor de websocket.
 *
 * - Com "REVERB_APP_KEY": conecta no Reverb, com host, porta e TLS vindos do env.
 * - Sem "REVERB_APP_KEY": conecta no Ably (fallback para as aplicações que ainda não migraram).
 *
 * TODO: remover o ramo do Ably quando todas as aplicações migrarem para o Reverb.
 *
 * @returns {object}
 */
export function getConnectionOptions () {
  const reverbKey = getReverbKey()

  if (reverbKey) {
    return {
      broadcaster: 'reverb',
      key: reverbKey,
      wsHost: handleProcess(() => import.meta.env.REVERB_HOST, 'localhost'),
      wsPort: Number(handleProcess(() => import.meta.env.REVERB_PORT, 8080)),
      wssPort: Number(handleProcess(() => import.meta.env.REVERB_PORT, 443)),
      forceTLS: handleProcess(() => import.meta.env.REVERB_SCHEME, 'https') === 'https'
    }
  }

  return {
    broadcaster: 'pusher',
    key: handleProcess(() => import.meta.env.ABLY_KEY, ''),
    wsHost: 'realtime-pusher.ably.io',
    wsPort: 443,
    encrypted: true,
    cluster: 'eu'
  }
}

/**
 * Função para setar configuração do Laravel Echo.
 *
 * @param {string} accessToken
 */
export function setLaravelEcho (accessToken) {
  window.Pusher = Pusher

  // Utiliza a mesma URL base do axios, respeitando o "$base" da query string em ambiente de preview.
  const serverBaseURL = getBaseURL()
  const normalizedServerBaseURL = serverBaseURL === '/'
    ? ''
    : serverBaseURL.replace(/\/$/, '')

  window.Echo = new Echo({
    ...getConnectionOptions(),
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${normalizedServerBaseURL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: accessToken
      }
    }
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
