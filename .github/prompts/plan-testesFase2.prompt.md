# Plano: Testes Unitários — Fase 2 (Componentes Médios)

**TL;DR** — Criar 27 arquivos de teste para os componentes médios da Fase 2 usando a infraestrutura já existente (`mountComponent` de `@test-utils`, mocks globais de `vue-router`, `store-adapter` e `copyToClipboard` já configurados no `setup.js`). Todos os testes seguem o padrão blackbox (comportamento, não implementação), sem snapshots, com descrições em pt-BR. A única exceção de infraestrutura adicional será o mock de `useDialogPluginComponent` do Quasar para o `QasDialog`.

---

**Pré-requisitos confirmados**
- `mountComponent()` já existe em `ui/src/test-utils/mount-helper.js` com `defaultProvide` e `defaultStubs` aplicados automaticamente
- `setup.js` já registra mocks globais: `useRouter`, `useRoute`, `onBeforeRouteLeave`, `getAction`, `getState`, `copyToClipboard`, `Notify`, `Screen`, `LocalStorage`
- `vitest.config.js` registra `q-btn`, `q-input`, `q-expansion-item`, `q-stepper`, `q-carousel` como componentes reais (não custom elements)
- `createRouterStub()`, `createRouteStub()`, `createStoreActionStub()` disponíveis em `factories.js`

---

**IMPORTANTE**:
- Cria testes separados para cada prop, comportamento significativo, evento, slot, e cenário de interação relevante para cada componente.
- Deixe os testes o mais descritivos possível, usando `describe` e `it` para organizar por prop, comportamento ou cenário.

## Passos

### 1. Ajuste pontual na infraestrutura (antes de escrever os testes)

Adicionar em `ui/src/test-utils/setup.js` um mock de `useDialogPluginComponent` do Quasar para que `QasDialog` não quebre no `onMounted`:

```js
vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useDialogPluginComponent: vi.fn(() => ({
      dialogRef: ref(null),
      onDialogHide: vi.fn(),
      onDialogOK: vi.fn(),
      onDialogCancel: vi.fn()
    }))
  }
})
```

Verificar se isso conflita com o registro atual do Quasar como plugin global e ajustar se necessário.

---

### 2. `QasAlert` — `ui/src/components/alert/QasAlert.test.js`

Expandir o teste existente:
- Renderização com `modelValue: true` / `false` (v-model via `defineModel`)
- Prop `status`: variantes `Info`, `Error`, `Success` — classe e ícone corretos
- Prop `text`: renderização do texto
- Tokens de link/texto via `useRegex`, verificando `buttonProps` e `routerLinkProps` gerados
- Prop `useCloseButton`: exibe ou oculta o botão de fechar
- Prop `useBox`: injeta `isBox: true` vs `false`
- Prop `storageKey` + `usePersistentModelOnClose`: quando `storageKey` definido, chama `LocalStorage.set` ao fechar
- Slot `default`: conteúdo customizado renderizado
- Interação de fechar: clique no botão → `modelValue` muda para `false`
- Injeção `isDialog: true`: ajuste de classes

---

### 3. `QasBtn` — `ui/src/components/btn/QasBtn.test.js`

- Renderização básica sem props
- Prop `variant`: `primary`, `secondary`, `tertiary` → classes CSS corretas no `q-btn`
- Prop `label`: texto visível
- Prop `color`/`size`: classes adequadas no botão
- Prop `disable` + `disabledTooltip`: atributo `disabled` e tooltip de desabilitado
- Prop `loading`: estado de loading no `q-btn`
- Prop `skeleton`: renderiza `QasSkeleton` (já stub'd) ao invés do botão
- Prop `tooltip`: quando presente, `QasTooltip` (já stub'd) é renderizado
- Prop `icon` e `iconRight`
- Inject `btnPropsDefaults`: props do provide sobrescrevem os defaults
- Inject `isHeader: true` → classe adicional
- Inject `isBox: true` → comportamento de cor
- Prop `useLabelOnSmallScreen`: label visível em mobile (mock `Screen.lt.sm = true`)
- Prop `useEllipsis`: adiciona classe full-width
- Prop `useHoverOnWhiteColor`: controla hover em branco
- `data-table-ignore-tr-hover` presente no root

---

### 4. `QasBtnDropdown` — `ui/src/components/btn-dropdown/QasBtnDropdown.test.js`

- Renderização básica
- Prop `buttonsPropsList`: renderiza um botão por item da lista
- Prop `disable`: desabilita todos os botões
- Prop `skeleton`: renderiza skeletons
- Prop `dropdownIcon`: ícone do dropdown ao usar `useSplit`
- Prop `useSplit`: modo split vs dropdown padrão
- Prop `menu` controla estado aberto (v-model)
- Prop `useMenuPadding` altera classe do conteúdo
- Prop `useAutoClose` bloqueia fechamento automático quando `false`
- Emit `click` ao clicar em um item
- Emit `update:menu` quando menu abre/fecha
- Slot `btn-content-{key}`: conteúdo customizado por item
- Slot `default`: conteúdo extra no dropdown

---

### 5. `QasCard` — `ui/src/components/card/QasCard.test.js`

- Renderização básica sem props
- Prop `title`: texto renderizado
- Prop `statusColor`: cor do indicador de status
- Prop `gradientStatusColor`: gradiente no header
- Prop `skeleton`: `QasSkeleton` exibido
- Prop `tooltip`: passa para `QasTooltip`
- Prop `route`: `<router-link>` renderizado com a rota correta
- Prop `useSelection` + `defineModel('selected')`: checkbox visível, emit `update:selected`
- Slot `header`, `header-left`, `title`, `default`, `footer`: cada slot renderiza conteúdo correto
- Inject `isDialog: true`: ajuste de classes
- Inject `isBox: true`: ajuste de estilos
- Prop `actionsMenuProps`: `QasActionsMenu` (stub) renderizado com as props corretas

---

### 6. `QasCardImage` — `ui/src/components/card-image/QasCardImage.test.js`

- Props de layout básicas: `imagePosition` e `gutter` afetam classes
- Prop `images` com lista; verifica que cria slides e usa apenas primeiras 3
- Prop `useHeader`: ativa cabeçalho com carrossel e slot `carousel-header`
- Cartões com `skeleton` mostram sobreposição
- Props `outlined` / `unelevated` mudam classes externas
- Slot `header` substitui carrossel, `default` conteúdo principal e `actions` abaixo
- Verificar que `hasImages` só true quando há mais de uma imagem
- Comportamento de navegação customizada (getNavigationIcon) não necessário

---

### 7. `QasCopy` — `ui/src/components/copy/QasCopy.test.js`

- Renderização básica com prop `text`
- Clique no botão → `copyToClipboard` chamado com o valor de `text`
- Estado de loading durante cópia: `q-btn` `loading` e desabilitado
- Prop `icon`: ícone customizado aplicado
- Prop `useText`: slot `default` renderizado com o texto
- Prop `rawText`: cópia sem formatação

---

### 8. `QasExpansionItem` — `ui/src/components/expansion-item/QasExpansionItem.test.js`

- Renderização básica com prop `label`
- Prop `label`: texto do cabeçalho
- Prop `disable` e `disableButton`: ambos geram classe `--disabled`
- Prop `badges`: renderiza badges no cabeçalho
- Prop `group`: passada para `q-expansion-item`
- Prop `gridGeneratorProps`: quando presente, exibe `qas-grid-generator` no conteúdo
- Prop `error` / `errorMessage` (baseErrorProps): mostra `QasErrorMessage` e classes de erro
- `defineModel` booleano: abre/fecha o item via `v-model`
- `provide('isExpansionItem', true)`: verifica que outros componentes injetam corretamente
- Slot `header`, `header-label`, `header-bottom`, `content`
- Inject `isBox: true` e `isDialog: true`: ajustes de estilo
- Prop `maxContentHeight`: altura máxima do conteúdo aplicada como style

---

### 9. `QasActions` — `ui/src/components/actions/QasActions.test.js`

- Renderização básica
- Prop `primaryButtonProps`: `QasBtn` (stub) renderizado com as props
- Prop `secondaryButtonProps`: segundo botão renderizado
- Prop `tertiaryButtonProps`: terceiro botão renderizado
- Prop `useFullWidth`: classe de largura total aplicada
- Prop `useEqualWidth`: duas colunas quando true
- Prop `align`: classe de alinhamento `FlexAlign` aplicada
- Prop `gutter` e `spacingTop`: espaçamento entre botões
- Slots `primary`, `secondary`, `tertiary`: conteúdo customizado por slot
- Comportamento responsivo: simular `Screen.lt.sm = true` e verificar layout

---

### 10. `QasActionsMenu` — `ui/src/components/actions-menu/QasActionsMenu.test.js`

- Renderização básica com lista de ações
- `data-cy="actions-menu"` presente
- Prop `list` com ações de tipo `route`, `action`, `delete` (objeto com chaves)
- Prop `buttonProps`: repassa defaults (useHoverOnWhiteColor, useLabelOnSmallScreen) e mescla com dados do item
- Prop `disable`: menu totalmente desabilitado
- Prop `skeleton`: skeletons exibidos
- Prop `useLabel`: exibe ou oculta label nos itens
- Prop `useTooltip`: adiciona tooltips (`q-tooltip` via slot `bottom-<key>`)
- Prop `deleteLabel`/`deleteIcon`/`deleteProps`: customização da ação de exclusão e presença de ação quando `hasDelete`
- Prop `splitName`, `useDropdownAlways`: verificam distribuição entre botões e dropdown, inclusive o caso único ou lista pequena
- Verificar cor do botão principal (primary vs DEFAULT_COLOR) quando único item delete
- Slot dinâmico `item-{key}`: slot customizado para item específico
- Inject `isTableGenerator: true`: força `useLabelOnSmallScreen` e alterações de tooltip
- `data-cy="actions-menu-list-item"` para cada item da lista
- Cenário com item `loading: true` assegura que menu não fecha automaticamente
- Casos sem `useDropdownAlways` e com screen.small para mudar comportamento

---

### 11. `QasHeader` — `ui/src/components/header/QasHeader.test.js`

- `provide('isHeader', true)` configurado no componente (verificar que filhos injetam)
- Prop `skeleton`: skeletons aplicados
- Prop `buttonProps`: renderiza `QasBtn` (stub) com as props
- Prop `actionsMenuProps`: renderiza `QasActionsMenu` (stub) com as props
- Prop `filtersProps`: renderiza `QasFilters` (stub) com as props
- Prop `badges`: renderiza badges no título
- Prop `labelProps`: passa para `QasLabel` (stub) e `useEllipsis` influencia
- Prop `description`: texto de descrição visível e `useEllipsis` nas classes
- Prop `tipProps`: `QasTip` (stub) renderizado com atributos
- Prop `spacing`: classe `q-mb-<value>` aplicada
- Slots `label`, `actions`, `description`
- Prop `useEllipsis`: classe de truncamento nos rótulos

---

### 12. `QasPageHeader` — `ui/src/components/page-header/QasPageHeader.test.js`

- Renderização com prop `title`: título visível
- Prop `breadcrumbs`: itens de breadcrumb renderizados, incluindo truncamento se >4
- Prop `useBreadcrumbs: false`: breadcrumb não renderizado
- Prop `useHomeIcon`: ícone home no breadcrumb
- Prop `root`: rota do item inicial aparece no começo
- Prop `skeleton`: mostra esqueletos nos breadcrumbs
- `useRouter()` chamado (já mockado no setup)
- Slot `default` e slot `bottom` para conteúdo adicional

---

### 13. `QasGalleryCard` — `ui/src/components/gallery-card/QasGalleryCard.test.js`

- Renderização com props básicas (`url`, `disable`)
- Prop `url`: imagem exibida dentro de `q-img`
- Comportamento de erro: exibe fallback com `errorIcon`/`errorMessage` ou `fileType`
- Props `fileType` e extração automática da URL
- Prop `useVideo` troca imagem por `q-video` e aceita slot `video`
- Props `headerProps`: renderiza `QasHeader` com as opções corretas e repassa `disable`
- Props `gridGeneratorProps` ou slot `bottom` mostram conteúdo adicional
- Clique no card não emite explicitamente, mas hover adiciona classe e slot de ações aparece
- Prop `disable` aplica classe de texto cinza

---

### 14. `QasDate` — `ui/src/components/date/QasDate.test.js`

- Renderização básica
- Prop `modelValue`: data inicial no formato correto, incluindo `multiple` e retorno ISO se `useIso`
- Emissão de `update:modelValue` ao selecionar data
- Prop `mask`: afeta máscara e formatação
- Props `events` / `eventColor`: adiciona elementos no dia e cores customizadas (incluindo callbacks)
- Formato pt-BR: datas exibidas como `dd/MM/yyyy`
- Props de intervalo (`from`/`to`)/`options`: restrições de seleção aplicadas
- Prop `useInactiveDates`: classe `--inative` aplicada
- Prop `width`: style aplicado
- Prop `disable` (via attrs) deixará o `q-date` vazio ou desabilitado
- Testar mudando o `modelValue` externamente e verificando atualização da exibição
- Testar alternar entre meses/anos e verificar se a navegação funciona corretamente

---

### 15. `QasDateTimeInput` — `ui/src/components/date-time-input/QasDateTimeInput.test.js`

- Renderização básica (input de data + input de hora)
- Prop `modelValue`: valor inicial
- Props `dateMask` / `timeMask`: alteram máscara exibida
- Props `dateProps` / `timeProps`: repassados aos componentes internos
- Props `datePopupProxyProps` / `timePopupProxyProps`: repassados
- Props `disable` / `readonly`:  desabilitam botões e input
- Props `useIso`, `useDateOnly`, `useTimeOnly`: afetam valor emitido e placeholders
- Interação de digitação e blur dispara validação e mostra erro
- Emit `update:modelValue` combinando data e hora e convertendo para ISO quando aplicável

---

### 16. `QasGridItem` — `ui/src/components/grid-item/QasGridItem.test.js`

- Prop `label`: texto do cabeçalho renderizado
- Prop `value`: conteúdo exibido no corpo
- Prop `tip`: renderiza `QasTip` e ajusta classes
- Prop `useEllipsis`: aplica `ellipsis` e `title` nos elementos
- Prop `useInline`: altera classes de container/header
- Prop `content` permite definir `typography` e afeta classes
- Slot `header` e slot `content` substituem valores padrão

---

### 17. `QasListItems` — `ui/src/components/list-items/QasListItems.test.js`

- Prop `list`: renderiza um item por entrada
- Props `labelKey` e `descriptionKey` usam as chaves corretas de cada objeto
- Prop `icon`: ícone do botão de ação
- Prop `useBox`: troca o `component` root por `QasBox`
- Prop `useClickableItem`: controla se o `q-item` é clicável e emite `click-item`
- Prop `useSectionActions`: exibe ou oculta seção de ação lateral
- Slot `item`/`item-section`/`item-section-side` para personalização
- Evento `click-item` disparado adequadamente e ignorado quando deve

---

### 18. `QasTextTruncate` — `ui/src/components/text-truncate/QasTextTruncate.test.js`

- Prop `text`: texto exibido
- Prop `lines`: número de linhas antes do truncamento → propriedade CSS `-webkit-line-clamp` aplicada
- Texto curto: sem truncamento
- Texto longo: truncado com classe adequada

---

### 19. `QasDrawer` — `ui/src/components/drawer/QasDrawer.test.js`

- Prop `modelValue: true`: drawer aberto
- Prop `modelValue: false`: drawer fechado
- Emit `update:modelValue` ao fechar
- Slot `default`
- Prop `title`: cabeçalho mostra título
- Prop `dialogProps`: repassa atributos ao `QasDialog`
- Prop `maxWidth`: calculado com `screen` e estilo na sobreposição de loading
- Prop `position` (`left` vs `right`) e classes associadas
- Prop `loading`: overlay de carregamento aparece com estilo correto

---

### 20. `QasDialog` — `ui/src/components/dialog/QasDialog.test.js`

> **Atenção:** Requer stub de `useDialogPluginComponent` (passo 1) e stub de `q-dialog`.

- `provide('isDialog', true)` configurado
- `data-cy="dialog"` presente
- Prop `modelValue: true`: dialog visível
- Prop `persistent`: impede fechar ao clicar fora
- Prop `ok`: botão OK com label customizado — `data-cy="dialog-ok-btn"`
- Prop `cancel`: botão cancelar — `data-cy="dialog-cancel-btn"`
- Prop `maxWidth`/`minWidth`: aplicados como style
- Emit `ok` ao confirmar
- Emit `cancel` ao cancelar
- Emit `update:modelValue` ao fechar
- Slots `header`, `description`, `actions`
- `data-cy="dialog-close-btn"`: botão de fechar
- Prop `useForm: true`: valida antes de confirmar (emit `validate`)

---

### 21. `QasDialogRouter` — `ui/src/components/dialog-router/QasDialogRouter.test.js`

- Expose `show(routeParam)` e `hide()`
- Método `show`: abre o dialog e navega para a rota via `useRouter()`
- Método `hide`: fecha o dialog e emite `hide`
- Emit `error` em caso de falha de navegação

---

### 22. `QasToggleVisibility` — `ui/src/components/toggle-visibility/QasToggleVisibility.test.js`

- Prop `text`: texto visível
- Prop `group`: visibilidade sincronizada entre componentes do mesmo grupo
- Toggle: clique alterna visível/oculto
- `data-no-grab` presente no root
- Slot `default`
- Props `visibleTooltip`/`hiddenTooltip`: tooltip correto por estado

---

### 23. `QasGrabbable` — `ui/src/components/grabbable/QasGrabbable.test.js`

- Renderização básica
- Slot `default`
- Evento `dragstart`: emitido ao iniciar drag
- Evento `dragend`: emitido ao soltar
- Classe `is-grabbing` aplicada durante drag

---

### 24. `QasStepper` — `ui/src/components/stepper/QasStepper.test.js`

> **Atenção:** `q-stepper` não é custom element no config — será montado como componente real.

- Prop `modelValue`: step atual (sincronizado com `q-stepper`)
- Emit `update:modelValue` ao mudar de step
- Prop `disable`: navegação desabilitada
- Expose `next()`: avança um step
- Expose `previous()`: volta um step
- Expose `goTo(step)`: vai para step específico
- Prop `useVertical`: layout vertical
- Slots padrão com context enriched (`next`, `previous`)

---

### 25. `QasInfiniteScroll` — `ui/src/components/infinite-scroll/QasInfiniteScroll.test.js`

- Renderização básica com `list` inicial
- Prop `url` obrigatória utilizada na requisição simulada (mock `axios`)
- Props `limitPerPage`, `params`, `fields` alteram chamada
- Emits `fetch-success` e `fetch-error` dependendo do resultado
- Métodos expostos `refresh()` e `remove(index)` atualizam `modelList` e `offset`
- Prop `maxHeight` aplica estilo e altera `scrollTarget`
- Slot `default` para os itens
- Estado `hasNoResults` mostra `QasEmptyResultText` quando apropriado

---

### 26. `QasTimeline` — `ui/src/components/timeline/QasTimeline.test.js`

- Prop `list`: renderiza um item de timeline por entrada
- Props `dateKey`, `hourKey`, `descriptionKey` para extrair valores corretos
- Datas válidas são formatadas; inválidas passam sem formatação
- Slot default e slots nomeados (`hour`, `description`) substituem conteúdo
- Lista vazia não quebra e não renderiza entradas

---

### 27. `QasPasswordStrengthChecker` — `ui/src/components/password-strength-checker/QasPasswordStrengthChecker.test.js`

> **Atenção:** Único componente da Fase 2 em **Options API** — testar via `mountComponent` normalmente; emits via `wrapper.emitted()`.

- Prop `password: ''`: score inicial 0, nível baixo
- Prop `password` com senha fraca: score baixo, critérios não cumpridos
- Prop `password` com senha forte: score alto, todos os critérios visualmente marcados
- Emit `update:currentLevel` ao mudar senha (watcher com `immediate: true`)
- Slot `default` com binding `{ level }`: nível de força acessível no slot
- Critérios individuais (mínimo de chars, maiúsculas, números, caracteres especiais): cada um refletido visualmente

---

### 28. `QasProfile` — `ui/src/components/profile/QasProfile.test.js`

- Prop `title` (anteriormente `name`): nome do usuário exibido obrigatoriamente
- Prop `result.image`: avatar com imagem
- Sem imagem: inicializações de nome são passadas ao `QasAvatar`
- Props `subtitle`, `tag`: alteram texto secundário e elemento wrapper
- Props `columns`, `fields`, `list`, `result` repassadas ao `QasGridGenerator`
- Slot default substitui título/subtitle
- Slot `grid` substitui todo o gerador de grid

---

## Verificação

- Rodar `npm run test` para validar todos os testes (sem quebrar os da Fase 1)
- Rodar `npx vitest run ui/src/components/<nome>/` para validar cada componente individualmente
- Rodar `npm run lint` para garantir conformidade com ESLint
- Opcionalmente: `npx vitest run --coverage` para confirmar cobertura > 80% dos componentes públicos da Fase 2

---

## Decisões

- **Mock de `useDialogPluginComponent`:** Necessário apenas para `QasDialog` — será adicionado pontualmente no `setup.js` com `vi.mock('quasar', ...)` preservando o restante do Quasar via `importOriginal`
- **`QasPasswordStrengthChecker` (Options API):** `mountComponent` funciona igualmente — sem tratamento especial; emits testados via `wrapper.emitted()`
- **`q-stepper` não como custom element:** Já configurado no `vitest.config.js` — será montado real; o expose `next/previous/goTo` pode ser testado via `wrapper.vm.next()` por ser API pública exposta
- **Ordem de implementação sugerida:** Componentes sem `inject` complexo primeiro (QasActions, QasCardImage, QasBreakline), depois os com `inject` (QasBtn, QasCard), por último QasDialog e QasStepper
- **Componentes sem teste no plano original:** `QasCardImage`, `QasProfile` — incluídos aqui; `QasGalleryCard`, `QasDate`, `QasDateTimeInput`, `QasGridItem`, `QasListItems`, `QasTextTruncate`, `QasDrawer`, `QasGrabbable`, `QasInfiniteScroll`, `QasTimeline` — todos incluídos
- **Sem snapshots:** Apenas testes comportamentais conforme `vue-testing-best-practices`
- **`data-cy` verificados:** Todo componente com atributos `data-cy` documentados terá um `describe('atributos data-cy')` dedicado
