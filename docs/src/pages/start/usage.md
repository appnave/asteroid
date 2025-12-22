---
title: Usando
---

Para a instalação do Asteroid é bem simples, em sua aplicação `Quasar` abra o terminal na raiz do projeto e digite:

```bash
quasar ext add @bildvitta/asteroid
```

Este comando além de instalar o Asteroid, também vai criar os arquivos `quasar.variables.scss` e `asteroid.config.js`, caso já tenha instalado o asteroid no projeto, pode criar manualmente estes arquivos na raiz do projeto.

**quasar.variables.scss:**
```scss
// Quasar SCSS (& Sass) Variables - Asteroid
// --------------------------------------------------
// NÃO MODIFIQUE ESTE ARQUIVO COM AS CONFIGURAÇÕES DO ASTEROID PRÉ DEFINIDAS!
@import '~@bildvitta/quasar-ui-asteroid/src/index';

$primary   : #0f53af;
$secondary : #1565C0;
$tertiary  : #c7ceff;
$accent    : rgba(33, 33, 33, 10%);
$dark      : #212121;
$positive  : #21ba45;
$negative  : #d40000;
$info      : #31ccec;
$warning   : #f2c037;

// Asteroid
$primary-contrast: #1976d2;
$secondary-contrast: #90caf9;

@include set-brand(primary-contrast, $primary-contrast);
@include set-brand(secondary-contrast, $secondary-contrast);
```

**asteroid.config.js**
```js
module.exports = {
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
     */
    featureToggle: {
      useNotifications: false
    },

    /**
     * Componentes que necessitam de instalação de bibliotecas de terceiros
     * dentro da aplicação que utiliza o asteroid, a instalação é feita automaticamente pelo asteroid.
     * @type {Array<'QasChartView' | 'QasMap'>}
    */
    thirdPartyComponents: []
  }
}
```

## Variáveis de ambiente
Abaixo temos uma lista de variáveis de ambiente, as que estão marcadas como `obrigatório` precisa ser adicionadas no `quasar.config.js`

| Variável | Descrição |
| ------------ | ------------ |
| `BUCKET_URL` * | Endereço de hospedagem dos arquivos **(OBRIGATÓRIO)** |
| `SERVER_BASE_URL` * | Endereço base de acesso do servidor **(OBRIGATÓRIO)** |
| `DEBUGGING` * | Habilita os loggers dos componentes **(OBRIGATÓRIO)** |
| `MAPS_API_KEY` | Key do google maps **(OBRIGATÓRIO SE ESPECIFICADO NO "thirdPartyComponents")** |
| `ABLY_KEY` | Key do Ably (notificações) |
| `ME_VERSION` * | Versão do endpoint `users/me` **(OBRIGATÓRIO)** |
