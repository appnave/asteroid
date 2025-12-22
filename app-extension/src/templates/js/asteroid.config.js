export default {
  /**
   * Configurações de API
   * @type {{ serverTimeout: number=10000 }}
  */
  api: {
    serverTimeout: 10000
  },

  framework: {
    fonts: {
      observer: {
        /**
         * O asteroid adiciona um observer nas fontes, enquanto ela não carrega adiciona um loading para
         * não quebrar o layout, a configuração "waitForUserAuthenticate: true" define que o observer deve esperar
         * o usuário estar autenticado para começar a observar as fontes, para isto a aplicação deve poder receber um
         * "postMessage" com um evento type "requestUser" e responder com um evento type "responseUser".
         *
         * @type {boolean=true}
         * @example
         * // solicita o usuário
         * window.postMessage({ type: 'requestUser' })
         *
         * window.addEventListener('message', ({ data }) => data.type // responseUser })
       */
        waitForUserAuthenticate: true
      }
    },

    /**
     * Controla o sistema de notificações da aplicação, ao ativado e configurado,
     * estará disponível os seguintes recursos:
     *
     * - Item de notificação no componente QasAppUser;
     * - Toast de notificação em real time;
     * - Ícone de notificação no menu em real time.
     *
     * @type {{ useNotifications: boolean }}
     */
    featureToggle: {
      useNotifications: false
    }
  }
}
