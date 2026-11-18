/**
 * Este boot só é adicionado dinamicamente na aplicação caso a opção
 * "asteroidConfig.framework.featureToggle.useNotifications" esteja ativada.
 */

import asteroidConfig from 'asteroid-config'
import { isLocalDevelopment } from 'asteroid'

import onLeaderElectionChannel from '../helpers/on-leader-election-channel.js'
import { isReverbEnabled, setLaravelEcho, setLaravelEchoListener } from '../helpers/laravel-echo.js'
import {
  setNotificationsChannelListener,
  setNotificationsUtilsChannel,
  setProcessChannelListener
} from '../helpers/notifications-channels.js'

import { LocalStorage } from 'quasar'

/**
 * Controla a escuta do evento "process.finished" (fim de processos assíncronos).
 */
const useProcessEvents = !!asteroidConfig.framework.featureToggle?.useProcessEvents

/**
 * O "updateUser" pode ser disparado mais de uma vez na sessão, então guardamos o usuário
 * já inicializado para não registrar os listeners em duplicidade.
 */
let initializedUserUuid = null

export default () => {
  /**
   * Em desenvolvimento local só estabelecemos conexão se o Reverb estiver configurado
   * ("REVERB_APP_KEY"), já que o servidor local sobe o Reverb. Sem ele, não há servidor
   * de websocket local para conectar.
   */
  if (isLocalDevelopment() && !isReverbEnabled()) return

  window.addEventListener('message', ({ data }) => {
    if (data.type !== 'updateUser') return

    const user = data.user

    if (initializedUserUuid === user?.uuid) return

    initializedUserUuid = user?.uuid

    const accessToken = LocalStorage.getItem('accessToken')

    const hasBearerPrefix = accessToken.startsWith('Bearer ')
    const userToken = hasBearerPrefix ? accessToken : `Bearer ${accessToken}`

    /**
     * Aqui vamos estabelecer a conexão com o servidor apenas na tab (aba) líder.
     * Vamos escutar por novas notificações, sempre que receber uma notificação,
     * iremos enviar via BroadcastChannel.postMessage().
     */
    onLeaderElectionChannel(channel => {
      setLaravelEcho(userToken)
      setLaravelEchoListener({ user, channel, useProcessEvents })
    })

    /**
     * Controle de notificações por comunicação entre abas (BroadcastChannel).
     */
    setNotificationsChannelListener()
    setNotificationsUtilsChannel()

    if (useProcessEvents) setProcessChannelListener()
  })
}
