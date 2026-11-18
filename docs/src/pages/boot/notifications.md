---
title: notifications
---

Boot que controla a central de notificação da aplicação, para que este boot funcione, são necessários **3 etapas**. Após configurar essas etapas, estará disponível os recursos de notificações, que são:

- Item de notificação no menu do `QasAppMenu`;
- Toast de notificação em real time;
- Ícone de notificação no menu em real time.

É utilizado o *pattern* de [leader election](https://en.wikipedia.org/wiki/Leader_election), após eleger uma aba como líder, apenas esta aba irá fazer a conexão com o servidor *websocket*, a comunicação entre outras abas será feita via [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API), o motivo desta implementação é para economia de recursos, mantendo uma única conexão por usuário.

O servidor de *websocket* é o [Laravel Reverb](https://reverb.laravel.com/) do `nave-hub-server` (`wss://ws.nave.app.br` em produção e `wss://ws.nave.dev.br` em staging). Enquanto todas as aplicações não migrarem, o [Ably](https://ably.com/) continua disponível como *fallback*: sem a env `REVERB_APP_KEY`, a conexão é feita no Ably.

:::info
Lembre-se de passar a propriedade "initialUnreadNotificationsCount" para o componente `QasLayout`, esta propriedade vem no `/me` como `unreadNotificationsCount`.
:::


#### Mapeamento de arquivos que lidam com notificações:
- `/app-extension/src/boot/notifications.js`;
- `/ui/src/components/app-user/QasAppUser.vue`;
- `/ui/src/components/layout/QasLayout.vue`;
- `/ui/src/components/layout/private/PvLayoutNotificationCard.vue`;
- `/ui/src/components/layout/private/PvLayoutNotificationsDrawer.vue`.

#### Etapas
##### 1. Habilitar no `asteroid.config.js`
```js
// asteroid.config.js
{
  framework: {
    featureToggle: {
      useNotifications: true
    }
  }
}
```

##### 2. Configure as envs do Reverb no `quasar.config.js`
Exponha as envs em `build.defineEnv`:

```js
// quasar.config.js
build: {
  defineEnv: {
    REVERB_APP_KEY: process.env.REVERB_APP_KEY || '',
    REVERB_HOST: process.env.REVERB_HOST || 'localhost',
    REVERB_PORT: process.env.REVERB_PORT || '8080',
    REVERB_SCHEME: process.env.REVERB_SCHEME || 'http'
  }
}
```

Valores por ambiente:

| Variável | Local | Staging | Produção |
| --- | --- | --- | --- |
| `REVERB_APP_KEY` | `hub-local-key` | key do app `hub` (staging) | key do app `hub` (produção) |
| `REVERB_HOST` | `localhost` | `ws.nave.dev.br` | `ws.nave.app.br` |
| `REVERB_PORT` | `8080` | `443` | `443` |
| `REVERB_SCHEME` | `http` | `https` | `https` |

:::warning
Vai **somente a key** (a mesma `REVERB_APP_KEY` configurada no `nave-hub-server` do ambiente), **nunca** o `REVERB_APP_SECRET`, já que o valor fica exposto no *bundle* do front.
:::

A autenticação dos canais continua em `${SERVER_BASE_URL}/broadcasting/auth`, então o `SERVER_BASE_URL` não muda.

Em `localhost`, a conexão só é estabelecida quando a `REVERB_APP_KEY` está definida, utilizando o Reverb que o `nave-hub-server` sobe localmente (`localhost:8080`). Sem ela, não há conexão local.

:::info
**Ably (depreciado):** sem a `REVERB_APP_KEY`, a conexão é feita no Ably utilizando a env `ABLY_KEY` (somente a parte pública, antes do `:`). Este *fallback* será removido quando todas as aplicações migrarem para o Reverb.
:::

##### 3. Certifique-se que exista o evento "updateUser" no window
Este evento dispara toda vez que a aplicação é iniciada e exista um `user` setado no *localStorage*, assim garante que o usuário esteja logado, e após isto, é feito todo o controle de notificações.
A biblioteca [@bildvitta/hub](https://github.com/bildvitta/quasar-app-extension-hub) já implementa por padrão estes eventos, caso não esteja utilizando a mesma, será necessário implementar manualmente este evento.

**Exemplo de como a central de notificações escuta por este evento**:
```js
window.addEventListener('message', ({ data }) => {
  if (data.type === 'updateUser') { ... } // aqui é o evento de updateUser
})
```
