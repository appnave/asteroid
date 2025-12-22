# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Para encontrar de uma forma mais detalhada todas as mudanças da `versão 2` para a `versão 3`, navegue até o arquivo `/docs/src/pages/start/upgrade-guide.md`.
Neste arquivo (CHANGELOG.MD) você encontrará somente as mudanças referentes a versão 3.

### Sobre os "BREAKING CHANGES"
Podemos ter pequenas breaking changes sem alterar o `major` version, apesar de serem pequenas, podem alterar o comportamento da funcionalidade caso não seja feita uma atualização, **preste muita atenção** nas breaking changes dentro das versões quando existirem.

### Sobre comentário N/A
Devemos adicionar o comentário `<!-- N/A -->` (Não adicionar), para que não precise adicionar um item do changelog ao lançar uma nova versão stable.
Caso adicionado no escopo inicial, todos os conteúdos abaixo não serão adicionados. Caso adicionado na linha, será considerado apenas ela.

## [Não publicado]
### Adicionado
- `QasListView`: adicionado prop `use-query-pagination` para a paginação ser controlada internamente no componente, para o uso quando temos o caso de ter mais de um `QasListView` na mesma página.

### Corrigido
- `QasBtnDropdown`: corrigido validação da prop `disable`, onde ao passar a prop no `buttonsPropsList` não funcionava.

## [3.20.0-beta.4] - 12-12-2025
### Corrigido
- `helpers/set-scroll-on-grab`: corrigido seletor de classe para só adicionar quando passado `cancelMouseDownTarget`.

## [3.20.0-beta.3] - 08-12-2025
### Adicionado
- `QasTextTruncate`:
  - adicionado recurso para configurar prop `typography` default dinamicamente via provide/inject semelhante ao `QasBtn`.
  - adicionado `items-center` para alinhamento correto agora que o line-height na tabela foi alterado e estava desalinhado.

### Modificado
- `QasToggleVisibility`: adicionado data `data-no-grab` para não arrastar conteúdo ao clicar nele, resolvendo problema de miss click.
- `helpers/set-scroll-on-grab`: adicionado nativamente elemento de `button` para ser ignorado e um novo data `data-no-grab` para resolver problemas de miss click em ações.
- `QasTableGenerator`:
  - modificado line-height para tabela ser sempre `100%`ao invés de seguir tipografia das fontes.
  - modificado tipografia padrão do `QasTextTruncate` via provide `textTruncatePropsDefaults` para `body2`.

### Corrigido
- `QasBtn`: corrigido tamanho dos ícones para seriem 18px no sm. <!-- N/A -->

## [3.20.0-beta.2] - 05-12-2025
## BREAKING CHANGES
- Validar todos locais que usam o `QasTableGenerator` pois tiveram bastante mudanças visuais.

### Adicionado
- `QasTableGenerator`:
  - adicionado nova propriedade `useMultiline`.
  - adicionado `QasTip`usado via prop `columns`.
  - adicionado label "Ações" na coluna de ação.
- `QasActionsMenu`: adicionado nova propriedade `useDropdownAlways`.
- `QasTooltip`: adicionado o componente `QasBreakline`para ser usado na prop `text`, agora é possível quebrar textos usando `\n`.
- `QasToggleVisibility`: adicionado propriedade `visibleTooltip` e `hiddenTooltip`.

### Modificado
- `QasTooltip`: modificado tamanho de largura máxima para `300px`.
- `QasBtn`: modificado tamanho do botão para `18px` quando o `size` ser `sm`.
- `helpers/filters/formatDocument`: adicionado validação para parâmetro vazio.
- `QasTableGenerator`:
  - adicionado borda abaixo do titulo das colunas.
  - modificado tipografia de `body1` para `body2`.
  - modificado tamanho padrão do `QasBtn` de `md` para `sm`.
  - modificado validação do `mappedResults`, quando usado type `object` ele não passa pelo `humanize` e não adicionado na chave `default` visando performance.
  - coluna de ação agora tem o conteúdo alinhado á esquerda igual aos demais. 

## [3.20.0-beta.1] - 25-11-2025
### Adicionado
- `QasBtnDropdown`: adicionado novo slot dinâmico `btn-content-[buttons-props-list-key]`.
- `QasFilters`:
  - adicionado feature para ordenação.
  - adicionado prop `orderByOptions`.

## [3.20.0-beta.0] - 19-11-2025
## BREAKING CHANGES
- **Possíveis breaking changes**: mudanças referentes ao overlay pode quebrar alguns componentes a nível de rota, ou então a nível de layout.
- Adicionado validação `isBackgroundOverlay` no watch da rota por conta do overlay navigation.
  - `QasChartView`.
  - `QasFilters`.
  - `QasListView`.
  - `QasSingleView`.
- `mixins/view.js`: removido computada `mx_componentClass` em favor de usar o componente `QasContainer`.
- `composables/use-view.js`. removido computada `componentClass` em favor de usar o componente `QasContainer`.
- `QasBox`: modificado valores padrões das props `outlined` e `unelevated` para quando estiver dentro de um overlay (vai ficar com borda).

### Adicionado
- Adicionado alterações e recursos para overlay navigation.
- Adicionado novo composable `useOverlayNavigation`.
- `QasCard`:
  - adicionado prop `useSelection`.
  - adicionado slot `header`. ([#1408](https://github.com/bildvitta/asteroid/issues/1408))
  - adicionado model `selected`.
  - adicionado prop `trueValue`.
  - adicionado prop `falseValue`.
- Adicionado novo componente `QasContainer`.
- `QasAlert`:
  - adicionado novo status `success`.
  - modificado controle do QasBox para controle automático de overlay navigation.
- `QasBtn`: adicionado nova propriedade `tooltip`.
- `QasDrawer`: adicionado novo slot `header` (usado no overlay).
- `QasFormView`:
  - adicionado validação interna para travar o dialog de overlay quando estiver fazendo um submit.
  - adicionado validação para remover botão de voltar automaticamente quando estiver dentro de um o overlay.
- `QasPageHeader`: adicionado validação para remover breadcrumbs automaticamente quando estiver dentro de um overlay.
- `QasTabsGenerator`: adicionado nova propriedade `querySlug` para controle automático de mudança de query na rota.

### Modificado
- `QasBox`: modificado valores padrões das props `outlined` e `unelevated` para quando estiver dentro de um overlay (vai ficar com borda).
- `QasBtn`: alterado default da prop `size` interna para `sm` quando o botão estiver dentro de um `QasBtn` e for variante `primary` ou `secondary`.
- `QasCard`: removido elemento HTML header e espaçamento do header quando não tiver slot header, title ou prop title. ([#1395](https://github.com/bildvitta/asteroid/issues/1395))
- `QasTooltip`: modificado tipografia para `text-caption`.
- Adicionado validação `isBackgroundOverlay` no watch da rota por conta do overlay navigation.
  - `QasChartView`.
  - `QasFilters`.
  - `QasListView`.
  - `QasSingleView`.
- `ui/src/mixins/context.js` | `ui/src/composables/use-context.js`: modificado uso do `route` do vue-router para usar `route` `useOverlayNavigation`.

### Removido
- `mixins/view.js`: removido computada `mx_componentClass` em favor de usar o componente `QasContainer`.
- `composables/use-view.js`. removido computada `componentClass` em favor de usar o componente `QasContainer`.

## [3.19.0] - 19-11-2025
## BREAKING CHANGES
- Todos locais que usarem component dinâmico `<component :is="QasBtn" />` do asteroid, precisa ser importado do asteroid `import { QasBtn } from 'asteroid'`, porque o auto import não consegue identificar o componente sozinho.
- Removido opção "thirdPartyComponents" e "autoRemoveThirdDependencies", agora precisa instalar/desinstalar manualmente as libs necessárias para o `QasMap` e `QasChartView`.
- Instalar dependências manualmente para os componentes `QasMap` e `QasChartView`.
- `QasDelete`: propriedade agora aceita receber um componente além de string, caso esteja passando algum component do asteroid com string, usar import diretamente.
- Remover personalização do `quasar.variables.css`.
- `dateTime`: Alguns lugares podem apresentar divergências na forma de exibição.
- `QasNumericInput`:
  - corrigido props `icon` e `iconRight` que estavam invertidas (iconRight mostrava a esquerda).
- [`QasFormGenerator`, `QasGridGenerator`]: lógicas de fieldset/subset adicionadas no composable `useGenerator`, validar se nada quebra.
- `QasGalleryCard`:
  - removido propriedades `name` e `actionsMenuProps` em favor de usar a nova propriedade `headerProps`.
  - removido slot `header`, `actions` e `name`.
  - modificado slot `image-error` para `image-error-message` para o nome fazer mais sentido com o que de fato faz.
- rever todos locais para passar a propriedade `galleryCardProps` no novo padrão do `QasGalleryCard`:
  - QasGalleryCard.
  - QasUploader.
  - QasGallery.
- Rever todos locais que usam `QasBtn` dentro de componentes de usam `QasInput` ou `QasTableGenerator` pois elas alteram a prop `size` default via provide `btnPropsDefaults`.
- Muitas mudanças no `QasUploader`, verificar se nada quebra e remover validações manuais referentes a propriedades `accept` e `maxFileSize`.
- Rever lugares que utilizam lazy loading nos campos, pois pode gerar breaking changes.
- `QasDelete`: Removido prop tag, sendo que agora o sempre será um botão. Validar lugares que utilizam pois pode ocorrer quebra no layout.

### Adicionado
- Adicionado suporte para Vite, mantendo suporte para Webpack.
- `build/*`: adicionado suporte para lançar versões alpha do asteroid para testes mais rápidos e precisos.
- Adicionado cores defaults internamente no componente sem necessidade de fazer isto no projeto no arquivo `quasar.variables.scss`
- `QasNestedFields`: Adicionado nova prop `use-header` para controlar quando irá ter ou não o header em cada linha.
- `QasSelectListDialog`: Adicionado novo slot `selected-content` para poder personalizar todos os itens adicionados.
- `QasInput`: adicionado prop `use-copy` para adicionar nativamente botão de ação "copiar" no input, que funciona apenas em conjunto da prop readonly ([1326](https://github.com/bildvitta/asteroid/issues/1326)).
- `QasTableGenerator`: Adicionado novo recurso de seleção de linhas na tabela através das novas props `useSelection`, `useObjectSelectedModel` e pelo model `v-model:selected`.
- `QasGridGenerator`: ([#1325](https://github.com/bildvitta/asteroid/issues/1325))
 - Adicionado opção de separador entre fieldset ou subset.
 - Adicionado opção de tip nos títulos dos campos através do fieldsProps.
 - Adicionado opção de alterar a tipografia do valor do campos através do fieldsProps.
- `QasTip`: Adicionado componente de dica.
- `QasToolTip`: Adicionado componente de tooltip.
- `QasActions`: adicionado possibilidade de passar props dos botões sem necessariamente precisar abrir slot. ([#1332](https://github.com/bildvitta/asteroid/issues/1332))
- `QasInfiniteScroll`: adicionado função `fetchList` no expose. ([#1315](https://github.com/bildvitta/asteroid/issues/1315))
- `QasUploader`:
  - adicionado propriedades:
    - useEmptyResultText
    - useGalleryCard
    - useHeader
    - maxFileSize (ja existia no QUploader mas agora foi definida no componente).
  - adicionado novo slot `bottom-list`.
  - adicionado evento `rejected` (ja existia no QUploader mas agora foi definida no componente).
  - adicionado `files` via parâmetros no método interno `addFiles`.
  - adicionado validações nativas pom feedback `notify` para props `accept` e `maxFileSize`.
- `QasBtn`: adicionado propriedade `size`. ([#1345](https://github.com/bildvitta/asteroid/issues/1345))
- `ui/src/css/mixins/set-button.scss`: adicionado novo parâmetro `size`.
- `QasGalleryCardProps`:
  - adicionado propriedade `headerProps`.
  - adicionado novo slot `image-error-container`.
- `QasGallery`:
  - adicionado nova propriedade `showMoreAlign`.
  - adicionado efeito no hover da img do QasGalleryCard para feedback visual.
- `QasHeader`: adicionada propriedade `useEllipsis`.
- `QasStepper`:
  - Adicionado prop `useVertical` para ter possibilidade de utilizá-lo na vertical.
  - Adicionado prop `headerNav` (substituído o attrs) para controle de navegação entre as steps.
- `QasAlert`: Adicionado possibilidade do componente ter vários `QasBtn` ou `RouterLink`.
- `QasPdfViewer`: Adicionado componente para renderização de documentos PDF diretamente no navegador com estados de loading, erro e suporte a múltiplas páginas.
- `QasFormView`: Adicionado propriedade `use-store` para dar a possibilidade de utilizar o componente sem a store do vuex/pinia. ([#1083](https://github.com/bildvitta/asteroid/issues/1083))
- `QasSelectListDialog`:
  - Adicionado model chamado `select-list-model` com os itens selecionados dentro do dialog.
  - Adicionado o método `toggleDialog` no define expose.
- `QasToggle`: Adicionado prop `title` para ter a possibilidade de ter um título acima do toggle. ([#1316](https://github.com/bildvitta/asteroid/issues/1316))
- `QasListView`: Adicionado refetch automático após deleção de itens quando `use-store` está desabilitado (`false`). ([#1404](https://github.com/bildvitta/asteroid/issues/1404))
- `QasDelete`: Adicionado prop `buttonProps` para repassar as propriedades para o botão para o `QasBtn`.
- `container.scss`: Adicionado padding-bottom no container pra quando existir o botão do gleap, pra o botão não sobrepor o conteúdo da página.
- `QasGalleryCard`: adicionado propriedade `fileType` para definir o tipo de arquivo quando não conseguir exibir imagem.
- `QasUploader`: adicionado nova propriedade `errors`.
- `QasGalleryCard`: adicionado novo slot `image-bottom` para uso dentro do `QasUploader`.

### Corrigido
- `QasNumericInput`:
  - corrigido estilo do componente quando usado com ícone no slot.
  - corrigido bug quando apagava 2 vezes os valores do campo, onde a label não decima para a posição padrão de quando fica sem valor e o model mesmo apagado ficava com valor `0`.
  - corrigido props `icon` e `iconRight` que estavam invertidas (iconRight mostrava a esquerda).
- `QasBtn`: Declarado prop `readonly` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes).
- `QasDateTimeInput`: Declarado props `readonly` e `disable` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes)
- `QasInput`: Declarado prop `readonly` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes).
- `QasSelect`: Declarado as prop `readonly`, `disable`e `multiple` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes).
- `QasChartView`:
  - Corrigido comportamento no qual quando se era passado `options` personalizadas para o gráfico, aplicavam as mesmas customizações para os demais gráficos do mesmo tipo.
  - Corrigido nome do slot para exibição do botão de filtrar, sendo o correto `actions`.
- `QasGridGenerator`: Correção de espaçamento do gutter quando modo `useInline: true`. ([#1325](https://github.com/bildvitta/asteroid/issues/1325))
- `QasFormGenerator`: gutter entre subsets agora é `md`.
- `QasActionsMenu`: corrigido alinhamento quando está dentro de outro container, como por exemplo o `QasPageHeader`. ([#1337](https://github.com/bildvitta/asteroid/issues/1337))
- `QasReportsFilters`: corrigido imports dos componentes internos.
- `QasUploader`:
  - corrigido exibição do QasGalleryCard quando um upload falha.
  - corrigido exibição no QasGalleryCard para arquivos que não carregam no QImg, ex: PDF, DOCX.
- `QasGallery`: corrigido elemento "ver mais", que estava alocado em um elemento com gutter que gerava inconsistência de tamanho.
- `QasSelect`: Corrigido forma no qual é setado uma opção padrão quando se tem apenas um item e o campo seja múltiplo, esteva setando como string, sendo que deveria ser como array com uma única opção dentro.
- `QasFormGenerator`: corrigido erro ao não passar a propriedade `columns` quando há subset. ([#1299](https://github.com/bildvitta/asteroid/issues/1299))
- `QasSingleView`: corrigido problema do loading travar a tela toda no dialog, foi resolvido adicionando classe "relative-position" no container. ([#1342](https://github.com/bildvitta/asteroid/issues/1342))
- `QasFormGenerator`: corrigido comportamento quando `fields` está vazio, agora não exibe nenhum campo ao invés de exibir todos os campos disponíveis. ([#1361](https://github.com/bildvitta/asteroid/issues/1361))
- `QasSelect`: Corrigido cor de foco nas opções durante a navegação com teclado (teclas de seta para cima/baixo).
- `QasNumericInput`: Corrigido foco do campo, pois quando utilizado via tab, o campo não focava.
- `QasGridGenerator`: Corrigido container de fields no qual não respeitava o tamanho do container pai.
- `QasActions`: Corrigido tamanho do botão quando passado via props e utilizado junto com `useEqualWidth`. ([#1400](https://github.com/bildvitta/asteroid/issues/1400))
- `QasSelectListDialog`:
  - Corrigido slots do dialog que não funcionavam.
  - Corrigido alinhamento do botão de adicionar item quando não se tem label no header.
- `QasNumericInput`:
  - Corrigido exibição do input, no qual exibia o conteúdo da lib `Autonumeric` ao dar hover, sendo que deve ser exibida apenas quando tem foco ou valor no campo. ([[#1403](https://github.com/bildvitta/asteroid/issues/1403)])
  - Corrigido inconsistência de valores entre navegação por Tab e clique ao perder foco, garantindo que ambos métodos produzam o mesmo resultado.
  - Corrigido precisão decimal no model para modo percentual, onde o `places` agora controla corretamente as casas decimais do valor final (places=2 resulta em 4 casas decimais para percentuais, ex: 0.0133).
- `QasAlert`: Corrigido para remover do HTML o componente quando ele for fechado (prop `useCloseBtn`). ([#1381](https://github.com/bildvitta/asteroid/issues/1381))
- `QasSelect`: Corrigido uso de badges na opção, no qual quebrava quando utilizado como objeto ao invés de função. ([#1329](https://github.com/bildvitta/asteroid/issues/1329))
- `QasFormView`: Corrigido comportamento do dialog de descarte de alterações sendo exibido em momentos errados. Para casos específicos, onde o model é manipulado externamente, é necessário atualizar o `cachedResult` para um comparativo é possível ter acesso a fn `updateUnsavedChangesCache` via inject ou via ref.
- `QasFormView`: Corrigido validação para não exibir o dialog de descarte após a criação.
- `QasGalleryCard`: Corrigido lógica pra exibir o tipo do arquivo no card(pdf, docx, etc), onde pra determinado padrão de url não era possível obter o tipo anteriormente.
- `QasGalleryCard`: Corrigido exibição do tipo de arquivo quando não conseguir carregar imagem.
- `formatPercent | money`: Corrigido formatação do campo percentual quando o valor é 0. ([#1350](https://github.com/bildvitta/asteroid/issues/1350))
- `QasInfiniteScroll`: Corrigido exibição do texto quando não há resultados, pois estava cortando ao definir tamanho máximo de altura. ([#1347](https://github.com/bildvitta/asteroid/issues/1347))

### Modificado
- Modificado arquivo `asteroid.config.js`.
- `QasMap`: modificações para utilizar plugin do import `@fawmi/vue-google-maps` dentro do próprio arquivo .vue, ao invés de utilizar no boot.
- `app-extension/src/boot/error-pages.js`: modificado import estático de paginas para import dinâmico.
- Mudanças necessárias para dar suporte ao vite, como:
  - modificado `modules.exports` por `export default`.
  - import manual de todos os componentes do asteroid internamente.
- `QasField`: Modificado imports estático de componentes para import dinâmico com `defineAsyncComponent` e alterado para composition API.
- import manual de componentes/scripts do Asteroid:
  - QasAlert
  - QasAppMenu
  - PvAppMenuDropdown
  - QasAppUser
  - QasBadge
  - QasBoardGenerator
  - QasDropdown
  - QasCardImage
  - QasCard
  - QasChartView
  - QasCheckbox
  - QasCopy
  - QasDateTimeInput
  - QasDelete
  - QasDialog
  - QasDrawer
  - QasExpansionItem
  - QasFilters
  - QasFormGenerator
  - QasFormView
  - QasGalleryCard
  - QasGallery
  - PvGalleryCarouselDialog
  - PvGalleryDeleteDialog
  - QasGridGenerator
  - QasHeader
  - QasInfiniteScroll
  - PvLayoutNotificationCard
  - PvLayoutNotificationsDrawer
  - QasListItems
  - QasNestedFields
  - QasPasswordInput
  - QasRadio
  - QasSearchBox
  - QasSearchInput
  - QasSelectFilter
  - QasSelectListDialog
  - PvSelectListCheckbox
  - QasSelect
  - QasSignaturePad
  - QasSingleView
  - QasStepperFormView
  - QasTableGenerator
  - QasTabsGenerator
  - QasTextTruncate
  - QasToggleVisibility
  - QasTreeGenerator
  - QasUploader
  - QasUploader
  - QasWelcome
  - QasWhatsappLink
  - ui/src/composables/use-notifications.js
  - ui/src/composables/use-query-cache.js
  - ui/src/pages/ErrorComponent.vue
  - ui/src/pages/Forbidden.vue
  - ui/src/pages/NotFound.vue
  - ui/src/pages/ServerError.vue
  - ui/src/pages/Unauthorized.vue
  - app-extension/src/boot/notifications.js
  - app-extension/src/boot/query-cache.js
  - app-extension/src/boot/register.js
  - app-extension/src/defaults/default-asteroid-config.js
  - app-extension/src/helpers/asteroid-config-handler.js
  - app-extension/src/helpers/install-third-party-components.js
  - app-extension/src/helpers/laravel-echo.js
  - app-extension/src/helpers/notifications-channels.js
  - ui/src/asteroid.js
- Modificado import do lodash para import default:
  - QasFormView
  - QasGridGenerator
  - QasPageHeader
  - QasSelectList
  - QasSignaturePad
  - mixins/search-filter.js
- `QasSelectListDialog`: Modificado header para utilizar o componente `QasHeader`.
- `QasNumericInput`: Alterado input para aplicar estilo tanto de `readonly` quanto de `disabled`, sendo que antes só aplicava `disabled` mesmo quando enviasse a prop `readonly`.
- `QasAlert`: Modificado comportamento para não ter box quando estiver dentro de um `QasDialog`. ([#1288](https://github.com/bildvitta/asteroid/issues/1288))
- `QasTableGenerator`: Alterado cor do título da coluna (th) para o `grey-10`. ([#1287](https://github.com/bildvitta/asteroid/issues/1287))
- `dateTime | PvLayoutNotificationCard`: Alterado padrão de data para `"dd/MM/yyyy 'às' HH:mm:ss"` para melhorar a legibilidade. ([#1294](https://github.com/bildvitta/asteroid/issues/1294))
- `QasCard`: Modificado estilo do card para utilizar bordas ao invés de box quando estiver dentro de um `QasDialog`. ([#1289](https://github.com/bildvitta/asteroid/issues/1289))
- `QasSelect`: removido ícone arrow-down (a direita) quando esta `readonly`. ([#1309](https://github.com/bildvitta/asteroid/issues/1309))
- `QasSelect`: removido ícone searchable quando readonly ou disable.
- [`QasSelect`, `QasInput`, .q-field]:
  - removido cor de borda diferente no hover quando readonly.
  - setado cor grey-6 para borda do readonly.
- `QasFormGenerator`: Logica de fieldset/subset movida para composable `useGenerator`.
- `QasUploader`:
  - modificado layout da área de drag and drop.
  - modificado comportamento da propriedade `columns` que antes fazia um merge com o que era passado de fora do componente e o default interno, agora o default só existe caso não seja passado pelo lado de fora.
- `ui/src/plugins/notify-error/NotifyError.js`: modificado ícone de erro para `sym_r_error`.
`QasBtn`:
  - modificado cursor `disabled` para `progress` quando o botão esta com estado `loading`.
  - modificações para propriedades `color`, `size` e `variant` terem padrões defaults configuráveis via provide `btnPropsDefaults`.
- Modificado `QTooltip` para `QasTooltip`:
  - QasCopy.
  - QasTransfer.
- `QasFilters`: alterado size do botão dentro do menu para `sm`.
- `QasInput`: alterado propriedades padrões do QasBtn via provide `btnPropsDefaults`:
  - size.
  - variant.
  - color.
- `QasTableGenerator`: alterado propriedade padrão `size` do QasBtn via provide `btnPropsDefaults`.
- `QasGalleryCard`:
  - modificado header para utilizar componente `QasHeader` através da propriedade `headerProps`.
  - modificado default da prop `errorIcon` para `sym_r_error`.
  - modificado default da prop `errorMessage` para `Falha ao carregar imagem.`.
  - modificado slot `image-error` para `image-error-message` para o nome fazer mais sentido com o que de fato faz.
  - modificado layout para outlined quando estiver dentro do QasDialog.
- `QasGallery`: mudanças necessárias para se adaptar as mudanças do `QasGalleryCard`.
- `QasHeader`: modificado logica para não mostrar elemento do header em casos de conteúdos vazio pela computada `hasHeaderContent`.
- `QasStepper`: Modificado exibição da cor primária nas linhas de cada step.
- `QasExpansionItem`: Modificado para o expansion não ter box e sim bordas quando estiver dentro de um dialog. ([#1373](https://github.com/bildvitta/asteroid/issues/1373))
- `QasSelect`: Modificado a forma na qual se é setado o valor default do campo, validando também os campos que são lazy loading e as opções recebidas. [[#1324](https://github.com/bildvitta/asteroid/issues/1324)]
- `QasInput`: Modificado máscara de CNPJ para aceitar letras conforme o novo padrão.
- `QasSelect`: Modificado para utilizar o `clearable` (botão de remover seleção) por padrão quando o campo **não for required**, antes estava apenas quando o campo tinha opção de pesquisar. ([#1394](https://github.com/bildvitta/asteroid/issues/1394))
- `Delete`: Alterado para o loading do plugin de delete estar apenas no botão do dialog ao invés da tela inteira. ([[#1304](https://github.com/bildvitta/asteroid/issues/1304)])
- `QasUploader`: modificado uso de `errors` dentro do `QasFormGenerator`, não utilize ele via `formGeneratorProps` mas sim via `errors`.
- `Delete - Plugin`: Alterado para bloquear o botão de cancelar quando estiver deletando o item. ([#1417](https://github.com/bildvitta/asteroid/issues/1417))

### Removido
- Removido opção "thirdPartyComponents" e "autoRemoveThirdDependencies", agora precisa instalar/desinstalar manualmente as libs necessárias para o `QasMap` e `QasChartView` no arquivo `asteroid.config.js`.
- `QasGalleryCard`:
  - removido propriedades `name` e `actionsMenuProps` em favor de usar a nova propriedade `headerProps`.
  - removido slot `header`, `actions` e `name`.
- `QasDelete`: Removido prop tag, sendo que agora o sempre será um botão. 

## [3.19.0-beta.17] - 18-11-2025
### Corrigido
- `QasInfiniteScroll`: Corrigido exibição do texto quando não há resultados, pois estava cortando ao definir tamanho máximo de altura. ([#1347](https://github.com/bildvitta/asteroid/issues/1347))

## [3.19.0-beta.16] - 12-11-2025
### Corrigido
- `formatPercent | money`: Corrigido formatação do campo percentual quando o valor é 0. ([#1350](https://github.com/bildvitta/asteroid/issues/1350))
- `QasTip`: Corrigido import do componente `QasTooltip` no qual estava sendo importado.

### Modificado
- `Delete - Plugin`: Alterado para bloquear o botão de cancelar quando estiver deletando o item. ([#1417](https://github.com/bildvitta/asteroid/issues/1417))

## [3.19.0-beta.15] - 11-11-2025
## BREAKING CHANGES
- `QasUploader`: removido propriedade `useValidateEncryptedPdf` e removido validação de PDF protegido por senha, uma vez que a validação retornava true para PDFs com certificado digital e para validar corretamente teria que fazer o uso de lib externa, agora o backend valida e retornamos isto via prop `errors`.
- `QasUploader`: modificado uso de `errors` dentro do `QasFormGenerator`, não utilize ele via `formGeneratorProps` mas sim via `errors`.

### Adicionado
- `QasUploader`: adicionado nova propriedade `errors`.
- `QasGalleryCard`: adicionado novo slot `image-bottom` para uso dentro do `QasUploader`.

### Modificado
- `QasUploader`: modificado uso de `errors` dentro do `QasFormGenerator`, não utilize ele via `formGeneratorProps` mas sim via `errors`.

### Removido
- `QasUploader`: removido propriedade `useValidateEncryptedPdf` e removido validação de PDF protegido por senha, uma vez que a validação retornava true para PDFs com certificado digital e para validar corretamente teria que fazer o uso de lib externa, agora o backend valida e retornamos isto via prop `errors`.

## [3.19.0-beta.14] - 05-11-2025
### Adicionado
- `QasUploader`:
  - adicionado propriedade `useValidateEncryptedPdf` para validar PDF com senha.
  - adicionado propriedade `fieldName` para normalizar `errors` dentro da propriedade `formGeneratorProps`.
- `QasGalleryCard`: adicionado propriedade `fileType` para definir o tipo de arquivo quando não conseguir exibir imagem.

### Corrigido
- `QasGalleryCard`: Corrigido exibição do tipo de arquivo quando não conseguir carregar imagem.

## [3.19.0-beta.13] - 03-11-2025
### Corrigido
- `QasFormView`: Corrigido validação para não exibir o dialog de descarte após a criação.
- `QasGalleryCard`: Corrigido lógica pra exibir o tipo do arquivo no card(pdf, docx, etc), onde pra determinado padrão de url não era possível obter o tipo anteriormente.

## [3.19.0-beta.12] - 29-10-2025
## BREAKING CHANGES
- `QasDelete`: Removido prop tag, sendo que agora o sempre será um botão. Validar lugares que utilizam pois pode ocorrer quebra no layout.

### Adicionado
- `QasFormView`: Adicionado propriedade `use-store` para dar a possibilidade de utilizar o componente sem a store do vuex/pinia. ([#1083](https://github.com/bildvitta/asteroid/issues/1083))
- `QasSelectListDialog`:
  - Adicionado model chamado `select-list-model` com os itens selecionados dentro do dialog.
  - Adicionado o método `toggleDialog` no define expose.
- `QasToggle`: Adicionado prop `title` para ter a possibilidade de ter um título acima do toggle. ([#1316](https://github.com/bildvitta/asteroid/issues/1316))
- `QasListView`: Adicionado refetch automático após deleção de itens quando `use-store` está desabilitado (`false`). ([#1404](https://github.com/bildvitta/asteroid/issues/1404))
- `QasDelete`: Adicionado prop `buttonProps` para repassar as propriedades para o botão para o `QasBtn`.
- `container.scss`: Adicionado padding-bottom no container pra quando existir o botão do gleap, pra o botão não sobrepor o conteúdo da página.

### Corrigido
- `QasActions`: Corrigido tamanho do botão quando passado via props e utilizado junto com `useEqualWidth`. ([#1400](https://github.com/bildvitta/asteroid/issues/1400))
- `QasSelectListDialog`:
  - Corrigido slots do dialog que não funcionavam.
  - Corrigido alinhamento do botão de adicionar item quando não se tem label no header.
- `QasNumericInput`:
  - Corrigido exibição do input, no qual exibia o conteúdo da lib `Autonumeric` ao dar hover, sendo que deve ser exibida apenas quando tem foco ou valor no campo. ([[#1403](https://github.com/bildvitta/asteroid/issues/1403)])
  - Corrigido inconsistência de valores entre navegação por Tab e clique ao perder foco, garantindo que ambos métodos produzam o mesmo resultado.
  - Corrigido precisão decimal no model para modo percentual, onde o `places` agora controla corretamente as casas decimais do valor final (places=2 resulta em 4 casas decimais para percentuais, ex: 0.0133).
- `QasAlert`: Corrigido para remover do HTML o componente quando ele for fechado (prop `useCloseBtn`). ([#1381](https://github.com/bildvitta/asteroid/issues/1381))
- `QasSelect`: Corrigido uso de badges na opção, no qual quebrava quando utilizado como objeto ao invés de função. ([#1329](https://github.com/bildvitta/asteroid/issues/1329))
- `QasFormView`: Corrigido comportamento do dialog de descarte de alterações sendo exibido em momentos errados. Para casos específicos, onde o model é manipulado externamente, é necessário atualizar o `cachedResult` para um comparativo é possível ter acesso a fn `updateUnsavedChangesCache` via inject ou via ref.

### Modificado
- `QasSelect`: Modificado para utilizar o `clearable` (botão de remover seleção) por padrão quando o campo **não for required**, antes estava apenas quando o campo tinha opção de pesquisar. ([#1394](https://github.com/bildvitta/asteroid/issues/1394))
- `Delete`: Alterado para o loading do plugin de delete estar apenas no botão do dialog ao invés da tela inteira. ([[#1304](https://github.com/bildvitta/asteroid/issues/1304)])

### Removido
- `QasDelete`: Removido prop tag, sendo que agora o sempre será um botão.

## [3.19.0-beta.11] - 16-10-2025
### Corrigido
- `humanize`: corrigido função para formatar a máscara de CNPJ, aceitando letras. Função usada por exemplo no `QasGridGenerator`, `QasTableGenerator`.

## [3.19.0-beta.10] - 15-10-2025
### Corrigido
- `QasInput`: Corrigido máscara no caso que precisa alternar entre diversas máscaras, onde acontece por exemplo alternando entre CPF e CNPJ.

## [3.19.0-beta.9] - 10-10-2025
### Modificado
- `QasInput`: Modificado máscara de CNPJ para aceitar letras conforme o novo padrão.

### Corrigido
- `QasGridGenerator`: Corrigido container de fields no qual não respeitava o tamanho do container pai.

## [3.19.0-beta.8] - 07-10-2025
### Adicionado
- `QasAlert`: Adicionado possibilidade do componente ter vários `QasBtn` ou `RouterLink`.
- `QasPdfViewer`: Adicionado componente para renderização de documentos PDF diretamente no navegador com estados de loading, erro e suporte a múltiplas páginas.

### Corrigido
- `QasSingleView`: corrigido problema do loading travar a tela toda no dialog, foi resolvido adicionando classe "relative-position" no container. ([#1342](https://github.com/bildvitta/asteroid/issues/1342))
- `QasFormGenerator`: corrigido comportamento quando `fields` está vazio, agora não exibe nenhum campo ao invés de exibir todos os campos disponíveis. ([#1361](https://github.com/bildvitta/asteroid/issues/1361))
- `QasSelect`: Corrigido cor de foco nas opções durante a navegação com teclado (teclas de seta para cima/baixo).
- `QasNumericInput`: Corrigido foco do campo, pois quando utilizado via tab, o campo não focava.

## [3.19.0-beta.7] - 26-09-2025
## BREAKING CHANGES
- Rever lugares que utilizam lazy loading nos campos, pois pode gerar breaking changes.

### Corrigido
- `QasSelect`: Corrigido forma no qual é setado uma opção padrão quando se tem apenas um item e o campo seja múltiplo, esteva setando como string, sendo que deveria ser como array com uma única opção dentro.
- `QasFormGenerator`: corrigido erro ao não passar a propriedade `columns` quando há subset. ([#1299](https://github.com/bildvitta/asteroid/issues/1299))

### Modificado
- `QasExpansionItem`: Modificado para o expansion não ter box e sim bordas quando estiver dentro de um dialog. ([#1373](https://github.com/bildvitta/asteroid/issues/1373))
- `QasSelect`: Modificado a forma na qual se é setado o valor default do campo, validando também os campos que são lazy loading e as opções recebidas. [[#1324](https://github.com/bildvitta/asteroid/issues/1324)]

## [3.19.0-beta.6] - 10-09-2025
## BREAKING CHANGES
- `QasGalleryCard`:
  - removido propriedades `name` e `actionsMenuProps` em favor de usar a nova propriedade `headerProps`.
  - removido slot `header`, `actions` e `name`.
  - modificado slot `image-error` para `image-error-message` para o nome fazer mais sentido com o que de fato faz.
- rever todos locais para passar a propriedade `galleryCardProps` no novo padrão do `QasGalleryCard`:
  - QasGalleryCard.
  - QasUploader.
  - QasGallery.
- Rever todos locais que usam `QasBtn` dentro de componentes de usam `QasInput` ou `QasTableGenerator` pois elas alteram a prop `size` default via provide `btnPropsDefaults`.
- Muitas mudanças no `QasUploader`, verificar se nada quebra e remover validações manuais referentes a propriedades `accept` e `maxFileSize`.

### Adicionado
- `QasActions`: adicionado possibilidade de passar props dos botões sem necessariamente precisar abrir slot. ([#1332](https://github.com/bildvitta/asteroid/issues/1332))
- `QasInfiniteScroll`: adicionado função `fetchList` no expose. ([#1315](https://github.com/bildvitta/asteroid/issues/1315))
- `QasUploader`:
  - adicionado propriedades:
    - useEmptyResultText
    - useGalleryCard
    - useHeader
    - maxFileSize (ja existia no QUploader mas agora foi definida no componente).
  - adicionado novo slot `bottom-list`.
  - adicionado evento `rejected` (ja existia no QUploader mas agora foi definida no componente).
  - adicionado `files` via parâmetros no método interno `addFiles`.
  - adicionado validações nativas pom feedback `notify` para props `accept` e `maxFileSize`.
- `QasBtn`: adicionado propriedade `size`. ([#1345](https://github.com/bildvitta/asteroid/issues/1345))
- `ui/src/css/mixins/set-button.scss`: adicionado novo parâmetro `size`.
- `QasGalleryCardProps`:
  - adicionado propriedade `headerProps`.
  - adicionado novo slot `image-error-container`.
- `QasGallery`:
  - adicionado nova propriedade `showMoreAlign`.
  - adicionado efeito no hover da img do QasGalleryCard para feedback visual.
- `QasHeader`: adicionada propriedade `useEllipsis`.
- `QasStepper`:
  - Adicionado prop `useVertical` para ter possibilidade de utilizá-lo na vertical.
  - Adicionado prop `headerNav` (substituído o attrs) para controle de navegação entre as steps.

### Corrigido
- `QasUploader`:
  - corrigido exibição do QasGalleryCard quando um upload falha.
  - corrigido exibição no QasGalleryCard para arquivos que não carregam no QImg, ex: PDF, DOCX.
- `QasGallery`: corrigido elemento "ver mais", que estava alocado em um elemento com gutter que gerava inconsistência de tamanho.

### Modificado
- `QasUploader`:
  - modificado layout da área de drag and drop.
  - modificado comportamento da propriedade `columns` que antes fazia um merge com o que era passado de fora do componente e o default interno, agora o default só existe caso não seja passado pelo lado de fora.
- `ui/src/plugins/notify-error/NotifyError.js`: modificado ícone de erro para `sym_r_error`.
`QasBtn`:
  - modificado cursor `disabled` para `progress` quando o botão esta com estado `loading`.
  - modificações para propriedades `color`, `size` e `variant` terem padrões defaults configuráveis via provide `btnPropsDefaults`.
- Modificado `QTooltip` para `QasTooltip`:
  - QasCopy.
  - QasTransfer.
- `QasFilters`: alterado size do botão dentro do menu para `sm`.
- `QasInput`: alterado propriedades padrões do QasBtn via provide `btnPropsDefaults`:
  - size.
  - variant.
  - color.
- `QasTableGenerator`: alterado propriedade padrão `size` do QasBtn via provide `btnPropsDefaults`.
- `QasGalleryCard`:
  - modificado header para utilizar componente `QasHeader` através da propriedade `headerProps`.
  - modificado default da prop `errorIcon` para `sym_r_error`.
  - modificado default da prop `errorMessage` para `Falha ao carregar imagem.`.
  - modificado slot `image-error` para `image-error-message` para o nome fazer mais sentido com o que de fato faz.
  - modificado layout para outlined quando estiver dentro do QasDialog.
- `QasGallery`: mudanças necessárias para se adaptar as mudanças do `QasGalleryCard`.
- `QasHeader`: modificado logica para não mostrar elemento do header em casos de conteúdos vazio pela computada `hasHeaderContent`.
- `QasStepper`: Modificado exibição da cor primária nas linhas de cada step.

### Removido
- `QasGalleryCard`:
  - removido propriedades `name` e `actionsMenuProps` em favor de usar a nova propriedade `headerProps`.
  - removido slot `header`, `actions` e `name`.

## [3.19.0-beta.5] - 29-08-2025
### Corrigido
- `QasActionsMenu`: corrigido alinhamento quando está dentro de outro container, como por exemplo o `QasPageHeader`. ([#1337](https://github.com/bildvitta/asteroid/issues/1337))
- `QasReportsFilters`: corrigido imports dos componentes internos.

## [3.19.0-beta.4] - 28-08-2025
## BREAKING CHANGE
- [`QasFormGenerator`, `QasGridGenerator`]: lógicas de fieldset/subset adicionadas no composable `useGenerator`, validar se nada quebra.

### Adicionado
- `QasGridGenerator`: ([#1325](https://github.com/bildvitta/asteroid/issues/1325))
 - Adicionado opção de separador entre fieldset ou subset.
 - Adicionado opção de tip nos títulos dos campos através do fieldsProps.
 - Adicionado opção de alterar a tipografia do valor do campos através do fieldsProps.
- `QasTip`: Adicionado componente de dica.
- `QasToolTip`: Adicionado componente de tooltip.

### Corrigido
- `QasGridGenerator`: Correção de espaçamento do gutter quando modo `useInline: true`. ([#1325](https://github.com/bildvitta/asteroid/issues/1325))
- `QasFormGenerator`: gutter entre subsets agora é `md`.

### Modificado
- `QasFormGenerator`: Logica de fieldset/subset movida para composable `useGenerator`.

## [3.19.0-beta.3] - 22-08-2025
## BREAKING CHANGES
- `dateTime`: Alguns lugares podem apresentar divergências na forma de exibição.
- `QasNumericInput`:
  - corrigido props `icon` e `iconRight` que estavam invertidas (iconRight mostrava a esquerda).

### Adicionado
- `QasInput`: adicionado prop `use-copy` para adicionar nativamente botão de ação "copiar" no input, que funciona apenas em conjunto da prop readonly ([1326](https://github.com/bildvitta/asteroid/issues/1326)).
- `QasTableGenerator`: Adicionado novo recurso de seleção de linhas na tabela através das novas props `useSelection`, `useObjectSelectedModel` e pelo model `v-model:selected`.

### Corrigido
- `QasNumericInput`:
  - corrigido estilo do componente quando usado com ícone no slot.
  - corrigido bug quando apagava 2 vezes os valores do campo, onde a label não decima para a posição padrão de quando fica sem valor e o model mesmo apagado ficava com valor `0`.
  - corrigido props `icon` e `iconRight` que estavam invertidas (iconRight mostrava a esquerda).
- `QasBtn`: Declarado prop `readonly` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes).
- `QasDateTimeInput`: Declarado props `readonly` e `disable` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes)
- `QasInput`: Declarado prop `readonly` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes).
- `QasSelect`: Declarado as prop `readonly`, `disable`e `multiple` para não precisar manipula-las via `$attrs`, facilitando e corrigindo problemas em alguns cenários (sem mudanças para o uso dos componentes).
- `QasChartView`:
  - Corrigido comportamento no qual quando se era passado `options` personalizadas para o gráfico, aplicavam as mesmas customizações para os demais gráficos do mesmo tipo.
  - Corrigido nome do slot para exibição do botão de filtrar, sendo o correto `actions`.

### Modificado
- `QasAlert`: Modificado comportamento para não ter box quando estiver dentro de um `QasDialog`. ([#1288](https://github.com/bildvitta/asteroid/issues/1288))
- `QasTableGenerator`: Alterado cor do título da coluna (th) para o `grey-10`. ([#1287](https://github.com/bildvitta/asteroid/issues/1287))
- `dateTime | PvLayoutNotificationCard`: Alterado padrão de data para `"dd/MM/yyyy 'às' HH:mm:ss"` para melhorar a legibilidade. ([#1294](https://github.com/bildvitta/asteroid/issues/1294))
- `QasCard`: Modificado estilo do card para utilizar bordas ao invés de box quando estiver dentro de um `QasDialog`. ([#1289](https://github.com/bildvitta/asteroid/issues/1289))
- `QasSelect`: removido ícone arrow-down (a direita) quando esta `readonly`. ([#1309](https://github.com/bildvitta/asteroid/issues/1309))
- `QasSelect`: removido ícone searchable quando readonly ou disable.
- [`QasSelect`, `QasInput`, .q-field]:
  - removido cor de borda diferente no hover quando readonly.
  - setado cor grey-6 para borda do readonly.

## [3.19.0-beta.2] - 01-08-2025 <!-- N/A -->
### Corrigido
`QasSelectListDialog`:
  - Corrigido espaçamento abaixo do header, no qual estava adicionando sem necessidade;
  - Corrigido import do componente de `QasHeader`.

## [3.19.0-beta.1] - 31-07-2025
### Adicionado
- `QasNestedFields`: Adicionado nova prop `use-header` para controlar quando irá ter ou não o header em cada linha.
- `QasSelectListDialog`: Adicionado novo slot `selected-content` para poder personalizar todos os itens adicionados.

### Modificado
- `QasSelectListDialog`: Modificado header para utilizar o componente `QasHeader`.
- `QasNumericInput`: Alterado input para aplicar estilo tanto de `readonly` quanto de `disabled`, sendo que antes só aplicava `disabled` mesmo quando enviasse a prop `readonly`.

## [3.19.0-beta.0] - 11-07-2025
## BREAKING CHANGES
- Todos locais que usarem component dinâmico `<component :is="QasBtn" />` do asteroid, precisa ser importado do asteroid `import { QasBtn } from 'asteroid'`, porque o auto import não consegue identificar o componente sozinho.
- Removido opção "thirdPartyComponents" e "autoRemoveThirdDependencies", agora precisa instalar/desinstalar manualmente as libs necessárias para o `QasMap` e `QasChartView`.
- Instalar dependências manualmente para os componentes `QasMap` e `QasChartView`.
- `QasDelete`: propriedade agora aceita receber um componente além de string, caso esteja passando algum component do asteroid com string, usar import diretamente.
- Remover personalização do `quasar.variables.css`.

### Adicionado
- Adicionado suporte para Vite, mantendo suporte para Webpack.
- `build/*`: adicionado suporte para lançar versões alpha do asteroid para testes mais rápidos e precisos.
- Adicionado cores defaults internamente no componente sem necessidade de fazer isto no projeto no arquivo `quasar.variables.scss`

### Modificado
- Modificado arquivo `asteroid.config.js`.
- `QasMap`: modificações para utilizar plugin do import `@fawmi/vue-google-maps` dentro do próprio arquivo .vue, ao invés de utilizar no boot.
- `app-extension/src/boot/error-pages.js`: modificado import estático de paginas para import dinâmico.
- Mudanças necessárias para dar suporte ao vite, como:
  - modificado `modules.exports` por `export default`.
  - import manual de todos os componentes do asteroid internamente.
- `QasField`: Modificado imports estático de componentes para import dinâmico com `defineAsyncComponent` e alterado para composition API.
- import manual de componentes/scripts do Asteroid:
  - QasAlert
  - QasAppMenu
  - PvAppMenuDropdown
  - QasAppUser
  - QasBadge
  - QasBoardGenerator
  - QasDropdown
  - QasCardImage
  - QasCard
  - QasChartView
  - QasCheckbox
  - QasCopy
  - QasDateTimeInput
  - QasDelete
  - QasDialog
  - QasDrawer
  - QasExpansionItem
  - QasFilters
  - QasFormGenerator
  - QasFormView
  - QasGalleryCard
  - QasGallery
  - PvGalleryCarouselDialog
  - PvGalleryDeleteDialog
  - QasGridGenerator
  - QasHeader
  - QasInfiniteScroll
  - PvLayoutNotificationCard
  - PvLayoutNotificationsDrawer
  - QasListItems
  - QasNestedFields
  - QasPasswordInput
  - QasRadio
  - QasSearchBox
  - QasSearchInput
  - QasSelectFilter
  - QasSelectListDialog
  - PvSelectListCheckbox
  - QasSelect
  - QasSignaturePad
  - QasSingleView
  - QasStepperFormView
  - QasTableGenerator
  - QasTabsGenerator
  - QasTextTruncate
  - QasToggleVisibility
  - QasTreeGenerator
  - QasUploader
  - QasUploader
  - QasWelcome
  - QasWhatsappLink
  - ui/src/composables/use-notifications.js
  - ui/src/composables/use-query-cache.js
  - ui/src/pages/ErrorComponent.vue
  - ui/src/pages/Forbidden.vue
  - ui/src/pages/NotFound.vue
  - ui/src/pages/ServerError.vue
  - ui/src/pages/Unauthorized.vue
  - app-extension/src/boot/notifications.js
  - app-extension/src/boot/query-cache.js
  - app-extension/src/boot/register.js
  - app-extension/src/defaults/default-asteroid-config.js
  - app-extension/src/helpers/asteroid-config-handler.js
  - app-extension/src/helpers/install-third-party-components.js
  - app-extension/src/helpers/laravel-echo.js
  - app-extension/src/helpers/notifications-channels.js
  - ui/src/asteroid.js
- Modificado import do lodash para import default:
  - QasFormView
  - QasGridGenerator
  - QasPageHeader
  - QasSelectList
  - QasSignaturePad
  - mixins/search-filter.js

### Removido
- Removido opção "thirdPartyComponents" e "autoRemoveThirdDependencies", agora precisa instalar/desinstalar manualmente as libs necessárias para o `QasMap` e `QasChartView` no arquivo `asteroid.config.js`.

## [3.18.2] - 31-07-2025
### Corrigido
`QasSelectListDialog`: Corrigido espaçamento abaixo do header, no qual estava adicionando sem necessidade.

## [3.18.1] - 30-07-2025
### Adicionado
- `QasNestedFields`: Adicionado nova prop `use-header` para controlar quando irá ter ou não o header em cada linha.
- `QasSelectListDialog`: Adicionado novo slot `selected-content` para poder personalizar todos os itens adicionados.

### Modificado
- `QasSelectListDialog`: Modificado header para utilizar o componente `QasHeader`.
- `QasNumericInput`: Alterado input para aplicar estilo tanto de `readonly` quanto de `disabled`, sendo que antes só aplicava `disabled` mesmo quando enviasse a prop `readonly`.

## [3.18.0] - 02-07-2025
## BREAKING CHANGE
- `QasInput`: alterado ordem da prop `iconRight` que estava adicionando na esquerda e não na direita, verificar lugares.
- Alterar `quasar.variables.scss`, nova cor do `$negative` sendo `$red-14`.
- `QasAppMenu`:
  - adicionado nova propriedade `useHomeItem` com default `true` para forçar padronização no item de inicio, é necessário remover esse item da prop "items" caso esteja sendo adicionado.
  - não esquecer de configurar corretamente a prop `homeRoute`.
- `QasAlert/QasInfo`: removido `QasInfo` que agora foi mesclado com o `QasAlert`, olhar documentação.
- `QasGalleryCard`: removido prop `card`, no qual foi transformado em duas props separadas, `url` e `name`.
- `QasFilters`: removido slot `right-side`, agora a forma recomendada para quando precisar utilizar itens ao lado do componente, utilize o grid em conjunto com a prop `useFullContent`. Contém um exemplo do uso na docs.
- `QasGallery/QasUploader`: possível breaking change ao repassar a prop `galleryCardProps`.
- `QasSearchBox`: modificado prop `height` para `maxHeight`, pois o nome da prop era `height`, mas internamente adicionava o style como `maxHeight`.
- `QasTableGenerator`:
  - removido prop `stickyHeaderTableHeight`, agora controla o tamanho da tabela pela prop `maxHeight`.
  - olhar todos lugares que usam slot de actions/componentes e passar a utilizar pelas propriedades `fieldsProps` e `actionsMenuProps`.
  - por padrão toda coluna terá `sort`, mas nem toda coluna precisa de sort, então é necessário olhar caso a caso e remover quando desnecessário.
- `QasBtn`: modificado a forma de exibição do loading, agora é exibido no lugar do ícone. Poderá haver breaking change visual. Verificar lugares onde é utilizado o `use-ellipsis` também.

### Adicionado
- `QasErrorMessage`: adicionado novo componente para mostrar mensagem de erros de forma padronizada.
- `QasRadio`: adicionado propriedades `error` e `errorMessage` em conjunto do componente `QasErrorMessage`.
- `css/mixins/set-error-message`: mixin para aplicar os estilos diretamente no css.
- `QasTableGenerator`: 
  - Adicionado prop `useVirtualScroll` para aplicar a renderização dinâmica dos elementos na tabela.
  - Adicionado prop `maxHeight` para definir o tamanho da tabela em casos de `useStickyHeader` e `useVirtualScroll`.
  - adicionado propriedade `fieldsProps` para controle de componente interno sem uso de slot.
  - adicionado propriedade `actionsMenuProps` para adicionar por padrão coluna `actions` com componente `QasActions` na ultima coluna com alinhamento á direita.
  - adicionado sort default em todas colunas.
  - adicionado scroll gradiente no eixo x.
- `helpers/color`: adicionado helper para cores.
- `helpers/setScrollGradient` adicionado helper para adicionar gradiente em áreas com scroll.
- `QasAlert/QasInfo`: (adicionado|mesclado):
  - buttonProps
  - routerLinkProps
  - useBox
  - useRegex
  - slot "default"
- `QasAppUser`:
  - adicionado prop `useHomeItem` para padronizar "inicio" no menu.
  - adicionado prop `homeRoute` para configurar a rota de "inicio".
  - adicionado propriedade "useDataOnSmallScreen".
- `QasCheckbox`: adicionado props:
  - disable
  - usaAsTitle
- `QasSelectFilter`: adicionado propriedade `multiple`.
- `css/components/menu`: adicionado estilo para adc separador em q-list > q-item dentro do `q-menu`.
- `QasAppMenu`: adicionado nova propriedade `useHomeItem` com default `true` para forçar padronização no item de inicio, é necessário remover esse item da prop "items" caso esteja sendo adicionado.
- `QasListView`:
  - Adicionado propriedade `use-store` para dar a possibilidade de utilizar o componente sem a store do vuex/pinia.
  - adicionado nova prop chamada `emptyResultText` para controlar o texto do `QasEmptyResultText` em casos que não tenha resultado.
- `QasGalleryCard`: adicionado possibilidade para utilizar vídeos ao invés de imagens através da prop `useVideo`.
- `QasNestedFields`: adicionado possibilidade de usar o `buttonDestroyProps` como um callback.
- `QasFilters`:
 - adicionado prop `useFullContent` para que o componente ocupe 100%, recomendado para quando precisar utilizar grids.
 - adicionado prop `listenerQueryKeys` que serão chaves que o componente deve ouvir sempre que houver mudanças na query, para que bata a api novamente de `/filters`.
- `QasTextTruncate`: Adicionado campo de busca no dialog do componente ao conter mais de 12 itens na lista.
- `QasSearchBox`: Adicionado prop `maxHeight` para definir uma altura máxima para o componente.
- `QasFormGenerator`: adicionado possibilidade de ter subseções (`subset`) dentro de uma seção (`fieldset`). Para mais detalhes, consultar a documentação.
- `QasReportsFilters`: adicionado componente responsável por lidar com filtros em relatórios.
- `boot/before-each`: boot responsável por atualizar o histórico de rotas e validar filtros padrões ao ser redirecionado para mesma rota.

### Corrigido
- `QasInput`: alterado ordem da prop `iconRight` que estava adicionando na esquerda e não na direita.
- `QasSelectFilter`: corrigido atribuição do valor do model externo do componente.
- `QasPasswordInput`:
  - invertido ícone de toggle.
  - corrigido label que não ficava acima do ícone ao ter foco/ativo.
  - desabilitado botão de toggle enquanto não tem valor preenchido.
- [`QasActionsMenu`, `QasBtnDropdown`, `QasTreeGenerator`]: adicionado classe `qas-menu`para corrigir estilos.
- `QasAlert`: removido da obrigatoriedade da prop `text` para quando for usado slot não gerar erros.
- `QasAppMenu`: corrigido área de mouseover quando o menu list é pequeno.
- `QasUploader`: corrigido ação "removeUploadedFiles" que era usado via ref em um botão hidden, agora é usado via refs do QUploader.
- `css/menu`: alterado tamanho do icon que estava errado.
- `QasActionsMenu`:
  - adicionado validação no `q-list` do `qas-actions-menu` pra não exibir um `q-list` vazio quando só há um item.
  - corrigido exibição de loading no componente dentro do dropdown ao ter uma prop `loading: true`.
- `QasHeader`: corrigido exibição do container de descrição em casos de não ter `label` e `description`.
- `setDefaultFiltersBeforeEach`: corrigido método utilizado no before each de cada rota para validar caso tenha um filtro padrão a ser aplicado, pois antes caso eu tivesse um beforeEnter sem utilizar um `setDefaultFiltersBeforeEnter`, quebrava o redirecionamento.
- `QasCard`: Corrigido borda à esquerda dos cards que não possuem status.

### Modificado
- `QasSelect`:
  - ignorando propriedade `useChips` que vem através de `$attrs`.
  - adicionado separador nas options e modificado estilo de botão de ação.
- `QasBadge`:
  - alterado tipografia para `text-body2`.
  - adicionado atributo `data-table-ignore-hover` para uso no QasTableGenerator.
- `QasExpansionItem`: alterado borda para 1px.
- [`QasInput`, `QasSelect`, `QasSearchInput`]:
  - mudança de design quando com erro.
  - mudança de design no hover.
  - mudança de mensagem de erro utilizando o mixin `set-message-error`.
- alterado mensagem de erro para o componente `QasErrorMessage`:
  - QasExpansionItem
  - QasUploader
  - QasCheckbox
- `QasToggleVisibiliy`: alterado área de clique para não ser apenas no botão e sim em todo elemento.
- `QasAppMenu`:
  - adicionado nova propriedade `useHomeItem` com default `true` para forçar padronização no item de inicio.
  - diminuído espaçamento interno entre lista de itens, logo, avatar de usuário e módulos, para caber mais conteúdos.
  - diminuído espaçamento interno entre itens do menu.
  - quando o ponteiro do mouse estiver encima da barra de scroll, o menu não será mais expandido, habilitando scroll em modo mini.
  - adicionado linear gradiente na parte superior e inferior da listagem de itens do menu quando existe scroll para feedback melhorado.
  - modificado estrutura do HTML, agora o lista de itens não tem altura fixa definida, pega todo o espaço disponível.
  - drawer no mobile quando aberto mostra a logo mini ao lado do botão de fechar.
  - `QasAppUser` agora mostra nome/email mesmo no mobile.
- `webkit-scrollbar`: alterado background para `transparent`.
- Mudanças de estilo no `NotifyError` e `NotifySuccess`.
`QasActionsMenu`: adicionado separador entre itens.
- `QasCheckbox`: modificado estilos.
- `QasRadio`: modificado estilos.
- `QasDateTimeInput`: modificado cor de ícone para primary.
- `QasPasswordInput`: desabilitado botão de toggle enquanto não tem conteúdo.
- `QasSelectList`: modificado estilos.
- `QasToggle` modificado estilos.
- `QasTreeGenerator`: adicionado separador nas ações.
- `QasAlert/QasInfo`: modificado cor de error para `negative`.
- `QasSearchBox`: modificado prop `height` para `maxHeight`, pois o nome da prop era `height`, mas internamente adicionava o style como `maxHeight`.
- `QasTextTruncate`: modificado espaçamento entre texto e botão "ver mais" de sm para xs.
- `QasTableGenerator`: modificado estilos e estilos de hover nas linhas
- [`QasBtn`, `QasToggleVisibility`]: adicionado atributo `data-table-ignore-tr-hover` para uso no QasTableGenerator.
- `QasCopy`: adicionado atributo `data-table-hover` para uso no QasTableGenerator.
- `QasBtn`: modificado a forma de exibição do loading, agora é exibido no lugar do ícone. Poderá haver breaking change visual. Verificar lugares onde é utilizado o `use-ellipsis` também.
- `container.scss`: alterado tamanho máximo do container utilizado nas telas para 1920px.
- `QasCard`: Modificado espaçamento vertical do card, será `sm` somente caso tenha status ou o expansivo.

### Removido
- `QasTableGenerator`:
  - removido prop `stickyHeaderTableHeight`, agora controla o tamanho da tabela pela prop `maxHeight`.
  - removido possibilidade de ter sort na tabela.
- `QasAlert/QasInfo`: removido `QasInfo` que agora foi mesclado com o `QasAlert`, olhar documentação.
- `QasGalleryCard`: removido prop `card`, no qual foi transformado em duas props separadas, `url` e `name`.
- `QasFilters`: removido slot `right-side`, agora a forma recomendada para quando precisar utilizar itens ao lado do componente, utilize o grid em conjunto com a prop `useFullContent`. Contém um exemplo do uso na docs.
- `boot/history`: removido boot de history, sendo que agora os métodos utilizados estão no boot `before-each.js`.

## [3.18.0-beta.9] - 26-06-2025
### Adicionado
- `QasListView`: Adicionado propriedade `use-store` para dar a possibilidade de utilizar o componente sem a store do vuex/pinia.

## [3.18.0-beta.8] - 10-06-2025
### Modificado
- `QasCard`: Modificado espaçamento vertical do card, será `sm` somente caso tenha status ou o expansivo.

### Corrigido
- `QasCard`: Corrigido borda à esquerda dos cards que não possuem status.

## [3.18.0-beta.7] - 30-05-2025
### Corrigido
- `QasBtn`: ajustado espaçamento do botão, estava causando quebra em alguns lugares como no menu da aplicação.
- `PvTableGeneratorTd`: corrigido forma de import dos componentes utilizados na tabela, os imports foram removidos da computada, o que fazia com que o componente fosse renderizado novamente sempre que a computada atualizava.
- `setDefaultFiltersBeforeEach`: corrigido método utilizado no before each de cada rota para validar caso tenha um filtro padrão a ser aplicado, pois antes caso eu tivesse um beforeEnter sem utilizar um `setDefaultFiltersBeforeEnter`, quebrava o redirecionamento.

## [3.18.0-beta.6] - 27-05-2025
### Adicionado
- `QasReportsFilters`: adicionado componente responsável por lidar com filtros em relatórios.
- `boot/before-each`: boot responsável por atualizar o histórico de rotas e validar filtros padrões ao ser redirecionado para mesma rota.

### Modificado
- `container.scss`: alterado tamanho máximo do container utilizado nas telas para 1920px.

### Removido
- `boot/history`: removido boot de history, sendo que agora os métodos utilizados estão no boot `before-each.js`.

## [3.18.0-beta.5] - 13-05-2025
### Adicionado
- `QasFormGenerator`: adicionado possibilidade de ter subseções (`subset`) dentro de uma seção (`fieldset`). Para mais detalhes, consultar a documentação.

## [3.18.0-beta.4] - 06-05-2025
## BREAKING CHANGE
- `QasBtn`: modificado a forma de exibição do loading, agora é exibido no lugar do ícone. Poderá haver breaking change visual. Verificar lugares onde é utilizado o `use-ellipsis` também.

### Corrigido
- `QasActionsMenu`: 
  - adicionado validação no `q-list` do `qas-actions-menu` pra não exibir um `q-list` vazio quando só há um item.
  - corrigido exibição de loading no componente dentro do dropdown ao ter uma prop `loading: true`.
- `QasHeader`: corrigido exibição do container de descrição em casos de não ter `label` e `description`.
- `QasTableGenerator`: 
  - adicionado `stopPropagation` e `preventDefault` ao clicar em um `QasBtn` ou `QasActionsMenu` para não chamar o `rowRouteFn` ou `rowClick` da tabela. 
  - corrigido hover da linha no Safari onde era pego toda tabela ao invés da própria linha.

### Removido
- `QasTableGenerator`: removido possibilidade de ter sort na tabela.

### Modificado
- `QasBtn`: modificado a forma de exibição do loading, agora é exibido no lugar do ícone. Poderá haver breaking change visual. Verificar lugares onde é utilizado o `use-ellipsis` também.

## [3.18.0-beta.3] - 24-04-2025
### Corrigido
- [`QasActionsMenu`, `QasBtnDropdown`, `QasTreeGenerator`]: adicionado classe `qas-menu`para corrigir estilos.
- `QasAlert`: removido da obrigatoriedade da prop `text` para quando for usado slot não gerar erros.
- `QasAppMenu`: corrigido área de mouseover quando o menu list é pequeno.
- `QasTableGenerator`:
  - corrigido prop `text` default quando usando componente QasTextTruncate via `fieldsProps`.
  - remove automaticamente sortable de todas colunas quando tem menos de 2 resultados, uma vez que não faz sentido ter sort nestes casos.
- `QasUploader`: corrigido ação "removeUploadedFiles" que era usado via ref em um botão hidden, agora é usado via refs do QUploader.
- `css/menu`: alterado tamanho do icon que estava errado.

## [3.18.0-beta.2] - 17-04-2025
## BREAKING CHANGE
- `QasSearchBox`: modificado prop `height` para `maxHeight`, pois o nome da prop era `height`, mas internamente adicionava o style como `maxHeight`.
- `QasTableGenerator`:
  - olhar todos lugares que usam slot de actions/componentes e passar a utilizar pelas propriedades `fieldsProps` e `actionsMenuProps`.
  - por padrão toda coluna terá `sort`, mas nem toda coluna precisa de sort, então é necessário olhar caso a caso e remover quando desnecessário.

### Adicionado
- `QasTextTruncate`: Adicionado campo de busca no dialog do componente ao conter mais de 12 itens na lista.
- `QasSearchBox`: Adicionado prop `maxHeight` para definir uma altura máxima para o componente.
- `QasTableGenerator`:
  - adicionado propriedade `fieldsProps` para controle de componente interno sem uso de slot.
  - adicionado propriedade `actionsMenuProps` para adicionar por padrão coluna `actions` com componente `QasActions` na ultima coluna com alinhamento á direita.
  - adicionado sort default em todas colunas.
  - adicionado scroll gradiente no eixo x.

### Modificado
- `QasSearchBox`: modificado prop `height` para `maxHeight`, pois o nome da prop era `height`, mas internamente adicionava o style como `maxHeight`.
- `QasTextTruncate`: modificado espaçamento entre texto e botão "ver mais" de sm para xs.
- `QasTableGenerator`: modificado estilos e estilos de hover nas linhas
- [`QasBtn`, `QasToggleVisibility`]: adicionado atributo `data-table-ignore-tr-hover` para uso no QasTableGenerator.
- `QasCopy`: adicionado atributo `data-table-hover` para uso no QasTableGenerator.
- `QasBadge`: adicionado atributo `data-table-ignore-hover` para uso no QasTableGenerator.

## [3.18.0-beta.1] - 16-04-2025
## BREAKING CHANGE
- `QasAppMenu`:
  - adicionado nova propriedade `useHomeItem` com default `true` para forçar padronização no item de inicio, é necessário remover esse item da prop "items" caso esteja sendo adicionado.
  - não esquecer de configurar corretamente a prop `homeRoute`.
- `QasAlert/QasInfo`: removido `QasInfo` que agora foi mesclado com o `QasAlert`, olhar documentação.
- `QasGalleryCard`: removido prop `card`, no qual foi transformado em duas props separadas, `url` e `name`.
- `QasFilters`: removido slot `right-side`, agora a forma recomendada para quando precisar utilizar itens ao lado do componente, utilize o grid em conjunto com a prop `useFullContent`. Contém um exemplo do uso na docs.
- `QasGallery/QasUploader`: possível breaking change ao repassar a prop `galleryCardProps`.

### Adicionado
- `helpers/color`: adicionado helper para cores.
- `helpers/setScrollGradient` adicionado helper para adicionar gradiente em áreas com scroll.
- `QasAlert/QasInfo`: (adicionado|mesclado):
  - buttonProps
  - routerLinkProps
  - useBox
  - useRegex
  - slot "default"
- `QasAppUser`:
  - adicionado prop `useHomeItem` para padronizar "inicio" no menu.
  - adicionado prop `homeRoute` para configurar a rota de "inicio".
- `QasCheckbox`: adicionado props:
  - disable
  - usaAsTitle
- `QasSelectFilter`: adicionado propriedade `multiple`.
- `css/components/menu`: adicionado estilo para adc separador em q-list > q-item dentro do `q-menu`.
- `QasAppMenu`: adicionado nova propriedade `useHomeItem` com default `true` para forçar padronização no item de inicio, é necessário remover esse item da prop "items" caso esteja sendo adicionado.
- `QasAppUser`: adicionado propriedade "useDataOnSmallScreen".
- `QasListView`: adicionado nova prop chamada `emptyResultText` para controlar o texto do `QasEmptyResultText` em casos que não tenha resultado.
- `QasGalleryCard`: adicionado possibilidade para utilizar vídeos ao invés de imagens através da prop `useVideo`.
- `QasNestedFields`: adicionado possibilidade de usar o `buttonDestroyProps` como um callback.
- `QasFilters`: 
 - adicionado prop `useFullContent` para que o componente ocupe 100%, recomendado para quando precisar utilizar grids.
 - adicionado prop `listenerQueryKeys` que serão chaves que o componente deve ouvir sempre que houver mudanças na query, para que bata a api novamente de `/filters`.

### Corrigido
- `QasPasswordInput`:
  - invertido ícone de toggle.
  - corrigido label que não ficava acima do ícone ao ter foco/ativo.
  - desabilitado botão de toggle enquanto não tem valor preenchido.

### Modificado
- `QasAppMenu`:
  - adicionado nova propriedade `useHomeItem` com default `true` para forçar padronização no item de inicio.
  - diminuído espaçamento interno entre lista de itens, logo, avatar de usuário e módulos, para caber mais conteúdos.
  - diminuído espaçamento interno entre itens do menu.
  - quando o ponteiro do mouse estiver encima da barra de scroll, o menu não será mais expandido, habilitando scroll em modo mini.
  - adicionado linear gradiente na parte superior e inferior da listagem de itens do menu quando existe scroll para feedback melhorado.
  - modificado estrutura do HTML, agora o lista de itens não tem altura fixa definida, pega todo o espaço disponível.
  - drawer no mobile quando aberto mostra a logo mini ao lado do botão de fechar.
  - `QasAppUser` agora mostra nome/email mesmo no mobile.
- `webkit-scrollbar`: alterado background para `transparent`.
- Mudanças de estilo no `NotifyError` e `NotifySuccess`.
`QasActionsMenu`: adicionado separador entre itens.
- `QasCheckbox`: modificado estilos.
- `QasRadio`: modificado estilos.
- `QasDateTimeInput`: modificado cor de ícone para primary.
- `QasPasswordInput`: desabilitado botão de toggle enquanto não tem conteúdo.
- `QasSelectList`: modificado estilos.
- `QasSelect`: adicionado separador nas options e modificado estilo de botão de ação.
- `QasToggle` modificado estilos.
- `QasTreeGenerator`: adicionado separador nas ações.
- `QasAlert/QasInfo`: modificado cor de error para `negative`.

### Removido
- `QasAlert/QasInfo`: removido `QasInfo` que agora foi mesclado com o `QasAlert`, olhar documentação.
- `QasGalleryCard`: removido prop `card`, no qual foi transformado em duas props separadas, `url` e `name`.
- `QasFilters`: removido slot `right-side`, agora a forma recomendada para quando precisar utilizar itens ao lado do componente, utilize o grid em conjunto com a prop `useFullContent`. Contém um exemplo do uso na docs.

## [3.18.0-beta.0] - 31-03-2025
## BREAKING CHANGE
- `QasInput`: alterado ordem da prop `iconRight` que estava adicionando na esquerda e não na direita, verificar lugares.
- Alterar `quasar.variables.scss`, nova cor do `$negative` sendo `$red-14`.
- `QasTableGenerator`: removido prop `stickyHeaderTableHeight`, agora controla o tamanho da tabela pela prop `maxHeight`.

### Adicionado
- `QasErrorMessage`: adicionado novo componente para mostrar mensagem de erros de forma padronizada.
- `QasRadio`: adicionado propriedades `error` e `errorMessage` em conjunto do componente `QasErrorMessage`.
- `css/mixins/set-error-message`: mixin para aplicar os estilos diretamente no css.
- `QasTableGenerator`: 
  - Adicionado prop `useVirtualScroll` para aplicar a renderização dinâmica dos elementos na tabela.
  - Adicionado prop `maxHeight` para definir o tamanho da tabela em casos de `useStickyHeader` e `useVirtualScroll`.

### Corrigido
- `QasInput`: alterado ordem da prop `iconRight` que estava adicionando na esquerda e não na direita.
- `QasSelectFilter`: corrigido atribuição do valor do model externo do componente.

### Modificado
- `QasSelect`: ignorando propriedade `useChips` que vem através de `$attrs`.
- `QasBadge`: alterado tipografia para `text-body2`.
- `QasExpansionItem`: alterado borda para 1px.
- [`QasInput`, `QasSelect`, `QasSearchInput`]:
  - mudança de design quando com erro.
  - mudança de design no hover.
  - mudança de mensagem de erro utilizando o mixin `set-message-error`.
- alterado mensagem de erro para o componente `QasErrorMessage`:
  - QasExpansionItem
  - QasUploader
  - QasCheckbox
- `QasToggleVisibiliy`: alterado área de clique para não ser apenas no botão e sim em todo elemento.

### Removido
- `QasTableGenerator`: removido prop `stickyHeaderTableHeight`, agora controla o tamanho da tabela pela prop `maxHeight`.

## [3.17.0] - 12-03-2025
## BREAKING CHANGES
- `A fazer`:
  - Substituir todos `QToggle` por `QasToggle`.
  - Substituir todos `QRadio` por `QasRadio`.
  - Substituir todos `QasCheckboxGroup` por `QasCheckbox`.
  - Substituir todos `QasHeaderActions` por `QasHeader`.
  - Revisar todos os `QasHeaderActions/QasHeader` se atentando as mudanças principalmente referente aos slots e propriedade `alignColumns`.
  - Atentar-se para prop `headerActionsProps` no componente `QasPageHeader`.
  - Remover TODOS `QChip` de slot do `QasSelect`.
  - Caso esteja usando `QChip` (fora do QasSelect) substituir o uso pelo `QasBadge` com a prop `removable`.
  - Atentar-se para possíveis breaking changes nos inputs: `QasToggle`, `QasCheckbox`, e `QasRadio`, validar nos formulários dos produtos.
  - Verificar todos os lugares que estão usando contadores no `QasTabsGenerator` se não estão tratando ele antes de passar.
  - Verificar todos os lugares que utilizam `QasGridGenerator` para possíveis breaking changes de estilos.
- `QasHeaderActions/QasHeader`:
  - renomeado para `QasHeader`.
  - alterado propriedade `text` para `description`.
  - removido propriedade `alignColumns`.
  - removido slots `right` e `left` em favor de utilizar novos slots.
- `QasGridGenerator`:
  - modificado tipografia;
  - utilizando novo componente `QasGridItem`.
- `QasInput`: adicionado contado no type`textarea`, então caso exista lugares com contadores de caracteres, é necessário remover para não duplicar.
- `QasCheckboxGroup/QasCheckbox`: renomeado para `QasCheckbox`.
- `QasPageHeader`: alterada propriedade `headerActionsProps` para `headerProps` para se adequar ao novo nome do componente `QasHeader`.
- `QasTabsGenerator`: agora o contador implementa a função `decimal` do asteroid, então caso esteja tratando esse valor por fora, remover.
- `QasNestedFields`: agora propriedade `actions-menu-props` só funciona junto da prop `:use-inline-actions="true"`.
- `QasListView`: possível breaking changes caso o loading era controlado externamente em conjunto com o `useResultsAreaOnly`. Agora o loading é exibido mesmo a prop sendo passada.
- `QasRadio` e `QasCheckbox`: Adicionado label por padrão a partir do field, caso tenha lugares que são feitos a mão, irá duplicar a label.
- `QasExpansionItem`:
  - renomeado slot `label` para `header-label`.
  - modificado slot header, agora ao abrir, ele sobrescreve toda a seção header, incluindo o botão de dropdown.
  - removido a prop `useHeaderSeparator`, agora não existe mais separator no header.
- `QasCard`: a prop `actionsMenuProps` anteriormente era passado diretamente era repassado pra o `list` internamente, impedindo de repassar outras props. Agora deve passar o `list` dentro do `actionsMenuProps`.
- `QasAppUser`: adicionado validação do endpoint `PATCH -> users/me` através de uma env `ME_VERSION`, é necessário adicionar esta env no `quasar.config.js`.
- [`QasGridItem`, `QasGridGenerator`]: modificado classe de cor, agora o label tem as mesmas cores tanto inline quando modo normal "text-grey-10",
- verificar lugares onde usa modo inline para ver se não estava sendo estilizado manualmente.
- `QasAppMenu`: modificado chat para o `gleap`, precisando de novas configurações.

### Adicionado
- `QasRadio`:
  - adicionado novo componente.
  - adicionado label por padrão em casos de ter mais de uma opção.
- `QasToggle`: adicionado novo componente.
- `QasGridItem`: adicionado novo componente.
- `QasInfo`: adicionado novo componente.
- `QasNestedFields`:
  - adicionado nova propriedade `useBox`.
  - adicionado componente `QasHeader` com a prop `header-props`.
  - adicionado nova propriedade `form-common-columns`.
- `QasBox`: adicionado novas propriedades `useSpacing`, `spacingX` e `spacingY`.
- `QasInput`: adicionado novas propriedades `icon` e `iconRight` para não precisar abrir slots nestes casos.
- `QasNumericInput`: adicionado novas propriedades `icon` e `iconRight` para não precisar abrir slots nestes casos.
- `QasGridGenerator`:
  - adicionado 2 novos slots, `content-field-[nome-da-chave]` e `header-field-[nome-da-chave]`.
  - adicionado novas propriedades `use-box`, `box-props` e `header-props`.
  - adicionado nova propriedade `boxProps`.
  - adicionado nova propriedade `filtersProps`.
- `QasHeaderActions/QasHeader`:
  - adicionado nova propriedade `useBox`.
  - adicionado novas propriedades `labelProps` e `badges`.
  - adicionado novos slots `actions`, `description` e `label`.
- `QasFormGenerator`:
  - adicionado recurso no fieldset para dividir colunas entre eles.
  - adicionado novas propriedades `useBox` e `boxProps`.
  - adicionado possibilidade de ter botão de ação por fieldset ao final dos fields.
  - criado slot `legend-bottom-[nome-do-fieldset]`.
- `QasBadge`:
  - adicionado propriedades para renderizar `QChip` (`removable`, `tabindex`, `modelValue`).
  - adicionado eventos para renderizar `QChip` (`remove`, `update:modelValue`).
- `QasSelect`:
  - adicionado comportamento no qual é setado automaticamente caso o select for required e houver apenas uma opção.
  - adicionado nova propriedade `useCustomOptions` para poder utilizar a opção personalizada com caption ou badge.
  - adicionado nova propriedade `badgeList` para conseguir controlar a badge a partir do retorno do backend.
  - adicionado propriedade `icon` para ser utilizado sem necessidade de slot e junto a propriedade `useFilterMode`.
  - adicionado nova propriedade `useFilterMode`.
- `QasActions`: corrigido style que não deixava div 100% quando usado com a prop `useFullWidth`.
- `QasTextTruncate`:
  - adicionado prop `emptyText` para exibição no caso do `list` ou `text` não tiver valor.
  - adicionado novas propriedade `useBadge` e `useWrapBadge`.
- `QasChartView`: adicionado novas propriedades `useBox` e `boxProps`.
- `QasTableGenerator`: adicionado componente `QasEmptyResultText` onde será exibido no caso dos valores da tabela serem vazios.
- `QasListItems`: adicionado propriedades `descriptionKey` e `labelKey` para usar o componente através de propriedades ao invés de slot.
- `QasExpansionItems`:
  - adicionado propriedade `disable`.
  - adicionado propriedade `disableButton`.
  - adicionado propriedade `group`.
  - adicionado v-model.
- `QasGrabbable`: Adicionado prop para passar um elemento para ignorar o Grab.
- `set-scroll-on-grab`: Adicionado validacao para controlar elementos a ser ignorado no grab.
- `QasInfiniteScroll`: Adicionado model `v-model:fields` para acessar os fields do fetch.
- `QasAvatar`: adicionado possibilidade de passar cores fora das defaults.
- `QasCopy`: Adicionado prop `use-text` para controlar se irá exibir label ao lado do botão de copiar.
- `QasCopy`: adicionado prop `raw-text` pra usar em casos onde o texto exibido não é o mesmo do valor que vai ser copiado.
- `composables/use-notifications`: adicionado som de notificação toda vez que as notificações `in app` são chamadas.
- `QasStepper`:
  - Adicionado possibilidade de passar props do `Quasar` para o componente.
  - Adicionado estilização em caso de step com erro.
  - Adicionado estilização em caso do stepper usar a prop `header-nav`.
- `QasBoardGenerator`:
  - adicionado nova propriedade `beforeUpdatePosition`.
  - adicionado novo evento `update-error`.
  - adicionado payload do retorno da api no evento `update-success`.
  - adicionado método `cancelDrop` no `defineExpose`.
  - adicionado possibilidade do componente ser Drag and Drop.
  - adicionado `headerBoxProps` para repassar props pro box do header.
- `QasSelectFilter`: Adicionado novo componente para lidar com filtros adicionando a query na URL e trabalhando em conjunto com o novo composable `useDefaultFilters`.
- `composables/useDefaultFilters`: adicionado novo composable para lidar com filtros defaults adicionados antes de entrar na pagina e após adicionado/alterado pelo componente `QasSelectFilter`.
- `QasCheckbox`:
 - adicionado prop `error-message` pra exibir o erro no campo.
 - adicionado prop `required` pra exibir `*` como sufixo da label.
 - adicionado label por padrão em casos de ter mais de uma opção.
- Adicionado lib `Gleap` no `/ui`.
- `QasWelcome`: Adicionado slot `after-greeting` para acessar conteúdo após saudações.

### Modificado
- `QasHeaderActions`: renomeado para `QasHeader`.
- `QasChartView`: adequado ao componente `QasHeader`.
- `QasSelect`: alterado layout.
- `QasNestedFields`:
  - modificado set scroll ao adicionado novas linhas, agora o scroll fica fixo na ultima linha adicionada.
  - agora propriedade `actions-menu-props` só funciona junto da prop `:use-inline-actions="true"`.
  - default do `formGutter` alterado de `lg` para `md`.
  - alterado layout.
- `QasInput`: alterado layout.
- `QasSearchInput`:
  - alterado layout.
  - modificado para usar borda ao invés de `qas-box` quando estiver dentro de um box ou um dialog.
- `QasField`: alterações para layout e novos componentes.
- `QasHeaderActions/QasHeader`: alterado propriedade `text` para `description`.
- `QasTabsGenerator`: agora o contador implementa a função `decimal` do asteroid.
- `QasBadge`: modificado altura minima de 24px para para 20px e espaçamento vertical de 4px para 2px.
- `QasPageHeader`: alterado espaçamento do `bottom` de `lg` para `md`.
- `QasGalleryCard`: adicionado componente `QasBox` e sempre adicionado estilo de "borda" quando estiver box dentro de box.
- `QasCard`:
  - adicionado componente `QasBox` e sempre adicionado estilo de "borda" quando estiver box dentro de box.
  - modificado tipografia do titulo para H5.
  - modificado a forma de passar `actionsMenuProps`, agora é possível passar outras props além do `list`.
  - modificado o titulo, agora existe o tratamento com a classe `ellipsis`.
- `QasGridGenerator`:
  - modificado tipografia;
  - utilizando novo componente `QasGridItem`.
  - alterado espaçamento gutter de `lg` para `md`
  - comportamento do `useEllipsis` agora os campos do tipo `textarea` não serão afetados.
  - modificado tamanho default da propriedade "gutter", agora quando for "useInline" terá o default de "8px".
  - `composables/private/useGenerator`: modificações referente ao gutter para o QasGridGenerator.
  - corrigido typo "getContainerClassses" por "getContainerClasses".
- `QasFilters`:
  - alterado layout.
  - utilizando `QasBadge` ao invés de `QChip`.
- `QasCheckboxGroup/QasCheckbox`:
  - renomeado para `QasCheckbox`.
  - agora quando não é passado `options` o componente opera em modo "single".
- `QasTableGenerator`: modificado layout de espaçamentos e borda da tabela.
- `QasSelectListDialog`: modificado para que os quando estiver usando dentro de uma box, não use o `qas-box`.
- `QasFormGenerator`:
  - agora o fieldset implementa o componente `QasHeader`.
  - alterado espaçamento gutter de `lg` para `md`.
- `QasHeader`: modificado espaçamento bottom padrão de `xl` para `md`.
- `QasDialog`:
  - alterado espaçamento interno de `lg` para `md`.
  - alterado titulo de h5 para h4 com componente `QasLabel`.
  - alterado espaçamento bottom do título de `lg` para `md`.
- `QasExpansionItem`:
  - modificado slot header, agora ao abrir, ele sobrescreve toda a seção header, incluindo o botão de dropdown.
  - renomeado slot `label` para `header-label`.
  - modificado comportamento renderizar na dom o content apenas ao abrir o expansion pela primeira vez.
- `QasUploader`: modificado header do componente para utilizar o `QasHeader` ao invés do `QasLabel`.
- `QasStepperFormView`: modificado atribuição de nome da step (necessário para utilizar `keep-alive-exclude`).
- `QasAppUser`: adicionado validação do endpoint `PATCH -> users/me` através de uma env `ME_VERSION`, é necessário adicionar esta env no `quasar.config.js`.
- `composables/useQueryFilter/findOne`: adicionado optional chaining.
- `QasTextTruncate`: modificado espaçamento entre itens no dialog para `sm`.
- `QasGridItem`: modificado classe de cor, agora o label tem as mesmas cores tanto inline quando modo normal "text-grey-10".
- `QasAppMenu`: modificado chat para o `gleap`, precisando de novas configurações.
- Atualizado SortableJS para `1.15.3`.
- adicionado placeholder padrão:
  - `QasDatetimeInput`.
  - `QasInput`.
  - `QasNumericInput`.

### Corrigido
- `QasActions`: corrigido style que não deixava div 100% quando usado com a prop `useFullWidth`.
- `QasNestedFields`: corrigido problemas de espaçamentos.
- `QasChartView`:
  - corrigido altura mínima ao fazer fetch.
  - corrigido hook `unmounted` para `beforeUnmounted`, quando saia de uma pagina com chart e ia para outra, o componente removia o registro após o registro da outra pagina, gerando erros [main -> develop].
- `QasHeader`:
  - corrigido problemas de layout.
  - corrigido espaçamento/alinhamento da seção de actions.
  - corrigido bug quando abria o slot de actions e não renderizava elemento, por exemplo com v-if.
- `QasFilters`:
  - não exibir badge ao limpar um campo do filtro pelo backspace, exibia uma badge com valor vazio.
  - campo de input não ficar com foco após efetuar a busca ou limpar pelo filtro lateral.
- `QasExpansionItem`:
  - corrigido propriedade "group" que o default era string vazia, e isto fazia que todos fizessem parte do mesmo grupo de `""`.
  - corrigido direção do ícone de dropdown.
  - corrigido cor da borda em casos de erro e dentro de um `QasBox`.
  - corrigido ícone de dropdown quando possui um expansion dentro de outro.
- `QasBoardGenerator`:
  - corrigido problema de duplicidade de model nos itens das colunas quando se entra na página novamente.
  - corrigido scroll vertical desnecessário no Safari.
- `QasGrabbable`: Corrigido o grab em casos de não passar elementos para ignorar.
- `QasAppMenu`: corrigido problema que ocorria quando um item do menu com "children" ficava vazio, ele quebrava por não encontrar a rota e mostrava um label mesmo que sem nenhum item abaixo.
- `QasTextTruncate`: corrigido botão do "ver mais" que não aparecia mesmo quando existia ellipsis.

### Removido
- `QasPageHeader`: alterada propriedade `headerActionsProps` para `headerProps` para se adequar ao novo nome do componente `QasHeader`.
- `QasHeaderActions/QasHeader`:
  - alterado propriedade `text` para `description`.
  - removido propriedade `alignColumns`.
  - removido slots `right` e `left` em favor de utilizar novos slots.
- `QasExpansionItem`: removido a prop `useHeaderSeparator`, agora não existe mais separator no header.

## [3.17.0-beta.32] - 12-03-2025
### Corrigido
- `QasTextTruncate`: corrigido botão do "ver mais" que não aparecia mesmo quando existia ellipsis.

## [3.17.0-beta.31] - 19-02-2025
### Adicionado
- `QasWelcome`: Adicionado slot `after-greeting` para acessar conteúdo após saudações.

### Corrigido
- `QasSelect`: 
  - Corrigido lógica para setar o model com a única option disponível.
  - Corrigido alinhamento das badges.

## [3.17.0-beta.30] - 19-02-2025
### Corrigido
- `QasAppMenu`: removido prefixo `+` no phone enviado para o gleap que estava incorreto.

## [3.16.4] - 19-02-2025
### Corrigido
- `QasAppMenu`: removido prefixo `+` no phone enviado para o gleap que estava incorreto.

## [3.17.0-beta.29] - 17-02-2025
## BREAKING CHANGES
- `QasAppMenu`: modificado chat para o `gleap`, precisando de novas configurações.

### Adicionado
- Adicionado lib `Gleap` no `/ui`.

### Modificado
- `QasAppMenu`: modificado chat para o `gleap`, precisando de novas configurações.

## [3.16.3] - 14-02-2025
## BREAKING CHANGES
- `QasAppMenu`: modificado chat para o `gleap`, precisando de novas configurações.

### Adicionado
- Adicionado lib `Gleap` no `/ui`.

### Corrigido
- `QasAppMenu`: corrigido problema que ocorria quando um item do menu com "children" ficava vazio, ele quebrava por não encontrar a rota e mostrava um label mesmo que sem nenhum item abaixo.

### Modificado
- `QasAppMenu`: modificado chat para o `gleap`, precisando de novas configurações.

## [3.17.0-beta.28] - 14-02-2025
## BREAKING CHANGES
- [`QasGridItem`, `QasGridGenerator`]: modificado classe de cor, agora o label tem as mesmas cores tanto inline quando modo normal "text-grey-10",
verificar lugares onde usa modo inline para ver se não estava sendo estilizado manualmente.

### Adicionado
`QasTextTruncate`: Adicionado novas propriedade `useBadge` e `useWrapBadge`.

### Modificado
- `QasTextTruncate`: modificado espaçamento entre itens no dialog para `sm`.
- `QasGridItem`: modificado classe de cor, agora o label tem as mesmas cores tanto inline quando modo normal "text-grey-10".
- `QasGridGenerator`:
  - modificado tamanho default da propriedade "gutter", agora quando for "useInline" terá o default de "8px".
  - `composables/private/useGenerator`: modificações referente ao gutter para o QasGridGenerator.
  - corrigido typo "getContainerClassses" por "getContainerClasses".

## [3.17.0-beta.27] - 07-02-2025
### Adicionado
- `QasCheckbox`:
 - adicionado prop `error-message` pra exibir o erro no campo.
 - adicionado prop `required` pra exibir `*` como sufixo da label.

## [3.17.0-beta.26] - 03-02-2025
### Corrigido
- `QasExpansionItem`: corrigido ícone de dropdown quando possui um expansion dentro de outro.

## [3.17.0-beta.25] - 27-01-2025
## BREAKING CHANGES
- `QasExpansionItem`: removido a prop `useHeaderSeparator`, agora não existe mais separator no header.

### Modificado
- `QasExpansionItem`: Modificado a borda do componente, agora ao ter um expansion dentro de outro expansion, ficará uma borda.

### Removido
- `QasExpansionItem`: removido a prop `useHeaderSeparator`, agora não existe mais separator no header.

## [3.17.0-beta.24] - 23-01-2025
## BREAKING CHANGES
- `QasAppUser`: adicionado validação do endpoint `PATCH -> users/me` através de uma env `ME_VERSION`, é necessário adicionar esta env no `quasar.config.js`.

### Adicionado
- `QasSelectFilter`: Adicionado novo componente para lidar com filtros adicionando a query na URL e trabalhando em conjunto com o novo composable `useDefaultFilters`.
- `composables/useDefaultFilters`: adicionado novo composable para lidar com filtros defaults adicionados antes de entrar na pagina e após adicionado/alterado pelo componente `QasSelectFilter`.

### Modificado
- `QasAppUser`: adicionado validação do endpoint `PATCH -> users/me` através de uma env `ME_VERSION`, é necessário adicionar esta env no `quasar.config.js`.
- `composables/useQueryFilter/findOne`: adicionado optional chaining.

## [3.17.0-beta.23] - 14-01-2025
### Adicionado
- `QasBoardGenerator`:
  - adicionado nova propriedade `beforeUpdatePosition`.
  - adicionado novo evento `update-error`.
  - adicionado payload do retorno da api no evento `update-success`.
  - adicionado método `cancelDrop` no `defineExpose`.

## [3.17.0-beta.22] - 20-12-2024
### Modificado
- `QasUploader`: modificado header do componente para utilizar o `QasHeader` ao invés do `QasLabel`.
- `QasStepperFormView`: modificado atribuição de nome da step (necessário para utilizar `keep-alive-exclude`).

### Adicionado
- `QasStepper`:
  - Adicionado possibilidade de passar props do `Quasar` para o componente.
  - Adicionado estilização em caso de step com erro.
  - Adicionado estilização em caso do stepper usar a prop `header-nav`.

## [3.17.0-beta.21] - 12-12-2024
### Adicionado
- `composables/use-notifications`: adicionado som de notificação toda vez que as notificações `in app` são chamadas.

## [3.17.0-beta.20] - 11-12-2024
### Adicionado
- `QasCopy`: adicionado prop `raw-text` pra usar em casos onde o texto exibido não é o mesmo do valor que vai ser copiado.

### Corrigido
- `QasFormGenerator`: corrigido validação para exibição do `fieldset`, ao não passar propriedades como label e description, fazia com que ficasse um espaço em branco.

## [3.17.0-beta.19] - 03-12-2024
### Corrigido
- `QasAppMenu`: corrigido problema que ocorria quando um item do menu com "children" ficava vazio, ele quebrava por não encontrar a rota e mostrava um label mesmo que sem nenhum item abaixo.

## [3.17.0-beta.18] - 19-11-2024
## BREAKING CHANGES
- `QasCard`: a prop `actionsMenuProps` anteriormente era passado diretamente era repassado pra o `list` internamente, impedindo de repassar outras props. Agora deve passar o `list` dentro do `actionsMenuProps`.

### Modificado
- `QasCard`: 
  - Modificado a forma de passar `actionsMenuProps`, agora é possível passar outras props além do `list`.
  - Modificado o titulo, agora existe o tratamento com a classe `ellipsis`.
- `QasExpansionItem`: Modificado comportamente renderizar na dom o content apenas ao abrir o expansion pela primeira vez.

### Corrigido
- `QasExpansionItem`: Corrigido cor da borda em casos de erro e dentro de um `QasBox`.

## [3.17.0-beta.17] - 13-11-2024
## BREAKING CHANGES
- `QasExpansionItem`:
  - Renomeado slot `label` para `header-label`.
  - Removido slot `header-left` (agora o `header` tem o mesmo comportamento que o `header-left`).

### Corrigido
- `QasExpansionItem`: Corrigido direção do ícone de dropdown.

### Modificado
- `QasExpansionItem`:
  - Modificado slot `header` para ele ser o antigo `header-left`, pegando toda a largura do conteúdo menos o ícone.
  - Renomeado slot `label` para `header-label`.

### Removido
- `QasExpansionItem`: Removido slot `header-left` (agora o `header` tem o mesmo comportamento que o `header-left`).

## [3.17.0-beta.16] - 11-11-2024
## BREAKING CHANGES
- `QasRadio` e `QasCheckbox`: Adicionado label por padrão a partir do field, caso tenha lugares que são feitos a mão, irá duplicar a label.

### Corrigido
- `QasTableGenerator`: Corrigido scroll vertical desnecessário no Safari.
- `QasGrabbable`: Corrigido o grab em casos de não passar elementos para ignorar.

### Adicionado
- `QasRadio` e `QasCheckbox`: Adicionado label por padrão em casos de ter mais de uma opção.
- `QasCopy`: Adicionado prop `use-text` para controlar se irá exibir label ao lado do botão de copiar.

## [3.17.0-beta.15] - 06-11-2024
### Adicionado
- `QasAvatar`: adicionado possibilidade de passar cores fora das defaults.

### Corrigido
- `QasChartView`: corrigido hook `unmounted` para `beforeUnmounted`, quando saia de uma pagina com chart e ia para outra, o componente removia o registro após o registro da outra pagina, gerando erros [main -> develop].

## [3.16.2] - 23-10-2024
### Corrigido
- `QasChartView`: corrigido hook `unmounted` para `beforeUnmounted`, quando saia de uma pagina com chart e ia para outra, o componente removia o registro após o registro da outra pagina, gerando erros.

## [3.17.0-beta.14] - 22-10-2024
### Corrigido
- `QasBoardGenerator`:
  - Corrigido lógica para fechar o dialog de confirmação de drop.
  - Corrigido lógica para não bater as APIs de colunas ao realizar o drop.

## [3.17.0-beta.13] - 15-10-2024
### Adicionado
- `QasBoardGenerator`: 
  - Adicionado possibilidade do componente ser Drag and Drop.
  - Adicionado `headerBoxProps` para repassar props pro box do header.
- `QasGrabbable`: Adicionado prop para passar um elemento para ignorar o Grab.
- `set-scroll-on-grab`: Adicionado validacao para controlar elementos a ser ignorado no grab.
- `QasInfiniteScroll`: Adicionado model `v-model:fields` para acessar os fields do fetch.

### Modificado
- Atualizado SortableJS para `1.15.3`.
- `QasCard`: Modificado tipografia do titulo para H5.

### Corrigido
- `QasBoardGenerator`: Corrigido problema de duplicidade de model nos itens das colunas quando se entra na página novamente.
- `QasHeader`: corrigido espaçamento/alinhamento da seção de actions.

## [3.17.0-beta.12] - 10-10-2024
### Corrigido
- `QasExpansionItem`: corrigido propriedade "group" que o default era string vazia, e isto fazia que todos fizessem parte do mesmo grupo de `""`.

## [3.17.0-beta.11] - 09-10-2024
### Corrigido
- `QasHeader`: corrigido bug quando abria o slot de actions e não renderizava elemento, por exemplo com v-if.

## [3.17.0-beta.10] - 08-10-2024
## BREAKING CHANGES
- `QasExpansionItems`: modificado slot header, agora ao abrir, ele sobrescreve toda a seção header, incluindo o botão de dropdown.

### Adicionado
- `QasExpansionItems`:
  - adicionado propriedade `disable`.
  - adicionado propriedade `disableButton`.
  - adicionado propriedade `group`.
  - adicionado v-model.
  - adicionado novo slot `header-left`.

### Modificado
- `QasExpansionItems`: modificado slot header, agora ao abrir, ele sobrescreve toda a seção header, incluindo o botão de dropdown.

## [3.17.0-beta.9] - 07-10-2024
### Adicionado
- `QasSelect`:
  - Adicionado propriedade `icon` para ser utilizado sem necessidade de slot e junto a propriedade `useFilterMode`.
  - Adicionado nova propriedade `useFilterMode`.

## [3.17.0-beta.8] - 30-09-2024
### Corrigido
- `QasChartView`: corrigido altura mínima ao fazer fetch.

## [3.17.0-beta.7] - 30-09-2024
## BREAKING CHANGES
- `QasListView`: possível breaking changes caso o loading era controlado externamente em conjunto com o `useResultsAreaOnly`. Agora o loading é exibido mesmo a prop sendo passada.

### Adicionado
- `QasFormGenerator`: criado slot `legend-bottom-[nome-do-fieldset]`.
- `QasTableGenerator`: adicionado componente `QasEmptyResultText` onde será exibido no caso dos valores da tabela serem vazios.
- `QasHeader`: adicionado nova propriedade `filtersProps`.
- `QasListItems`: adicionado propriedades `descriptionKey` e `labelKey` para usar o componente através de propriedades ao invés de slot.

### Modificado
- `QasExpansionItem`: modificado componente para ter uma borda caso esteja dentro de um `QasBox`.
- `QasDateTimeInput`: modificado o ícone do calendário.
- `QasActionsMenu`: modificado o botão splitted, agora possui a label `Opções` quando não for mobile.
- `QasListView`: modificado a forma que os loadings são exibidos.

## Corrigido
- `QasGridGenerator`: ajuste de lógica do ellipsis que estava causando um warning.
- `QasFormGenerator`: ajuste ao usar o `buttonProps` com um select com opções com label grande, fazia com que o select não respeitasse o ellipsis.
- `QasChartView`: corrigido tamanho mínimo do componente quando não existem items há serem exibidos.

## [3.17.0-beta.6] - 10-09-2024
### Corrigido
- `QasFormGenerator`: corrigido fieldset que não estava sendo exibido.

## [3.17.0-beta.5] - 09-09-2024

## BREAKING CHANGES
- `QasNestedFields`: agora propriedade `actions-menu-props` só funciona junto da prop `:use-inline-actions="true"`.

### Adicionado
- `QasNestedFields`:
  - adicionado componente `QasHeader` com a prop `header-props`.
  - adicionado nova propriedade `form-common-columns`.
- `QasTextTruncate`: adicionado prop `emptyText` para exibição no caso do `list` ou `text` não tiver valor.
- `QasChartView`: adicionado novas propriedades `useBox` e `boxProps`.

### Corrigido
- `QasActions`: corrigido style que não deixava div 100% quando usado com a prop `useFullWidth`.
- `QasNestedFields`: corrigido problemas de espaçamentos.
- `QasFormGenerator`: corrigido div vazia quando não tinha fieldset.
- `QasHeader`: corrigido problemas de layout.
- `QasFilters`:
  - Não exibir badge ao limpar um campo do filtro pelo backspace, exibia uma badge com valor vazio.
  - Campo de input não ficar com foco após efetuar a busca ou limpar pelo filtro lateral.

### Modificado
- `QasDialog`:
  - alterado espaçamento interno de `lg` para `md`.
  - alterado titulo de h5 para h4 com componente `QasLabel`.
  - alterado espaçamento bottom do título de `lg` para `md`.
- [`QasFormGenerator`, `QasGridGenerator`]: alterado espaçamento gutter de `lg` para `md`.
- `QasNestedFields`:
  - modificado set scroll ao adicionado novas linhas, agora o scroll fica fixo na ultima linha adicionada.
  - agora propriedade `actions-menu-props` só funciona junto da prop `:use-inline-actions="true"`.
  - default do `formGutter` alterado de `lg` para `md`.
- `QasGridGenerator`: comportamento do `useEllipsis` agora os campos do tipo `textarea` não serão afetados.

## [3.17.0-beta.4] - 02-09-2024
### Adicionado
- `QasSelect`:
  - Adicionado nova propriedade `useCustomOptions` para poder utilizar a opção personalizada com caption ou badge.
  - Adicionado nova propriedade `badgeList` para conseguir controlar a badge a partir do retorno do backend.

## [3.17.0-beta.3] - 02-09-2024
### Adicionado
- `QasGridGenerator`: adicionado novas propriedades `use-box`, `box-props` e `header-props`.

## [3.17.0-beta.2] - 02-09-2024
### Adicionado
- `QasSelect`: Adicionado comportamento no qual é setado automaticamente caso o select for required e houver apenas uma opção.

### Modificado
- `QasFormGenerator`: Agora o fieldset implementa o componente `QasHeader`.
- `QasHeader`: modificado espaçamento bottom padrão de `xl` para `md`.

## [3.17.0-beta.1] - 22-08-2024
### Adicionado
- `QasFormGenerator`: Adicionado possibilidade de ter botão de ação por fieldset ao final dos fields.

### Modificado
- `QasTableGenerator`: modificado layout de espaçamentos e borda da tabela.
- `QasSelectListDialog`: modificado para que os quando estiver usando dentro de uma box, não use o `qas-box`.
- `QasSearchInput`: modificado para usar borda ao invés de `qas-box` quando estiver dentro de um box ou um dialog.

## [3.17.0-beta.0] - 16-08-2024
## BREAKING CHANGES

- `A fazer`:
  - Substituir todos `QToggle` por `QasToggle`.
  - Substituir todos `QRadio` por `QasRadio`.
  - Substituir todos `QasCheckboxGroup` por `QasCheckbox`.
  - Substituir todos `QasHeaderActions` por `QasHeader`.
  - Revisar todos os `QasHeaderActions/QasHeader` se atentando as mudanças principalmente referente aos slots e propriedade `alignColumns`.
  - Atentar-se para prop `headerActionsProps` no componente `QasPageHeader`.
  - Remover TODOS `QChip` de slot do `QasSelect`.
  - Caso esteja usando `QChip` (fora do QasSelect) substituir o uso pelo `QasBadge` com a prop `removable`.
  - Atentar-se para possíveis breaking changes nos inputs: `QasToggle`, `QasCheckbox`, e `QasRadio`, validar nos formulários dos produtos.
  - Verificar todos os lugares que estão usando contadores no `QasTabsGenerator` se não estão tratando ele antes de passar.
  - Verificar todos os lugares que utilizam `QasGridGenerator` para possíveis breaking changes de estilos.

- `QasHeaderActions/QasHeader`:
  - renomeado para `QasHeader`.
  - alterado propriedade `text` para `description`.
  - removido propriedade `alignColumns`.
  - removido slots `right` e `left` em favor de utilizar novos slots.

- `QasGridGenerator`:
  - modificado tipografia;
  - utilizando novo componente `QasGridItem`.

- `QasInput`: adicionado contado no type`textarea`, então caso exista lugares com contadores de caracteres, é necessário remover para não duplicar.
- `QasCheckboxGroup/QasCheckbox`: renomeado para `QasCheckbox`.
- `QasPageHeader`: alterada propriedade `headerActionsProps` para `headerProps` para se adequar ao novo nome do componente `QasHeader`.
- `QasTabsGenerator`: agora o contador implementa a função `decimal` do asteroid, então caso esteja tratando esse valor por fora, remover.

### Adicionado
- `QasRadio`: adicionado novo componente.
- `QasToggle`: adicionado novo componente.
- `QasGridItem`: adicionado novo componente.
- `QasInfo`: adicionado novo componente.
- `QasNestedFields`: adicionado nova propriedade `useBox`.
- `QasBox`: adicionado novas propriedades `useSpacing`, `spacingX` e `spacingY`.
- `QasInput`: adicionado novas propriedades `icon` e `iconRight` para não precisar abrir slots nestes casos.
- `QasNumericInput`: adicionado novas propriedades `icon` e `iconRight` para não precisar abrir slots nestes casos.
- `QasGridGenerator`: adicionado 2 novos slots, `content-field-[nome-da-chave]` e `header-field-[nome-da-chave]`.

- `QasHeaderActions/QasHeader`:
  - adicionado novas propriedades `labelProps` e `badges`.
  - adicionado novos slots `actions`, `description` e `label`.

- `QasFormGenerator`:
  - adicionado recurso no fieldset para dividir colunas entre eles.
  - adicionado novas propriedades `useBox` e `boxProps`.

- `QasBadge`:
  - adicionado propriedades para renderizar `QChip` (`removable`, `tabindex`, `modelValue`).
  - adicionado eventos para renderizar `QChip` (`remove`, `update:modelValue`).

### Modificado
- `QasHeaderActions`: renomeado para `QasHeader`.
- `QasChartView`: adequado ao componente `QasHeader`.
- `QasSelect`: alterado layout.
- `QasNestedFields`: alterado layout.
- `QasInput`: alterado layout.
- `QasSearchInput`: alterado layout.
- `QasField`: alterações para layout e novos componentes.
- `QasHeaderActions/QasHeader`: alterado propriedade `text` para `description`.
- `QasTabsGenerator`: agora o contador implementa a função `decimal` do asteroid.
- `QasBadge`: modificado altura minima de 24px para para 20px e espaçamento vertical de 4px para 2px.
- `QasPageHeader`: alterado espaçamento do `bottom` de `lg` para `md`.
- `QasGalleryCard`: adicionado componente `QasBox` e sempre adicionado estilo de "borda" quando estiver box dentro de box.
- `QasCard`: adicionado componente `QasBox` e sempre adicionado estilo de "borda" quando estiver box dentro de box.

- `QasGridGenerator`:
  - modificado tipografia;
  - utilizando novo componente `QasGridItem`.

- adicionado placeholder padrão:
  - `QasDatetimeInput`.
  - `QasInput`.
  - `QasNumericInput`.

- `QasFilters`:
  - alterado layout.
  - utilizando `QasBadge` ao invés de `QChip`.

- `QasCheckboxGroup/QasCheckbox`:
  - renomeado para `QasCheckbox`.
  - agora quando não é passado `options` o componente opera em modo "single".

### Removido
- `QasPageHeader`: alterada propriedade `headerActionsProps` para `headerProps` para se adequar ao novo nome do componente `QasHeader`.
- `QasHeaderActions/QasHeader`:
  - alterado propriedade `text` para `description`.
  - removido propriedade `alignColumns`.
  - removido slots `right` e `left` em favor de utilizar novos slots.

## [3.16.1] - 16-08-2024
### Corrigido
- Corrigido tamanho dos botões do `QasActions` em casos de telas pequenas, no qual se deve ficar tamanho total da largura.

## [3.16.1-beta.0] - 15-08-2024
### Corrigido
- Corrigido tamanho dos botões do `QasActions` em casos de telas pequenas, no qual se deve ficar tamanho total da largura.

## [3.16.0] - 12-08-2024
## BREAKING CHANGES
- [`QasFormGenerator`, `QasGridGenerator`]: removido a propriedade `useCommonColumns` em favor de utilizar a propriedade `commonColumns`.
- `QasSingleView`: Possível breaking change ao utilizar o `before-fetch`.

### Adicionado
- [`QasFormGenerator`, `QasGridGenerator`]: adicionado nova propriedade `commonColumns`, esta propriedade vai substituir a necessidade do `useCommonColumns` e dar mais flexibilidade.
- `QasAppMenu`: adicionado propriedade `helpChatLink`, para a ação de "Solicitar ajuda".
- `QasActionsMenu`: possibilidade de passar a prop `to` para os botões.
- `QasHeaderActions`: adicionado prop `spacing`.
- `QasSingleView`: Adicionado propriedade `use-store` para dar a possibilidade de utilizar o componente sem a store do vuex/pinia.
- `QasToggleVisibility`: Adicionado novo componente.
- `QasExpansionItem`: adicionado novo slot `header-bottom`.
- [`QasFormView`, `QasListView`, `QasSingleView`]: adicionado novo slot chamado `fetch-error` que é disponibilizado quando ocorre o `fetchError`.
- `QasActions`: adicionado nova opção de ação terciária.

### Corrigido
- `QasSelect`: Corrigido forma de atribuir as options, já que estava dando problema de endereço de memória em selects dependentes que são lazy-loading dentro de um `QasNestedFields`.
- `QasAppMenu`: adicionado validações para garantir que não aconteça nenhum erro que trave a aplicação.
- `QasHeaderActions`: Corrigido quebra de de layout em casos de ter 2 itens com split usando `QasActionsMenu`.
- `QasExpansionItem`: corrigido função `setHasNextSibling`.
- `QasGridGenerator`: Corrigido gutter quando se é utilizado a prop `useInline`.
- `QasExpansionItem`: Adicionado nova propriedade `useHeaderSeparator` para forçar o controle do QSeparator.
- `QasExpansionItem`: Adicionado classe para z-index, onde corrige o problema de quando usado grid com gutter no conteúdo e sobrepunha o header fazendo com que perdesse o evento de click.
- `QasTableGenerator`: adicionado nova propriedade `useBox`.

### Modificado
- `QasSingleView`:
  - modificado para composition API.
  - removido obrigatoriedade da propriedade "entity".
- `QasExpansionItem`: modificado layout do componente quando ele é usado como nested (QasExpansionItem dentro de QasExpansionItem).
- `QasExpansionItem`:
  - Repassando todos eventos do QExpansionItem.
- `QasToggleVisibility`: adicionado evento `prevent.stop` no botão para não disparar evento de click na tabela.
- `boot/notifications`: removido notificações em localhost, uma vez que ficava gerando vários errors de conexão no console/network, o que atrapalhava o desenvolvimento local.
- `QasExpansionItem`:
  - adicionado espaçamento `sm` no conteúdo quando for nested.
  - agora é possível sobrescrever a propriedade "useInline" pela `gridGeneratorProps`.
- `QasLabel`: Modificado tag renderizada no componente para ser de acordo com a passada pela prop `typography`.

### Removido
- [`QasFormGenerator`, `QasGridGenerator`]: removido a propriedade `useCommonColumns` em favor de utilizar a propriedade `commonColumns`.

## [3.16.0-beta.10] - 01-08-2024
## BREAKING CHANGES
- `QasSingleView`: Possível breaking change ao utilizar o `before-fetch`.

### Adicionado
- `QasActions`: adicionado nova opção de ação terciária.

### Corrigido
- `QasSingleView`: Corrigido validação do `hasResults` (voltou para a anterior).
- [`use-view`, `view`]: Corrigido nome do slot na validação para ver se existe ou não o slot de `fetch-error`.

## [3.16.0-beta.9] - 31-07-2024
### Adicionado
- [`QasFormView`, `QasListView`, `QasSingleView`]: adicionado novo slot chamado `fetch-error` que é disponibilizado quando ocorre o `fetchError`.

### Modificado
- `QasLabel`: Modificado tag renderizada no componente para ser de acordo com a passada pela prop `typography`.

### Corrigido
- `QasGridGenerator`: Corrigido gutter quando se é utilizado a prop `useInline`.
- `QasExpansionItem`: Adicionado nova propriedade `useHeaderSeparator` para forçar o controle do QSeparator.
- `QasExpansionItem`: Adicionado classe para z-index, onde corrige o problema de quando usado grid com gutter no conteúdo e sobrepunha o header fazendo com que perdesse o evento de click.
- `QasTableGenerator`: adicionado nova propriedade `useBox`.

## [3.16.0-beta.8] - 24-07-2024
### Modificado
- `QasExpansionItem`:
  - adicionado espaçamento `sm` no conteúdo quando for nested.
  - agora é possível sobrescrever a propriedade "useInline" pela `gridGeneratorProps`.

### Corrigido
- `QasExpansionItem`: corrigido função `setHasNextSibling`.

## [3.16.0-beta.7] - 23-07-2024
### Modificado
- `boot/notifications`: removido notificações em localhost, uma vez que ficava gerando vários errors de conexão no console/network, o que atrapalhava o desenvolvimento local.

## [3.16.0-beta.6] - 12-07-2024
### Corrigido
- `QasHeaderActions`: Corrigido quebra de de layout em casos de ter 2 itens com split usando `QasActionsMenu`.
- `QasSingleView`: Corrigido exposição de métodos para possibilidade de usar `Template Refs`.

### Modificado
- `QasExpansionItem`:
  - Repassando todos eventos do QExpansionItem.
- `QasToggleVisibility`: adicionado evento `prevent.stop` no botão para não disparar evento de click na tabela.

## [3.16.0-beta.5] - 04-07-2024
### Adicionado
- `QasToggleVisibility`: Adicionado novo componente.
- `QasExpansionItem`: adicionado novo slot `header-bottom`.

### Modificado
- `QasExpansionItem`: modificado layout do componente quando ele é usado como nested (QasExpansionItem dentro de QasExpansionItem).

## [3.16.0-beta.4] - 26-06-2024
### Adicionado
- `QasSingleView`: Adicionado propriedade `use-store` para dar a possibilidade de utilizar o componente sem a store do vuex/pinia.

### Modificado
- `QasSingleView`:
  - modificado para composition API.
  - removido obrigatoriedade da propriedade "entity".

## [3.16.0-beta.3] - 20-06-2024
### Adicionado
- `QasActionsMenu`: possibilidade de passar a prop `to` para os botões.
- `QasHeaderActions`: adicionado prop `spacing`.

## [3.16.0-beta.2] - 31-05-2024
### Corrigido
- `QasAppMenu`: adicionado validações para garantir que não aconteça nenhum erro que trave a aplicação.

## [3.16.0-beta.1] - 31-05-2024
## BREAKING CHANGES
- [`QasFormGenerator`, `QasGridGenerator`]: removido a propriedade `useCommonColumns` em favor de utilizar a propriedade `commonColumns`.

### Adicionado
- [`QasFormGenerator`, `QasGridGenerator`]: adicionado nova propriedade `commonColumns`, esta propriedade vai substituir a necessidade do `useCommonColumns` e dar mais flexibilidade.
- `QasAppMenu`: adicionado propriedade `helpChatLink`, para a ação de "Solicitar ajuda".

### Removido
- [`QasFormGenerator`, `QasGridGenerator`]: removido a propriedade `useCommonColumns` em favor de utilizar a propriedade `commonColumns`.

## [3.16.0-beta.0] - 24-05-2024
### Corrigido
- `QasSelect`: Corrigido forma de atribuir as options, já que estava dando problema de endereço de memória em selects dependentes que são lazy-loading dentro de um `QasNestedFields`.

## [3.15.0] - 23-05-2024
## BREAKING CHANGES
- `QasCard`: Componente agora se chama `QasCardImage`, pois agora foi criado um novo componente com o nome de `QasCard` (`QasCard <-> QasCardImage`).

- `QasBoardGenerator`:
  - props `results` alterada para `headers`,
  - `v-model` agora é recuperado pelo `v-model:results`.
  - alterado prop `use-shallow-ref` para `use-mark-raw`.

- `QasBtnDropdown`:
  - removido propriedade `buttonProps`;
  - removido slot `left-button`.

- `QasActionsMenu`:
  - modificado comportamento, agora caso esteja usando a prop `splitName` e tenha 2 itens na lista, o componente deixará os botões um ao lado do outro.
  - antes o componente utilizava `QasBtnDropDown` quando tinha mais de 1 item e `QasBtn` quando tinha apenas 1 item, agora ele sempre utiliza o `QasBtnDropdown`.
  - propriedade `buttonProps` é aplicada quando o componente esta no modo "Opções", que é quando não utiliza o `splitName` ou esteja no `mobile`.
  - `QasActionsMenu`: removido propriedade `dropdownIcon`, uma vez que é possível passar pelo `buttonProps`.

### Adicionado
- `QasGrabbable`: adicionado componente de scroll em uma determinada área (elemento) ao realizar evento de grab (puxar/agarrar) com o mouse/touch.
- `QasSelect`: adicionado prop `useFetchOptionsOnFocus` para controlar se deve buscar as opções somente ao realizar foco no select.
- `search-filter`: adicionado evento `update:selectedOptions` para retornar as opções selecionadas (label e value).
- `utils/scroll.scss`: Adicionado classe `secondary-scroll` com um estilo de scroll mais sútil em relação a padrão.
- `QasCard` (novo): adicionado novo componente de card tendo o nome do antigo `QasCard`, pois este card não depende de imagens.
- `QasBoardGenerator`: adicionado componente de board, responsável pela exibição e busca dos dados de um board de colunas.
- `QasUploader`: adicionado método de `reset` caso queira resetar o campo externamente.
- `QasActionsMenu`: adicionado nova propriedade `disable`.
- `use-query-cache`: adicionado função para limpar todos os filtros cacheados.
- `Spacing.js`: Adicionado espaçamentos `4xl e 5xl`.
- `QasStepper`: Adicionado componente de stepper.
- `QasStepperFormView`: Adicionado componente de gerador de steppers de formulário, utilizando o `QasSteppers`.
- `QasExpansionItem`: Adicionado componente de card expansivo.
- `QasChartView`: Adicionado prop `colors-list` para personalizar as cores dos gráficos.
- [`QasFormGenerator`, `QasGridGenerator`]: Adicionado prop `useCommonColumns` onde será possível passar um único objeto com seus breakpoints e será replicado para todos fields.

- `helpers/setScrollOnGrab`:
  - adicionado opções de callback após eventos de grab: `onMoveFn`, `onGrabFn` e `onScrollFn`.
  - adicionado suporte a dispositivos com touch.
  - adicionado estilos padrões no container para desabilitar click ao realizar o grab.

- `QasFilters`:
  - adicionado model `filters` para controlar os filtros ativos.
  - adicionado suporte a campos do filtro com lazy loading.

- `QasBoardGenerator`: 
  - adicionado eventos `fetch-columns-success`, `fetch-columns-error`, `fetch-column-success` e `fetch-column-error`.
  - adicionado prop `lazy-loading-fields-keys`.

- `QasBtnDropdown`:
  - adicionado nova propriedade `buttonsPropsList`.
  - adicionado nova propriedade `disable`.
  - adicionado novo slot `bottom-[buttons-props-list-key]`.

- `QasGridGenerator`:
  - Adicionado prop `useEllipsis` que por default é `true`, que irá adicionar a classe `ellipsis` em cada item do grid.
  - Adicionado prop `useInline` para mudar a disposição dos campos para ser por linha, ou seja, header e content ocupando a linha toda.
  - Adicionado title ao header e content ao utilizar a prop `useEllipsis`.

### Corrigido
- `QasTableGenerator`: corrigido ação de click na linha ao realizar o scroll horizontal na tabela.
- `boot/notifications`: corrigido a forma de passar o token para o método `setLaravelEcho`, onde precisou de uma validação para formatar o token passando o valor correto.
- `QasAppMenu`: Correção temporária (ou permanente caso não seja resolvido no quasar), bug que ocorria com o QDrawer quando usado com a versão do vue `v3.4+`, onde era removido o scroll da pagina quando ocorria um resize na pagina de desktop pra mobile.
- `QasUploader`: corrigido valor do emit ao remover um item do uploader, pois estava quebrando no caso do uso `use-object-model`.
- `QasBtnDropdown`: corrigido classes para o funcionamento do "ellipsis".
- `QasAppMenu`: corrigido o uso do `QasBtnDropdown`.
- Adicionado um `max-width` no `QasCard` para ajustar o overflow do seu conteúdo.
- `QasGridGenerator`: Corrigido comportamento da propriedade `columns` quando passado com valores `col`, exemplo `{ lg: 'col' }`.
- `QasActionsMenu`: Corrigido props defaults que estavam faltando no componente após a refatoração/redesign (`{ useHoverOnWhiteColor: true, useLabelOnSmallScreen: false }`).

### Modificado
- `QasAppUser`: Alterado do menu "Editar" para "Perfil", uma vez que agora a pagina do /me não é somente para editar.
- `QasCard` (antigo): Alterado nome do componente para `QasCardImage`, uma vez que ele é um card com imagens.
- `QasOptionGroup`: alterado componente para sobrescrever a prop `inline`.
- `QasNestedFields`: alterado comportamento da propriedade `formGutter`, agora ela é repassada para o componente `QasFormGenerator` e utilizada nos espaçamentos dos campos do formulário.
- `QasAppUser`: alterado componente para usar o `reset` do `use-query-cache` ao realizar a troca de vínculo, fazendo com que seja resetado todo os filtros previamente cacheados.
- `QasGridGenerator`: Ao utilizar o `use-inline`, os titulos não terão `text-bold`.
- `QasBtnDropdown`: alterado componente para receber uma lista de botões.

- `QasBoardGenerator`:
  - alterado prop `results` para `headers`.
  - `v-model` agora é recuperado pelo `v-model:results`.
  - alterado prop `use-shallow-ref` para `use-mark-raw`.

- `QasActionsMenu`:
  - modificado comportamento, agora caso esteja usando a prop `splitName` e tenha 2 itens na lista, o componente deixará os botões um ao lado do outro.
  - antes o componente utilizava `QasBtnDropDown` quando tinha mais de 1 item e `QasBtn` quando tinha apenas 1 item, agora ele sempre utiliza o `QasBtnDropdown`.
  - propriedade `buttonProps` é aplicada quando o componente esta no modo "Opções", que é quando não utiliza o `splitName` ou esteja no `mobile`.

### Removido
- `helpers/setScrollOnGrab`: removido função interna `haveMoved`.
- `QasActionsMenu`: removido propriedade `dropdownIcon`, uma vez que é possível passar pelo `buttonProps`.

- `QasBtnDropdown`:
  - removido propriedade `buttonProps`.
  - removido slot `left-button`.

## [3.15.0-beta.15] - 10-05-2024
### Adicionado
- `QasChartView`: Adicionado prop `colors-list` para personalizar as cores dos gráficos.

## [3.15.0-beta.14] - 24-04-2024
### Adicionado
- `QasExpansionItem`: Adicionado componente de card expansivo.

### Modificado
- `QasGridGenerator`: Ao utilizar o `use-inline`, os titulos não terão `text-bold`.

## [3.15.0-beta.13] - 22-04-2024
### Corrigido
- `QasActionsMenu`: Corrigido props defaults que estavam faltando no componente após a refatoração/redesign (`{ useHoverOnWhiteColor: true, useLabelOnSmallScreen: false }`).

## [3.15.0-beta.12] - 19-04-2024
### Adicionado
- `QasGridGenerator`:
  - Adicionado prop `useEllipsis` que por default é `true`, que irá adicionar a classe `ellipsis` em cada item do grid.
  - Adicionado prop `useInline` para mudar a disposição dos campos para ser por linha, ou seja, header e content ocupando a linha toda.
  - Adicionado title ao header e content ao utilizar a prop `useEllipsis`.
- [`QasFormGenerator`, `QasGridGenerator`]: Adicionado prop `useCommonColumns` onde será possível passar um único objeto com seus breakpoints e será replicado para todos fields.

### Corrigido
- `QasGridGenerator`: Corrigido comportamento da propriedade `columns` quando passado com valores `col`, exemplo `{ lg: 'col' }`.

## [3.15.0-beta.11] - 18-04-2024
### Adicionado
- `QasStepperFormView`: Adicionado componente de gerador de steppers de formulário, utilizando o `QasSteppers`.

### Corrigido
- Adicionado um `max-width` no `QasCard` para ajustar o overflow do seu conteúdo.

## [3.15.0-beta.10] - 12-04-2024
### Adicionado
- `Spacing.js`: Adicionado espaçamentos `4xl e 5xl`.
- `QasStepper`: Adicionado componente de stepper.

### Corrigido
- `QasBtnDropdown`: corrigido classes para o funcionamento do "ellipsis".
- `QasAppMenu`: corrigido o uso do `QasBtnDropdown`.

## [3.15.0-beta.9] - 04-04-2024
## BREAKING CHANGES
- `QasBtnDropdown`:
  - removido propriedade `buttonProps`;
  - removido slot `left-button`.
- `QasActionsMenu`:
  - modificado comportamento, agora caso esteja usando a prop `splitName` e tenha 2 itens na lista, o componente deixará os botões um ao lado do outro.
  - antes o componente utilizava `QasBtnDropDown` quando tinha mais de 1 item e `QasBtn` quando tinha apenas 1 item, agora ele sempre utiliza o `QasBtnDropdown`.
  - propriedade `buttonProps` é aplicada quando o componente esta no modo "Opções", que é quando não utiliza o `splitName` ou esteja no `mobile`.
  - `QasActionsMenu`: removido propriedade `dropdownIcon`, uma vez que é possível passar pelo `buttonProps`.

### Adicionado
- `QasUploader`: adicionado método de `reset` caso queira resetar o campo externamente.
- `QasBtnDropdown`:
  - adicionado nova propriedade `buttonsPropsList`.
  - adicionado nova propriedade `disable`.
  - adicionado novo slot `bottom-[buttons-props-list-key]`.
- `QasActionsMenu`: adicionado nova propriedade `disable`.
- `use-query-cache`: adicionado função para limpar todos os filtros cacheados.

### Modificado
- `QasBtnDropdown`: alterado componente para receber uma lista de botões.
- `QasActionsMenu`:
  - modificado comportamento, agora caso esteja usando a prop `splitName` e tenha 2 itens na lista, o componente deixará os botões um ao lado do outro.
  - antes o componente utilizava `QasBtnDropDown` quando tinha mais de 1 item e `QasBtn` quando tinha apenas 1 item, agora ele sempre utiliza o `QasBtnDropdown`.
  - propriedade `buttonProps` é aplicada quando o componente esta no modo "Opções", que é quando não utiliza o `splitName` ou esteja no `mobile`.
- `QasAppUser`: alterado componente para usar o `reset` do `use-query-cache` ao realizar a troca de vínculo, fazendo com que seja resetado todo os filtros previamente cacheados.

### Corrigido
- `QasUploader`: corrigido valor do emit ao remover um item do uploader, pois estava quebrando no caso do uso `use-object-model`.

### Removido
- `QasActionsMenu`: removido propriedade `dropdownIcon`, uma vez que é possível passar pelo `buttonProps`.
- `QasBtnDropdown`:
  - removido propriedade `buttonProps`.
  - removido slot `left-button`.

## [3.15.0-beta.8] - 14-03-2024
### Corrigido
- `QasAppMenu`: Correção temporária (ou permanente caso não seja resolvido no quasar), bug que ocorria com o QDrawer quando usado com a versão do vue `v3.4+`, onde era removido o scroll da pagina quando ocorria um resize na pagina de desktop pra mobile.

## [3.15.0-beta.7] - 11-03-2024
### Corrigido
- `boot/notifications`: corrigido a forma de passar o token para o método `setLaravelEcho`, onde precisou de uma validação para formatar o token passando o valor correto.

## [3.15.0-beta.6] - 04-03-2024
## BREAKING CHANGES
- `QasBoardGenerator`:
  - props `results` alterada para `headers`,
  - `v-model` agora é recuperado pelo `v-model:results`.
  - alterado prop `use-shallow-ref` para `use-mark-raw`.

### Adicionado
- `QasBoardGenerator`: 
  - adicionado eventos `fetch-columns-success`, `fetch-columns-error`, `fetch-column-success` e `fetch-column-error`.
  - adicionado prop `lazy-loading-fields-keys`.

### Modificado
- `QasBoardGenerator`: 
  - alterado prop `results` para `headers`.
  - `v-model` agora é recuperado pelo `v-model:results`.
  - alterado prop `use-shallow-ref` para `use-mark-raw`.

## [3.15.0-beta.5] - 01-03-2024
### Modificado
- `QasNestedFields`: alterado comportamento da propriedade `formGutter`, agora ela é repassada para o componente `QasFormGenerator` e utilizada nos espaçamentos dos campos do formulário.

## [3.15.0-beta.4] - 01-03-2024
### Modificado
- `QasOptionGroup`: alterado componente para sobrescrever a prop `inline`.

## [3.15.0-beta.3] - 28-02-2024
## BREAKING CHANGES
- `QasCard`: Componente agora se chama `QasCardImage`, pois agora foi criado um novo componente com o nome  de `QasCard` (`QasCard <-> QasCardImage`).

### Adicionado
- `QasCard` (novo): adicionado novo componente de card tendo o nome do antigo `QasCard`, pois este card não depende de imagens.
- `QasBoardGenerator`: adicionado componente de board, responsável pela exibição e busca dos dados de um board de colunas.

### Modificado
- `QasCard` (antigo): Alterado nome do componente para `QasCardImage`, uma vez que ele é um card com imagens.

## [3.15.0-beta.2] - 28-02-2024
### Adicionado
- `utils/scroll.scss`: Adicionado classe `secondary-scroll` com um estilo de scroll mais sútil em relação a padrão.

### Modificado
- `QasAppUser`: Alterado do menu "Editar" para "Perfil", uma vez que agora a pagina do /me não é somente para editar.

## [3.15.0-beta.1] - 21-02-2024
### Corrigido
- `QasGrabbable`:
  - corrigido problema do conteúdo ser alterado após o componente ser montado e o grab não ser ajustado de acordo com o novo conteúdo.
  - corrigido z-index do fade lateral.

## [3.15.0-beta.0] - 21-02-2024
### Adicionado
- `QasGrabbable`: adicionado componente de scroll em uma determinada área (elemento) ao realizar evento de grab (puxar/agarrar) com o mouse/touch.
- `helpers/setScrollOnGrab`: 
  - adicionado opções de callback após eventos de grab: `onMoveFn`, `onGrabFn` e `onScrollFn`.
  - adicionado suporte a dispositivos com touch.
  - adicionado estilos padrões no container para desabilitar click ao realizar o grab.
- `QasFilters`: 
  - adicionado model `filters` para controlar os filtros ativos.
  - adicionado suporte a campos do filtro com lazy loading.
- `QasSelect`: adicionado prop `useFetchOptionsOnFocus` para controlar se deve buscar as opções somente ao realizar foco no select.
- `search-filter`: adicionado evento `update:selectedOptions` para retornar as opções selecionadas (label e value).

### Corrigido
- `QasTableGenerator`: corrigido ação de click na linha ao realizar o scroll horizontal na tabela.

### Removido
- `helpers/setScrollOnGrab`: removido função interna `haveMoved`.

## [3.14.0] - 20-02-2024
## BREAKING CHANGES
- `QasDateTimeInput`: removido métodos blur e focus que não estavam sendo utilizados.
- `QasAppUser`: removido propriedade `notifications`, agora quem faz o controle de notificações é o `QasLayout`.
- `QasDate`: removido propriedade `useUnmaskEvents`, uma vez que ela não era utilizada para nada dentro do componente.

### Adicionado
- `QasWhatsappLink`: adicionado novo componente de link para o Whatsapp.
- `QasChartView`:
  - adicionado propriedade `before-fetch` para controlar o fetch de dados do componente.
  - adicionado chamada do evento `onUpdate:currentFilters` repassado para a propriedade `filters-props`.
- Adicionado novo componente `QasDrawer`.
- `QasLayout`:
  - adicionado nova propriedade `initialUnreadNotificationsCount`.
  - expondo método `toggleNotificationsDrawer` para controle externo do drawer de notificações.
- `QasAvatar`: Adicionado nova propriedade `useCropTitle` com default "true", para controlar se o titulo será cortado ou não.
- `QasInfiniteScroll`: Adicionado dois novos eventos `fetch-success` e `fetch-error`.
- Adicionado novo composable `useNotifications`.
- `QasListItems`: Adicionado nova propriedade `useBox` com default `true` para controlar se o componente vai ter um `QasBox` ou `div`.

### Corrigido
- `QasAppUSer`: corrigido select de empresa quando o select possuía busca, que ao clicar no botão de limpar, não limpava e ainda tentava alterar o vinculo para um vinculo vazio.
- `QasActionsMenu`: Corrigido problema da const `hasDelete` do composable `useDelete`, onde não estava reativo pois não foi feito como computada.
- `QasUploader`: corrigido circular dependency que estava causando estouro de memoria, apesar de não afetar o funcionando aparente do componente.
- `QasNumericInput`: corrigido problema no componente que, mesmo desativado, permitia a edição do valor. Agora, o input permanece inacessível quando desabilitado.
- `QasLayout`: propriedade "initialUnreadNotificationsCount" só era escutada por uma vez, o que gerava problemas quando os dados eram alterados.
- `QasDrawer`: loading estava quebrando no mobile.
- `QasDate`: Corrigido exibição de eventos com mais de 3 dígitos no calendário.
- `QasDate`: Corrigido exibição de eventos em dias inativos.

### Modificado
- Alterado componentes para Composition API:
  - QasBtnDropdown.
  - QasCard.
  - QasCheckboxGroup.
  - QasCopy.
  - QasDate.
  - QasDateTimeInput.
  - QasDebugger.
  - QasDelete.
  - QasDialogRouter.
  - QasGallery.
  - QasGalleryCard.
  - QasHeaderActions.
  - QasLabel.
  - QasListItems.
  - QasMap.
  - QasPageHeader.
  - QasPagination.
  - QasTabsGenerator.
- Adicionado prefixo de `props` nas propriedades dentro do template:
  - QasAppAlert: [text].
  - QasAppBar: [brand, title].
  - QasAppMenu: [items, title].
  - QasAppUser: [users, notifications].
  - QasAvatar: [image, icon, title].
  - QasBreakline: [tag, icon, title].
  - QasDialog: [card, persistent, useForm].
  - QasFormGenerator: [fieldsProps, modelValue, errors].
  - QasGridGenerator: [headerClass, contentClass].
  - QasTimeline: [list].
- Modificado nome `emits` para `emit` no script setup:
  - QasAppBar.
  - QasAppMenu.
  - QasAppUser.
  - QasBtnDropdown.
- Modificado $attrs para useAttrs() no template:
  - QasBreakline.
  - QasDialog.
- Modificado slots para useSlots() no template:
  - QasSelectListDialog.
- `/ui/src/vue-plugin.js`: adicionado método `getAction` do `@bildvitta/store-adapter` na variável global `qas` para conseguir utiliza-lo no composition API (NÃO UTILIZAR NO PROJETO).
- `QasLayout`: modificado para Composition API.
- `QasAvatar`: modificado prop `color` para aceitar nova cor: `red-14`.
- `QasCard`: modificado classe `w-full` para `full-width` do quasar.
- `QasDialog` modificado dialog para funcionamento do novo componente `QasDrawer`, uma vez que o mesmo utilizar o `QasDialog`.
- `QasListItems`: Modificado estilos de espaçamento.
- `ui/src/css/plugins/notify.scss`: modificado estilos para adaptar notify da central de notificações.
- `QasDate`:
  - modificado largura mínima da exibição do mês no calendário.
  - modificado estilo do dia atual.
  - modificado estilo dos dias com eventos, agora os dias ficam alinhados no mesma direção de dias sem eventos.
- `QasWhatsappLink`: modificado propriedade `calling-code` para aceitar o tipo `Number`.
- `QasDrawer`: adicionado default `60%` na propriedade `maxWidth`.
- `QasListItens`:
  - alterado cor do botão de `primary` para `grey-10`.
  - alterado espaçamento entre itens de `lg` para `md`.
  - removido `v-ripple` para se adequar ao design.
- `QasListItens`: resetado `min-height` que existia no q-item.

### Removido
- `QasDate`: removido propriedade `useUnmaskEvents`, uma vez que ela não era utilizada para nada dentro do componente.
- `QasDateTimeInput`: removido métodos blur e focus que não estavam sendo utilizados.
- `QasAppUser`: removido propriedade `notifications`, agora quem faz o controle de notificações é o `QasLayout`.

## [3.14.0-beta.10] - 16-02-2024
### Corrigido
- `QasDate`: Corrigido exibição de eventos em dias inativos.

## [3.14.0-beta.9] - 15-02-2024
### Modificado
- `QasListItens`: resetado `min-height` que existia no q-item.

## [3.14.0-beta.8] - 15-02-2024
### Modificado
- `QasListItens`:
  - alterado cor do botão de `primary` para `grey-10`.
  - alterado espaçamento entre itens de `lg` para `md`.
  - removido `v-ripple` para se adequar ao design.

## [3.14.0-beta.7] - 15-02-2024
### Corrigido
- `QasDate`: Corrigido exibição de eventos com mais de 3 dígitos no calendário.

## [3.14.0-beta.6] - 02-02-2024
### Corrigido
- `QasDrawer`: loading estava quebrando no mobile.

### Modificado
- `QasDrawer`: adicionado default `60%` na propriedade `maxWidth`.

## [3.14.0-beta.5] - 02-02-2024
### Corrigido
- `QasLayout`: propriedade "initialUnreadNotificationsCount" só era escutada por uma vez, o que gerava problemas quando os dados eram alterados.

## [3.14.0-beta.4] - 01-02-2024
### Modificado
- `QasDate`:
  - modificado largura mínima da exibição do mês no calendário.
  - modificado estilo do dia atual.
  - modificado estilo dos dias com eventos, agora os dias ficam alinhados no mesma direção de dias sem eventos.
- `QasWhatsappLink`: modificado propriedade `calling-code` para aceitar o tipo `Number`.

## [3.14.0-beta.3] - 01-02-2024
## BREAKING CHANGES
- `QasAppUser`: removido propriedade `notifications`, agora quem faz o controle de notificações é o `QasLayout`.

### Adicionado
- Adicionado novo componente `QasDrawer`.
- `QasLayout`:
  - adicionado nova propriedade `initialUnreadNotificationsCount`.
  - expondo método `toggleNotificationsDrawer` para controle externo do drawer de notificações.
- `QasAvatar`: Adicionado nova propriedade `useCropTitle` com default "true", para controlar se o titulo será cortado ou não.
- `QasInfiniteScroll`: Adicionado dois novos eventos `fetch-success` e `fetch-error`.
- Adicionado novo composable `useNotifications`.
- `QasListItems`: Adicionado nova propriedade `useBox` com default `true` para controlar se o componente vai ter um `QasBox` ou `div`.

### Modificado
- `QasLayout`: modificado para Composition API.
- `QasAvatar`: modificado prop `color` para aceitar nova cor: `red-14`.
- `QasCard`: modificado classe `w-full` para `full-width` do quasar.
- `QasDialog` modificado dialog para funcionamento do novo componente `QasDrawer`, uma vez que o mesmo utilizar o `QasDialog`.
- `QasListItems`: Modificado estilos de espaçamento.
- `ui/src/css/plugins/notify.scss`: modificado estilos para adaptar notify da central de notificações.

### Removido
- `QasAppUser`: removido propriedade `notifications`, agora quem faz o controle de notificações é o `QasLayout`.

## [3.14.0-beta.2] - 29-01-2024
### Adicionado
- `QasWhatsappLink`: adicionado novo componente de link para o Whatsapp.
- `QasChartView`:
  - adicionado propriedade `before-fetch` para controlar o fetch de dados do componente.
  - adicionado chamada do evento `onUpdate:currentFilters` repassado para a propriedade `filters-props`.

### Corrigido
- `QasUploader`: corrigido circular dependency que estava causando estouro de memoria, apesar de não afetar o funcionando aparente do componente.
- `QasNumericInput`: corrigido problema no componente que, mesmo desativado, permitia a edição do valor. Agora, o input permanece inacessível quando desabilitado.

## [3.14.0-beta.1] - 15-01-2024
## BREAKING CHANGES
- `QasDateTimeInput`: removido métodos blur e focus que não estavam sendo utilizados.

### Corrigido
- `QasActionsMenu`: Corrigido problema da const `hasDelete` do composable `useDelete`, onde não estava reativo pois não foi feito como computada.

### Modificado
- Alterado componentes para Composition API:
  - QasBtnDropdown.
  - QasCard.
  - QasCheckboxGroup.
  - QasCopy.
  - QasDate.
  - QasDateTimeInput.
  - QasDebugger.
  - QasDelete.
  - QasDialogRouter.
  - QasGallery.
  - QasGalleryCard.
  - QasHeaderActions.
  - QasLabel.
  - QasListItems.
  - QasMap.
  - QasPageHeader.
  - QasPagination.
  - QasTabsGenerator.

- Adicionado prefixo de `props` nas propriedades dentro do template:
  - QasAppAlert: [text].
  - QasAppBar: [brand, title].
  - QasAppMenu: [items, title].
  - QasAppUser: [users, notifications].
  - QasAvatar: [image, icon, title].
  - QasBreakline: [tag, icon, title].
  - QasDialog: [card, persistent, useForm].
  - QasFormGenerator: [fieldsProps, modelValue, errors].
  - QasGridGenerator: [headerClass, contentClass].
  - QasTimeline: [list].

- Modificado nome `emits` para `emit` no script setup:
  - QasAppBar.
  - QasAppMenu.
  - QasAppUser.
  - QasBtnDropdown.

- Modificado $attrs para useAttrs() no template:
  - QasBreakline.
  - QasDialog.

- Modificado slots para useSlots() no template:
  - QasSelectListDialog.

- `/ui/src/vue-plugin.js`: adicionado método `getAction` do `@bildvitta/store-adapter` na variável global `qas` para conseguir utiliza-lo no composition API (NÃO UTILIZAR NO PROJETO).

### Removido
- `QasDate`: removido propriedade `useUnmaskEvents`, uma vez que ela não era utilizada para nada dentro do componente.
- `QasDateTimeInput`: removido métodos blur e focus que não estavam sendo utilizados.

## [3.13.1] - 11-01-2024
### Corrigido
- `QasActionsMenu`: Corrigido problema da const `hasDelete` do composable `useDelete`, onde não estava reativo pois não foi feito como computada.

## [3.14.0-beta.0] - 03-01-2024
### Corrigido
- `QasAppUSer`: corrigido select de empresa quando o select possuía busca, que ao clicar no botão de limpar, não limpava e ainda tentava alterar o vinculo para um vinculo vazio.

## [3.13.0] - 27-12-2023
## BREAKING CHANGES
- Anteriormente, o componente `QasFormView` não atualizava automaticamente o v-model após um evento de "submit" com sucesso, o que levava a alguns problemas relacionados a não atualização de certos campos retornados da API. Para resolver isso, implementamos uma mudança para garantir que o `v-model` agora seja sempre atualizado com o resultado retornado pela API após um submit. Isso pode exigir testes para confirmar que o comportamento dos formulários estão alinhados com o esperado.
- `QasAppUser`: removido propriedades `companiesOptions` e `currentCompany` em favor de utilizar a nova propriedade `companyProps`.
- `QasFormView`: modificação do `data-cy` dos botões de "Salvar" e "Voltar" do formulário. Veja mais detalhes na seção "Modificado" abaixo.
- `plugins/Logger`: removido plugin de log, uma vez que o mesmo estava poluindo muito o console, alterado para a lib `debug`.
- `QasDialog`: ref `dialog` interno do componente alterado para `dialogRef`.
- `QasNestedFields`: alterado slot `custom-fields` para se chamar `after-fields`.
- `QasPageHeader`: removido a query dos breadcrumb. Utilize `useCache: true` no meta das rotas onde precisar persistir a query.
- Devido as mudanças de rebranding poderá haver quebras visuais, algumas revisões que deverão ser feitas: 
  - Todos os locais em que é utilizado a cor `grey-9` deverá ser modificado para utilizar a cor `grey-10`, em especial, no componente `QasBtn` que há um validador na propriedade `color` que não deixará `grey-9` ser utilizado, causando um warning no console.
  - Mudanças realizadas no valor das variáveis `primary`, `primary-contrast` e `dark` do arquivo `quasar.variables.scss`, portanto será necessário atualizar essas variáveis com os valores encontrados na seção "Começando - Usando" da documentação.
  - Cor dos headings (h1 ao h6) foi adicionado por padrão no Asteroid, portanto, se tornando desnecessário passar classe de cor para os mesmos.

### Adicionado
- `QasTabsGenerator`: adicionado nova propriedade `use-route-tab` com o valor `false` por padrão. Essa propriedade serve para controlar se o componente deve utilizar o `q-route-tab` ou `q-tab` do Quasar.
- `QasInfiniteScroll`: novo componente de infinite scroll.
- `api.js`: adicionado `provide` do axios por conta de composition components não terem acesso ao `globalProperties`.
- `QasDialog`: adicionado novos eventos `@ok` que dispara toda vez que é clicado no botão "ok" ou quando useForm for true e o for clicado "enter" estando com foco em algum input (evento de submit).
- `QasDialog`: adicionado novos eventos `@cancel` que dispara toda vez que é clicado no botão "cancel".
- `QasAppUser`: adicionado 2 novos `data-cy`, `data-cy="app-user"` e `data-cy="app-user-companies-select"`.
- `helpers/promiseHandler`: adicionado nova opção `loadingConfig` para personalizar o loading.
- `QasAppUser`: adicionado nova propriedade `companyProps` que repassa todas as props para o select de vínculos.
- `QasGalleryCard`: adicionado novas propriedades `errorMessage` e `errorIcon` para controlar conteúdo quando dar falha ao carregar imagem.
- `QasGalleryCard`: adicionado novo slot `image-error-icon` para controle de ícone.
- `QasDialog`: adicionado `data-cy` em algumas seções do componente. Como, por exemplo: título, descrição, botões, etc.
- `QasFormView`: adicionado nova propriedade `useNotifySuccess` para controlar quando mostrar a notificação de sucesso (utilizar somente em casos muito específicos, olhar documentação).
- `enums/Align`: adicionado novo enum `FlexAlign` para alinhamentos.
- `QasNestedFields`: adicionado nova prop `fieldsHandlerFn` para para controlar a visibilidade dos campos do formulário.
- `QasNestedFields`: adicionado novo slot `before-fields` para renderizar conteúdo antes dos campos do formulário.
- `vue-plugin.js`: Adicionado provider `qas`.
- `components/base.scss`: adicionado `color: $grey-8` como cor de texto padrão do `body`.
- `typography.scss`: adicionado propriedade `color: $grey-10` como cor de texto padrão do headings (h1 ao h6).
- [`checkbox.scss`, `editor.scss`, `field.scss`, `radio.scss`, `toggle.scss`]: adicionado tipografia padrão.
- [`QasNestedFields`, `QasActionsMenu`]: adicionado novos seletores `data-cy` no componente.

### Corrigido
- `QasFormView`: corrigido alguns problemas ao utilizar a propriedade `use-dialog-on-unsaved-changes` com o valor `true`.
- `QasFormView`: corrigido problema ao alterar valores do formulário, salvar e o `v-model` do formulário ficar desatualizado em relação ao resultado retornado da API. Agora o `v-model` é sempre atualizado com o resultado retornado pela API após um submit.
- `QasDialog`: corrigido bug que fazia que pagina recarregasse ao dar enter quando a prop useForm tinha o valor "true".
- `QasInfiniteScroll`: corrigido problema do componente não resetar ao utilizar o método `refresh` em alguns cenários.
- `QasDialog`: corrigido evento de `onClick` no botão de "ok" quando o `useForm` é `true`.
- `helpers/promiseHandler`: corrigido `Loading.hide()` que era executado mesmo quando a flag `useLoading` era false, isto fazia que cancelasse qualquer loading da aplicação.
- `Notify`: alterado notify para aplicar estilos nos actions somente em NotifySuccess e NotifyError, uma vez que da forma anterior esta afetando todos os casos.
- `QasActions`: corrigido computada `defaultGutter` que sempre retornava `md` ou `lg`, ignorando a prop `gutter`.
- `QasAppMenu`: corrigido props que estavam sendo usado como se estivesse em `Options API`.
- `QasAppMenu`: corrigido modules que não estava usando `defaultModules`.
- `QasAppMenu`: corrigido computada `currentModelOption`.
- `QasActionsMenu`: corrigido problema de a ação de deletar não funcionar após alteração do componente para Composition API.
- `QasDialog`: corrigido problema de não emitir o evento `@hide`.
- `plugins/Dialog.js`: corrigido problema de não retornar a instância do dialog.
- `ErrorComponent`: corrigido problema na exibição da cor de fundo.
- `QasAppMenu`: corrigido problema na animação de abrir e fechar do menu.- `QasAppMenu`: corrigido problema na animação de abrir e fechar do menu.

### Modificado
- `QasDialog`: agora a seção de `actions` foi movida para dentro do QForm, isto faz com que ao clicar enter, o botão deja disparado mesmo que não tenha sido clicado (quando useForm for true).
- `QasUploader`: propriedade `galleryCardProps` agora aceita callback function, para ter controle personalizado por card.
- `QasGalleryCard`: modificado estilo de card para erro.
- `QasFormView`: modificado `data-cy` do botão de "Salvar" para `data-cy="form-view-submit-btn-[entity]"`.
- `QasFormView`: modificado `data-cy` do botão de "Voltar" para `data-cy="form-view-cancel-btn-[entity]"`.
- [`QasListView`, `QasFormView`, `QasSingleView`, `QasFilters`, `QasNestedField`]: alterado plugin `Logger` para lib `debug` e simplificado os logs.
- `QasNestedFields`: alterado prop `fieldsProps` para aceitar uma função de callback.
- `QasNestedFields`: alterado slot `custom-fields` para se chamar `after-fields`. O slot `after-fields` é renderizado após os campos do formulário.
- `QasNestedFields`: alterado tipo da propriedade `formColumns` para aceitar `array`, `string` ou `object`.
- `QasActions`: alterado componente para Composition API.
- `QasActionsMenu`: alterado componente para Composition API.
- `QasAppBar`: alterado componente para Composition API.
- `QasAppMenu`: alterado componente para Composition API.
- `QasAppUser`: alterado componente para Composition API.
- `QasAvatar`: alterado componente para Composition API.
- `QasBadge`: alterado componente para Composition API.
- `QasBox`: alterado componente para Composition API.
- `QasBtn`: alterado componente para Composition API.
- `QasDialog`: alterado componente para Composition API.
- `QasAppUser`: alterado `default` da propriedade `avatarSize` para `40px`.
- `QasAppUser`: alterado `dataCy` para `data-cy`.
- `QasBadge`: alterado `default` da propriedade `text-color` para `black`.
- `QasBtn`: alterado `validator` da propriedade `color` para permitir `grey-10` no lugar de `grey-9`.
- `QasLabel`: alterado `default` da propriedade `color` para `grey-10`.
- `typography.scss`: alterado `size` do heading `h4` para `1.25rem` (20px).
- `quasar.variables.scss`: alterado variáveis de cores `primary`, `primary-contrast` e `dark`.
- `QasAppBar`: alterado `max-width` da logo para `115px`.
- `QasTableGenerator`: alterado hover da cor de fundo da linha da tabela para a cor de background padrão.

### Removido
- `QasAppUser`: removido propriedades `companiesOptions` e `currentCompany` em favor de utilizar a nova propriedade `companyProps`.
- `plugins/Logger`: removido plugin de log, uma vez que o mesmo estava poluindo muito o console, alterado para a lib `debug`.
- `QasTableGenerator`: removido logger desnecessário.
- `QasPageHeader`: removido a query dos links do breadcrumb.

## [3.13.0-beta.19] - 22-12-2023
### Corrigido
- `QasAppMenu`: corrigido problema na animação de abrir e fechar do menu.

## [3.13.0-beta.18] - 20-12-2023
### Modificado
- `QasTableGenerator`: alterado hover da cor de fundo da linha da tabela para a cor de background padrão.

### Corrigido
- `ErrorComponent`: corrigido problema na exibição da cor de fundo.

## [3.13.0-beta.17] - 19-12-2023
### Modificado
- `QasAppBar`: alterado `max-width` da logo para `115px`.

## [3.13.0-beta.16] - 18-12-2023
## BREAKING CHANGE
Devido as mudanças de rebranding poderá haver quebras visuais, algumas revisões que deverão ser feitas: 
- Todos os locais em que é utilizado a cor `grey-9` deverá ser modificado para utilizar a cor `grey-10`, em especial, no componente `QasBtn` que há um validador na propriedade `color` que não deixará `grey-9` ser utilizado, causando um warning no console.  
- Mudanças realizadas no valor das variáveis `primary`, `primary-contrast` e `dark` do arquivo `quasar.variables.scss`, portanto será necessário atualizar essas variáveis com os valores encontrados na seção "Começando - Usando" da documentação.
- Cor dos headings (h1 ao h6) foi adicionado por padrão no Asteroid, portanto, se tornando desnecessário passar classe de cor para os mesmos.

### Adicionado
- `components/base.scss`: adicionado `color: $grey-8` como cor de texto padrão do `body`.
- `typography.scss`: adicionado propriedade `color: $grey-10` como cor de texto padrão do headings (h1 ao h6).
- [`checkbox.scss`, `editor.scss`, `field.scss`, `radio.scss`, `toggle.scss`]: adicionado tipografia padrão.
- [`QasNestedFields`, `QasActionsMenu`]: adicionado novos seletores `data-cy` no componente.

### Modificado
- `QasAppUser`: alterado `default` da propriedade `avatarSize` para `40px`.
- `QasBadge`: alterado `default` da propriedade `text-color` para `black`.
- `QasBtn`: alterado `validator` da propriedade `color` para permitir `grey-10` no lugar de `grey-9`.
- `QasLabel`: alterado `default` da propriedade `color` para `grey-10`.
- `typography.scss`: alterado `size` do heading `h4` para `1.25rem` (20px).
- `quasar.variables.scss`: alterado variáveis de cores `primary`, `primary-contrast` e `dark`.

## [3.13.0-beta.15] - 11-12-2023
## BREAKING CHANGE
- `QasPageHeader`: removido a query dos breadcrumb. Utilize `useCache: true` no meta das rotas onde precisar persistir a query.

### Removido
- `QasPageHeader`: removido a query dos links do breadcrumb.

## [3.13.0-beta.14] - 07-12-2023
### Corrigido
- `QasDialog`: corrigido problema de não emitir o evento `@hide`.
- `plugins/Dialog.js`: corrigido problema de não retornar a instância do dialog.

## [3.13.0-beta.13] - 07-12-2023
### Adicionado
- `vue-plugin.js`: Adicionado provider `qas`.

### Corrigido
- `QasActionsMenu`: corrigido problema de a ação de deletar não funcionar após alteração do componente para Composition API.

## [3.13.0-beta.12] - 30-11-2023
### Corrigido
- `QasAppMenu`: corrigido computada `currentModelOption`.

## [3.13.0-beta.11] - 30-11-2023
### Corrigido
- `QasAppMenu`: corrigido modules que não estava usando `defaultModules`.

## [3.13.0-beta.10] - 30-11-2023
### Corrigido
- `QasAppMenu`: corrigido props que estavam sendo usado como se estivesse em `Options API`.

## [3.13.0-beta.9] - 28-11-2023
## BREAKING CHANGE
- `QasDialog`: ref `dialog` interno do componente alterado para `dialogRef`.
- `QasNestedFields`: alterado slot `custom-fields` para se chamar `after-fields`.

### Adicionado
- `enums/Align`: adicionado novo enum `FlexAlign` para alinhamentos.
- `QasNestedFields`: adicionado nova prop `fieldsHandlerFn` para para controlar a visibilidade dos campos do formulário.
- `QasNestedFields`: adicionado novo slot `before-fields` para renderizar conteúdo antes dos campos do formulário.

### Corrigido
- `QasActions`: corrigido computada `defaultGutter` que sempre retornava `md` ou `lg`, ignorando a prop `gutter`.

### Modificado
- `QasNestedFields`: alterado prop `fieldsProps` para aceitar uma função de callback.
- `QasNestedFields`: alterado slot `custom-fields` para se chamar `after-fields`. O slot `after-fields` é renderizado após os campos do formulário.
- `QasNestedFields`: alterado tipo da propriedade `formColumns` para aceitar `array`, `string` ou `object`.
- `QasActions`: alterado componente para Composition API.
- `QasActionsMenu`: alterado componente para Composition API.
- `QasAppBar`: alterado componente para Composition API.
- `QasAppMenu`: alterado componente para Composition API.
- `QasAppUser`: alterado componente para Composition API.
- `QasAvatar`: alterado componente para Composition API.
- `QasBadge`: alterado componente para Composition API.
- `QasBox`: alterado componente para Composition API.
- `QasBtn`: alterado componente para Composition API.
- `QasDialog`: alterado componente para Composition API.

## [3.13.0-beta.8] - 22-11-2023
## BREAKING CHANGE
- `plugins/Logger`: removido plugin de log, uma vez que o mesmo estava poluindo muito o console, alterado para a lib `debug`.

### Modificado
- [`QasListView`, `QasFormView`, `QasSingleView`, `QasFilters`, `QasNestedField`]: alterado plugin `Logger` para lib `debug` e simplificado os logs.

### Removido
- `plugins/Logger`: removido plugin de log, uma vez que o mesmo estava poluindo muito o console, alterado para a lib `debug`.
- `QasTableGenerator`: removido logger desnecessário.

## [3.13.0-beta.7] - 07-11-2023
## BREAKING CHANGES
- `QasFormView`: modificação do `data-cy` dos botões de "Salvar" e "Voltar" do formulário. Veja mais detalhes na seção "Modificado" abaixo.

### Adicionado
- `QasDialog`: adicionado `data-cy` em algumas seções do componente. Como, por exemplo: título, descrição, botões, etc.
- `QasFormView`: adicionado nova propriedade `useNotifySuccess` para controlar quando mostrar a notificação de sucesso (utilizar somente em casos muito específicos, olhar documentação).

### Corrigido
- `QasAppUser`: alterado `dataCy` para `data-cy`.

### Modificado
- `QasFormView`: modificado `data-cy` do botão de "Salvar" para `data-cy="form-view-submit-btn-[entity]"`.
- `QasFormView`: modificado `data-cy` do botão de "Voltar" para `data-cy="form-view-cancel-btn-[entity]"`.

## [3.13.0-beta.6] - 03-11-2023
### Adicionado
- `QasGalleryCard`: adicionado novas propriedades `errorMessage` e `errorIcon` para controlar conteúdo quando dar falha ao carregar imagem.
- `QasGalleryCard`: adicionado novo slot `image-error-icon` para controle de ícone.

### Modificado
- `QasUploader`: propriedade `galleryCardProps` agora aceita callback function, para ter controle personalizado por card.
- `QasGalleryCard`: modificado estilo de card para erro.

## [3.13.0-beta.5] - 01-11-2023
### Corrigido
- `Notify`: alterado notify para aplicar estilos nos actions somente em NotifySuccess e NotifyError, uma vez que da forma anterior esta afetando todos os casos.

## [3.13.0-beta.4] - 26-10-2023
### Corrigido
- `helpers/promiseHandler`: corrigido `Loading.hide()` que era executado mesmo quando a flag `useLoading` era false, isto fazia que cancelasse qualquer loading da aplicação.

## [3.13.0-beta.3] - 25-10-2023
## BREAKING CHANGES
- `QasAppUser`: removido propriedades `companiesOptions` e `currentCompany` em favor de utilizar a nova propriedade `companyProps`.

### Adicionado
- `QasAppUser`: adicionado nova propriedade `companyProps` que repassa todas as props para o select de vínculos.

### Removido
- `QasAppUser`: removido propriedades `companiesOptions` e `currentCompany` em favor de utilizar a nova propriedade `companyProps`.

## [3.13.0-beta.2] - 19-10-2023
### Adicionado
- `helpers/promiseHandler`: adicionado nova opção `loadingConfig` para personalizar o loading.

## [3.13.0-beta.1] - 13-10-2023
### Corrigido
- `QasInfiniteScroll`: corrigido problema do componente não resetar ao utilizar o método `refresh` em alguns cenários.
- `QasDialog`: corrigido evento de `onClick` no botão de "ok" quando o `useForm` é `true`.

## [3.13.0-beta.0] - 11-10-2023
## BREAKING CHANGES
- Anteriormente, o componente `QasFormView` não atualizava automaticamente o v-model após um evento de "submit" com sucesso, o que levava a alguns problemas relacionados a não atualização de certos campos retornados da API. Para resolver isso, implementamos uma mudança para garantir que o `v-model` agora seja sempre atualizado com o resultado retornado pela API após um submit. Isso pode exigir testes para confirmar que o comportamento dos formulários estão alinhados com o esperado.

### Adicionado
- `QasTabsGenerator`: adicionado nova propriedade `use-route-tab` com o valor `false` por padrão. Essa propriedade serve para controlar se o componente deve utilizar o `q-route-tab` ou `q-tab` do Quasar.
- `QasInfiniteScroll`: novo componente de infinite scroll.
- `api.js`: adicionado `provide` do axios por conta de composition components não terem acesso ao `globalProperties`.
- `QasDialog`: adicionado novos eventos `@ok` que dispara toda vez que é clicado no botão "ok" ou quando useForm for true e o for clicado "enter" estando com foco em algum input (evento de submit).
- `QasDialog`: adicionado novos eventos `@cancel` que dispara toda vez que é clicado no botão "cancel".
- `QasAppUser`: adicionado 2 novos `data-cy`, `data-cy="app-user"` e `data-cy="app-user-companies-select"`.

### Corrigido
- `QasFormView`: corrigido alguns problemas ao utilizar a propriedade `use-dialog-on-unsaved-changes` com o valor `true`.
- `QasFormView`: corrigido problema ao alterar valores do formulário, salvar e o `v-model` do formulário ficar desatualizado em relação ao resultado retornado da API. Agora o `v-model` é sempre atualizado com o resultado retornado pela API após um submit.
- `QasDialog`: corrigido bug que fazia que pagina recarregasse ao dar enter quando a prop useForm tinha o valor "true".

### Modificado
- `QasDialog`: agora a seção de `actions` foi movida para dentro do QForm, isto faz com que ao clicar enter, o botão deja disparado mesmo que não tenha sido clicado (quando useForm for true).

## [3.12.0] - 10-10-2023
## BREAKING CHANGES
- `QasTextTruncate`: quebra visual por conta das alterações de estilos na fonte do texto, olhar todos lugares que utilizam o componente e caso necessário adaptar com as propriedades color e typography.
- `QasAlert`: removido propriedades [`color`, `title`].
- `QasAlert`: removido slot header.
- `boot/query-cache.js`: modificado o valor padrão do `useCache`, antes todas rotas por default era `true`, agora, apenas rotas que contém a chave `name` e o name termine com a string `list` ou `List` terão `true` como padrão.
- `QasSelectListDialog`: os parâmetros retornados no evento add, retornava o próprio model (array de uuid), agora retorna um array de objeto com label e value somente dos itens que foram adicionados.

### Adicionado
- `QasTextTruncate`: adicionado propriedades `color` e `typography` para controlar estilo da fonte.
- `QasTextTruncate` adicionado propriedades, `maxVisibleItem`, `list` e `useObjectList` para recurso de contador.
- `QasTimeline`: novo componente de timeline.
- `QasSelectListDialog`: adicionado novo componente de seleção de lista através de um dialog.
- `boot/queryCache`: boot para gerenciar a persistência de filtros.
- `useQueryCache`: composable para manipular as queries salvas no sessionStorage.
- `useContext`: composable para pegar os dados da query no formato padrão do asteroid.
- `boot/queryCache`: adicionado query `page` como excludes padrão.
- `QasNestedFields`: Adicionado suporte para função de callback na propriedade `disabled-rows`.
- `QasAlert`: adicionado novas propriedades [`status`, `storageKey`, `usePersistentModelOnClose`].
- `enums/Status`: adicionado novos enums para status.
- `QasNestedFields`: adicionado suporte para função de callback na propriedade `actions-menu-props`.
- `QasLabel`: adicionado nova propriedade `typography` para controlar a tipografia do texto.
- `QasUploader`: adicionado propriedade `useUrlPath` para dar possibilidade de salvar base64 no model ao invés de uma url externa (uso offline).
- `QasUploader`: adicionado propriedade `uploadCredentialsParams` para repassar parâmetros para o endpoint `upload-credentials`.

### Corrigido
- `QasSelectListDialog`: adicionado propriedade `useLazyLoading` para resolver problema quando usado com slot do `dialog-description`.
- `QasSelect`: corrigido watcher que não removia classe e mantinham opções desabilitadas quando deveriam estar habilitadas.

### Modificado
- `QasAppUser`: modificado validação, agora se tiver pelo menos 1 opção, o select de vinculo é exibido.
- `QasTextTruncate`: modificado cor e tipografia do texto.
- `QasAlert`: mudanças de layout e comportamento com componente.
- `QasAlert`: modificado componente para composition API.
- `QasAlert`: agora só é preciso passar um v-model caso realmente seja necessário.
- `QasAlert`: adicionado classe `inline-block` para o elemento pegar somente o tamanho necessário e não 100% sempre.
- `boot/query-cache.js`: modificado o valor padrão do `useCache`, antes todas rotas por default era `true`, agora, apenas rotas que contém a chave `name` e o name termine com a string `list` ou `List` terão `true` como padrão.
- `QasNestedFields`: modificado espaçamentos do componente.
- `QasNestedFields`: modificado tamanho da fonte do label.
- `QasSelectListDialog`: modificado os parâmetros retornados no evento `@add`, onde agora retorna um array de objeto com label e value dos itens que foram adicionados.

### Removido
- `QasAlert`: removido propriedades [`color`, `title`].
- `QasAlert`: removido slot header.

## [3.12.0-beta.10] - 05-10-2023
## BREAKING CHANGES
- `QasSelectListDialog`: os parâmetros retornados no evento add, retornava o próprio model (array de uuid), agora retorna um array de objeto com label e value somente dos itens que foram adicionados.

### Adicionado
- `QasUploader`: adicionado propriedade `useUrlPath` para dar possibilidade de salvar base64 no model ao invés de uma url externa (uso offline).
- `QasUploader`: adicionado propriedade `uploadCredentialsParams` para repassar parâmetros para o endpoint `upload-credentials`.

### Modificado
- `QasSelectListDialog`: modificado os parâmetros retornados no evento `@add`, onde agora retorna um array de objeto com label e value dos itens que foram adicionados.

## [3.12.0-beta.9] - 29-09-2023
### Adicionado
- `QasNestedFields`: adicionado suporte para função de callback na propriedade `actions-menu-props`.
- `QasLabel`: adicionado nova propriedade `typography` para controlar a tipografia do texto.

### Modificado
- `QasNestedFields`: modificado espaçamentos do componente.
- `QasNestedFields`: modificado tamanho da fonte do label.

## [3.12.0-beta.8] - 13-09-2023
### Corrigido
- `boot/query-cache.js`: added optional chaining to route name.

## [3.12.0-beta.7] - 13-09-2023
## BREAKING CHANGES
- `boot/query-cache.js`: modificado o valor padrão do `useCache`, antes todas rotas por default era `true`, agora, apenas rotas que contém a chave `name` e o name termine com a string `list` ou `List` terão `true` como padrão.

### Modificado
- `boot/query-cache.js`: modificado o valor padrão do `useCache`, antes todas rotas por default era `true`, agora, apenas rotas que contém a chave `name` e o name termine com a string `list` ou `List` terão `true` como padrão.

## [3.12.0-beta.6] - 13-09-2023
### Modificado
- `QasAlert`: adicionado classe `inline-block` para o elemento pegar somente o tamanho necessário e não 100% sempre.

## [3.12.0-beta.5] - 13-09-2023
## BREAKING CHANGES
### Removido
- `QasAlert`: removido propriedades [`color`, `title`].
- `QasAlert`: removido slot header.

### Adicionado
- `QasNestedFields`: Adicionado suporte para função de callback na propriedade `disabled-rows`.
- `QasAlert`: adicionado novas propriedades [`status`, `storageKey`, `usePersistentModelOnClose`].
- `enums/Status`: adicionado novos enums para status.

### Modificado
- `QasAlert`: mudanças de layout e comportamento com componente.
- `QasAlert`: modificado componente para composition API.
- `QasAlert`: agora só é preciso passar um v-model caso realmente seja necessário.

### Removido
- `QasAlert`: removido propriedades [`color`, `title`].
- `QasAlert`: removido slot header.

## [3.12.0-beta.4] - 11-09-2023
### Corrigido
- `QasSelect`: corrigido watcher que não removia classe e mantinham opções desabilitadas quando deveriam estar habilitadas.

## [3.12.0-beta.3] - 08-09-2023
### Corrigido
- `boot/queryCache`: alterada a validação ao definir cache da query para corrigir erro, que, ao limpar os filtros e alterar de página não limpava o cache.

## [3.12.0-beta.2] - 06-09-2023
### Adicionado
- `boot/queryCache`: adicionado query `page` como excludes padrão.

### Corrigido
- `QasSelectListDialog`: adicionado propriedade `useLazyLoading` para resolver problema quando usado com slot do `dialog-description`.

## [3.12.0-beta.1] - 05-09-2023
### Adicionado
- `QasTimeline`: novo componente de timeline.
- `QasSelectListDialog`: adicionado novo componente de seleção de lista através de um dialog.
- `boot/queryCache`: boot para gerenciar a persistência de filtros.
- `useQueryCache`: composable para manipular as queries salvas no sessionStorage.
- `useContext`: composable para pegar os dados da query no formato padrão do asteroid.

## [3.12.0-beta.0] - 04-09-2023
## BREAKING CHANGES
- `QasTextTruncate`: quebra visual por conta das alterações de estilos na fonte do texto, olhar todos lugares que utilizam o componente e caso necessário adaptar com as propriedades color e typography.

### Adicionado
- `QasTextTruncate`: adicionado propriedades `color` e `typography` para controlar estilo da fonte.
- `QasTextTruncate` adicionado propriedades, `maxVisibleItem`, `list` e `useObjectList` para recurso de contador.

### Modificado
- `QasAppUser`: modificado validação, agora se tiver pelo menos 1 opção, o select de vinculo é exibido.
- `QasTextTruncate`: modificado cor e tipografia do texto.

## [3.11.0] - 01-09-2023
## BREAKING CHANGES
- com a adição do `asteroid.config.js`, é **necessário** criar o arquivo na raiz da aplicação para que não quebre a mesma.
- controle do server timeout agora é feito pelo `asteroid.config.js` e não pelo `process.env.SERVER_TIMEOUT`.
- Caso esteja utilizando o componente `QasMap` verificar documentação para configurar corretamente o mesmo.
- `QasSelectList`: removido slot `item-action`, como o componente mudou o layout, esse slot mudaria de lugar, porém o uso dele é desnecessário e pode levar a quebra de Design System.
- `QasSelectList`: removido slot `item-section`, como foi removido o slot `item-action`, não faz mais sentido um slot para o `item-section` pois a estrutura é a mesma, caso necessário, utilizar o slot `item`.
- `QasSelectList`: removido prop `useClickableLabel`, clicar na label agora faz selecionar o item sempre.
- `QasSelectList`: removido scope `handleClick` para `onUpdateModel` no slot `item`.
- `QasSelectList`: removido evento `click-label`.
- `QasSelectList`: nome de eventos alterados de `@added` para `@add` e `@removed` para `@remove`.
- `QasSortable`: removido as props `sorted` e `list`, onde o a ordenação e as options será o próprio v-model.
- `QasNumericInput`: modificado o nome da propriedade `decimalPlaces` para `places`, mantendo assim o padrão de API e do Asteroid.

### Adicionado
- `Delete.js`: adicionado parâmetro `redirectRoute`, onde há a possibilidade de passar uma rota onde será redirecionado após deletar o item.
- `QasDelete`: adicionado prop `redirectRoute` que será repassado para o plugin `Delete`.
- [`useForm`, `useGenerator (privado)`, `useScreen`]: adicionado novos composables.
- `Spacing.js`: adicionado enums de espaçamento.
- `asteroid.config.js`: adicionado novo arquivo de configuração do asteroid.
- Adicionado vitest.
- `QasAlert` adicionado `data-test="alert-title"` na tag h5 de title para testes iniciais.
- `QasSelectList`: adicionado nova prop `emitValue` com default `true`, quando valor é "true", transforma o model em um array de string, senão o model será um array de objeto (não foi usado o nome `useEmitValue` pois existe uma prop para mesma finalidade no QSelect do quasar e ela se chama "emitValue").
- `QasSelectList`: adicionado nova prop `useEmitLabelValueOnly` com default `true`, propriedade para ser usada em conjunto com ':emitValue="false"', caso habilite essa propriedade, o model sempre será um array de objeto com label e value, se estiver desabilitado, o objeto dentro do model será o objeto inteiro, não somente label e value.
- `QasSearchBox`: adicionado nova propriedade `outlined` que define se a área que contém o resultado da pesquisa terá o estilo de borda arredondada com fundo branco (semelhante a um input).
- `QasSelectList`: adicionado novo recurso de limpar seleção.
- Componente de gráficos `QasChartView`.
- Instalação automática das dependências do `QasChartView` via `thirdPartyComponents`.
- `QasSortable`: adicionado v-model para o controle da ordenação.
- `QasField`: adicionado suporte ao parâmetro `places` que será repassado para o componente `QasNumericInput` para definir a quantidade de casas decimais.
- `QasFormView`: adicionado nova prop `formProps` para repassar todas as props/eventos para o `QForm`.
- `QasDialog`: possibilidade de passar a descrição como componente através da prop `description` de dentro do `card`.
- `QasActionsMenu`: adicionado `@click.stop.prevent` solucionando o problema de utilizar o componente em conjunto com o `QasTableGenerator`.
- `QasInput`: adicionado `inputmode` default de acordo com máscaras e type email.
- [`QasDateTimeInput`, `QasNumericInput`]: adicionado `inputmode="numeric"`.
- `QasSearchInput`: adicionado `inputmode="search"`.
- `QasDateTimeInput`: adicionado prop `datePopupProxyProps` para repassar props para o componente `QPopupProxy` do `QDate`.
- `QasDateTimeInput`: adicionado prop `timePopupProxyProps` para repassar props para o componente `QPopupProxy` do `QTime`.
- [`QasLabel`, `QasSelect`, `QasInput`, `QasNumericInput`]: adicionado propriedade `required` para controle de label obrigatória.
- Adicionado novo helper `getRequiredLabel` para retornar label obrigatória normalizada.
- `QasPageHeader`: adicionado `ellipsis` em cada item do `breadcrumbs` setando os mesmo com no máximo `180px`, a partir desse tamanho sera adicionado o ellipsis.
- `QasWelcome`: adicionado componente `QasActionsMenu`.
- `QasWelcome`: adicionado prop `actionsMenuProps` para repassar as props para o componente `QasActionsMenu`.
- `QasFormGenerator`: adicionado possibilidade de passar uma descrição para o `fieldset`.
- Adicionado novo boot font-face que adiciona um loading nos ícones enquanto eles ainda estão carregando.

### Corrigido
- `ui/src/css/components/field.scss`: corrigido seletor de classe que estava deixando com cor no lugar errado.
- `required`: corrigida a validação para `null`.
- `required`: Adicionado ponto final à frase padrão.
- `search-filter.js`: corrigido problema ao limpar diversos campos relacionados a um mesmo campo de filtro.
- `QasSearchBox`: corrigido como é feito o primeiro fetch, antes o evento do infinite scroll era sempre chamado, agora ele espera finalizar o fetch inicial, após isto o infinite scroll é ativado.
- `QasGridGenerator`: corrigido ordem de exibição dos `fields`.
- `rules.js`: validação da função `required`.
- `isEmpty.js`: adicionado novo helper para verificar se um valor é vazio (null, undefined ou '').
- `mixins/searchFilter`: adicionado nova prop `optionsToExclude`, que é uma lista de valores que não serão exibidos na lista de resultados (options/list) que pode ser uuid/id/slug.
- `QasSelectList`: corrigido problema ao remover item do model quando `:emit-value="false"`.
- `QasFilters`: Corrigido problema de merge entre os `fields` iniciais e a propriedade `fieldsProps` na computada `activeFilters`.
- `QasFilters`: Corrigido exibição vazia da badge de filtros ativos quando o valor não é encontrado na lista de opções de um campo de select.
- [`QasCopy`, `QasDelete`, `QasTreeGenerator`, `QasTruncate`]: alterado o `@click.stop` para `@click.stop.prevent` solucionando o problema de utilizar esses componentes em conjunto com o `QasTableGenerator`.
- `QasSortable`: alterado watch da prop `list` para o deep, passando a ouvir quando dermos um `.push` ou `splice` no list.
- `QasSortable`: removido método `sort` dentro do watch `list` na qual estava ordenando a lista quando não deveria ser ordenando.
- `QasSortable`: adicionado prop `useSaveOnSort` com default `true` para não bater a API para salvar após fazer uma ordenação.
- `QasSelectList`: adicionado evento `clear` que será disparado toda vez que o v-model é limpo através do botão de "Limpar seleção".
- `search-filter`: adicionado validação da prop `useLazyLoading` no watch do `lazyLoadingProps.params` para não fazer request quando ela for false.
- `Delete.js`: merge do `dialogProps` vindo por parâmetro na função com os valores defaults.
- `QasDialog`: validação para quando deverá renderizar a descrição como componente e não texto.

### Modificado
- [`QasBreakline`, `QasFormGenerator`, `QasStatus`, `QasTextTruncate`, `QasGridGenerator`]: convertidos para composition API.
- `QasMap`: removido dependência terceira do "@fawmi/vue-google-maps", em favor da logica de `thirdPartyComponents` (agora a dependência fica na aplicação).
- `vue-plugin`: adicionado logica para import dinâmico dos thirdPartyComponents (QasMap).
- `vue-plugin`: import `import { QasMap } from 'asteroid'` agora retorna uma `Promise` quando existe e `null` quando não existe.
- `app-extension/src/index.js`: adicionado logica para automatizar instalação / desinstalação de bibliotecas terceiras do `thirdPartyComponents`.
- `process.env.MAPS_API_KEY`: não é mais necessário declarar esta env, somente se for utilizar o componente `QasMap`.
- `QasAvatar`: adicionado nova cor `grey-4` na propriedade `color`.
- `QasLabel`: modificado default da prop `margin` para `md (16px)`.
- `QasLabel`: modificado tipografia para `text-h4`.
- `QasSearchInput`: modificado estilo do input, removido shadow e adicionado borda.
- `item.scss`: alterado espaçamento global da classe `q-item__section--side` que é aplicado quando usado `QItem` com `QItemSection` com propriedade `avatar`, deixando o `padding-right` menor (sm).
- `QasSelectList`: modificado comportamento de como é adicionado itens, antes feito por botões de adicionar/remover, agora é feito por um `checkbox`.
- `QasSearchBox`: alterado `height` fixo para `max-height` (impacta QasSelectList).
- [`QasGridGenerator`, `QasTableGenerator`]: modificado comportamento de exibição do valor do `empty-result-text`. Agora para o resultado de algum campo ser considerado vazio é necessário que o seu valor seja `null`, `undefined` ou `''`.
- `QasBox`: modificado padding y de `lg` para `md`.
`ui/src/css/utils/container.scss`: alterado espaçamento da classe `spaced`.
`QasPageHeader`: alterado o valor do margin-bottom pra `lg`.
- `QasSortable`: removido `required` da prop `entity` para deixar opcional.
- `ui/src/css/components/button.scss`: modificado cor disabled de `grey-8` para `grey-6` nas variantes `secondary` e `tertiary` para seguir design system.
- `QasNumericInput`: modificado o nome da propriedade `decimalPlaces` para `places`, mantendo assim o padrão de API e do Asteroid.
- `QasInput`: modificado computada `inputReference` que retornava o ref do `input` para ser um data. Pois seguindo a recomendação do Vue não é uma boa prática utilizar refs dentro de computadas.
- [`QasNumericInput`, `QasSelect`]: adicionado propriedade `label` fixo no componente e não mais pelo `$attrs` para funcionar logica do required.
- `QasField`: agora logica de label obrigatória é controlada em cada componente e não mais pelo QasField.

### Removido
- `process.env.SERVER_TIMEOUT`: agora é controlado pelo arquivo `asteroid.config.js` com a config `api: { serverTimeOut: 10000 }`.
- `QasSelectList`: removido slot `item-action`, como o componente mudou o layout, esse slot mudaria de lugar, porém o uso dele é desnecessário e pode levar a quebra de Design System.
- `QasSelectList`: removido slot `item-section`, como foi removido o slot `item-action`, não faz mais sentido um slot para o `item-section` pois a estrutura é a mesma, caso necessário, utilizar o slot `item`.
- `QasSelectList`: removido prop `useClickableLabel`, clicar na label agora faz selecionar o item sempre.
- `QasSelectList`: removido scope `handleClick` para `onUpdateModel` no slot `item`.
- `QasSelectList`: removido evento `click-label`.
- `QasSortable`: removido as props `sorted` e `list`.

## [3.11.0-beta.18] - 25-08-2023
### Adicionado
- `QasFormGenerator`: adicionado possibilidade de passar uma descrição para o `fieldset`.
- Adicionado novo boot font-face que adiciona um loading nos ícones enquanto eles ainda estão carregando.

## [3.11.0-beta.17] - 24-08-2023
### Adicionado
- `QasPageHeader`: adicionado `ellipsis` em cada item do `breadcrumbs` setando os mesmo com no máximo `180px`, a partir desse tamanho sera adicionado o ellipsis.
- `QasWelcome`: adicionado componente `QasActionsMenu`.
- `QasWelcome`: adicionado prop `actionsMenuProps` para repassar as props para o componente `QasActionsMenu`.

## [3.11.0-beta.16] - 22-08-2023
### Adicionado
- [`QasLabel`, `QasSelect`, `QasInput`, `QasNumericInput`]: adicionado propriedade `required` para controle de label obrigatória.
- Adicionado novo helper `getRequiredLabel` para retornar label obrigatória normalizada.

### Modificado
- [`QasNumericInput`, `QasSelect`]: adicionado propriedade `label` fixo no componente e não mais pelo `$attrs` para funcionar logica do required.
- `QasField`: agora logica de label obrigatória é controlada em cada componente e não mais pelo QasField.

## [3.11.0-beta.15] - 17-08-2023
### Adicionado
- `QasDateTimeInput`: adicionado prop `datePopupProxyProps` para repassar props para o componente `QPopupProxy` do `QDate`.
- `QasDateTimeInput`: adicionado prop `timePopupProxyProps` para repassar props para o componente `QPopupProxy` do `QTime`.

### Corrigido
- `QasInput`: corrigido problema causado na versão `3.11.0-beta.14` onde o watch `mask` não foi alterado para `currentMask`.

### Modificado
- `QasInput`: modificado computada `inputReference` que retornava o ref do `input` para ser um data. Pois seguindo a recomendação do Vue não é uma boa prática utilizar refs dentro de computadas.

## [3.11.0-beta.14] - 15-08-2023
### Adicionado
- `QasActionsMenu`: adicionado `@click.stop.prevent` solucionando o problema de utilizar o componente em conjunto com o `QasTableGenerator`.
- `QasInput`: adicionado `inputmode` default de acordo com máscaras e type email.
- [`QasDateTimeInput`, `QasNumericInput`]: adicionado `inputmode="numeric"`.
- `QasSearchInput`: adicionado `inputmode="search"`.

### Corrigido
- `QasDialog`: validação para quando deverá renderizar a descrição como componente e não texto.

## [3.11.0-beta.13] - 04-08-2023
### Adicionado
- `QasDialog`: possibilidade de passar a descrição como componente através da prop `description` de dentro do `card`.

### Corrigido
- `Delete.js`: merge do `dialogProps` vindo por parâmetro na função com os valores defaults.

## [3.11.0-beta.12] - 04-08-2023
## BREAKING CHANGES
- `QasNumericInput`: modificado o nome da propriedade `decimalPlaces` para `places`, mantendo assim o padrão de API e do Asteroid.

### Adicionado
- `QasField`: adicionado suporte ao parâmetro `places` que será repassado para o componente `QasNumericInput` para definir a quantidade de casas decimais.
- `QasFormView`: adicionado nova prop `formProps` para repassar todas as props/eventos para o `QForm`.

### Modificado
- `ui/src/css/components/button.scss`: modificado cor disabled de `grey-8` para `grey-6` nas variantes `secondary` e `tertiary` para seguir design system.
- `QasNumericInput`: modificado o nome da propriedade `decimalPlaces` para `places`, mantendo assim o padrão de API e do Asteroid.

## [3.11.0-beta.11] - 01-08-2023
## BREAKING CHANGES
- `QasSortable`: removido as props `sorted` e `list`, onde o a ordenação e as options será o próprio v-model.

### Adicionado
- `QasSortable`: adicionado v-model para o controle da ordenação.

### Removido
- `QasSortable`: removido as props `sorted` e `list`.

### Corrigido
- `search-filter`: adicionado validação da prop `useLazyLoading` no watch do `lazyLoadingProps.params` para não fazer request quando ela for false.

## [3.11.0-beta.10] - 28-07-2023
## BREAKING CHANGES
- `QasSelectList`: nome de eventos alterados de `@added` para `@add` e `@removed` para `@remove`.

### Adicionado
- `QasSortable`: adicionado prop `useSaveOnSort` com default `true` para não bater a API para salvar após fazer uma ordenação.
- `QasSelectList`: adicionado evento `clear` que será disparado toda vez que o v-model é limpo através do botão de "Limpar seleção".

### Modificado
- `QasSortable`: removido `required` da prop `entity` para deixar opcional.

### Corrigido
- [`QasCopy`, `QasDelete`, `QasTreeGenerator`, `QasTruncate`]: alterado o `@click.stop` para `@click.stop.prevent` solucionando o problema de utilizar esses componentes em conjunto com o `QasTableGenerator`.
- `QasSortable`: alterado watch da prop `list` para o deep, passando a ouvir quando dermos um `.push` ou `splice` no list.
- `QasSortable`: removido método `sort` dentro do watch `list` na qual estava ordenando a lista quando não deveria ser ordenando.

## [3.11.0-beta.9] - 25-07-2023
### Corrigido
- `QasFilters`: Corrigido problema de merge entre os `fields` iniciais e a propriedade `fieldsProps` na computada `activeFilters`.
- `QasFilters`: Corrigido exibição vazia da badge de filtros ativos quando o valor não é encontrado na lista de opções de um campo de select.

## [3.11.0-beta.8] - 19-07-2023
### Adicionado
- `Delete.js`: adicionado parâmetro `redirectRoute`, onde há a possibilidade de passar uma rota onde será redirecionado após deletar o item.
- `QasDelete`: adicionado prop `redirectRoute` que será repassado para o plugin `Delete`.

### Modificado
`ui/src/css/utils/container.scss`: alterado espaçamento da classe `spaced`.
`QasPageHeader`: alterado o valor do margin-bottom pra `lg`.

## [3.11.0-beta.7] - 14-07-2023
### Corrigido
- `QasSelectList`: corrigido problema ao remover item do model quando `:emit-value="false"`.

### Modificado
- `QasBox`: modificado padding y de `lg` para `md`.

## [3.11.0-beta.6] - 12-07-2023
### Adicionado
- `isEmpty.js`: adicionado novo helper para verificar se um valor é vazio (null, undefined ou '').
- `mixins/searchFilter`: adicionado nova prop `optionsToExclude`, que é uma lista de valores que não serão exibidos na lista de resultados (options/list) que pode ser uuid/id/slug.

### Modificado
- [`QasGridGenerator`, `QasTableGenerator`]: modificado comportamento de exibição do valor do `empty-result-text`. Agora para o resultado de algum campo ser considerado vazio é necessário que o seu valor seja `null`, `undefined` ou `''`.

### Corrigido
- `QasGridGenerator`: corrigido ordem de exibição dos `fields`.
- `docs`: exibição dos componentes na documentação do `QasChartView` e `QasMaps`.
- `rules.js`: validação da função `required`.

## [3.11.0-beta.5] - 11-07-2023
### Corrigido
- Corrigido problemas relacionados aos `third party components`.

## [3.11.0-beta.4] - 11-07-2023
## BREAKING CHANGES
- `QasSelectList`: removido slot `item-action`, como o componente mudou o layout, esse slot mudaria de lugar, porém o uso dele é desnecessário e pode levar a quebra de Design System.
- `QasSelectList`: removido slot `item-section`, como foi removido o slot `item-action`, não faz mais sentido um slot para o `item-section` pois a estrutura é a mesma, caso necessário, utilizar o slot `item`.
- `QasSelectList`: removido prop `useClickableLabel`, clicar na label agora faz selecionar o item sempre.
- `QasSelectList`: removido scope `handleClick` para `onUpdateModel` no slot `item`.
- `QasSelectList`: removido evento `click-label`.

### Adicionado
- `QasSelectList`: adicionado nova prop `emitValue` com default `true`, quando valor é "true", transforma o model em um array de string, senão o model será um array de objeto (não foi usado o nome `useEmitValue` pois existe uma prop para mesma finalidade no QSelect do quasar e ela se chama "emitValue").
- `QasSelectList`: adicionado nova prop `useEmitLabelValueOnly` com default `true`, propriedade para ser usada em conjunto com ':emitValue="false"', caso habilite essa propriedade, o model sempre será um array de objeto com label e value, se estiver desabilitado, o objeto dentro do model será o objeto inteiro, não somente label e value.
- `QasSearchBox`: adicionado nova propriedade `outlined` que define se a área que contém o resultado da pesquisa terá o estilo de borda arredondada com fundo branco (semelhante a um input).
- `QasSelectList`: adicionado novo recurso de limpar seleção.
- Componente de gráficos `QasChartView`.
- Instalação automática das dependências do `QasChartView` via `thirdPartyComponents`.

### Modificado
- `QasSearchInput`: modificado estilo do input, removido shadow e adicionado borda.
- `item.scss`: alterado espaçamento global da classe `q-item__section--side` que é aplicado quando usado `QItem` com `QItemSection` com propriedade `avatar`, deixando o `padding-right` menor (sm).
- `QasSelectList`: modificado comportamento de como é adicionado itens, antes feito por botões de adicionar/remover, agora é feito por um `checkbox`.
- `QasSearchBox`: alterado `height` fixo para `max-height` (impacta QasSelectList).

### Corrigido
- Problema de instalar a dependência `install` ao utilizar a opção do asteroid instalar automáticamente as libs de terceiros pelo `thirdPartyComponents`.
- `required`: corrigida a validação para `null`.
- `required`: Adicionado ponto final à frase padrão.
- `search-filter.js`: corrigido problema ao limpar diversos campos relacionados a um mesmo campo de filtro.
- `QasSearchBox`: corrigido como é feito o primeiro fetch, antes o evento do infinite scroll era sempre chamado, agora ele espera finalizar o fetch inicial, após isto o infinite scroll é ativado.

### Removido
- `QasSelectList`: removido slot `item-action`, como o componente mudou o layout, esse slot mudaria de lugar, porém o uso dele é desnecessário e pode levar a quebra de Design System.
- `QasSelectList`: removido slot `item-section`, como foi removido o slot `item-action`, não faz mais sentido um slot para o `item-section` pois a estrutura é a mesma, caso necessário, utilizar o slot `item`.
- `QasSelectList`: removido prop `useClickableLabel`, clicar na label agora faz selecionar o item sempre.
- `QasSelectList`: removido scope `handleClick` para `onUpdateModel` no slot `item`.
- `QasSelectList`: removido evento `click-label`.

## [3.11.0-beta.3] - 26-06-2023
### Modificado
- `QasLabel`: modificado default da prop `margin` para `md (16px)`.
- `QasLabel`: modificado tipografia para `text-h4`.

### Corrigido
- `ui/src/css/components/field.scss`: corrigido seletor de classe que estava deixando com cor no lugar errado.

## [3.11.0-beta.2] - 23-06-2023
### Modificado
- `QasAvatar`: adicionado nova cor `grey-4` na propriedade `color`.

## [3.11.0-beta.1] - 22-06-2023
### Corrigido
- `asteroid.config.js`: correções referentes as configurações do asteroid config.

## [3.11.0-beta.0] - 22-06-2023
## BREAKING CHANGES
- com a adição do `asteroid.config.js`, é **necessário** criar o arquivo na raiz da aplicação para que não quebre a mesma.
- controle do server timeout agora é feito pelo `asteroid.config.js` e não pelo `process.env.SERVER_TIMEOUT`.
- Caso esteja utilizando o componente `QasMap` verificar documentação para configurar corretamente o mesmo.

### Adicionado
- [`useForm`, `useGenerator (privado)`, `useScreen`]: adicionado novos composables.
- `Spacing.js`: adicionado enums de espaçamento.
- `asteroid.config.js`: adicionado novo arquivo de configuração do asteroid.
- Adicionado vitest.
- `QasAlert` adicionado `data-test="alert-title"` na tag h5 de title para testes iniciais.

### Modificado
- [`QasBreakline`, `QasFormGenerator`, `QasStatus`, `QasTextTruncate`, `QasGridGenerator`]: convertidos para composition API.
- `QasMap`: removido dependência terceira do "@fawmi/vue-google-maps", em favor da logica de `thirdPartyComponents` (agora a dependência fica na aplicação).
- `vue-plugin`: adicionado logica para import dinâmico dos thirdPartyComponents (QasMap).
- `vue-plugin`: import `import { QasMap } from 'asteroid'` agora retorna uma `Promise` quando existe e `null` quando não existe.
- `app-extension/src/index.js`: adicionado logica para automatizar instalação / desinstalação de bibliotecas terceiras do `thirdPartyComponents`.
- `process.env.MAPS_API_KEY`: não é mais necessário declarar esta env, somente se for utilizar o componente `QasMap`.

### Removido
- `process.env.SERVER_TIMEOUT`: agora é controlado pelo arquivo `asteroid.config.js` com a config `api: { serverTimeOut: 10000 }`.

## [3.10.0] - 21-06-2023
## BREAKING CHANGES
- `QasSelect`: removido props `labelKey` e `valueKey`, componente não aceita mais fazer conversão das chaves label/value, o backend deve sempre retornar no padrão correto, em **ultimo** caso, é possível utilizar o helper `getNormalizedOptions` para converter as opções antes de enviar para o componente, porém o componente não fica mais responsável por isto.
- `QasSelectList`: removido props [`list`, `fuseOptions`] em favor da propriedade `searchBoxProps`.
- `ui/src/mixins/search-filter.js`: removido computada `mx_isFilterByFuse` que não estava sendo utilizado em nenhum lugar.
- `QasSearchBox`: removido `QasBox` e adicionado `div` no lugar para se adequar ao layout.
- `QasFilters`: removido `data-cy="filters-search-input"` e adicionado um fixo no componente `QasSearchInput` chamado `data-cy="search-input"`.
- `QasSearchBox`: removido prop `emptyResultText` para manter sempre a mesma mensagem quando não encontra itens.
- `QasFilters`: O componente irá filtrar somente campos com valores que sejam diferente de **null** ou **undefined**, caso contrário ao filtrar o campo irá ser removido da query.
- Como foi atualizado todas as libs do asteroid, é possível que existam breaking changes que não foram detectadas, é importante testar a aplicação que estiver usando o asteroid como um todo.

### Adicionado
- `QasDate`: adicionado novo componente wrapper do `QDate` com estilos próprios e recursos extras.
- `QasSelectList`: adicionado 2 novas props `addLabel` e `deleteLabel` para controlar seus respectivos labels.
- `QasSearchInput`: adicionado novo componente que sera usado em buscas / filtros, como no `QasSearchBox` e `QasFilters`.
- `QasSelect`: adicionado nova prop `useFetchOptionsOnCreate` para controlar se o componente vai fazer um fetch das opções assim que o mesmo é criado (caso tenha lazy loading ativado).
- `QasSelectList`: adicionado nova propriedade `readonly` para habilitar componente em modo de visualização (remove botões de ações).
- `QasSelectList` adicionado props `addLabel` e `deleteLabel` para controlar labels dos botões.
- `QasSelectList` adicionado prop `searchBoxProps` para repassar props do `QasSearchBox`.
- `QasEmptyResultText`: adicionado novo componente para resultados vazio.

### Modificado
- `QasLabel`: modificado a classe de fonte utilizada no componente, de `text-subtitle2` para `text-subtitle1`.
- `QasDateTimeInput`: substituído `QDate` pelo `QasDate`.
- [`QasSelectList`, `QasSearchBox`]: mudanças de estilos para se adequar a novo layout.
- `QasSearchBox`: removido `QasInput` a adicionado `QasSearchInput`.
- `QasSelectList`: componente só faz sort da lista caso não seja lazy loading.
- `ui/src/mixins/search-filter.js`: mudanças para adicionar ordenação de opções selecionadas.
- `QasFilters`: mudanças para utilização do `QasSearchInput`.
- `QasLabel`: modificado a classe de fonte utilizada no componente, de `text-subtitle2` para `text-subtitle1`.
- `QasSearchBox`: alterado default da prop `emptyResultText` para `Não há itens para serem exibidos.`
- `QasSearchBox`: alterado estilo de quando não não há itens para serem exibidos.
- [`QasSearchBox`, `QasListView`, `QasSingleView`]: adicionado componente `QasEmptyResultText`.
- `QasFilters`: tratamento para passar os `fieldsProps` utilizando as chaves dos fields em camelCase para mantermos o padrão.
- `typography.scss`: modificado line-height que antes seguia o tamanho do font-size agora é 140% o tamanho do font-size.
- `QasUploader`: adicionado `QasEmptyResultText` para quando o modelValue do componente for vazio (também afeta o QasSignatureUploader).
- `QasSelect`: modificado comportamento para selects do tipo lazy loading para não ser possível selecionar uma opção quando o componente estiver buscando por novas opções.
- Atualizado todas libs do asteroid (ui/app-extension/docs/raiz).
- Mudanças referentes as atualizações de bibliotecas.

### Corrigido
- `QasFormView`: corrigido a validação das props `useCancelButton` e `useSubmitButton`.
- `QasSearchBox`: corrigido primeiro fetch quando existe `options` antes de finalizar o primeiro `fetch`.
- `ui/src/mixins/search-filter.js`: corrigido duplicidade de opções quando acontece mais de requisição em paralelo pelas mudanças causadas no `lazyLoadingProps`.
- `QasFilters`: Ao selecionar o botão de limpar, irá limpar somente os campos do filtro e da query, mantendo outros filtros externos na query.
- `QasFilters`: tratamento para não filtrar na query campos que não possuem valores.
- `QasFilters`: tratamento para filtrar na query somente valores que são diferente de null ou undefined.
- `search-filter.js`: corrigido problema de quando as opções externas são setadas após o fetch interno de opções, que fazia que as opções externas sobrescreviam as opões interna erroneamente.
- `QasNestedFields`: corrigido problemas referentes ao espaçamento do label quando é usado com `useSingleLabel`.
- `QasFilters`: corrigido problema no método `updateValues`. O model interno de `filters` ficava desatualizado quando não tinha query na URL.
- `QasFilters`: corrigido problema na checagem se há valores nos `fields` retornados da API, caso não viesse `fields` ocorria um erro no console ao recuperar o tamanho do objeto de `fields`.
- `QasFilters`: corrigido atualização do model `currentFilters` que emitia o evento de atualização antes da query ser atualizada com base no filtro realizado.
- `QasNestedFields`: corrigido espaçamento das labels.
- `search-filter`: corrigido duplicidade de opções que acontecia quando o `mx_fetchCount` era `1`, impacta `QasSelect` e `QasSelectList`.
- `QasDateTimeInput`: corrigido logica para seguir regra do lint.
- `search-filter`: corrigido problema com filtros relacionados onde as opções cacheadas (opções iniciais) não eram limpas após mudança dos parâmetros da URL de lazy loading.
- `search-filter`: corrigido problema com filtros relacionados que estavam sendo disparados o evento para buscar novas opções sem necessariamente ter alterado os parâmetros da URL de lazy loading.
- `QasFilters`: corrigido botão de limpar pesquisa que não funcionada quando utilizado com a prop `:use-search-on-type="false"`.
- `QasGridGenerator`: refatorado código do componente para resolver problema de variável não sendo definida caso chamasse o slot `content` do componente.

### Removido
- `QasSelect`: removido props `labelKey` e `valueKey`, componente não aceita mais fazer conversão das chaves label/value, o backend deve sempre retornar no padrão correto, em **ultimo** caso, é possível utilizar o helper `getNormalizedOptions` para converter as opções antes de enviar para o componente, porém o componente não fica mais responsável por isto.
- `QasSelectList`: removido props [`list`, `fuseOptions`] em favor da propriedade `searchBoxProps`.
- `ui/src/mixins/search-filter.js`: removido computada `mx_isFilterByFuse` que não estava sendo utilizado em nenhum lugar.
- `QasSearchBox`: removido `QasBox` e adicionado `div` no lugar para se adequar ao layout.
- `QasFilters`: removido `data-cy="filters-search-input"` e adicionado um fixo no componente `QasSearchInput` chamado `data-cy="search-input"`.
feature/changes-qas-select-list.
- `QasSearchBox`: removido prop `emptyResultText` para manter sempre a mesma mensagem quando não encontra itens.
- `ui/scr/dev/`: removido folder pois utilizamos o `/docs` para testes.
- `stylelint`: removido stylelint, já era desativada muitas regras e não estava ajudando no desenvolvimento, então foi removido.

## [3.10.0-beta.10] - 14-06-2023
### Corrigido
`QasDate`: alterado a ordem de uso do método `resetEvents`, onde deverá limpar os eventos sempre, evitando problemas de manter antigos eventos quando deveriam serem limpados.

## [3.10.0-beta.9] - 07-06-2023
## BREAKING CHANGES
- `QasDate`: propriedade `events` recebe um novo padrão, deixa de ser um array de string para ser um array de objetos, olhar documentação para mais informações.

### Modificado
- `QasDate`: modificado estilos e comportamentos.

### Corrigido
- `QasGridGenerator`: refatorado código do componente para resolver problema de variável não sendo definida caso chamasse o slot `content` do componente.
- `QasDate`: corrigido problema de reatividade ao trocar eventos e mudar mês/ano.

## [3.10.0-beta.8] - 06-06-2023
## BREAKING CHANGES
- Como foi atualizado todas as libs do asteroid, é possível que existam breaking changes que não foram detectadas, é importante testar a aplicação que estiver usando o asteroid como um todo.

### Modificado
- `QasSelect`: modificado comportamento para selects do tipo lazy loading para não ser possível selecionar uma opção quando o componente estiver buscando por novas opções.
- Atualizado todas libs do asteroid (ui/app-extension/docs/raiz).
- Mudanças referentes as atualizações de bibliotecas.

### Corrigido
- `QasDateTimeInput`: corrigido logica para seguir regra do lint.
- `search-filter`: corrigido problema com filtros relacionados onde as opções cacheadas (opções iniciais) não eram limpas após mudança dos parâmetros da URL de lazy loading.
- `search-filter`: corrigido problema com filtros relacionados que estavam sendo disparados o evento para buscar novas opções sem necessariamente ter alterado os parâmetros da URL de lazy loading.
- `QasFilters`: corrigido botão de limpar pesquisa que não funcionada quando utilizado com a prop `:use-search-on-type="false"`.

### Removido
- `ui/scr/dev/`: removido folder pois utilizamos o `/docs` para testes.
- `stylelint`: removido stylelint, já era desativada muitas regras e não estava ajudando no desenvolvimento, então foi removido.

## [3.10.0-beta.7] - 05-06-2023
### Corrigido
- `search-filter`: corrigido duplicidade de opções que acontecia quando o `mx_fetchCount` era `1`, impacta `QasSelect` e `QasSelectList`.

## [3.10.0-beta.6] - 30-05-2023
### Corrigido
- `QasNestedFields`: corrigido espaçamento das labels.

## [3.10.0-beta.5] - 30-05-2023
### Modificado
- `QasUploader`: adicionado `QasEmptyResultText` para quando o modelValue do componente for vazio (também afeta o QasSignatureUploader).

### Corrigido
- `QasNestedFields`: corrigido problemas referentes ao espaçamento do label quando é usado com `useSingleLabel`.
- `QasFilters`: corrigido problema no método `updateValues`. O model interno de `filters` ficava desatualizado quando não tinha query na URL.
- `QasFilters`: corrigido problema na checagem se há valores nos `fields` retornados da API, caso não viesse `fields` ocorria um erro no console ao recuperar o tamanho do objeto de `fields`.
- `QasFilters`: corrigido atualização do model `currentFilters` que emitia o evento de atualização antes da query ser atualizada com base no filtro realizado.

## [3.10.0-beta.4] - 17-05-2023
### Modificado
- `QasDate`: adicionado a cor primaria na data de hoje.

### Corrigido
- `search-filter.js`: corrigido problema de quando as opções externas são setadas após o fetch interno de opções, que fazia que as opções externas sobrescreviam as opões interna erroneamente.

## [3.10.0-beta.3] - 12-05-2023
## BREAKING CHANGES
- `QasFilters`: O componente irá filtrar somente campos com valores que sejam diferente de **null** ou **undefined**, caso contrário ao filtrar o campo irá ser removido da query.

### Corrigido
- `QasFilters`: tratamento para filtrar na query somente valores que são diferente de null ou undefined.

## [3.10.0-beta.2] - 11-05-2023
### Corrigido
- `QasFilters`: Ao selecionar o botão de limpar, irá limpar somente os campos do filtro e da query, mantendo outros filtros externos na query.
- `QasFilters`: tratamento para não filtrar na query campos que não possuem valores.

### Modificado
- `QasFilters`: tratamento para passar os `fieldsProps` utilizando as chaves dos fields em camelCase para mantermos o padrão.
- `typography.scss`: modificado line-height que antes seguia o tamanho do font-size agora é 140% o tamanho do font-size.

## [3.10.0-beta.1] - 10-05-2023
## BREAKING CHANGES
- `QasSearchBox`: removido prop `emptyResultText` para manter sempre a mesma mensagem quando não encontra itens.

### Adicionado
- `QasEmptyResultText`: adicionado novo componente para resultados vazio.

### Modificado
- `QasSearchBox`: alterado default da prop `emptyResultText` para `Não há itens para serem exibidos.`
- `QasSearchBox`: alterado estilo de quando não não há itens para serem exibidos.
- [`QasSearchBox`, `QasListView`, `QasSingleView`]: adicionado componente `QasEmptyResultText`.

### Corrigido
- `QasSearchBox`: corrigido primeiro fetch quando existe `options` antes de finalizar o primeiro `fetch`.
- `ui/src/mixins/search-filter.js`: corrigido duplicidade de opções quando acontece mais de requisição em paralelo pelas mudanças causadas no `lazyLoadingProps`.

### Removido
- `QasSearchBox`: removido prop `emptyResultText` para manter sempre a mesma mensagem quando não encontra itens.

## [3.10.0-beta.0] - 04-05-2023
## BREAKING CHANGES
- `QasSelect`: removido props `labelKey` e `valueKey`, componente não aceita mais fazer conversão das chaves label/value, o backend deve sempre retornar no padrão correto, em **ultimo** caso, é possível utilizar o helper `getNormalizedOptions` para converter as opções antes de enviar para o componente, porém o componente não fica mais responsável por isto.
- `QasSelectList`: removido props [`list`, `fuseOptions`] em favor da propriedade `searchBoxProps`.
- `ui/src/mixins/search-filter.js`: removido computada `mx_isFilterByFuse` que não estava sendo utilizado em nenhum lugar.
- `QasSearchBox`: removido `QasBox` e adicionado `div` no lugar para se adequar ao layout.
- `QasFilters`: removido `data-cy="filters-search-input"` e adicionado um fixo no componente `QasSearchInput` chamado `data-cy="search-input"`.

### Adicionado
- `QasDate`: adicionado novo componente wrapper do `QDate` com estilos próprios e recursos extras.
- `QasSelectList`: adicionado 2 novas props `addLabel` e `deleteLabel` para controlar seus respectivos labels.
- `QasSearchInput`: adicionado novo componente que sera usado em buscas / filtros, como no `QasSearchBox` e `QasFilters`.
- `QasSelect`: adicionado nova prop `useFetchOptionsOnCreate` para controlar se o componente vai fazer um fetch das opções assim que o mesmo é criado (caso tenha lazy loading ativado).
- `QasSelectList`: adicionado nova propriedade `readonly` para habilitar componente em modo de visualização (remove botões de ações).
- `QasSelectList` adicionado props `addLabel` e `deleteLabel` para controlar labels dos botões.
- `QasSelectList` adicionado prop `searchBoxProps` para repassar props do `QasSearchBox`.

### Modificado
- `QasLabel`: modificado a classe de fonte utilizada no componente, de `text-subtitle2` para `text-subtitle1`.
- `QasDateTimeInput`: substituído `QDate` pelo `QasDate`.
- [`QasSelectList`, `QasSearchBox`]: mudanças de estilos para se adequar a novo layout.
- `QasSearchBox`: removido `QasInput` a adicionado `QasSearchInput`.
- `QasSelectList`: componente só faz sort da lista caso não seja lazy loading.
- `ui/src/mixins/search-filter.js`: mudanças para adicionar ordenação de opções selecionadas.
- `QasFilters`: mudanças para utilização do `QasSearchInput`.
- `QasLabel`: modificado a classe de fonte utilizada no componente, de `text-subtitle2` para `text-subtitle1`.

### Corrigido
- `QasFormView`: corrigido a validação das props `useCancelButton` e `useSubmitButton`.

### Removido
- `QasSelect`: removido props `labelKey` e `valueKey`, componente não aceita mais fazer conversão das chaves label/value, o backend deve sempre retornar no padrão correto, em **ultimo** caso, é possível utilizar o helper `getNormalizedOptions` para converter as opções antes de enviar para o componente, porém o componente não fica mais responsável por isto.
- `QasSelectList`: removido props [`list`, `fuseOptions`] em favor da propriedade `searchBoxProps`.
- `ui/src/mixins/search-filter.js`: removido computada `mx_isFilterByFuse` que não estava sendo utilizado em nenhum lugar.
- `QasSearchBox`: removido `QasBox` e adicionado `div` no lugar para se adequar ao layout.
- `QasFilters`: removido `data-cy="filters-search-input"` e adicionado um fixo no componente `QasSearchInput` chamado `data-cy="search-input"`.
feature/changes-qas-select-list

## [3.9.0] - 02-05-2023
## BREAKING CHANGES
- `QasGallery`: removido slot `destroy` para dar lugar aos slots do `QasGalleryCard`, olhar documentação.
- `QasGallery`: breaking changes nos slots, verificar documentação.
- `QasActionsMenu` agora precisa passar a prop `useTooltip` para controle de tooltip.
- [`QasAppMenu`, `QasAppBar`]: removido propriedade `user` em favor da nova propriedade `appUserProps`.
- `QasAppBar`: removido escopo `user` do slot `user`, uma vez que já temos essa informação fora do componente.

### Adicionado
- `QasListView`: adicionado propriedade `useAutoRefetchOnDelete` para controlar se o componente vai fazer o fetch novamente quando acontecer algum delete compatível com a listagem.
- `QasGallery`: adicionado propriedade `galleryCardProps`.
- `QasGalleryCard`: adicionado novo slot `actions`.
- `QasActionsMenu`: adicionado propriedade `useTooltip` com default `false` para controle de tooltip.
- `QasAppUser`: adicionado propriedade `currentCompany` para setar empresa atual vinculada.
- `QasAppUser`: adicionado propriedade `companiesOptions` para enviar opções de possíveis empresas para troca de vínculo.
- `QasAppUser`: adicionado recurso para troca de vínculo de empresa.
- [`QasAppMenu`, `QasAppBar`]: adicionado propriedade `appUserProps` para repassar todas props do `QasAppUser`.
- `QasListView`: adicionado nova propriedade `usePagination` para controlar paginação com default `true`.

### Modificado
- `QasGallery`: implementado componente `QasGalleryCard`.
- `QasGallery`: com a implementação do componente `QasGalleryCard`, a altura do card passou de `150px` para `180px`.
- `QasGallery`: componente repassa todos os slots do `QasGalleryCard` passando como escopo `image` e `index`.
- `QasGalleryCard`: mudanças de espaçamento e no `defaultActionsMenuProps`.
- `QasActionsMenu`: agora o tooltip precisa de controle por prop `useTooltip`.
- `copyToClipboard`: modificado helper, agora no notify aparece sempre uma mensagem genérica "Item copiado com sucesso." ao invés do texto copiado anteriormente (isto impacta diretamente no componente `QasCopy`).

### Removido
- `QasGallery`: removido slot `destroy` para dar lugar aos slots do `QasGalleryCard`, olhar documentação.
- [`QasAppMenu`, `QasAppBar`]: removido propriedade `user` em favor da nova propriedade `appUserProps`.
- `QasAppBar`: removido escopo `user` do slot `user`, uma vez que já temos essa informação fora do componente.

## [3.9.0-beta.1] - 19-04-2023
## BREAKING CHANGES
- [`QasAppMenu`, `QasAppBar`]: removido propriedade `user` em favor da nova propriedade `appUserProps`.
- `QasAppBar`: removido escopo `user` do slot `user`, uma vez que já temos essa informação fora do componente.

### Adicionado
- `QasAppUser`: adicionado propriedade `currentCompany` para setar empresa atual vinculada.
- `QasAppUser`: adicionado propriedade `companiesOptions` para enviar opções de possíveis empresas para troca de vínculo.
- `QasAppUser`: adicionado recurso para troca de vínculo de empresa.
- [`QasAppMenu`, `QasAppBar`]: adicionado propriedade `appUserProps` para repassar todas props do `QasAppUser`.
- `QasListView`: adicionado nova propriedade `usePagination` para controlar paginação com default `true`.

### Removido
- [`QasAppMenu`, `QasAppBar`]: removido propriedade `user` em favor da nova propriedade `appUserProps`.
- `QasAppBar`: removido escopo `user` do slot `user`, uma vez que já temos essa informação fora do componente.

## [3.9.0-beta.0] - 14-04-2023
## BREAKING CHANGES
- `QasGallery`: removido slot `destroy` para dar lugar aos slots do `QasGalleryCard`, olhar documentação.
- `QasGallery`: breaking changes nos slots, verificar documentação.
- `QasActionsMenu` agora precisa passar a prop `useTooltip` para controle de tooltip.

### Adicionado
- `QasListView`: adicionado propriedade `useAutoRefetchOnDelete` para controlar se o componente vai fazer o fetch novamente quando acontecer algum delete compatível com a listagem.
- `QasGallery`: adicionado propriedade `galleryCardProps`.
- `QasGalleryCard`: adicionado novo slot `actions`.
- `QasActionsMenu`: adicionado propriedade `useTooltip` com default `false` para controle de tooltip.

### Modificado
- `QasGallery`: implementado componente `QasGalleryCard`.
- `QasGallery`: com a implementação do componente `QasGalleryCard`, a altura do card passou de `150px` para `180px`.
- `QasGallery`: componente repassa todos os slots do `QasGalleryCard` passando como escopo `image` e `index`.
- `QasGalleryCard`: mudanças de espaçamento e no `defaultActionsMenuProps`.
- `QasActionsMenu`: agora o tooltip precisa de controle por prop `useTooltip`.
- `copyToClipboard`: modificado helper, agora no notify aparece sempre uma mensagem genérica "Item copiado com sucesso." ao invés do texto copiado anteriormente (isto impacta diretamente no componente `QasCopy`).

### Removido
- `QasGallery`: removido slot `destroy` para dar lugar aos slots do `QasGalleryCard`, olhar documentação.

## [3.8.0] - 14-04-2023
## BREAKING CHANGES
- `QasAppMenu`: adicionado propriedade `miniBrand` sendo `required` para passar logo em modo "mini".
- `ui/src/mixins/view.js`: removido computada `mx_componentTag` uma vez que os componentes de view sempre renderizam uma `div`, caso esteja usando este mixin nos produtos, revisar e remover.
- `QasLayout`: removido propriedade `padding` do componente `QPage` já que a responsabilidade deste espaçamento deve ser da classe `container`, isto pode gerar alguma(s) breaking changes visuais.
- `ui/src/css/utils/container.scss`: modificado espaçamento do container em telas mobile, alterado para `40px` (20px para cada lado), isto pode gerar alguma(s) breaking changes visuais.
- `QasUploader`: mudanças significativas de layout e comportamento que podem ou não gerar quebras.
- `QasUploader`: removido propriedade `hint`.
- `QasSignatureUploader`: removido propriedades `readonly`, `uploadLabel` pois agora esse controle é feito pela propriedade `uploaderProps`.
- `QasNestedFields`: mudanças de model no componente, pode ter breaking changes, principalmente se utilizado a propriedade `:use-remove-on-destroy="false"`.

### Adicionado
- `QasBtn`: adicionado propriedade `useEllipsis`.
- `QasAppMenu`: adicionado propriedade `miniBrand` para passar logo em modo "mini".
- `QasBtnDropdown`: adicionado model `menu`.
- `ui/src/css/mixins/set-button.scss`: adicionado nova opção para adicionar `ellipsis`.
- `downloadFile`: adicionado novo helper para fazer download de arquivos.
- `docs/src/components/DocPrint.vue`: adicionado novo componente para **documentação** para adicionar imagens (prints) de exemplos.
- `QasGalleryCard`: novo componente adicionado para ser utilizado no QasUploader (futuramente no QasGallery também).
- `QasSignatureUploader`: adicionado nova propriedade `uploaderProps` para repassar as propriedades para o QasUploader.
- `QasFormView`: adicionado novo evento no `window` que dispara toda vez que o submit ocorre com sucesso chamado `submit-success`.
- `QasLabel`: adicionado propriedade `color` para controle da cor com default `grey-9`.
- `QasUploader`: adicionado novas propriedades: `addButtonFn`, `addButtonLabel`, `columns`, `dialogProps`, `error`, `fields`, `formGeneratorProps`, `galleryCardProps`, `gridGeneratorProps`, e `useDownload`
- `QasTableGenerator`: Adicionado propriedade `use-sticky-header` e `sticky-header-table-height` para manter o header da tabela fixo na rolagem do conteúdo.
- `scrollbar.scss`: Adicionado estilo padrão para o scrollbar.
- `QasFilters`: Adicionado slot `filter-button`.
- `QasFilters`: Adicionado documentação para o slot `right-side`.
- `QasFilters`: Adicionado propriedade `use-spacing` com o valor default `true` para habilitar ou não o espaçamento padrão do componente.
- `QasFilters`: Adicionado propriedade `use-update-route` com o valor default `true` para habilitar ou não a atualização da rota com base nos filtros.
- `QasFilters`: Adicionado evento `@update:currentFilters` que dispara sempre que é realizada alguma atualização no filtro.

### Modificado
- `QasFilters`: Modificado comportamento para após filtrar ou limpar o filtro realizar o fechamento do menu de filtros.
- atualizado quasar e package-lock geral do asteroid.
- `QasAppMenu`: modificado layout e comportamento para se adequar ao DS.
- `QasBtn`: agora é possível utilizar a propriedade `align` do `QBtn` do quasar.
- `QasAppMenu`: removido `required` da propriedade `title`.
- `QasAppMenu`: adicionado `required` na propriedade `brand`.
- `ui/src/css/utils/container.scss`: modificado espaçamento do container em telas mobile, alterado para `40px` (20px para cada lado), isto pode gerar alguma(s) breaking changes visuais.
- `QasLayout`: modificado propriedade `view` para se adequar ao novo layout.
- `QasLayout`: removido propriedade `padding` do componente `QPage` já que a responsabilidade deste espaçamento deve ser da classe `container`, isto pode gerar alguma(s) breaking changes visuais.
- `QasSignatureUploader`: atualizações para se adequar as mudanças do QasUploader.
- [`QasSignatureUploader`, `QasUploader`]: adicionado ordem alfabética em métodos / data / props.
- `QasField`: atualizações para se adequar as mudanças do QasSignatureUploader.
- `QasGridGenerator`: removido logger.
- `QasUploader`: mudanças de layout e comportamento.

### Corrigido
- `QasAppMenu`: Corrigido separator que não estava aparecendo de uma forma correta, adicionado pelo componente `QSeparator` ao invés de css.
- [`QasFormView`, `QasListView`, `QasSingleView`]: removido mixin que controlava se a tag vai seria uma `div` ou um `QPage`, uma vez que o `QasLayout` já engloba um `QPage` não deveria existir QPage dentro de QPage, já que ele gera tag main dentro de main.
- `QasNestedFields`: corrigido model do componente para quando a prop `useRemoveOnDestroy` for `false` e `useIndexLabel` for `true`.
- `QasNestedFields`: corrigido disposição da label quando existe a prop `useSingleLabel`, estava alinhada a esquerda quando deveria ser aliado a direita.
- `QasNestedFields`: corrigido model do componente para quando a prop `useRemoveOnDestroy` for false.
- `docs/src/pages/helpers/filters.md`: corrigido doc.
- `QasFilters`: corrigido problema onde não era possível ter o botão de filtro sem o campo de busca.
- `QasPagination`: corrigido problema com propriedade `max-content` que quebrava no `safari`.
- `searchFilterMixin`: corrigido problema ao emitir o evento `update:modelValue` para campos de select múltiplos ao alterar a propriedade `lazyLoadingProps`.

### Removido
- `ui/src/mixins/view.js`: removido computada `mx_componentTag` uma vez que os componentes de view sempre renderizam uma `div`.
- `QasSignatureUploader`: removido propriedades `readonly`, `uploadLabel` pois agora esse controle é feito pela propriedade `uploaderProps`.
- `QasUploader`: removido propriedade `hint`.

## [3.8.0-beta.7] - 11-04-2023
### Corrigido
- `QasAppMenu`: Corrigido separator que não estava aparecendo de uma forma correta, adicionado pelo componente `QSeparator` ao invés de css.

## [3.8.0-beta.6] - 10-04-2023
### Modificado
- `QasFilters`: Modificado comportamento para após filtrar ou limpar o filtro realizar o fechamento do menu de filtros.

## [3.8.0-beta.5] - 10-04-2023
### Modificado
- atualizado quasar e package-lock geral do asteroid.

## [3.8.0-beta.4] - 05-04-2023
## BREAKING CHANGES
- `QasAppMenu`: adicionado propriedade `miniBrand` sendo `required` para passar logo em modo "mini".
- `ui/src/mixins/view.js`: removido computada `mx_componentTag` uma vez que os componentes de view sempre renderizam uma `div`, caso esteja usando este mixin nos produtos, revisar e remover.
- `QasLayout`: removido propriedade `padding` do componente `QPage` já que a responsabilidade deste espaçamento deve ser da classe `container`, isto pode gerar alguma(s) breaking changes visuais.
- `ui/src/css/utils/container.scss`: modificado espaçamento do container em telas mobile, alterado para `40px` (20px para cada lado), isto pode gerar alguma(s) breaking changes visuais.

### Adicionado
- `QasBtn`: adicionado propriedade `useEllipsis`.
- `QasAppMenu`: adicionado propriedade `miniBrand` para passar logo em modo "mini".
- `QasBtnDropdown`: adicionado model `menu`.
- `ui/src/css/mixins/set-button.scss`: adicionado nova opção para adicionar `ellipsis`.

### Corrigido
- [`QasFormView`, `QasListView`, `QasSingleView`]: removido mixin que controlava se a tag vai seria uma `div` ou um `QPage`, uma vez que o `QasLayout` já engloba um `QPage` não deveria existir QPage dentro de QPage, já que ele gera tag main dentro de main.

### Modificado
- `QasAppMenu`: modificado layout e comportamento para se adequar ao DS.
- `QasBtn`: agora é possível utilizar a propriedade `align` do `QBtn` do quasar.
- `QasAppMenu`: removido `required` da propriedade `title`.
- `QasAppMenu`: adicionado `required` na propriedade `brand`.
- `ui/src/css/utils/container.scss`: modificado espaçamento do container em telas mobile, alterado para `40px` (20px para cada lado), isto pode gerar alguma(s) breaking changes visuais.
- `QasLayout`: modificado propriedade `view` para se adequar ao novo layout.
- `QasLayout`: removido propriedade `padding` do componente `QPage` já que a responsabilidade deste espaçamento deve ser da classe `container`, isto pode gerar alguma(s) breaking changes visuais.

### Removido
- `ui/src/mixins/view.js`: removido computada `mx_componentTag` uma vez que os componentes de view sempre renderizam uma `div`.

## [3.8.0-beta.3] - 04-04-2023
### Corrigido
- `QasNestedFields`: corrigido model do componente para quando a prop `useRemoveOnDestroy` for `false` e `useIndexLabel` for `true`.

## [3.8.0-beta.2] - 31-03-2023
## BREAKING CHANGES
- `QasUploader`: mudanças significativas de layout e comportamento que podem ou não gerar quebras.
- `QasUploader`: removido propriedade `hint`.
- `QasSignatureUploader`: removido propriedades `readonly`, `uploadLabel` pois agora esse controle é feito pela propriedade `uploaderProps`.
- `QasNestedFields`: mudanças de model no componente, pode ter breaking changes, principalmente se utilizado a propriedade `:use-remove-on-destroy="false"`.

### Adicionado
- `downloadFile`: adicionado novo helper para fazer download de arquivos.
- `docs/src/components/DocPrint.vue`: adicionado novo componente para **documentação** para adicionar imagens (prints) de exemplos.
- `QasGalleryCard`: novo componente adicionado para ser utilizado no QasUploader (futuramente no QasGallery também).
- `QasSignatureUploader`: adicionado nova propriedade `uploaderProps` para repassar as propriedades para o QasUploader.
- `QasFormView`: adicionado novo evento no `window` que dispara toda vez que o submit ocorre com sucesso chamado `submit-success`.
- `QasLabel`: adicionado propriedade `color` para controle da cor com default `grey-9`.
- `QasUploader`: adicionado novas propriedades: `addButtonFn`, `addButtonLabel`, `columns`, `dialogProps`, `error`, `fields`, `formGeneratorProps`, `galleryCardProps`, `gridGeneratorProps`, e `useDownload`
- `QasTableGenerator`: Adicionado propriedade `use-sticky-header` e `sticky-header-table-height` para manter o header da tabela fixo na rolagem do conteúdo.
- `scrollbar.scss`: Adicionado estilo padrão para o scrollbar.
- `QasFilters`: Adicionado slot `filter-button`.
- `QasFilters`: Adicionado documentação para o slot `right-side`.
- `QasFilters`: Adicionado propriedade `use-spacing` com o valor default `true` para habilitar ou não o espaçamento padrão do componente.
- `QasFilters`: Adicionado propriedade `use-update-route` com o valor default `true` para habilitar ou não a atualização da rota com base nos filtros.
- `QasFilters`: Adicionado evento `@update:currentFilters` que dispara sempre que é realizada alguma atualização no filtro.

### Modificado
- `QasSignatureUploader`: atualizações para se adequar as mudanças do QasUploader.
- [`QasSignatureUploader`, `QasUploader`]: adicionado ordem alfabética em métodos / data / props.
- `QasField`: atualizações para se adequar as mudanças do QasSignatureUploader.
- `QasGridGenerator`: removido logger.
- `QasUploader`: mudanças de layout e comportamento.

### Corrigido
- `QasNestedFields`: corrigido disposição da label quando existe a prop `useSingleLabel`, estava alinhada a esquerda quando deveria ser aliado a direita.
- `QasNestedFields`: corrigido model do componente para quando a prop `useRemoveOnDestroy` for false.
- `docs/src/pages/helpers/filters.md`: corrigido doc.
- `QasFilters`: corrigido problema onde não era possível ter o botão de filtro sem o campo de busca.

### Removido
- `QasSignatureUploader`: removido propriedades `readonly`, `uploadLabel` pois agora esse controle é feito pela propriedade `uploaderProps`.
- `QasUploader`: removido propriedade `hint`.

## [3.8.0-beta.1] - 30-03-2023
### Corrigido
- `QasPagination`: corrigido problema com propriedade `max-content` que quebrava no `safari`.

## [3.8.0-beta.0] - 21-03-2023
### Corrigido
- `searchFilterMixin`: corrigido problema ao emitir o evento `update:modelValue` para campos de select múltiplos ao alterar a propriedade `lazyLoadingProps`.

## [3.7.0] - 20-03-2023
## BREAKING CHANGES
- `QasPasswordInput`: removido propriedade `iconColor` uma vez que não deve ser possível mudar a cor do ícone.
- `QasPasswordStrengthChecker`: removido model `modelValue` pois não estava sendo repassado para o `QasPasswordInput`.
- `QasActionsMenu`: removido propriedades [`useLabelOnSmallScreen`, `color`, `icon`] pois agora é possível passar as propriedades para o `buttonProps` e `dropdownIcon`.
- `QasActionsMenu`: como agora o componente não faz mais uso do `QasDelete`, mas sim do `Delete.js` muda um pouco a utilização, checar documentação.
- `QasNumericInput`: modificado o valor padrão da propriedade `use-negative` para `false`. Anteriormente por padrão era possível inserir valores negativos, porém com essa modificação será necessário passar a propriedade `use-negative` como `true` para ter o mesmo comportamento anterior.

### Adicionado
- [`QasPasswordInput`, `QasPasswordStrengthChecker`]: model `currentLevel` que retorna o level atual.
- `QasTableGenerator`: Adicionado prop `row-route-fn` caso queira que ao clicar em uma linha, vá para outra rota.
- `QasTableGenerator`: Adicionado prop `use-external-link` que é usado em conjunto com a prop `row-function-fn` quando há a necessidade da rota ser um link externo.
- `QasActionsMenu`: adicionado propriedade `splitName` que habilita o useSplit no QBtnDropdown internamente separando 2 ações no componente por uma barra.
-`Delete.js`: adicionado novo plugin para dar a possibilidade de utilização de deleção de items sem ser pelo uso do componente `QasDelete`, com isto é possível utilizar fora de componentes `vue`.
- `QasBtnDropdown`: adicionado novo componente semelhante ao QBtnDropdown, porém nossas regras, e estilos.
- `QasActionsMenu`: adicionado propriedade `dropdownIcon` para ser repassado para o `QasBtnDropdown`.
- `QasActionsMenu`: adicionado propriedade `buttonProps` para ser repassado para o `QasBtn` e `QasBtnDropdown` (dependendo da quantidade de itens dentro da prop `list`).
- `QasActionsMenu`: adicionado propriedade `splitName` que habilita o `useSplit` do `QasBtnDropdown` e também é responsável por sinalizar qual item da lista será o botão a esquerda do QasBtnDropdown.
- `QasBtn`: adicionadas propriedades [`icon`, `iconRight`], antes essas props vinha através do `$attrs`, porém por logica interna foi necessário fixar elas no componente.
- `ui/src/css/variables/separator.scss`: modificado cores do QSeparator.
- [`app-extension/src/boot/loading.js`, `ui/src/css/plugins/loading.scss`]: adicionado novos arquivos para mudar o estilo do Loading.

### Modificado
- `QasPasswordInput`: Corrigido `QIcon` que foi substituído para um `QasBtn`.
- `QasActionsMenu`: modificado componente para utilizar nativamente o `QBtnDropdown`ao invés de fazer a logica manual com `QMenu`.
- `/ui/src/css/components/button.scss`: adicionado propriedade `box-shadow: none` para zerar o shadow em todos os casos.
- `QasDelete`: reimplementado componente para fazer utilização do plugin `Delete.js`.
- `QasActionsMenu`: refatorado código para troca no `QasDelete` pelo `Delete.js`.
- `QasActionsMenu`: refatorado código para utilização do `QasBtnDropdown`.
- `QasActionsMenu`: mudanças de comportamento.
- `QasNestedFields`: repassando todas propriedades do `QasActionsMenu` e não somente o `list`.
- `QasNumericInput`: modificado o valor padrão da propriedade `use-negative` para `false`.
- `QasDialog`: modificado a forma de repassar as props para o `QasActions`, para que sobrescreva os valores defaults.
- `QasActions`: modificado a lógica de inverter os botões a partir do momento que for passada a prop `useFullWidth`.
- `Loading` adicionado estilos default para o Loading do `quasar`.

### Removido
- `QasPasswordInput`: removido propriedade `iconColor` uma vez que não deve ser possível mudar a cor do ícone.
- `QasPasswordStrengthChecker`: removido model `modelValue` pois não estava sendo repassado para o `QasPasswordInput`.
- `QasActionsMenu`: removido propriedades [`useLabelOnSmallScreen`, `color`, `icon`] pois agora é possível passar as propriedades para o `buttonProps` e `dropdownIcon`.

### Corrigido
- `QasPasswordInput`: Corrigido slot do hint que texto ficava em cima de conteúdos abaixo do input.
- `QasInput`: corrigido `errorMessage` que não deveria ser resetado ao usar a propriedade `use-remove-error-on-type`.
- [`loading.js`, `loading.scss`]: adicionado custom class `qas-loading` para só estilizar o loading quando existir esta classe.

## [3.7.0-beta.3] - 09-03-2023
## BREAKING CHANGES
- `QasPasswordInput`: removido propriedade `iconColor` uma vez que não deve ser possível mudar a cor do ícone.
- `QasPasswordStrengthChecker`: removido model `modelValue` pois não estava sendo repassado para o `QasPasswordInput`.

### Adicionado
- [`QasPasswordInput`, `QasPasswordStrengthChecker`]: model `currentLevel` que retorna o level atual.

### Modificado
- `QasPasswordInput`: Corrigido `QIcon` que foi substituído para um `QasBtn`.

### Corrigido
- `QasPasswordInput`: Corrigido slot do hint que texto ficava em cima de conteúdos abaixo do input.
- `QasInput`: corrigido `errorMessage` que não deveria ser resetado ao usar a propriedade `use-remove-error-on-type`.

### Removido
- `QasPasswordInput`: removido propriedade `iconColor` uma vez que não deve ser possível mudar a cor do ícone.
- `QasPasswordStrengthChecker`: removido model `modelValue` pois não estava sendo repassado para o `QasPasswordInput`.

## [3.7.0-beta.2] - 06-03-2023
## BREAKING CHANGES
- `QasActionsMenu`: removido propriedades [`useLabelOnSmallScreen`, `color`, `icon`] pois agora é possível passar as propriedades para o `buttonProps` e `dropdownIcon`.
- `QasActionsMenu`: como agora o componente não faz mais uso do `QasDelete`, mas sim do `Delete.js` muda um pouco a utilização, checar documentação.
- `QasNumericInput`: modificado o valor padrão da propriedade `use-negative` para `false`. Anteriormente por padrão era possível inserir valores negativos, porém com essa modificação será necessário passar a propriedade `use-negative` como `true` para ter o mesmo comportamento anterior.

### Adicionado
- `QasTableGenerator`: Adicionado prop `row-route-fn` caso queira que ao clicar em uma linha, vá para outra rota.
- `QasTableGenerator`: Adicionado prop `use-external-link` que é usado em conjunto com a prop `row-function-fn` quando há a necessidade da rota ser um link externo.
- `QasActionsMenu`: adicionado propriedade `splitName` que habilita o useSplit no QBtnDropdown internamente separando 2 ações no componente por uma barra.
-`Delete.js`: adicionado novo plugin para dar a possibilidade de utilização de deleção de items sem ser pelo uso do componente `QasDelete`, com isto é possível utilizar fora de componentes `vue`.
- `QasBtnDropdown`: adicionado novo componente semelhante ao QBtnDropdown, porém nossas regras, e estilos.
- `QasActionsMenu`: adicionado propriedade `dropdownIcon` para ser repassado para o `QasBtnDropdown`.
- `QasActionsMenu`: adicionado propriedade `buttonProps` para ser repassado para o `QasBtn` e `QasBtnDropdown` (dependendo da quantidade de itens dentro da prop `list`).
- `QasActionsMenu`: adicionado propriedade `splitName` que habilita o `useSplit` do `QasBtnDropdown` e também é responsável por sinalizar qual item da lista será o botão a esquerda do QasBtnDropdown.
- `QasBtn`: adicionadas propriedades [`icon`, `iconRight`], antes essas props vinha através do `$attrs`, porém por logica interna foi necessário fixar elas no componente.
- `ui/src/css/variables/separator.scss`: modificado cores do QSeparator.

### Modificado
- `QasActionsMenu`: modificado componente para utilizar nativamente o `QBtnDropdown`ao invés de fazer a logica manual com `QMenu`.
- `/ui/src/css/components/button.scss`: adicionado propriedade `box-shadow: none` para zerar o shadow em todos os casos.
- `QasDelete`: reimplementado componente para fazer utilização do plugin `Delete.js`.
- `QasActionsMenu`: refatorado código para troca no `QasDelete` pelo `Delete.js`.
- `QasActionsMenu`: refatorado código para utilização do `QasBtnDropdown`.
- `QasActionsMenu`: mudanças de comportamento.
- `QasNestedFields`: repassando todas propriedades do `QasActionsMenu` e não somente o `list`.
- `QasNumericInput`: modificado o valor padrão da propriedade `use-negative` para `false`.
- `QasDialog`: modificado a forma de repassar as props para o `QasActions`, para que sobrescreva os valores defaults.
- `QasActions`: modificado a lógica de inverter os botões a partir do momento que for passada a prop `useFullWidth`.

### Removido
- `QasActionsMenu`: removido propriedades [`useLabelOnSmallScreen`, `color`, `icon`] pois agora é possível passar as propriedades para o `buttonProps` e `dropdownIcon`.

## [3.7.0-beta.1] - 23-02-2023
### Corrigido
- [`loading.js`, `loading.scss`]: adicionado custom class `qas-loading` para só estilizar o loading quando existir esta classe.

## [3.7.0-beta.0] - 14-02-2023
### Adicionado
- [`app-extension/src/boot/loading.js`, `ui/src/css/plugins/loading.scss`]: adicionado novos arquivos para mudar o estilo do Loading.

### Modificado
- `Loading` adicionado estilos default para o Loading do `quasar`.

## [3.6.0] - 14-02-2023
## BREAKING CHANGES
- `QasBtn`: componente passou por muitas mudanças, é preciso repassar em **TODOS** os lugares que utilizam ele e rever as propriedades adicionando o comportamento / estilo correto.
- `QasCopy`: removido propriedade `size` uma vez que não é mais repassado pro `QasBtn`.
- `QasListItems`: removido propriedade `iconProps` para ser passado somente o nome ícone.
- `QasBtn`: não é repassado mais algumas propriedades para o quasar, elas são: [align, dense, fab, fabMini, flat, glossy, noWrap, outline, padding, push, ripple, round, size, square, stack, stretch, textColor, unelevated].
- `QasDelete`: fixado cor `grey-9` quando for tag `qas-btn`.

### Adicionado
- `QasBadge` adicionado novo componente wrapper do quasar para badges.
- `QasStatus`: adicionado componente circular de status.
- `typography.md`: adicionado documentação para classes de tipografia.
- `QasListItems`: adicionado nova propriedade `icon` para repassar o nome do ícone.
- `QasBtn`: adicionado propriedade `useHoverOnWhiteColor` para remover cor de hover quando a cor for `white` e variant `tertiary`, para resolver problemas de contrast em alguns casos específicos.
- `QasBtn`: adicionado propriedade `variant` para escolher comportamento / design do botão, sendo 3 possibilidades: `primary`, `secondary` e `tertiary` (default).
- `QasBtn`: adicionado no componente a propriedade `color` com 3 possibilidades: `primary`, `grey-9` e `white`, porem esta propriedade só funciona quando a variante for `tertiary`.
- `ui/src/css/components/button.scss`: adicionado classe `button.scss` para modificar o QasBtn, foi criado uma classe ao invés de modificar no componente para ser possível alterar o estilo do botão quando não for utilizado o QasBtn.
- `ui/src/css/mixins/set-button.scss`: adicionado novo mixin para forçar `QBtn` internos a terem mesmos estilos do `QasBtn`.
- `spacing.md`: adicionado documentação para espaçamentos.
- [`Forbidden`, `NotFound`, `ServerError`]: adicionado documentação das páginas de erros.

### Modificado
- `ui/src/index.scss`: modificado `--qas-generic-border-radius` para `4px`.
- `QasTabsGenerator`: utilizando `QasStatus` no lugar do `PvTabsGeneratorStatus`.
- [`QasSelect`, `QasSearchBox`]: removido `threshold: 0.1`, deixando o default do `fuse.js` (0.6), assim a busca fica menos precisa e mais fácil de filtrar o que deseja.
- `typography.scss`: alterado line-height fixo de `1.5rem` para o mesmo de cada `font-size`.
- `QasDelete`: fixado cor `grey-9` quando a prop `tag` for `qas-btn`.
- `QasActionsMenu`: recebendo propriedade `color` dentro dos itens do `list`, que sobrepõe a propriedade `color`, porém só é usado quando existe apenas um único item na lista.
- `QasBtn`: mudanças de design system, tanto de comportamento quando design.
- `QasBtn`: melhorado documentação.
- `QasActions.vue`: alterado espaçamento `top`.
- `QasBadge`: adicionado tamanho mínimo de `24px` para respeitar layout.
- `QasFormView`: modificado actions para usar `QasActions`.
- `QasListView`: modificado espaçamento usado na paginação.
- `QasPagination`: mudanças de responsividade.
- `QasSearchBox`: mudanças de estilo no ícone de input para ficar semelhante ao `QasSelect` quando tem busca.
- `ui/src/css/variables/button.scss`: modificado valores.
- [`ErrorComponent`, `Forbidden`, `Unauthorized`, `ServerError`]: modificado layout.
- `QasSelectList`: removido label dos botões de "Adicionar" e "Remover" para existir apenas ícones.
- `spacing.scss`: adicionado 2 novos tokens: `2xl` e `3xl`.
- modificações referentes as mudanças do `QasBtn`: [QasActionsMenu, QasAlert, QasAppBar, QasAppMenu, QasCard, QasCopy, QasDateTimeInput, QasDelete, QasDialog, QasFilters, QasFormView, QasGallery, PvGalleryCarouselDialog, QasListItems, QasNestedFields, QasPagination, QasSelectList, QasSignaturePad, QasSignatureUploader, QasTransfer, QasTreeGenerator, QasUploader, ErrorComponent].
- [`NotifyError`, `NotifySuccess`]: adicionado flag para diferenciar notifies de erro e sucesso.
- `QasFormView`: alterado mensagem de erro de "Existem campos no formulário que ainda não foram preenchidos. Complete todas as informações para avançar." para "Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente."
- [`/`, `/docs`, `/ui`, `app-extension`]: atualizadas bibliotecas do quasar, @quasar/extras, @quasar/app-webpack, store-adapter e vue.

### Corrigido
- `QasTextTruncate`: corrigido bug quando o texto tinha como valor inicial `undefined`.
- `QasFilters`: corrigido model search que vinha vazio mesmo estando na URL quando usado propriedade `:use-filter-button="false"`.
- `QasFilters`: corrigido problema de style sendo aplicado a demais componentes com a classe `q-field` quando usado dentro do slot do QasFilters.
- `QasDateTimeInput`: corrigido ícone `q-icon` para `QasBtn` com ícone, já que existe uma ação.
- `QasDateTimeInput`: corrigido problema quando o input era `readonly` e isto não repassado para os ícones de date e time.
- `QasDialog`: corrigido espaçamento do `QasActions`.
- `QasTextTruncate`: corrigido texto de descrição quando vem por slot.
- `vue-plugin.js`: adicionado plugin de `Loading` para corrigir problema de variável global interna causado pela atualizações do quasar.
- `QasWelcome`: corrigido problema de data.
- `ErrorComponent`: adicionado prefixo `sym_r_`.

### Removido
- `PvTabsGeneratorStatus`: removido componente privado em favor do componente publico `QasStatus`.
- `text.md`: removido aquivo para ser unificado no `typography.md`.
- `QasCopy`: removido propriedade `size` uma vez que não é mais repassado pro `QasBtn`.
- `QasListItems`: removido propriedade `iconProps` para ser passado somente o nome ícone.
- `QasBtn`: não é repassado mais algumas propriedades para o quasar, elas são: [align, dense, fab, fabMini, flat, glossy, noWrap, outline, padding, push, ripple, round, size, square, stack, stretch, textColor, unelevated].
- `QasDelete`: fixado cor `grey-9` quando for tag `qas-btn`.
- `ui/src/asset/gear.svg`: removido ilustração.
- `Unauthorized`: removido uso da pagina de 401 já que ele nunca cai nela, o fluxo sempre leva para refazer login ou dar refresh no token.

## [3.6.0-beta.2] - 06-02-2023
### Modificado
- [`/`, `/docs`, `/ui`, `app-extension`]: atualizadas bibliotecas do quasar, @quasar/extras, @quasar/app-webpack, store-adapter e vue.

### Corrigido
- `vue-plugin.js`: adicionado plugin de `Loading` para corrigir problema de variável global interna causado pela atualizações do quasar.
- `QasWelcome`: corrigido problema de data.
- `ErrorComponent`: adicionado prefixo `sym_r_`.

## [3.6.0-beta.1] - 06-02-2023
## BREAKING CHANGES
- `QasBtn`: componente passou por muitas mudanças, é preciso repassar em **TODOS** os lugares que utilizam ele e rever as propriedades adicionando o comportamento / estilo correto.
- `QasCopy`: removido propriedade `size` uma vez que não é mais repassado pro `QasBtn`.
- `QasListItems`: removido propriedade `iconProps` para ser passado somente o nome ícone.
- `QasBtn`: não é repassado mais algumas propriedades para o quasar, elas são: [align, dense, fab, fabMini, flat, glossy, noWrap, outline, padding, push, ripple, round, size, square, stack, stretch, textColor, unelevated].
- `QasDelete`: fixado cor `grey-9` quando for tag `qas-btn`.

### Adicionado
- `QasListItems`: adicionado nova propriedade `icon` para repassar o nome do ícone.
- `QasBtn`: adicionado propriedade `useHoverOnWhiteColor` para remover cor de hover quando a cor for `white` e variant `tertiary`, para resolver problemas de contrast em alguns casos específicos.
- `QasBtn`: adicionado propriedade `variant` para escolher comportamento / design do botão, sendo 3 possibilidades: `primary`, `secondary` e `tertiary` (default).
- `QasBtn`: adicionado no componente a propriedade `color` com 3 possibilidades: `primary`, `grey-9` e `white`, porem esta propriedade só funciona quando a variante for `tertiary`.
- `ui/src/css/components/button.scss`: adicionado classe `button.scss` para modificar o QasBtn, foi criado uma classe ao invés de modificar no componente para ser possível alterar o estilo do botão quando não for utilizado o QasBtn.
- `ui/src/css/mixins/set-button.scss`: adicionado novo mixin para forçar `QBtn` internos a terem mesmos estilos do `QasBtn`.
- `spacing.md`: adicionado documentação para espaçamentos.
- [`Forbidden`, `NotFound`, `ServerError`]: adicionado documentação das páginas de erros.

### Modificado
- `QasDelete`: fixado cor `grey-9` quando a prop `tag` for `qas-btn`.
- `QasActionsMenu`: recebendo propriedade `color` dentro dos itens do `list`, que sobrepõe a propriedade `color`, porém só é usado quando existe apenas um único item na lista.
- `QasBtn`: mudanças de design system, tanto de comportamento quando design.
- `QasBtn`: melhorado documentação.
- `QasActions.vue`: alterado espaçamento `top`.
- `QasBadge`: adicionado tamanho mínimo de `24px` para respeitar layout.
- `QasFormView`: modificado actions para usar `QasActions`.
- `QasListView`: modificado espaçamento usado na paginação.
- `QasPagination`: mudanças de responsividade.
- `QasSearchBox`: mudanças de estilo no ícone de input para ficar semelhante ao `QasSelect` quando tem busca.
- `ui/src/css/variables/button.scss`: modificado valores.
- [`ErrorComponent`, `Forbidden`, `Unauthorized`, `ServerError`]: modificado layout.
- `QasSelectList`: removido label dos botões de "Adicionar" e "Remover" para existir apenas ícones.
- `spacing.scss`: adicionado 2 novos tokens: `2xl` e `3xl`.
- modificações referentes as mudanças do `QasBtn`: [QasActionsMenu, QasAlert, QasAppBar, QasAppMenu, QasCard, QasCopy, QasDateTimeInput, QasDelete, QasDialog, QasFilters, QasFormView, QasGallery, PvGalleryCarouselDialog, QasListItems, QasNestedFields, QasPagination, QasSelectList, QasSignaturePad, QasSignatureUploader, QasTransfer, QasTreeGenerator, QasUploader, ErrorComponent].
- [`NotifyError`, `NotifySuccess`]: adicionado flag para diferenciar notifies de erro e sucesso.
- `QasFormView`: alterado mensagem de erro de "Existem campos no formulário que ainda não foram preenchidos. Complete todas as informações para avançar." para "Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente."

### Corrigido
- `QasDialog`: corrigido espaçamento do `QasActions`.
- `QasTextTruncate`: corrigido texto de descrição quando vem por slot.

### Removido
- `QasCopy`: removido propriedade `size` uma vez que não é mais repassado pro `QasBtn`.
- `QasListItems`: removido propriedade `iconProps` para ser passado somente o nome ícone.
- `QasBtn`: não é repassado mais algumas propriedades para o quasar, elas são: [align, dense, fab, fabMini, flat, glossy, noWrap, outline, padding, push, ripple, round, size, square, stack, stretch, textColor, unelevated].
- `QasDelete`: fixado cor `grey-9` quando for tag `qas-btn`.
- `ui/src/asset/gear.svg`: removido ilustração.
- `Unauthorized`: removido uso da pagina de 401 já que ele nunca cai nela, o fluxo sempre leva para refazer login ou dar refresh no token.

## [3.6.0-beta.0] - 31-01-2023
### Adicionado
- `QasBadge` adicionado novo componente wrapper do quasar para badges.
- `QasStatus`: adicionado componente circular de status.
- `typography.md`: adicionado documentação para classes de tipografia.

### Modificado
- `ui/src/index.scss`: modificado `--qas-generic-border-radius` para `4px`.
- `QasTabsGenerator`: utilizando `QasStatus` no lugar do `PvTabsGeneratorStatus`.
- [`QasSelect`, `QasSearchBox`]: removido `threshold: 0.1`, deixando o default do `fuse.js` (0.6), assim a busca fica menos precisa e mais fácil de filtrar o que deseja.
- `typography.scss`: alterado line-height fixo de `1.5rem` para o mesmo de cada `font-size`.

### Corrigido
- `QasTextTruncate`: corrigido bug quando o texto tinha como valor inicial `undefined`.
- `QasFilters`: corrigido model search que vinha vazio mesmo estando na URL quando usado propriedade `:use-filter-button="false"`.
- `QasFilters`: corrigido problema de style sendo aplicado a demais componentes com a classe `q-field` quando usado dentro do slot do QasFilters.
- `QasDateTimeInput`: corrigido ícone `q-icon` para `QasBtn` com ícone, já que existe uma ação.
- `QasDateTimeInput`: corrigido problema quando o input era `readonly` e isto não repassado para os ícones de date e time.

### Removido
- `PvTabsGeneratorStatus`: removido componente privado em favor do componente publico `QasStatus`.
- `text.md`: removido aquivo para ser unificado no `typography.md`.

## [3.5.0] - 31-01-2023
## BREAKING CHANGE
- `QasField`: removido propriedade `useSearch` que era repassado para o `QasSelect` já que agora o componente QasSelect já adiciona uma busca automática quando existem muitas opções, porém ainda é possível passar a propriedade `useSearch` mas não de forma automática, precisa setar manualmente.
- `QasField`: Alterado type `radio` par utilizar o novo componente `QasOptionGroup` e removido prop de erro pois não existe no componente `QOptionGroup`, testar bem para validar.
- Componentes de radio agora existe padronização, a partir do mobile componente segue comportamento de linha, em telas mobile segue comportamento de bloco, não sendo possível alterar este comportamento, verificar locais que utilizam para não quebrar o estilo.
- `QasTableGenerator`: pode haver breaking change de design no espaçamento embaixo do componente uma vez que foi removido a classe `q-mb-xl`.
- `QasActionsMenu`: removido propriedade `label`, agora o label sempre será fixo "Opções".
- `QasNestedFields`: mudanças de comportamento e estilo do nested, rever implementações.
- `QasFilters`: removido slot `filter-button`.
`QasAvatar`: removido propriedades `color` e `text-color` agora sempre vai ser background primary com cor de texto branca.
- `QasAvatar`: mudanças relacionadas a cor.
- `QasPageHeader`: adicionada nova propriedade `useHomeIcon` que habilita o ícone de início como primeiro nível do breadcrumbs, com default `true` para respeitar novo padrão de design, caso já tenha um nível de "início" declarado no breadcrumbs, remova.
- - `icons`: modificado biblioteca de ícones para `material-symbols-rounded`, agora é necessário alterar o prefixo dos ícones de `o_` para `sym_r_`.
- `QasTabsGenerator`: removido propriedades: `activeColor`, `counterProps`, `indicatorColor` e `tabClass` com intuito de padronizar novos estilos.
- `ui/src/css/utils/shadow.scss`: removido util shadow.scss para mudar shadow por variável.
- `QasDialog`: removido propriedade `cardProps` pois não utilizamos mais o `QCard`.
- `QasDialog`: removido propriedade `useCloseButton` pois agora o controle de mostrar o botão é feito automaticamente.

### Adicionado
- `QasFilters`: adicionado nova propriedade `fieldsProps` para repassar propriedades para os campos do filtro.
- `QasSelect`: adicionado busca automática quando existem pelo menos 10 opções.
- `QasOptionGroup`: adicionado novo componente wrapper do `QOptionGroup` do quasar, para deixar padronizado propriedade `inline` e deixar mais componentizado.
- `QasPagination`: adicionado novo componente de paginação que é um wrapper do `QPagination`.
- `QasField`: Adicionado `*` na label no caso do campo ser obrigatório com base na propriedade `required: true`.
- [`NotifySuccess`, `NotifyError`]: Adicionado botão de fechar.
- `shared`: Adicionado pasta para arquivos de configurações que iremos utilizar internamente.
- `plugins`: Adicionado pasta para plugins css.
- `notify.scss`: Adicionado arquivo de css para o novo padrão de layout dos notifies.
- `QasListView`: adicionado nova propriedade `use-auto-handle-on-delete` para controlar se o componente vai lidar automaticamente quando acontecer algum delete compatível com a listagem.
- `QasActionsMenu`: adicionada a propriedade `auto-close` para fechar o menu após a ação ser executada.
- `QasNestedFields`: adicionado propriedade `actions-menu-props` para repassar propriedades para o `QasActionsMenu`.
- `QasActionsMenu`: adicionado propriedade `useLabelOnSmallScreen`.
- `QasNestedFields`: adicionada nova propriedade `addFirstInputLabel` para modificar o texto do botão de adicionar o primeiro item.
- `QasNestedFields`: adicionada nova propriedade `useFirstInputButton` para usar um botão diferente para adicionar o primeiro item.
- `QasNestedFields`: adicionada nova propriedade `useStartsEmpty` para iniciar o componente sem nenhum item.
- `QasTableGenerator`: Suporte ao evento `rowClick`, nativo do `QTable`.
- `QasAppUser`: Novo componente para exibir informações do usuário logado.
-`ui/src/index.scss`: adicionado nova variável css para transição: `--qas-generic-transition: 300ms`.
- `border.scss`: adicionado nova cor de borda `border-grey`.
- `index.scss`: adicionado nova var css `--qas-border-grey`.
- `QasAvatar`: adicionado propriedade `size`.
- `QasAvatar`: adicionado propriedade color sendo possível passar 2 valores `primary` e `secondary-contrast`.
- `QasHeaderActions`: adicionado novo componente para trabalhar com descrição e ações.
- `set-typography.scss`: adicionado novo mixin para setar estilos de tipografia quando não é possível através das classes do quasar.
- `QasActions`: adicionado propriedade `use-full-width` para deixar as colunas 100%, com col-12.
- `QasActions`: adicionado propriedade `use-equal-width` para deixar as colunas 50% no desktop e 100% no mobile, col-12 col-sm-6.
`ui/src/css/variables/shadow.scss`: adicionado shadow.scss para modificar através de variável.
- `QasActionsMenu`: adicionado propriedade `useLabel` com default `true` para esconder o label em todas as telas necessárias.
- `QasWelcome`: adicionado novo componente de boas-vindas para uso na Home.
- `date-config.js`: adicionado arquivo para configurações de datas.

### Corrigido
- `QasNestedFields`: resolvido validação do `showDestroyBtn`.
- `QasFormView`: agora quando faz um submit com sucesso os erros são resetados.
- `QasField`: agora o label de required também é modificado caso passe através dos `$attrs`.
- `QasAppMenu`: adicionado validação na badge de desenvolvimento.
- `QasAppUser`: corrigido avatar.
- `QasAvatar`: corrigido $attrs.
- `QasActionsMenu`: corrigido problema de circular dependency entre as propriedades computadas `actions` e `hasMoreThanOneAction`.
- `QasTabsGenerator`: corrigido documentação.
- `QasTabsGenerator`: agora o model não é alterado internamente ao clicar em uma tab desabilitada.
- `QasUploader`: corrigido propriedade `color` do `QasAvatar` dentro do uploader.
- `QasPageHeader`: mudanças de layout e comportamento, agora caso o breadcrumbs tenha mais de 4 níveis é adicionado uma label "...".
- `typography.scss`: alterado `font-weight` do `$caption` para `400`.
- `QasPageHeader`: adicionada nova propriedade `useHomeIcon` que habilita o ícone de início como primeiro nível do breadcrumbs, com default `true` para respeitar novo padrão de design.
- `QasActionsMenu`: alterado valor default da propriedade `useLabelOnSmallScreen` para `false`.
- `QasTabsGenerator`: alteração de estilos.
- `QasTableGenerator`: modificado cores e fontes.
- `QasPagination`: modificado cor das paginas para `grey-8` e cor dos ícones de setas para `grey-9`.
- `QasDateTimeInput`: adicionado validações para datas invalidas.
- `icons`: modificado biblioteca de ícones para `material-symbols-rounded`, agora é necessário alterar o prefixo dos ícones de `o_` para `sym_r_`.
- [`QasFilters`, `QasSearchBox`]: alterado debounce de `500ms` para `1200ms`.
- `QasSelect`: alterado debounce de `500ms` (default) para `1200ms` e quando não tem `useLazyLoading` removido o debounce.
- `QasAppMenu`: corrigido tamanho do drawer, estava invertido, 320px deve ser no mobile e não desktop.
- `QasAppMenu`: corrigido botão de fechar drawer no mobile, não tinha nenhuma ação ao clicar nele.
- `item.scss`: corrigido cor quando o item está ativo, estava sobrescrevendo com a cor `grey-9` mesmo o item sendo ativo, agora não mais.

### Modificado
- `QasField`: alterado type `radio` par utilizar o novo componente `QasOptionGroup` e removido prop de erro pois não existe no componente `QOptionGroup`.
- `typography.scss`: alterado tipografia para seguir novo padrão de design.
- [`QasTextTruncate`, `QasDelete`, `QasCopy`]: adicionado modificador `.stop` nos eventos `@click.stop` para prevenir evento de click quando utilizado dentro da tabela.
- `QasNestedFields`: modificado o valor padrão da propriedade `useDestroyAlways` para ser um espelho da propriedade `useStartsEmpty` como valor default.
- [`NotifySuccess`, `NotifyError`]: Mudança de posição que será exibido(era bottom, agora será top).
- [`NotifySuccess`, `NotifyError`]: Mudança de cor, agora será `grey-9`.
- `generator.js`: Modificado o padrão da prop de gutter de `md` para `lg`.
- `QasActionsMenu`: modificado o estilo padrão do componente e comportamento quando há uma ação ou mais ações.
- `QasActionsMenu`: modificado a label padrão do botão para "Opções" e ícone para `o_more_vert`.
- `QasTableGenerator`: removido classe `q-mb-xl` para adaptação de layout, responsabilidade de espaçamento fica com quem implementa.
- `QasListView`: utilizando `QasPagination` no lugar do `QPagination` e adicionado de informação de quantos itens existem por página.
- `QasNestedFields`: agora usa o `QActionsMenu` para as ações exibidas no tipo bloco.
- `QasActionsMenu`: refatorado código, alterado estilos.
- `items.scss`: modificado classe global do `q-item` para adicionar `fonte-weight: 600` sempre que não estiver desativado.
- `spacing.scss`: modificado espaçamento do `lg` de 32px para 24px e do `xl` de 48px para 32px.
- `QasListView`: modificado estilo do `empty-results`.
- `QasFormView`: alterado valor default da propriedade `cancelButtonLabel` de "Cancelar" para "Voltar".
- `QasPageHeader`: removido botão de voltar ao lado do título da página.
- `QasSelect`: alterado ícone de busca para a esquerda ao invés da direita.
- `QasNestedFields`: alterado nome da computada `showDestroyBtn` para `showDestroyButton`.
- [`QasFormView`, `view.js`, `QasDelete`]: alterado mensagens padrão do nofity, e removido `exception` dos notifies.
- `notify.scss`: adicionado tamanho máximo de `560px`.
- [`QasLayout`, `QasAppBar`, `QasAppMenu`]: Modificado internamente em razão do novo layout.
- `QasAppMenu`: removido busca dos módulos.
- `QasFilters`: mudanças de design.
- `QasPageHeader`: alterado espaçamento de `q-mb-lg` para `q-mb-xl` para manter o que era anteriormente.
- `QasFormView`: modificado comportamento da propriedade `disable`, agora só desabilita o botão de salvar (submit), deixando o botão voltar habilitado.
- [`QasAlert`, `QasAvatar`, `QasBox`, `QasCard`, `QasTransfer`]: modificado cores referente a `primary-contrast` e `secondary-contrast`.
- `quasar.variables.scss`: modificado cores.
- QasAppMenu: adicionado `border-radius: 4px` no select de módulos.
- `shadow.scss`: modificado cor `shadow-2` do quasar.
- modificado cor `accent` para opacidade de `10%` ao invés de `20%`.
- `QasNumericInput`: adicionado manualmente prefixo `R$ ` com espaçamento a mais propositalmente.
- [`QasAppMenu`, `QasAppBar`, `QasAppUser`]: mudanças de layout.
- `QasActions`: modificado default da propriedade `gutter` para `lg` porém no mobile ela continua `md`.
- `QasDialog`: modificado estilos do dialog.
- [`QasDelete`, `delete.js`, `QasFormView`]: removido titulo do dialog.
- `QasTreeGenerator`: removido titulo do dialog de excluir ramo.
- `spacing.scss`: modificado variáveis de gutter para aplicar mudanças do spacing.
- `QasSignatureUploader`: modificado customização do template `actions` do `qas-dialog` para utilizar o default.
- `item.scss`: modificado cor do hover para `$primary-color`;
- `item.scss`: modificado cor do item quando clicável para `grey-9` e quando não clicável para `grey-8`.

### Removido
- `QasField`: removido propriedade `useSearch` que era repassado para o `QasSelect` já que agora o componente QasSelect já adiciona uma busca automática quando existem muitas opções, porém ainda é possível passar a propriedade `useSearch` mas não de forma automática, precisa setar manualmente.
- `QasActionsMenu`: removido propriedade `label`, agora o label sempre será fixo "Opções".
- `QasNestedFields`: modificado o valor padrão da propriedade `addInputLabel` para "Adicionar".
- `QasFilters`: removido slot `filter-button`.
`QasAvatar`: removido propriedades `color` e `text-color` agora sempre vai ser background primary com cor de texto branca.
- `QasTabsGenerator`: removido propriedades: `activeColor`, `counterProps`, `indicatorColor` e `tabClass` com intuito de padronizar novos estilos.
- `ui/src/css/utils/shadow.scss`: removido util shadow.scss para mudar shadow por variável.
- `QasDialog`: removido propriedade `cardProps` pois não utilizamos mais o `QCard`.
- `QasDialog`: removido propriedade `useCloseButton` pois agora o controle de mostrar o botão é feito automaticamente.

## [3.5.0-beta.15] - 24-01-2023
### Corrigido
- `item.scss`: corrigido cor quando o item está ativo, estava sobrescrevendo com a cor `grey-9` mesmo o item sendo ativo, agora não mais.

## [3.5.0-beta.14] - 17-01-2023
### Corrigido
- `QasAppMenu`: corrigido tamanho do drawer, estava invertido, 320px deve ser no mobile e não desktop.
- `QasAppMenu`: corrigido botão de fechar drawer no mobile, não tinha nenhuma ação ao clicar nele.

## [3.5.0-beta.13] - 17-01-2023
### Adicionado
- `QasActions`: adicionado propriedade `use-full-width` para deixar as colunas 100%, com col-12.
- `QasActions`: adicionado propriedade `use-equal-width` para deixar as colunas 50% no desktop e 100% no mobile, col-12 col-sm-6.
`ui/src/css/variables/shadow.scss`: adicionado shadow.scss para modificar através de variável.
- `QasActionsMenu`: adicionado propriedade `useLabel` com default `true` para esconder o label em todas as telas necessárias.
- `QasWelcome`: adicionado novo componente de boas-vindas para uso na Home.
- `date-config.js`: adicionado arquivo para configurações de datas.

### Modificado
- `QasNumericInput`: adicionado manualmente prefixo `R$ ` com espaçamento a mais propositalmente.
- [`QasAppMenu`, `QasAppBar`, `QasAppUser`]: mudanças de layout.
- `QasActions`: modificado default da propriedade `gutter` para `lg` porém no mobile ela continua `md`.
- `QasDialog`: modificado estilos do dialog.
- [`QasDelete`, `delete.js`, `QasFormView`]: removido titulo do dialog.
- `QasTreeGenerator`: removido titulo do dialog de excluir ramo.
- `spacing.scss`: modificado variáveis de gutter para aplicar mudanças do spacing.
- `QasSignatureUploader`: modificado customização do template `actions` do `qas-dialog` para utilizar o default.
- `item.scss`: modificado cor do hover para `$primary-color`;
- `item.scss`: modificado cor do item quando clicável para `grey-9` e quando não clicável para `grey-8`.

### Removido
- `ui/src/css/utils/shadow.scss`: removido util shadow.scss para mudar shadow por variável.
- `QasDialog`: removido propriedade `cardProps` pois não utilizamos mais o `QCard`.
- `QasDialog`: removido propriedade `useCloseButton` pois agora o controle de mostrar o botão é feito automaticamente.

## [3.5.0-beta.12] - 06-01-2023
## BREAKING CHANGES:
- `QasPageHeader`: adicionada nova propriedade `useHomeIcon` que habilita o ícone de início como primeiro nível do breadcrumbs, com default `true` para respeitar novo padrão de design, caso já tenha um nível de "início" declarado no breadcrumbs, remova.
- - `icons`: modificado biblioteca de ícones para `material-symbols-rounded`, agora é necessário alterar o prefixo dos ícones de `o_` para `sym_r_`.
- `QasTabsGenerator`: removido propriedades: `activeColor`, `counterProps`, `indicatorColor` e `tabClass` com intuito de padronizar novos estilos.

### Adicionado
- `QasHeaderActions`: adicionado novo componente para trabalhar com descrição e ações.
- `set-typography.scss`: adicionado novo mixin para setar estilos de tipografia quando não é possível através das classes do quasar.

### Modificado
- `QasPageHeader`: mudanças de layout e comportamento, agora caso o breadcrumbs tenha mais de 4 níveis é adicionado uma label "...".
- `typography.scss`: alterado `font-weight` do `$caption` para `400`.
- `QasPageHeader`: adicionada nova propriedade `useHomeIcon` que habilita o ícone de início como primeiro nível do breadcrumbs, com default `true` para respeitar novo padrão de design.
- `QasActionsMenu`: alterado valor default da propriedade `useLabelOnSmallScreen` para `false`.
- `QasTabsGenerator`: alteração de estilos.
- `QasTableGenerator`: modificado cores e fontes.
- `QasPagination`: modificado cor das paginas para `grey-8` e cor dos ícones de setas para `grey-9`.
- `QasDateTimeInput`: adicionado validações para datas invalidas.
- `icons`: modificado biblioteca de ícones para `material-symbols-rounded`, agora é necessário alterar o prefixo dos ícones de `o_` para `sym_r_`.
- [`QasFilters`, `QasSearchBox`]: alterado debounce de `800ms` para `1200ms`.
- `QasSelect`: alterado debounce de `500ms` (default) para `1200ms` e quando não tem `useLazyLoading` removido o debounce.

### Corrigido
- `QasTabsGenerator`: corrigido documentação.
- `QasTabsGenerator`: agora o model não é alterado internamente ao clicar em uma tab desabilitada.
- `QasUploader`: corrigido propriedade `color` do `QasAvatar` dentro do uploader.

### Removido
- `QasTabsGenerator`: removido propriedades: `activeColor`, `counterProps`, `indicatorColor` e `tabClass` com intuito de padronizar novos estilos.

## [3.5.0-beta.11] - 02-01-2023
### Modificado
- `shadow.scss`: modificado cor `shadow-2` do quasar.
- modificado cor `accent` para opacidade de `10%` ao invés de `20%`.

## [3.5.0-beta.10] - 30-12-2022
### Corrigido
- `QasActionsMenu`: corrigido problema de circular dependency entre as propriedades computadas `actions` e `hasMoreThanOneAction`.

## [3.5.0-beta.9] - 29-12-2022
### Corrigido
- `QasAvatar`: corrigido $attrs.

## [3.5.0-beta.8] - 28-12-2022
## BREAKING CHANGES
- `QasAvatar`: mudanças relacionadas a cor.

### Adicionado
- `QasAvatar`: adicionado propriedade `size`.
- `QasAvatar`: adicionado propriedade color sendo possível passar 2 valores `primary` e `secondary-contrast`.

### Modificado
- QasAppMenu: adicionado `border-radius: 4px` no select de módulos.

### Corrigido
- `QasAppUser`: corrigido avatar.

## [3.5.0-beta.7] - 28-12-2022
### Adicionado
- `border.scss`: adicionado nova cor de borda `border-grey`.
- `index.scss`: adicionado nova var css `--qas-border-grey`.

### Modificado
- [`QasAlert`, `QasAvatar`, `QasBox`, `QasCard`, `QasTransfer`]: modificado cores referente a `primary-contrast` e `secondary-contrast`.
- `quasar.variables.scss`: modificado cores.

### Corrigido
- `QasAppMenu`: adicionado validação na badge de desenvolvimento.

### Removido
`QasAvatar`: removido propriedades `color` e `text-color` agora sempre vai ser background primary com cor de texto branca.

## [3.5.0-beta.6] - 26-12-2022
### Modificado
- `QasFormView`: modificado comportamento da propriedade `disable`, agora só desabilita o botão de salvar (submit), deixando o botão voltar habilitado.

### Corrigido
- `QasField`: agora o label de required também é modificado caso passe através dos `$attrs`.

## [3.5.0-beta.5] - 26-12-2022
## BREAKING CHANGE
- `QasFilters`: removido slot `filter-button`.

### Adicionado
- `QasSelect`: adicionado documentação do `useSearch`.
-`ui/src/index.scss`: adicionado nova variável css para transição: `--qas-generic-transition: 300ms`;

### Modificado
- `QasFilters`: mudanças de design.
- `QasFilters`: alterado debounce de `500ms` para `800ms`.
- `QasPageHeader`: alterado espaçamento de `q-mb-lg` para `q-mb-xl` para manter o que era anteriormente.

### Removido
- `QasFilters`: removido slot `filter-button`.

### Corrigido
- `QasFormView`: agora quando faz um submit com sucesso os erros são resetados.

## [3.5.0-beta.4] - 22-12-2022
### Adicionado
- `QasSelect`: adicionado propriedade `useSearch` para caso que não queira busca automática do fuse, se não passar essa prop a busca vai depender da quantidade de options.

### Modificado
- `QasAppMenu`: removido busca dos módulos.

## [3.5.0-beta.3] - 22-12-2022
### Adicionado
- `QasAppUser`: Novo componente para exibir informações do usuário logado.

### Modificado
- [`QasLayout`, `QasAppBar`, `QasAppMenu`]: Modificado inteiramente em razão do novo layout.

## [3.5.0-beta.2] - 20-12-2022
### Modificado
- `QasFormView`: alterado valor default da propriedade `cancelButtonLabel` de "Cancelar" para "Voltar".
- `QasPageHeader`: removido botão de voltar ao lado do título da página.
- `QasSelect`: alterado ícone de busca para a esquerda ao invés da direita.
- `QasNestedFields`: alterado nome da computada `showDestroyBtn` para `showDestroyButton`.
- [`QasFormView`, `view.js`, `QasDelete`]: alterado mensagens padrão do nofity, e removido `exception` dos notifies.
- `notify.scss`: adicionado tamanho máximo de `560px`.

### Corrigido
- `QasNestedFields`: resolvido validação do `showDestroyBtn`.

## [3.5.0-beta.1] - 16-12-2022
## BREAKING CHANGE
- `QasTableGenerator`: pode haver breaking change de design no espaçamento embaixo do componente uma vez que foi removido a classe `q-mb-xl`.
- `QasActionsMenu`: removido propriedade `label`, agora o label sempre será fixo "Opções".
- `QasNestedFields`: mudanças de comportamento e estilo do nested, rever implementações.

### Adicionado
- `QasPagination`: adicionado novo componente de paginação que é um wrapper do `QPagination`.
- `QasField`: Adicionado `*` na label no caso do campo ser obrigatório com base na propriedade `required: true`.
- [`NotifySuccess`, `NotifyError`]: Adicionado botão de fechar.
- [`NotifySuccess`, `NotifyError`]: Adicionado ícones de sucesso e erro.
- `shared`: Adicionado pasta para arquivos de configurações que iremos utilizar internamente.
- `plugins`: Adicionado pasta para plugins css.
- `notify.scss`: Adicionado arquivo de css para o novo padrão de layout dos notifies.
- `QasListView`: adicionado nova propriedade `use-auto-handle-on-delete` para controlar se o componente vai lidar automaticamente quando acontecer algum delete compatível com a listagem.
- `QasActionsMenu`: adicionada a propriedade `auto-close` para fechar o menu após a ação ser executada.
- `QasNestedFields`: adicionado propriedade `actions-menu-props` para repassar propriedades para o `QasActionsMenu`.
- `QasActionsMenu`: adicionado propriedade `useLabelOnSmallScreen`.
- `QasNestedFields`: adicionada nova propriedade `addFirstInputLabel` para modificar o texto do botão de adicionar o primeiro item.
- `QasNestedFields`: adicionada nova propriedade `useFirstInputButton` para usar um botão diferente para adicionar o primeiro item.
- `QasNestedFields`: adicionada nova propriedade `useStartsEmpty` para iniciar o componente sem nenhum item.
- `QasTableGenerator`: Suporte ao evento `rowClick`, nativo do `QTable`.

### Modificado
- [`NotifySuccess`, `NotifyError`]: Mudança de posição que será exibido(era bottom, agora será top).
- [`NotifySuccess`, `NotifyError`]: Mudança de cor, agora será `grey-9`.
- `generator.js`: Modificado o padrão da prop de gutter de `md` para `lg`.
- `QasActionsMenu`: modificado o estilo padrão do componente e comportamento quando há uma ação ou mais ações.
- `QasActionsMenu`: modificado a label padrão do botão para "Opções" e ícone para `o_more_vert`.
- `QasTableGenerator`: removido classe `q-mb-xl` para adaptação de layout, responsabilidade de espaçamento fica com quem implementa.
- `QasListView`: utilizando `QasPagination` no lugar do `QPagination` e adicionado de informação de quantos itens existem por página.
- `QasNestedFields`: agora usa o `QActionsMenu` para as ações exibidas no tipo bloco.
- `QasActionsMenu`: refatorado código, alterado estilos.
- `items.scss`: modificado classe global do `q-item` para adicionar `fonte-weight: 600` sempre que não estiver desativado.
- `spacing.scss`: modificado espaçamento do `lg` de 32px para 24px e do `xl` de 48px para 32px.
- `QasListView`: modificado estilo do `empty-results`.

### Removido
- `QasActionsMenu`: removido propriedade `label`, agora o label sempre será fixo "Opções".
- `QasNestedFields`: modificado o valor padrão da propriedade `addInputLabel` para "Adicionar".
- `QasNestedFields`: modificado o valor padrão da propriedade `useDestroyAlways` para ser um espelho da propriedade `useStartsEmpty` como valor default.

## [3.5.0-beta.0] - 18-11-2022
## BREAKING CHANGE
- `QasField`: Alterado type `radio` par utilizar o novo componente `QasOptionGroup` e removido prop de erro pois não existe no componente `QOptionGroup`, testar bem para validar.
- Componentes de radio agora existe padronização, a partir do mobile componente segue comportamento de linha, em telas mobile segue comportamento de bloco, não sendo possível alterar este comportamento, verificar locais que utilizam para não quebrar o estilo.
- `QasSelect`: removido propriedade `useSearch` pois agora existe o padrão de ter pesquisa pelo fuse sempre que existir pelo menos 10 opções e nunca menos que isto.
### Adicionado
- `QasFilters`: adicionado nova propriedade `fieldsProps` para repassar propriedades para os campos do filtro.
- `QasSelect`: adicionado busca automaticamente quando existem pelo menos 10 opções.
- `QasOptionGroup`: adicionado novo componente wrapper do `QOptionGroup` do quasar, para deixar padronizado propriedade `inline` e deixar mais componentizado.

### Modificado
- `QasField`: alterado type `radio` par utilizar o novo componente `QasOptionGroup` e removido prop de erro pois não existe no componente `QOptionGroup`.
- `QasField`: removido propriedade `useSearch` que era repassado para o `QasSelect` já que ela foi removido do mesmo.
- `typography.scss`: alterado tipografia para seguir novo padrão de design.
- [`QasTextTruncate`, `QasDelete`, `QasCopy`]: adicionado modificador `.stop` nos eventos `@click.stop` para prevenir evento de click quando utilizado dentro da tabela.

### Removido
- `QasSelect`: removido propriedade `useSearch` pois agora existe o padrão de ter pesquisa pelo fuse sempre que existir pelo menos 10 opções e nunca menos que isto.

## [3.4.0] - 18-11-2022
### Adicionado
- `QasField`: repassando `useStrengthChecker` no QasField.
- `copyToClipboard`: adicionado novo helper copyToClipboard para ser utilizado no componente `QasCopy` e fora do asteroid.

### Modificado
- [`QasFormView`, `QasListView`, `QasSingleView`]: removido notify de erro do método `mx_fetchError` quando o status code é `401 | 403 | 404 | >= 500`.
- `QasCopy`: utilizando novo helper`copyToClipboard`.
- `QasSearchBox`: modificado tempo de `debounce` no lazy loading de `500` para `800`.
- `QasSearchBox`: removido `disable` do campo de busca enquanto ocorria uma request.
- `quasar`: atualizado quasar para `2.10.1`.

### Corrigido
- `QasAppBar`: corrigido badge que mostra se o ambiente é de `Develop`.
- `QasPasswordInput`: corrigido problema de slots que não mostrada `QasPasswordStrengthChecker` quando renderizado pelo `QasField` e também não respeitava a prop `hideBottomSpace` quando usado diretamente.
- `QasFormGenerator`: corrigido problema que não deixava campo disabled quando a prop vinha pelo `QasField`.
- `QasInput`: corrigido problemas de mascara ao alterar valor do model fora do componente.

## [3.4.0-beta.2] - 17-11-2022
### Corrigido
- `QasFormGenerator`: corrigido problema que não deixava campo disabled quando a prop vinha pelo `QasField`.

## [3.4.0-beta.1] - 11-11-2022
### Adicionado
- `QasField`: repassando `useStrengthChecker` no QasField.

### Modificado
- `QasSearchBox`: modificado tempo de `debounce` no lazy loading de `500` para `800`.
- `QasSearchBox`: removido `disable` do campo de busca enquanto ocorria uma request.

### Corrigido
- `QasAppBar`: corrigido badge que mostra se o ambiente é de `Develop`.
- `QasPasswordInput`: corrigido problema de slots que não mostrada `QasPasswordStrengthChecker` quando renderizado pelo `QasField` e também não respeitava a prop `hideBottomSpace` quando usado diretamente.

## [3.4.0-beta.0] - 10-11-2022
### Adicionado
- `copyToClipboard`: adicionado novo helper copyToClipboard para ser utilizado no componente `QasCopy` e fora do asteroid.

### Modificado
- [`QasFormView`, `QasListView`, `QasSingleView`]: removido notify de erro do método `mx_fetchError` quando o status code é `401 | 403 | 404 | >= 500`.
- `QasCopy`: utilizando novo helper`copyToClipboard`.

## [3.3.1-beta.0] - 04-11-2022
### Modificado
- `quasar`: atualizado quasar para `2.10.1`.

### Corrigido
- `QasInput`: corrigido problemas de mascara ao alterar valor do model fora do componente.

## [3.3.0] - 04-11-2022
## BREAKING CHANGES
- `QasGallery`: propriedade `images` substituída para `modelValue` uma vez que agora é possível excluir itens da galeria.
- `QasGallery`: propriedade `height` removida para padronização.
- `QasGallery`: propriedade `carouselNextIcon` removida para padronização.
- `QasGallery`: propriedade `carouselPreviousIcon` removida para padronização.
- `QasGallery`: propriedade `loadSize` removida, agora o tamanho de carregamento de imagens é relativo ao `initialSize`.

### Adicionado
- `QasDialog`: adicionado nova propriedade `useFullMaxWidth` para utilizar `100% do maxWidth`.
- `QasGallery`: adicionado funcionalidade para deletar imagem a partir da galeria.
- `QasGallery`: adicionado propriedade `customId` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `dialogProps` usada para configurar dialog de deleção.
- `QasGallery`: adicionado propriedade `entity` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `modelValue` usada para controlar as imagens.
- `QasGallery`: adicionado propriedade `modelKey` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `url` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `entity` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `useDestroy` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `useObjectModel` usada para definir model como objeto.
- `QasGallery`: adicionado evento `@update:modelValue` para atualização do model.
- `QasGallery`: adicionado evento `@delete-success` que é disparado quando acontece uma deleção com sucesso.
- `QasGallery`: adicionado evento `@delete-error` que é a deleção falha.

### Modificado
- `QasGallery`: alterado estilos/comportamento quando é imagem única do componente.
- `QasGallery`: refatoração de código.
- `QasGallery`: Adicionado classe `bg-white` para espaço entre a sombra e imagem sempre ficar `branca`.

### Corrigido
- `QasGallery`: resolvido pequeno problema referente a tamanhos

### Removido
- `QasGallery`: propriedade `images` substituída para `modelValue` uma vez que agora é possível excluir itens da galeria.
- `QasGallery`: propriedade `height` removida para padronização.
- `QasGallery`: propriedade `carouselNextIcon` removida para padronização.
- `QasGallery`: propriedade `carouselPreviousIcon` removida para padronização.
- `QasGallery`: propriedade `loadSize` removida, agora o tamanho de carregamento de imagens é relativo ao `initialSize`.

## [3.3.0-beta.1] - 31-10-2022
### Modificado
- `QasGallery`: adicionado classe `bg-white` para espaço entre a sombra e imagem sempre ficar `branca`.

## [3.3.0-beta.0] - 31-10-2022
## BREAKING CHANGES
- `QasGallery`: propriedade `images` substituída para `modelValue` uma vez que agora é possível excluir itens da galeria.
- `QasGallery`: propriedade `height` removida para padronização.
- `QasGallery`: propriedade `carouselNextIcon` removida para padronização.
- `QasGallery`: propriedade `carouselPreviousIcon` removida para padronização.
- `QasGallery`: propriedade `loadSize` removida, agora o tamanho de carregamento de imagens é relativo ao `initialSize`.

### Adicionado
- `QasDialog`: adicionado nova propriedade `useFullMaxWidth` para utilizar `100% do maxWidth`.
- `QasGallery`: adicionado funcionalidade para deletar imagem a partir da galeria.
- `QasGallery`: adicionado propriedade `customId` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `dialogProps` usada para configurar dialog de deleção.
- `QasGallery`: adicionado propriedade `entity` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `modelValue` usada para controlar as imagens.
- `QasGallery`: adicionado propriedade `modelKey` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `url` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `entity` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `useDestroy` usada para deletar a imagem da galeria.
- `QasGallery`: adicionado propriedade `useObjectModel` usada para definir model como objeto.
- `QasGallery`: adicionado evento `@update:modelValue` para atualização do model.
- `QasGallery`: adicionado evento `@delete-success` que é disparado quando acontece uma deleção com sucesso.
- `QasGallery`: adicionado evento `@delete-error` que é a deleção falha.

### Modificado
- `QasGallery`: alterado estilos/comportamento quando é imagem única do componente.
- `QasGallery`: refatoração de código.

### Corrigido
- `QasGallery`: resolvido pequeno problema referente a tamanhos

### Removido
- `QasGallery`: propriedade `images` substituída para `modelValue` uma vez que agora é possível excluir itens da galeria.
- `QasGallery`: propriedade `height` removida para padronização.
- `QasGallery`: propriedade `carouselNextIcon` removida para padronização.
- `QasGallery`: propriedade `carouselPreviousIcon` removida para padronização.
- `QasGallery`: propriedade `loadSize` removida, agora o tamanho de carregamento de imagens é relativo ao `initialSize`.

## [3.2.0] - 21-10-2022
## BREAKING CHANGES
- `QasAppMenu`: removido logo do modular no menu.
- `QasAppMenu`: agora os itens com children no item pai não tem redirecionamento, nem ícone, apenas os filhos dele.
- `quasar`: atualizado para 2.10.0.

### Adicionado
- `QasTreeGenerator`: adicionado novo componente para criação de árvore.
- `promiseHandler`: adicionado novo helper para lidar com promises.
- `destroyNestedChildrenByKey`: adicionado novo helper para lidar com remoção em campos nested.
- `findChildrenByKey`: adicionado novo helper para encontrar children através de chave e valor.
- `rules`: adicionado novo helper para lidar com validações de componentes, no momento existe apenas `required`.
- Criado automatização de todo processo de publicação do asteroid.

### Modificado
- `QasAvatar`: forçando a sempre ser "redondo", removido propriedades `rounded` e `square`.
- `QasAppBar`: alterado estilos do componente.
- `fonts.scss`: alterado font `Inter` para `Nunito`.
- `item.scss`: alterado estilo padrão do `QItem`.
- `spacing.scss`: alterado espaçamento padrão do `lg` para `32px`.
- `QasAppMenu`: alterado estilos e comportamento do componente, entre eles o modo "mini".
- `quasar`: atualizado o quasar para a versão 2.10.0.
- `QasLayout`: modificado screen `untilMedium` para `untilLarge`.

### Corrigido
- `add-counter-suffix.md`: corrigido title da documentação.
- `filter-object.md`: corrigido title da documentação.
- `checkbox-group.md`: corrigido documentação que estava pegando com base da do select.
- `transfer.yml`: adicionado chave `model: true` na propriedade `model-value`.
- `QasNestedFields`: Corrigido botão de excluir ao adicionar um novo item sem salvar ele não removia o item independente da prop useRemoveOnDestroy.

### Removido
- `QasAppMenu`: removido propriedade `brand-menu` pois não existe mais a logo "modular" no menu.

## [3.2.0-beta.3] - 19-10-2022
### Corrigido
- `QasAppBar`: adicionado classe `no-wrap` para não quebrar o menu de usuário.

## [3.2.0-beta.2] - 18-10-2022
## BREAKING CHANGES
- `QasAppMenu`: removido logo do modular no menu.
- `QasAppMenu`: agora os itens com children no item pai não tem redirecionamento, nem ícone, apenas os filhos dele.
- `quasar`: atualizado para 2.10.0.

### Modificado
- `QasAvatar`: forçando a sempre ser "redondo", removido propriedades `rounded` e `square`.
- `QasAppBar`: alterado estilos do componente.
- `fonts.scss`: alterado font `Inter` para `Nunito`.
- `item.scss`: alterado estilo padrão do `QItem`.
- `spacing.scss`: alterado espaçamento padrão do `lg` para `32px`.
- `QasAppMenu`: alterado estilos e comportamento do componente, entre eles o modo "mini".
- `quasar`: atualizado o quasar para a versão 2.10.0.
- `QasLayout`: modificado screen `untilMedium` para `untilLarge`.

### Removido
- `QasAppMenu`: removido propriedade `brand-menu` pois não existe mais a logo "modular" no menu.

## [3.2.0-beta.1] - 13-10-2022
### Adicionado
- Criado automatização de todo processo de publicação do asteroid.

## [3.2.0-beta.0] - 30-09-2022
### Adicionado
- `QasTreeGenerator`: adicionado novo componente para criação de árvore.
- `promiseHandler`: adicionado novo helper para lidar com promises.
- `destroyNestedChildrenByKey`: adicionado novo helper para lidar com remoção em campos nested.
- `findChildrenByKey`: adicionado novo helper para encontrar children através de chave e valor.
- `rules`: adicionado novo helper para lidar com validações de componentes, no momento existe apenas `required`.

### Corrigido
- `add-counter-suffix.md`: corrigido title da documentação.
- `filter-object.md`: corrigido title da documentação.
- `checkbox-group.md`: corrigido documentação que estava pegando com base da do select.
- `transfer.yml`: adicionado chave `model: true` na propriedade `model-value`.

## [3.1.1-beta.0] - 26-09-22
### Corrigido
- `QasNestedFields`: Corrigido botão de excluir ao adicionar um novo item sem salvar ele não removia o item independente da prop useRemoveOnDestroy.

## [3.1.0] - 19-09-22
### Adicionado
Adicionado suporte para Pinia/Vuex Seguindo os padrões da biblioteca `@bildvitta/store-adapter` e `@bildvitta/store-module`.
- `QasFormGenerator`: adicionado propriedade `disabled` para desativar todos os campos de uma vez.
- `QasNestedFields`: adicionado propriedade `disableRows`com esta propriedade é possível desabilitar rows (linhas) especificas passando um array com chaves identificadoras, ou caso queira desativar todas passando um boolean "true" (isto vai remover todos os botões da linha, duplicar e excluir).
- `QasNestedFields`: adicionado propriedade `useAdd` para controla quando vai ter seção de "adicionar" novas rows (linhas).
- `QasFilters`: adicionado data-cy no input, dropdown e botões
- `QasGridGenerator`: adicionado data-cy nos campos e resultados

### Modificado
- [`QasBox`, `QasListItems`, `QasCard`, `QasAppBar`]: alterado cor shadow padrão de `shadow-14` para `shadow-2`.
- `QasListItems`: alterado como usa shadow para resolver problema de borda que cortava o shadow, agora o componente usa o `QasBox` e removido prop `bordered`.

### Corrigido
- `QasActionsMenu`: Alterado propriedade `use-label-on-small-screen` para `:use-label-on-small-screen="false"` para seguir o padrão.
- `QasTabsGenerator`: Alterado type do `modelValue` para `[String, Number]` para aceitar numbers também.
- `QasTableGenerator`: Alterado `counters[key]` para `counters[tab.value]` para funcionar o counters quando utilizar tabs como `array`.
- `QasNestedFields`: Adicionado prop `deep: true` no watch no `modelValue` para resolver bug quando usa um custom slot, ou altera o v-model e perde a reatividade.

### Removido
- `shadow.scss`: Removido arquivo de sombras que alteravam cores para deixar estilo original do quasar.

## [3.1.0-beta.4] - 15-09-22
### Corrigido
- `QasNestedFields`: Adicionado prop `deep: true` no watch no `modelValue` para resolver bug quando usa um custom slot, ou altera o v-model e perde a reatividade.

## [3.1.0-beta.3] - 14-09-22
### Corrigido
- `QasActionsMenu`: Alterado propriedade `use-label-on-small-screen` para `:use-label-on-small-screen="false"` para seguir o padrão.
- `QasTabsGenerator`: Alterado type do `modelValue` para `[String, Number]` para aceitar numbers também.
- `QasTableGenerator`: Alterado `counters[key]` para `counters[tab.value]` para funcionar o counters quando utilizar tabs como `array`.

## [3.1.0-beta.2] - 06-09-22
### Modificado
- [`QasBox`, `QasListItems`, `QasCard`, `QasAppBar`]: alterado cor shadow padrão de `shadow-14` para `shadow-2`.
- `QasListItems`: alterado como usa shadow para resolver problema de borda que cortava o shadow, agora o componente usa o `QasBox` e removido prop `bordered`.

### Removido
- `shadow.scss`: Removido arquivo de sombras que alteravam cores para deixar estilo original do quasar.

## [3.1.0-beta.1] - 02-09-22
### Adicionado
- `QasFilters`: adicionado data-cy no input, dropdown e botões
- `QasGridGenerator`: adicionado data-cy nos campos e resultados

## [3.1.0-beta.0] - 02-09-22
### Adicionado
Adicionado suporte para Pinia/Vuex Seguindo os padrões da biblioteca `@bildvitta/store-adapter` e `@bildvitta/store-module`.
- `QasFormGenerator`: adicionado propriedade `disabled` para desativar todos os campos de uma vez.
- `QasNestedFields`: adicionado propriedade `disableRows`com esta propriedade é possível desabilitar rows (linhas) especificas passando um array com chaves identificadoras, ou caso queira desativar todas passando um boolean "true" (isto vai remover todos os botões da linha, duplicar e excluir).
- `QasNestedFields`: adicionado propriedade `useAdd` para controla quando vai ter seção de "adicionar" novas rows (linhas).

## 3.0.0 - 22-08-22
## Versão estável lançada

## [3.0.0-beta.20] - 16-08-2022
### Adicionado
- `QasUploader`: adicionada a prop: `useObjectModel` para poder utilizar o model padrão como um objeto.

### Modificado
- `QasSearchBox`: modificado watch `mx_search` para realizar o focus do input de pesquisa após retornar dados do lazy loading.
- [`QasDateTimeInput`, `QasField`, `QasInput`, `QasPasswordInput`]: modificado componente para não herdar todos os atributos. Para isso foi adicionado `inheritAttrs` com o valor `false`.
- `QasMap`: modificado height da classe `.qas-map__draw` para conter a propriedade `!important`.
- `QasFormGenerator`: modificado a computada `fieldsetClasses` para adicionar a classe gutter somente no eixo y.

### Corrigido
- `QasFormGenerator`: corrigido problema ao adicionar validação no `field` do `normalizedFields`  quando o valor é `undefined`.
- `QasDateTimeInput`: corrigido problema do `valueLength` quando o valor é `undefined` adicionando `optional chaining`.

### Removido
- `QasPasswordInput`: removido propriedade `color` com o valor `negative` por padrão.

## [3.0.0-beta.19] - 08-08-2022
## BREAKING CHANGES
- `QasFormView`: alterado parâmetro `params` para `externalPayload`, agora ele sobrescreve todo o payload do `fetchSingle` e não somente o `params`.
- `QasFormView`: alterado nome do método de `fetch` para `fetchSingle` para manter padrão dos outros componentes de `view`.

### Adicionado
- `filters`: adicionado novos tipos money e decimal na função `humanize`.
- `QasDialog`: adicionado nova propriedade `useValidationAllAtOnce` para validar todos os campos de uma única vez.
- `handleProcess`: Adicionado novo `helper` que lida com `process.env`.

### Modificado
- `QasTabsGenerator`: alterado `name` do `QTab` para `tab.value` ao invés de `key`.
- `QasTabsGenerator`: adicionado novo type `Array` na propriedade `tabs`.
- `QasLayout`: componente agora começa com menu lateral aberto a partir de telas maiores que "tablet", sem a necessidade de fazer este controla manual.
- `QasListView`: alterado execução do método `fetchList` para `mx_fetchHandler` dentro do `refresh`.
- `api.js`: alterado boot do `api` para validar quando intercepta o `axios` e fazer o `camelize`.

### Corrigido
- `QasNestedFields`: corrigido propriedade `useDestroyAlways`, não estava sendo removido a ultima linha (row) do nested, alterado onde o método `setDefaultNestedValue` é chamado.
- `QasNestedFields`: corrigido propriedade `useRemoveOnDestroy`, não estava funcionando quando valor era `false` por uma validação errada no método `destroy`.
- `QasField`: alterado atributo `gmt` para `useIso` para o componente `QasDateTimeInput`.
- [`QasDateTimeInput`, `QasInput`, `QasField`, `QasPasswordInput`]: removido div "pai" dos elementos deixando os próprios elementos sendo o "pai", resolvendo alguns problemas referentes ao `$attrs`.

### Removido
- `QasNestedFields`: removido `leaveActiveClass: 'animated slideOutUp'` animação na "volta" não funcionava e apenas dava um delay desnecessário e parecia que o componente estava lento.

## [3.0.0-beta.18] - 02-08-2022
### Adicionado
- `QasFormGenerator`: adicionado propriedade `fieldset` para agrupar elementos por rótulo (label).
- `QasFormGenerator`: adicionado propriedade `fieldsetGutter` para dar espaçamentos entre rótulos (label) com default `lg`.
- `QasUploader`: Adicionado o atributo `accept` para o `<input>` interno do componente.
- `QasSelect`: Adicionado o tipo `Boolean` para a propriedade `modelValue`.

### corrigido
- `generatorMixin`: alterado `validator` da propriedade `gutter` para quando ele é do tipo `Boolean`.
- `QasFormView`: Removido a utilização do `$nextTick` na atualização da model. Assim, corrigindo o problema de o evento `fetchSuccess` estar com a model desatualizada.
- `DocLayout`: Corrigido warning da propriedade `view` do componente `q-layout`.

### Removido
- `QasSelect`: Removido o atributo `bottomSlots` do componente, pois não é mais necessário.

## [3.0.0-beta.17] - 18-07-2022
### Adicionado
- [`QasSelect`, `QasSearchBox`]: adicionada props: `useLazyLoading`, `name`, `entity` e `useLazyLoadingProps` para adicionar funcionalidades do lazy loading semelhante a versão 2 do asteroid: https://github.com/bildvitta/asteroid/pull/573/files
- [`QasSelect`, `QasSearchBox`]: adicionada eventos: `@fetch-options-error`, `@fetch-options-success` e `@update:fetching` referentes ao lazy loading.
- `QasSearchBox`: adicionado slot loading referente ao lazy loading.
- `QasField`: repassando `entity`, `name` e `useLazyLoading` ao componente `QasSelect`.
- Adicionado novo helper `getNormalizedOptions`.
- Adicionado novo mixin `searchFilterMixin` para ser usado tanto no `QasSelect` quanto no `QasSearchBox`
- `QasSearchBox`: Adicionado propriedade `emptyResultText` com default `Não há resultados disponíveis.`.

### Corrigido
- `QasInput`: resolvido problema com mascara quando o model vinha `null`.
- `QasSelectList`: adicionado propriedade `deep: true` no watch do `modelValue` para resolver problemas de model.

## [3.0.0-beta.16] - 22-06-2022
## BREAKING CHANGES
- `QasListView`: antes o que era passado por parâmetro entrava como `filters`, agora é o payload todo, então se precisar passar um filters como anteriormente usar `fetchList({ filters: {...} })`.
- `QasSingleView`: antes o que era passado por parâmetro entrava como `params`, agora é o payload todo, então se precisar passar um params como anteriormente usar `fetchSingle({ params: {...} })`.

### Adicionado
- `QasListView`: adicionada prop `useResultsAreaOnly` para definir se o container de results quando o valor está vazio, irá sempre ser exibido.
- [`QasListView`, `QasFormView`, `QasSingleView`]: adicionada prop `beforeFetch`, onde dará a liberdade para controlar quando irá acontecer a primeira execução do `fetchList`.
- `viewMixin`: adicionado o método `mx_fetchHandler`, onde será o handler responsável por interceptar as funções de fetch das views.
- `viewMixin`: adicionado novo data `mx_cancelBeforeFetch` e novo callback `done` dentro do `beforeFetch`.

### Modificado
- [`QasListView`, `QasSingleView`]: modificado o nome do parâmetro, possibilitando que o payload passado externamente sobreponha qualquer valor caso precise.

## [3.0.0-beta.15] - 09-06-2022
### Adicionado
- `QasNestedFields`: adicionada prop `identifierItemKey` para definir a chave identificadora do objeto/linha.

### Modificado
- `QasNestedFields`: modificado o comportamento do método `destroy`, adicionando uma validação para caso não exista uma chave identificadora, ele remova a o objeto mesmo que `useRemoveOnDestroy` seja `false`.

- `QasNestedFields`: modificado o comportamento do método `add` para ação duplicar linha, removendo a chave identificadora na hora de duplicar a linha.

## [3.0.0-beta.14] - 07-06-2022
### Adicionado
- `QasFormView`: adicionado propriedade `beforeSubmit` para controlar o submit, ex: mostrar um modal de confirmação antes de fazer o submit do formulário.

### Modificado
- `QasFormView`: adicionado um handler `submitHandler` para o controle do submit junto a propriedade `beforeSubmit`.

### Corrigido
- `QasNestedFields`: adicionado método `setDefaultNestedValue` no watch do `modelValue` ao invés do `fields` para resolver problema quando modelValue é alterado para array vazio **após** o created. Ex: quando a API retorna array vazio, ele removia os campos default setados pelo `rowObject`.

## [3.0.0-beta.13] - 02-06-2022
### Adicionado
- Adicionado helper `camelizeFieldsName` para formatar os `names` dos fields em camelCase.

### Modificado
- `QasNestedFields`: removido logica do camelize na computada `children` já que agora os fields já vem formatados.
- `viewMixin`: `mx_setFields` usando helper `camelizeFieldsName` de forma recursiva para formatar os `names` dos `fields`.
- `QasFilters`: Adicionados props `color="grey-9"` e `flat` para os <qas-btn /> do input de busca para deixar o estilo igual quando era com <q-btn />.

## [3.0.0-beta.12] - 02-06-2022
### Modificado
- `QasPageHeader`: utilizando mixin `createMetaMixin` do quasar para utilizar `title`.
- `Logger`: alterado método `console.group` para `console.groupCollapsed` para que os grupos por padrão se mantenham fechados e abram após clicar.

### Corrigido
- `QasInput`: adicionado validação no método `toggleMask` para resolver problema de quando o campo já vinha com valor preenchido (depois do created) e a mascara fosse `document` ou `phone`.
- `QasInput`: adicionado novo evento `@paste` com o método `onPaste` para resolver problemas de formatação da mascara quando acontece `ctrl v`.

## [3.0.0-beta.11] - 01-06-2022
### Adicionado
- Adicionado novo plugin `Logger` que funcionam quando a variável de ambiente `DEBUGGING` é setada.
- [`QasDelete`, `QasFilters`, `QasFormView`, `QasListView`, `QasNestedFields`, `QasSingleView`, `QasSingleView`, `QasGridGenerator`, `QasTableGenerator`, `QasUploader`]: Adicionado loggers.

### Modificado
- [`QasFilters`, `QasSearchBox`]: Alterado componente `q-input` para o `qas-input`.

### Corrigido
- `QasDateTimeInput`: corrigido watch que estava `value` ao invés de `modelValue`, quando o valor não era setado no created, não funcionava.

## [3.0.0-beta.10] - 20-05-2022
## BREAKING CHANGES
- `QasBtn`: propriedade `hideLabelOnSmallScreen` alterada para `useLabelOnSmallScreen`, com valor default `true`.
- `QasAppBar`: propriedade `isAuth` removida, agora é validado caso exista valor na propriedade `user`.
- `QasActionsMenu`: evento `delete-success` removido, a propriedade `deleteProps` deve ser a única responsável por passar propriedades e eventos para o `QasDelete`.
- `QasCard`: propriedade `bgImagePosition` alterada para `imagePosition`.
- `QasCard`: propriedade `formMode` removida em favor das novas propriedades: `outlined` e `unelevated` para fazer o controle dos estilos.
- `QasDateTimeInput`: propriedade `gmt` alterada para `useIso`.
- `QasDateTimeInput`: propriedade `dateOnly` alterada para `useDateOnly`.
- `QasDateTimeInput`: propriedade `timeOnly` alterada para `useTimeOnly`.
- `QasDialog`: propriedade `useCloseIcon` alterada para `useCloseButton`.
- `QasFilters`: propriedade `forceRefetch` alterada para `useForceRefetch`.
- [`QasFormView`, `QasListView`, `QasSingleView`]: propriedade `dialog` do mixin `viewMixin` alterada para `useBoundary` com default `true`, uma vez que dialog é muito especifico para quando for usado dentro de um dialog, porém o mesmo comportamento pode se repetir fora de um dialog.
- `QasFormView`: propriedade `showDialogOnUnsavedChanges` alterada para `useDialogOnUnsavedChanges`.
- `QasGridGenerator`: propriedade `hideEmptyResult` alterada para `useEmptyResult`.
- `QasInput`: propriedade `removeErrorOnType` alterada para `useRemoveErrorOnType`.
- `QasListItems`: propriedades `redirectKey`, e `to` removidas em favor de utilizar o evento `click-item` para lidar quando clicado nos items ou dentro do button dos items.
- `QasListItems`: propriedade `useRedirectOnIcon` alterada para `useClickableItem` com default `false` para identificar que o item inteiro é clicável ao invés de somente o button.
- `QasListItems`: slot `item-section-left` alterado para `item-section`.
- `QasListView`: propriedade `disableRefresh` alterada para `useRefresh` com default `true`.
- `QasNumericInput`: propriedade `allowNegative` alterada para `useNegative`.
- `QasNumericInput`: propriedade `allowPositive` alterada para `usePositive`.
- `QasNumericInput`: propriedade `autonumericProps` alterada para `autonumericOptions`.
- `QasPasswordInput`: propriedade `hideStrengthChecker` alterada para `useStrengthChecker` com default `true`.
- `QasSelect`: propriedade `searchable` alterada para `useSearch`.
- `QasSelectList`: propriedades `to`, `redirectKey` e `paramKey` removidas em favor de usar o evento `click-label` para lidar quando clicar no label.
- `QasNestedFields`: propriedade `btnDestroyProps` alterada para `buttonDestroyProps`.
- `QasNestedFields`: propriedade `btnDuplicateProps` alterada para `buttonDuplicateProps`.

### Adicionado
- `QasCard`: propriedade `outlined` com default `false`.
- `QasCard`: propriedade `unelevated` com default `false`.
- `QasListItems`: propriedade `useClickableItem`.
- `QasListItems`: evento `click-item` adicionado para lidar quando clicado nos items ou dentro do button dos items.
- `QasSelectList`: propriedade `useClickableLabel` com default `false` para deixar label com `cursor-pointer` e habilitar evento `click-label`.
- `QasSelectList`: evento `click-label` para lidar quando clicar no label (evento só acontece caso a propriedade `useClickableLabel` for `true`).

### Modificado
- [`QasAppBar`, `QasFilters`, '`QasSignatureUploader`]: substituído `q-btn` por `qas-btn`.

## [3.0.0-beta.9] - 13-05-2022
## BREAKING CHANGES
- `QasFormView`: propriedade `readOnly` alterada para `useActions`.
- `QasFormView`: propriedade `cancelButton` alterada para `cancelButtonLabel`.
- `QasFormView`: propriedade `submitButton` alterada para `submitButtonLabel`.

### Adicionado
- `QasFormView`: propriedade `useCancelButton` adicionada para controlar se vai ter ou não botão de "cancelar".
- `QasFormView`: propriedade `useSubmitButton` adicionada para controlar se vai ter ou não botão de submit.

### Corrigindo
- `QasFormView`: corrigido bug de validações quando o usuário deixa a pagina.

## [3.0.0-beta.8] - 12-05-2022
### Adicionado
- Adicionado nova pagina de erro `Unauthorized.vue` para quando api retorna status code `401` no fetch.
- Adicionado `name` para as paginas de erros.

### Modificado
- `QasSearchBox`: modificado valor default da prop `fuseOptions` para `{ threshold: 0.1, ignoreLocation: true }`. 
- `QasSelect`: modificado valor default da prop `fuseOptions` para `{ threshold: 0.1, ignoreLocation: true, keys: ['label', 'value'] }`.

### Corrigido
- Adicionado redirect para status code `> 500` (antes já existia a pagina para isto, mas não era redirecionado).
- `QasTableGenerator`: corrigido bug `Uncaught TypeError: this.scrollOnGrab.destroyEvents is not a function`.

## [3.0.0-beta.7] - 10-05-2022
### Adicionado
- `QasNumericInput`: adicionado novo evento "update-model" para disparar toda vez que acontece um novo input.

### Modificado
- `QasListView`: adicionado propriedade `deep` para o watch do `resultsModel`.
- `QasPasswordInput`: modificado valor `bottom-slots` para `false`.
- `QasFilters`: adicionado `max-with="240px"` e `full-width` dentro do `QMenu`.

### Corrigido
- `QasListView`: corrigido bug de filtros ao fazer o `fetchList`.
- `QasTransfer`: corrigido bug quando v-model já existe valor antes de existir `options`.
- `QasNumericInput`: corrigido bug no two-way data binding.

## [3.0.0-beta.6] - 05-06-2022
### Modificado
- Propriedade `hideLabelOnSmallScreen` só funciona quando o "rotulo" do botão é passado via prop `label` e não mais por slot default também.

### Corrigido
- Corrigido `QasBtn`, quando usa a prop `hideLabelOnSmallScreen` e utiliza o slot default, quando a tela está em tamanho pequeno, o botão remove o slot default, o problema disto é que se usar com um `QMenu` dentro do botão, o `QMenu` não é chamado pois não existe mais slot default.

[3.0.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.5...v3.0.0-beta.6?expand=1
[3.0.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.6...v3.0.0-beta.7?expand=1
[3.0.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.7...v3.0.0-beta.8?expand=1
[3.0.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.8...v3.0.0-beta.9?expand=1
[3.0.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.9...v3.0.0-beta.10?expand=1
[3.0.0-beta.11]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.10...v3.0.0-beta.11?expand=1
[3.0.0-beta.12]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.11...v3.0.0-beta.12?expand=1
[3.0.0-beta.13]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.12...v3.0.0-beta.13?expand=1
[3.0.0-beta.14]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.13...v3.0.0-beta.14?expand=1
[3.0.0-beta.15]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.14...v3.0.0-beta.15?expand=1
[3.0.0-beta.16]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.15...v3.0.0-beta.16?expand=1
[3.0.0-beta.17]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.16...v3.0.0-beta.17?expand=1
[3.0.0-beta.18]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.17...v3.0.0-beta.18?expand=1
[3.0.0-beta.19]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.18...v3.0.0-beta.19?expand=1
[3.0.0-beta.20]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.19...v3.0.0-beta.20?expand=1
[3.0.0]: https://github.com/bildvitta/asteroid/compare/v3.0.0-beta.20...v3.0.0?expand=1
[3.1.0]: https://github.com/bildvitta/asteroid/compare/3.0.0...3.1.0?expand=1
[3.1.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.0.0...3.1.0-beta.0?expand=1
[3.1.0-beta.1]: https://github.com/bildvitta/asteroid/compare/3.1.0-beta.0...3.1.0-beta.1?expand=1
[3.1.0-beta.2]: https://github.com/bildvitta/asteroid/compare/3.1.0-beta.1...3.1.0-beta.2?expand=1
[3.1.0-beta.3]: https://github.com/bildvitta/asteroid/compare/3.1.0-beta.2...3.1.0-beta.3?expand=1
[3.1.0-beta.4]: https://github.com/bildvitta/asteroid/compare/3.1.0-beta.3...3.1.0-beta.4?expand=1
[3.1.1-beta.0]: https://github.com/bildvitta/asteroid/compare/3.1.0...3.1.1-beta.0?expand=1
[3.2.0-beta.0]: https://github.com/bildvitta/asteroid/compare/3.1.1-beta.0...3.2.0-beta.0?expand=1
[3.2.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.2.0-beta.0...v3.2.0-beta.1?expand=1
[3.2.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.2.0-beta.1...v3.2.0-beta.2?expand=1
[3.2.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.2.0-beta.2...v3.2.0-beta.3?expand=1
[3.2.0]: https://github.com/bildvitta/asteroid/compare/v3.1.0...v3.2.0?expand=1
[3.3.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.2.0...v3.3.0-beta.0?expand=1
[3.3.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.3.0-beta.0...v3.3.0-beta.1?expand=1
[3.3.0]: https://github.com/bildvitta/asteroid/compare/v3.2.0...v3.3.0?expand=1
[3.3.1-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.3.0...v3.3.1-beta.0?expand=1
[3.4.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.3.1-beta.0...v3.4.0-beta.0?expand=1
[3.4.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.4.0-beta.0...v3.4.0-beta.1?expand=1
[3.4.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.4.0-beta.1...v3.4.0-beta.2?expand=1
[3.4.0]: https://github.com/bildvitta/asteroid/compare/v3.3.0...v3.4.0?expand=1
[3.5.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.4.0...v3.5.0-beta.0?expand=1
[3.5.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.0...v3.5.0-beta.1?expand=1
[3.5.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.1...v3.5.0-beta.2?expand=1
[3.5.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.2...v3.5.0-beta.3?expand=1
[3.5.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.3...v3.5.0-beta.4?expand=1
[3.5.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.4...v3.5.0-beta.5?expand=1
[3.5.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.5...v3.5.0-beta.6?expand=1
[3.5.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.6...v3.5.0-beta.7?expand=1
[3.5.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.7...v3.5.0-beta.8?expand=1
[3.5.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.8...v3.5.0-beta.9?expand=1
[3.5.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.9...v3.5.0-beta.10?expand=1
[3.5.0-beta.11]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.10...v3.5.0-beta.11?expand=1
[3.5.0-beta.12]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.11...v3.5.0-beta.12?expand=1
[3.5.0-beta.13]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.12...v3.5.0-beta.13?expand=1
[3.5.0-beta.14]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.13...v3.5.0-beta.14?expand=1
[3.5.0-beta.15]: https://github.com/bildvitta/asteroid/compare/v3.5.0-beta.14...v3.5.0-beta.15?expand=1
[3.5.0]: https://github.com/bildvitta/asteroid/compare/v3.4.0...v3.5.0?expand=1
[3.6.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.5.0...v3.6.0-beta.0?expand=1
[3.6.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.6.0-beta.0...v3.6.0-beta.1?expand=1
[3.6.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.6.0-beta.1...v3.6.0-beta.2?expand=1
[3.6.0]: https://github.com/bildvitta/asteroid/compare/v3.5.0...v3.6.0?expand=1
[3.7.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.6.0...v3.7.0-beta.0?expand=1
[3.7.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.7.0-beta.0...v3.7.0-beta.1?expand=1
[3.7.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.7.0-beta.1...v3.7.0-beta.2?expand=1
[3.7.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.7.0-beta.2...v3.7.0-beta.3?expand=1
[3.7.0]: https://github.com/bildvitta/asteroid/compare/v3.6.0...v3.7.0?expand=1
[3.8.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.7.0...v3.8.0-beta.0?expand=1
[3.8.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.8.0-beta.0...v3.8.0-beta.1?expand=1
[3.8.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.8.0-beta.1...v3.8.0-beta.2?expand=1
[3.8.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.8.0-beta.2...v3.8.0-beta.3?expand=1
[3.8.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.8.0-beta.3...v3.8.0-beta.4?expand=1
[3.8.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.8.0-beta.4...v3.8.0-beta.5?expand=1
[3.8.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.8.0-beta.5...v3.8.0-beta.6?expand=1
[3.8.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.8.0-beta.6...v3.8.0-beta.7?expand=1
[3.8.0]: https://github.com/bildvitta/asteroid/compare/v3.7.0...v3.8.0?expand=1
[3.9.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.8.0...v3.9.0-beta.0?expand=1
[3.9.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.9.0-beta.0...v3.9.0-beta.1?expand=1
[3.9.0]: https://github.com/bildvitta/asteroid/compare/v3.8.0...v3.9.0?expand=1
[3.10.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.9.0...v3.10.0-beta.0?expand=1
[3.10.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.0...v3.10.0-beta.1?expand=1
[3.10.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.1...v3.10.0-beta.2?expand=1
[3.10.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.2...v3.10.0-beta.3?expand=1
[3.10.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.3...v3.10.0-beta.4?expand=1
[3.10.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.11.0-alpha.2...v3.10.0-beta.5?expand=1
[3.10.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.5...v3.10.0-beta.6?expand=1
[3.10.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.6...v3.10.0-beta.7?expand=1
[3.10.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.7...v3.10.0-beta.8?expand=1
[3.10.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.8...v3.10.0-beta.9?expand=1
[3.10.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.10.0-beta.9...v3.10.0-beta.10?expand=1
[3.10.0]: https://github.com/bildvitta/asteroid/compare/v3.11.0-alpha.2...v3.10.0?expand=1
[3.11.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.10.0...v3.11.0-beta.0?expand=1
[3.11.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.0...v3.11.0-beta.1?expand=1
[3.11.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.1...v3.11.0-beta.2?expand=1
[3.11.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.2...v3.11.0-beta.3?expand=1
[3.11.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.3...v3.11.0-beta.4?expand=1
[3.11.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.4...v3.11.0-beta.5?expand=1
[3.11.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.5...v3.11.0-beta.6?expand=1
[3.11.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.6...v3.11.0-beta.7?expand=1
[3.11.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.7...v3.11.0-beta.8?expand=1
[3.11.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.8...v3.11.0-beta.9?expand=1
[3.11.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.9...v3.11.0-beta.10?expand=1
[3.11.0-beta.11]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.10...v3.11.0-beta.11?expand=1
[3.11.0-beta.12]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.11...v3.11.0-beta.12?expand=1
[3.11.0-beta.13]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.12...v3.11.0-beta.13?expand=1
[3.11.0-beta.14]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.13...v3.11.0-beta.14?expand=1
[3.11.0-beta.15]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.14...v3.11.0-beta.15?expand=1
[3.11.0-beta.17]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.16...v3.11.0-beta.17?expand=1
[3.11.0-beta.18]: https://github.com/bildvitta/asteroid/compare/v3.11.0-beta.17...v3.11.0-beta.18?expand=1
[3.11.0]: https://github.com/bildvitta/asteroid/compare/v3.10.0...v3.11.0?expand=1
[3.12.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.11.0...v3.12.0-beta.0?expand=1
[3.12.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.0...v3.12.0-beta.1?expand=1
[3.12.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.1...v3.12.0-beta.2?expand=1
[3.12.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.2...v3.12.0-beta.3?expand=1
[3.12.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.3...v3.12.0-beta.4?expand=1
[3.12.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.4...v3.12.0-beta.5?expand=1
[3.12.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.5...v3.12.0-beta.6?expand=1
[3.12.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.6...v3.12.0-beta.7?expand=1
[3.12.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.7...v3.12.0-beta.8?expand=1
[3.12.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.8...v3.12.0-beta.9?expand=1
[3.12.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.12.0-beta.9...v3.12.0-beta.10?expand=1
[3.12.0]: https://github.com/bildvitta/asteroid/compare/v3.11.0...v3.12.0?expand=1
[3.13.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.12.0...v3.13.0-beta.0?expand=1
[3.13.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.0...v3.13.0-beta.1?expand=1
[3.13.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.1...v3.13.0-beta.2?expand=1
[3.13.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.2...v3.13.0-beta.3?expand=1
[3.13.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.3...v3.13.0-beta.4?expand=1
[3.13.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.4...v3.13.0-beta.5?expand=1
[3.13.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.5...v3.13.0-beta.6?expand=1
[3.13.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.6...v3.13.0-beta.7?expand=1
[3.13.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.7...v3.13.0-beta.8?expand=1
[3.13.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.8...v3.13.0-beta.9?expand=1
[3.13.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.9...v3.13.0-beta.10?expand=1
[3.13.0-beta.11]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.10...v3.13.0-beta.11?expand=1
[3.13.0-beta.12]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.11...v3.13.0-beta.12?expand=1
[3.13.0-beta.13]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.12...v3.13.0-beta.13?expand=1
[3.13.0-beta.14]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.13...v3.13.0-beta.14?expand=1
[3.13.0-beta.15]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.14...v3.13.0-beta.15?expand=1
[3.13.0-beta.16]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.15...v3.13.0-beta.16?expand=1
[3.13.0-beta.17]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.16...v3.13.0-beta.17?expand=1
[3.13.0-beta.18]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.17...v3.13.0-beta.18?expand=1
[3.13.0-beta.19]: https://github.com/bildvitta/asteroid/compare/v3.13.0-beta.18...v3.13.0-beta.19?expand=1
[3.13.0]: https://github.com/bildvitta/asteroid/compare/v3.12.0...v3.13.0?expand=1
[3.13.1]: https://github.com/bildvitta/asteroid/compare/v3.13.0...v3.13.1?expand=1
[3.14.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.13.0...v3.14.0-beta.0?expand=1
[3.14.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.13.1...v3.14.0-beta.1?expand=1
[3.14.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.1...v3.14.0-beta.2?expand=1
[3.14.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.2...v3.14.0-beta.3?expand=1
[3.14.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.3...v3.14.0-beta.4?expand=1
[3.14.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.4...v3.14.0-beta.5?expand=1
[3.14.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.5...v3.14.0-beta.6?expand=1
[3.14.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.6...v3.14.0-beta.7?expand=1
[3.14.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.7...v3.14.0-beta.8?expand=1
[3.14.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.8...v3.14.0-beta.9?expand=1
[3.14.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.14.0-beta.9...v3.14.0-beta.10?expand=1
[3.14.0]: https://github.com/bildvitta/asteroid/compare/v3.13.1...v3.14.0?expand=1
[3.15.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.14.0...v3.15.0-beta.0?expand=1
[3.15.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.0...v3.15.0-beta.1?expand=1
[3.15.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.1...v3.15.0-beta.2?expand=1
[3.15.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.2...v3.15.0-beta.3?expand=1
[3.15.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.3...v3.15.0-beta.4?expand=1
[3.15.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.4...v3.15.0-beta.5?expand=1
[3.15.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.5...v3.15.0-beta.6?expand=1
[3.15.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.6...v3.15.0-beta.7?expand=1
[3.15.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.7...v3.15.0-beta.8?expand=1
[3.15.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.8...v3.15.0-beta.9?expand=1
[3.15.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.9...v3.15.0-beta.10?expand=1
[3.15.0-beta.11]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.10...v3.15.0-beta.11?expand=1
[3.15.0-beta.12]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.11...v3.15.0-beta.12?expand=1
[3.15.0-beta.13]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.12...v3.15.0-beta.13?expand=1
[3.15.0-beta.14]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.13...v3.15.0-beta.14?expand=1
[3.15.0-beta.15]: https://github.com/bildvitta/asteroid/compare/v3.15.0-beta.14...v3.15.0-beta.15?expand=1
[3.15.0]: https://github.com/bildvitta/asteroid/compare/v3.14.0...v3.15.0?expand=1
[3.16.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.15.0...v3.16.0-beta.0?expand=1
[3.16.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.0...v3.16.0-beta.1?expand=1
[3.16.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.1...v3.16.0-beta.2?expand=1
[3.16.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.2...v3.16.0-beta.3?expand=1
[3.16.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.3...v3.16.0-beta.4?expand=1
[3.16.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.4...v3.16.0-beta.5?expand=1
[3.16.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.5...v3.16.0-beta.6?expand=1
[3.16.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.6...v3.16.0-beta.7?expand=1
[3.16.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.7...v3.16.0-beta.8?expand=1
[3.16.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.8...v3.16.0-beta.9?expand=1
[3.16.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.16.0-beta.9...v3.16.0-beta.10?expand=1
[3.16.0]: https://github.com/bildvitta/asteroid/compare/v3.15.0...v3.16.0?expand=1
[3.16.1-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.16.0...v3.16.1-beta.0?expand=1
[3.17.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.16.1...v3.17.0-beta.0?expand=1
[3.17.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.0...v3.17.0-beta.1?expand=1
[3.17.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.1...v3.17.0-beta.2?expand=1
[3.17.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.2...v3.17.0-beta.3?expand=1
[3.17.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.3...v3.17.0-beta.4?expand=1
[3.17.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.4...v3.17.0-beta.5?expand=1
[3.17.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.5...v3.17.0-beta.6?expand=1
[3.17.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.6...v3.17.0-beta.7?expand=1
[3.17.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.7...v3.17.0-beta.8?expand=1
[3.17.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.8...v3.17.0-beta.9?expand=1
[3.17.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.9...v3.17.0-beta.10?expand=1
[3.17.0-beta.11]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.10...v3.17.0-beta.11?expand=1
[3.17.0-beta.12]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.11...v3.17.0-beta.12?expand=1
[3.17.0-beta.13]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.12...v3.17.0-beta.13?expand=1
[3.17.0-beta.14]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.13...v3.17.0-beta.14?expand=1
[3.16.1]: https://github.com/bildvitta/asteroid/compare/v3.16.0...v3.16.1?expand=1
[3.16.2]: https://github.com/bildvitta/asteroid/compare/v3.16.1...v3.16.2?expand=1
[3.17.0-beta.15]: https://github.com/bildvitta/asteroid/compare/v3.16.2...v3.17.0-beta.15?expand=1
[3.17.0-beta.16]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.15...v3.17.0-beta.16?expand=1
[3.17.0-beta.17]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.16...v3.17.0-beta.17?expand=1
[3.17.0-beta.18]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.17...v3.17.0-beta.18?expand=1
[3.17.0-beta.19]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.18...v3.17.0-beta.19?expand=1
[3.17.0-beta.20]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.19...v3.17.0-beta.20?expand=1
[3.17.0-beta.21]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.20...v3.17.0-beta.21?expand=1
[3.17.0-beta.22]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.21...v3.17.0-beta.22?expand=1
[3.17.0-beta.23]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.22...v3.17.0-beta.23?expand=1
[3.17.0-beta.24]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.23...v3.17.0-beta.24?expand=1
[3.17.0-beta.25]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.24...v3.17.0-beta.25?expand=1
[3.17.0-beta.26]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.25...v3.17.0-beta.26?expand=1
[3.17.0-beta.27]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.27-alpha.0...v3.17.0-beta.27?expand=1
[3.17.0-beta.28]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.27...v3.17.0-beta.28?expand=1
[3.16.3]: https://github.com/bildvitta/asteroid/compare/v3.16.2...v3.16.3?expand=1
[3.17.0-beta.29]: https://github.com/bildvitta/asteroid/compare/v3.16.3...v3.17.0-beta.29?expand=1
[3.16.3]: https://github.com/bildvitta/asteroid/compare/v3.16.2...v3.16.3?expand=1
[3.16.4]: https://github.com/bildvitta/asteroid/compare/v3.16.3...v3.16.4?expand=1
[3.17.0-beta.30]: https://github.com/bildvitta/asteroid/compare/v3.16.4...v3.17.0-beta.30?expand=1
[3.17.0-beta.31]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.30...v3.17.0-beta.31?expand=1
[3.17.0-beta.32]: https://github.com/bildvitta/asteroid/compare/v3.17.0-beta.31...v3.17.0-beta.32?expand=1
[3.17.0]: https://github.com/bildvitta/asteroid/compare/v3.16.4...v3.17.0?expand=1
[3.18.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.17.0...v3.18.0-beta.0?expand=1
[3.18.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.18.0-beta.0...v3.18.0-beta.1?expand=1
[3.18.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.18.0-beta.1...v3.18.0-beta.2?expand=1
[3.18.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.18.0-beta.2...v3.18.0-beta.3?expand=1
[3.18.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.18.0-beta.3...v3.18.0-beta.4?expand=1
[3.18.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.18.0-beta.4...v3.18.0-beta.5?expand=1
[3.18.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.19.0-alpha.18...v3.18.0-beta.6?expand=1
[3.18.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.19.0-alpha.20...v3.18.0-beta.7?expand=1
[3.18.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.19.0-alpha.22...v3.18.0-beta.8?expand=1
[3.18.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.18.0-beta.8...v3.18.0-beta.9?expand=1
[3.18.0]: https://github.com/bildvitta/asteroid/compare/v3.19.0-alpha.25...v3.18.0?expand=1
[3.19.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.19.0-alpha.27...v3.19.0-beta.0?expand=1
[3.18.1]: https://github.com/bildvitta/asteroid/compare/v3.19.0-alpha.27...v3.18.1?expand=1
[3.19.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.19.0-alpha.27...v3.19.0-beta.0?expand=1
[3.19.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.18.1...v3.19.0-beta.1?expand=1
[3.18.2]: https://github.com/bildvitta/asteroid/compare/v3.18.1...v3.18.2?expand=1
[3.19.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.18.2...v3.19.0-beta.2?expand=1
[3.19.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.3-alpha.3...v3.19.0-beta.3?expand=1
[3.19.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.3...v3.19.0-beta.4?expand=1
[3.19.0-beta.5]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.5-alpha.0...v3.19.0-beta.5?expand=1
[3.19.0-beta.6]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.6-alpha.7...v3.19.0-beta.6?expand=1
[3.19.0-beta.7]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.6...v3.19.0-beta.7?expand=1
[3.19.0-beta.8]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.8-alpha.11...v3.19.0-beta.8?expand=1
[3.19.0-beta.9]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.8...v3.19.0-beta.9?expand=1
[3.19.0-beta.10]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.8-alpha.14...v3.19.0-beta.10?expand=1
[3.19.0-beta.11]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.11-alpha.0...v3.19.0-beta.11?expand=1
[3.19.0-beta.12]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.8-alpha.19...v3.19.0-beta.12?expand=1
[3.19.0-beta.13]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.12...v3.19.0-beta.13?expand=1
[3.19.0-beta.14]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.13...v3.19.0-beta.14?expand=1
[3.19.0-beta.15]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.14...v3.19.0-beta.15?expand=1
[3.19.0-beta.16]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.15...v3.19.0-beta.16?expand=1
[3.19.0-beta.17]: https://github.com/bildvitta/asteroid/compare/v3.19.0-beta.16...v3.19.0-beta.17?expand=1
[3.19.0]: https://github.com/bildvitta/asteroid/compare/v3.18.2...v3.19.0?expand=1
[3.20.0-beta.0]: https://github.com/bildvitta/asteroid/compare/v3.19.0...v3.20.0-beta.0?expand=1
[3.20.0-beta.1]: https://github.com/bildvitta/asteroid/compare/v3.20.0-beta.0...v3.20.0-beta.1?expand=1
[3.20.0-beta.2]: https://github.com/bildvitta/asteroid/compare/v3.20.0-beta.1...v3.20.0-beta.2?expand=1
[3.20.0-beta.3]: https://github.com/bildvitta/asteroid/compare/v3.20.0-beta.2...v3.20.0-beta.3?expand=1
[3.20.0-beta.4]: https://github.com/bildvitta/asteroid/compare/v3.20.0-beta.3...v3.20.0-beta.4?expand=1