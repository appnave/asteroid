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
- `QasGridGenerator`: `use-empty-result` agora funciona. Campos com lista ou objeto vazio passam a exibir "-" e, com `false`, campos vazios são escondidos.

### Corrigido
- `QasBoardGenerator`: 
 - Corrigido o erro sem tratamento no console ao clicar em "Tentar novamente" ou "Ver mais" quando a coluna falha de novo.
 - Removido `console.log` de depuração ao buscar as colunas.
 - Removida da documentação a prop `use-confirm-dialog`, que não existe mais. Para confirmar o drop, use o `openConfirmDialog` do `before-update-position`.
- `QasDateTimeInput`: Corrigida a validação de datas que não existem (ex: `31/04` ou `29/02` em ano não bissexto), que eram salvas como a data seguinte sem aviso. Agora exibe "Data inválida.".
- `QasDialog`: Corrigido o evento `validate` com `use-form`, que emitia uma Promise no lugar do boolean.
- `QasDialogFilePreview`: Corrigido o aviso "Erro ao carregar imagem.", que continuava aparecendo ao abrir outra imagem depois de uma falha.
- `QasFilters`: Corrigido erro ao abrir ou navegar em uma tela com filtros na URL quando a entidade não tem store (ex: `QasListView` com `use-store` false).
- `QasFormView`: Corrigida a prop `ignore-keys-in-unsaved-changes`, que não ignorava as chaves ao verificar se havia alterações não salvas.
- `QasFormView`: Corrigido o evento `delete-success`, que continuava sendo ouvido após o componente ser desmontado.
- `QasGridGenerator`: Corrigida a prop `use-empty-result`, que não tinha efeito. Com `false`, os campos vazios são escondidos. No padrão (`true`), campos com lista ou objeto vazio, que antes eram escondidos, agora aparecem com "-".
- `QasHeader`: Corrigido o slot `actions`, que não era exibido quando o header não tinha label nem descrição.
- `QasInfiniteScroll`: Corrigido o `refresh`, que não buscava a lista de novo depois de um erro (ex: ao trocar de aba no histórico da venda).
- `QasPasswordStrengthChecker`: Corrigido erro que quebrava o componente quando a senha não atendia nenhum critério (ex: só "ç" ou espaço). Agora exibe "Muito fraco".
- `QasReportsFilters`: Corrigido o botão "Filtrar", que ficava habilitado quando um filtro obrigatório era limpo.
- `QasSearchBox` e `QasSelect`: Corrigida a prop `options-to-exclude`, que removia as opções direto do array recebido em `list`/`options`, alterando a lista do componente pai.
- `QasSelect`, `QasSearchBox`, `QasSelectList` e `QasSelectListDialog`: Corrigido o aviso de prop obrigatória (`entity` e `name`) no lazy loading, que nunca era exibido. Agora a mensagem aparece no console e a requisição não é feita.
- `QasSelectListDialog`: Corrigido o item que, removido e adicionado de novo sem lazy loading, aparecia com o `value` no lugar do `label`.
- `QasStepperFormView`: Corrigidos os passos com `name`, que nunca eram marcados como concluídos.
- `QasTableGenerator`: Corrigida a limpeza do scroll (observer, gradiente e eventos), que não era executada ao desmontar o componente, inclusive o listener de `resize` quando a tabela não ultrapassava a largura da tela.
- `QasTableGenerator` e `QasGridGenerator`: Corrigido erro que quebrava o componente quando um campo `select` com `multiple` vinha sem valor.
- `QasTransfer`: Corrigida a quantidade de itens, que não aparecia nos títulos das colunas, e a sincronização com `options` e `v-model`: os selecionados não duplicam mais quando as `options` mudam, e limpar o model por fora limpa as selecionadas.
- `QasTreeGenerator`: Corrigida a validação de campo obrigatório no nome do ramo, que permitia salvar com o campo vazio.

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