# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Para encontrar de uma forma mais detalhada todas as mudanças da `versão 2` para a `versão 3`, navegue até o arquivo `/docs/src/pages/start/upgrade-guide.md`.
Neste arquivo (CHANGELOG.MD) você encontrará somente as mudanças referentes a versão 4.

### Sobre os "BREAKING CHANGES"
Podemos ter pequenas breaking changes sem alterar o `major` version, apesar de serem pequenas, podem alterar o comportamento da funcionalidade caso não seja feita uma atualização, **preste muita atenção** nas breaking changes dentro das versões quando existirem.

### Sobre comentário N/A
Devemos adicionar o comentário `<!-- N/A -->` (Não adicionar), para que não precise adicionar um item do changelog ao lançar uma nova versão stable.
Caso adicionado no escopo inicial, todos os conteúdos abaixo não serão adicionados. Caso adicionado na linha, será considerado apenas ela.

## Não publicado
### Adicionado
- `useProcessListener`: adicionado composable para escutar o evento `process.finished` (fim de processos assíncronos) via websocket, filtrando por `identifiers` (ou `match`) e disparando `onSuccess`/`onError`. Quando a conexão é restabelecida ou o usuário volta para a aba, chama o `onSync` caso exista processo em andamento (`isWaiting`).
- `useNotifications`: adicionado hook `onProcessFinished` (removido automaticamente ao desmontar o componente), estado `realtimeConnectionState` com o estado da conexão websocket repassado pela aba líder e a constante `isProcessEventsEnabled`.
- `asteroid.config.js`: adicionada feature toggle `framework.featureToggle.useProcessEvents` para habilitar a escuta do evento `process.finished` no mesmo canal das notificações (depende do `useNotifications`).
- `boot/notifications`: adicionado repasse do evento `process.finished` e do estado da conexão para todas as abas através do BroadcastChannel `notifications--process`.

### Corrigido
- `boot/notifications`: corrigido registro duplicado dos listeners quando o `updateUser` é disparado mais de uma vez para o mesmo usuário na sessão.
- `app-extension`: adicionado `pusher-js` e `laravel-echo` no `optimizeDeps` do Vite, evitando o erro "Pusher is not a constructor" em desenvolvimento.
- `build/release`: Corrigido erro ao ler as variáveis de ambiente após publicar uma versão beta ou stable.

### Modificado
- `boot/api`: a lógica de URL base foi extraída para o helper `get-base-url.js`, que guarda a URL resolvida na primeira chamada para que axios e Laravel Echo utilizem sempre a mesma URL.
- `laravel-echo`: o Laravel Echo passa a utilizar a mesma URL base do axios, respeitando o `$base` da query string em ambiente de preview.

### Removido
- Removido suporte ao Vetur, que já não era utilizado. A extensão recomendada passa a ser a Vue - Official (Volar), oficial para o Vue 3.
- `docs`: Removida dependência `@bildvitta/vuex-offline`, que não era utilizada.

## [4.0.0-beta.1] - 16-10-2026
### Modificado
- `QasUploader`: Modificado componente pra exibir o template da imagem do upload com base na chave `full_path` retornada pela API `upload-credentials`.

### Corrigido
- `QasUploader`: Corrigido adicionar uma imagem após já existir uma imagem no upload, antes não acontecia nada por conta da validação interna do `maxFiles`.
- `build/release`: Corrigido script de release que falhava ao instalar o `ui` no `app-extension` antes da versão ficar disponível no npm.

## [4.0.0-beta.0] - 29-09-2026
### BREAKING CHANGES
- Removido suporte ao webpack; a documentação e o fluxo de desenvolvimento passam a considerar apenas Vite.

### Adicionado
- `QasAppUser`: adicionado o postMessage `setUser` pra o `@appnave/quasar-app-extension-hub` atualizar o `user` no localStorage ao alterar o vínculo.

### Modificado
- Removido suporte ao webpack; a documentação e o fluxo de desenvolvimento passam a considerar apenas Vite.
[4.0.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v4.0.0-beta.0-alpha.0...v4.0.0-beta.0?expand=1
[4.0.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v4.0.0-beta.1-alpha.5...v4.0.0-beta.1?expand=1
