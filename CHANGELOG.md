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
### BREAKING CHANGES
- `setDefaultFiltersBeforeEnter` e `setDefaultFiltersBeforeEach`: removido o parâmetro `next` (deprecated no Vue Router 5). Caso utilize o `queryList`, altere para `beforeEnter: (to, from) => setDefaultFiltersBeforeEnter(to, from, ['company'])`.
- `Delete`: removida a prop `useResponseNotifyError`, exibir a mensagem do back passa a ser o padrão.

### Adicionado
- `getErrorMessage`: helper que retorna a mensagem de erro de uma requisição, priorizando o `status.text` do back e, na falta dele, uma mensagem padrão pelo método (`GET`, `DELETE`, `POST`/`PUT`/`PATCH`).
- `useRequestHandler`: composable para requisições manuais, com `data`, `error`, `isLoading`, `execute` e opção `immediate`.

### Modificado
- `QasFormView`: notify de erro do `submit` e do fetch passa a utilizar o `getErrorMessage`.
- `QasListView` e `QasSingleView`: notify de erro do fetch passa a utilizar o `getErrorMessage`.
- `QasChartView`: notify de erro do fetch passa a utilizar o `getErrorMessage`.
- `QasInfiniteScroll`: notify de erro do fetch passa a utilizar o `getErrorMessage`.
- `Delete`: notify de erro passa a utilizar o `getErrorMessage`.
- `viewMixin`: removido o computed `mx_fetchErrorMessage`.

## [4.0.0-beta.0] - 29-09-2026
### BREAKING CHANGES
- Removido suporte ao webpack; a documentação e o fluxo de desenvolvimento passam a considerar apenas Vite.

### Adicionado
- `QasAppUser`: adicionado o postMessage `setUser` pra o `@appnave/quasar-app-extension-hub` atualizar o `user` no localStorage ao alterar o vínculo.

### Modificado
- Removido suporte ao webpack; a documentação e o fluxo de desenvolvimento passam a considerar apenas Vite.
[4.0.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v4.0.0-beta.0-alpha.0...v4.0.0-beta.0?expand=1