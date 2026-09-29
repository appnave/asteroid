export default {
  /**
   * Configurações de API
   * @type {{ serverTimeout: number=10000 }}
  */
  api: {
    serverTimeout: 10000
  },

  framework: {
    /**
     * O asteroid ao identificar que a aplicação tenha dependências terceiras e
     * não estão declarados na opção "thirdPartyComponents" ele remove as dependências da aplicação (package.json), caso precise dessas dependências mesmo que sem os thirdPartyComponents, desative esta opção setando como "false".
     * @type {boolean=true}
    */
    autoRemoveThirdDependencies: true,

    fonts: {
      observer: {
        /**
         * O asteroid adiciona um observer nas fontes, enquanto ela não carrega adiciona um loading para
         * não quebrar o layout, a configuração "waitForUserAuthenticate: true" define que o observer deve esperar
         * o usuário estar autenticado para começar a observar as fontes, para isto a aplicação deve poder receber um
         *
         * @type {boolean=true}
         * @example
         *
         * window.addEventListener('message', ({ data }) => data.type // updateUser })
       */
        waitForUserAuthenticate: false
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
    },

    /**
     * Componentes que necessitam de instalação de bibliotecas de terceiros
     * dentro da aplicação que utiliza o asteroid, a instalação é feita automaticamente pelo asteroid.
     * @type {Array<'QasChartView' | 'QasMap'>}
    */
    thirdPartyComponents: [
      'QasMap',
      'QasChartView'
    ]
  }
}
