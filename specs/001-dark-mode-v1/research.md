# Research — Dark Mode v1

**Feature**: Dark Mode v1
**Branch**: `feature/dark-mode-v1`
**Data**: 09/03/2026

---

## 1. Quasar Dark Mode — API Nativa

### Decisão
Usar `$q.dark` do Quasar v2.18.1 como base da implementação (conforme FR-008).

### Racional
- O Quasar já oferece uma API completa de dark mode integrada ao framework.
- `$q.dark.set(true/false)` ativa/desativa o modo.
- `$q.dark.isActive` (reativo) indica o estado atual.
- `$q.dark.toggle()` alterna entre modos.
- Quando ativo, adiciona `.body--dark` ao `<body>` e remove `.body--light` (e vice-versa).
- As CSS custom properties `--q-*` do Quasar podem ser redefinidas dentro de `.body--dark` para alterar cores globalmente.

### Alternativas consideradas
- **Media query `prefers-color-scheme`**: Descartada — FR-003 exige que o padrão seja `light`, sem depender do sistema operacional.
- **Solução CSS-only custom**: Descartada — reinventaria o que o Quasar já oferece e quebraria a integração com o ecossistema.

---

## 2. Mapeamento de Cores (OQ-001 Resolvida)

### Decisão
**Opção B** — Mapeamento interno automático via composable `useThemeColor`.

### Racional
- 87 componentes com uso extensivo de cores hardcoded via props (`color="grey-10"`, `color="grey-8"`, etc.).
- Criar props paralelas (`color-dark`) seria inviável — duplicaria a API inteira.
- Manter responsabilidade no consumidor contraria o princípio "Design System First" da constitution.
- Um composable central `useThemeColor(color)` resolve automaticamente: quando `$q.dark.isActive`, retorna a variante dark mapeada.
- Mapa central de cores (`DARK_COLOR_MAP`) fica em um único lugar, fácil de manter.

### Mapa de cores proposto

| Cor Light (original) | Cor Dark (mapeada) | Uso semântico |
|---|---|---|
| `grey-10` (#212121) | `grey-2` (#EEEEEE) | Títulos, ações negativas |
| `grey-8` (#424242) | `grey-4` (#BDBDBD) | Texto padrão |
| `grey-6` (#757575) | `grey-5` (#9E9E9E) | Estado inativo |
| `grey-4` (#BDBDBD) | `grey-7` (#616161) | Bordas |
| `grey-2` (#EEEEEE) | `grey-9` (#212121) | Backgrounds claros |
| `white` (#FFFFFF) | `dark` (#1D1D1D) | Background principal |
| `negative` / `red-14` | `red-14` (sem mudança) | Erros — já tem bom contraste |
| `positive` | `positive` (sem mudança) | Sucesso — uso restrito |
| `primary` | `primary` (sem mudança) | FR-005: preservar |
| `secondary` | `secondary` (sem mudança) | FR-005: preservar |

### Alternativas consideradas
- **Props paralelas (Opção A)**: Inviável — 87 componentes × N props de cor = centenas de novas props.
- **Responsabilidade no consumidor (Opção C)**: Contra a constitution do projeto.

---

## 3. Classes Utilitárias Estáticas (OQ-002 Resolvida)

### Decisão
Override via `.body--dark` para classes usadas internamente no Asteroid.

### Racional
- Classes como `text-grey-10`, `text-grey-8`, `bg-grey-2` são usadas em 20+ componentes internos.
- O Quasar já adiciona `.body--dark` ao `<body>` quando dark mode está ativo.
- Override global é a abordagem com menor esforço e zero breaking change nos templates.
- Para consumidores que usam essas classes em seus próprios templates, documentar a limitação e recomendar o composable `useThemeColor` ou computed classes.

### Implementação
```scss
// ui/src/index.scss ou arquivo dedicado
.body--dark {
  // Textos
  .text-grey-10 { color: $grey-2 !important; }
  .text-grey-8  { color: $grey-4 !important; }
  .text-grey-6  { color: $grey-5 !important; }

  // Backgrounds
  .bg-white     { background: #1D1D1D !important; }
  .bg-grey-2    { background: $grey-9 !important; }
  .bg-grey-4    { background: $grey-8 !important; }

  // Bordas
  .border-grey-4 { border-color: $grey-7 !important; }
}
```

### Alternativas consideradas
- **Classes semânticas (`text-title`)**: Exigiria refator de todos os templates. Desproporcionado para v1.
- **CSS custom properties inline**: Mistura inline style com classes, inconsistente.

---

## 4. Mudanças na app-extension (OQ-003 Resolvida)

### Decisão
Sim, a app-extension terá 3 mudanças pontuais.

### Racional
1. **`default-asteroid-config.js`** — Adicionar `useDarkMode: false` em `framework.featureToggle`.
2. **Novo boot file `dark-mode.js`** — Responsável por:
   - Ler preferência do `localStorage` na inicialização.
   - Configurar `$q.dark` do Quasar com o valor salvo.
   - Executar **antes** dos componentes renderizarem para evitar FOUT (NFR-001).
   - Respeitar a config `featureToggle.useDarkMode` — se `false`, não inicializa.
3. **`src/index.js`** — Registrar o novo boot file na lista de boots da extension.

### Alternativas consideradas
- **Não alterar app-extension**: Impossível — a inicialização do dark mode precisa acontecer no boot, antes de qualquer componente renderizar.

---

## 5. Configuração Global vs. Prop (OQ-004 Resolvida)

### Decisão
Ambos, com hierarquia clara: prop > config global.

### Racional
- **`asteroid.config.js` → `framework.featureToggle.useDarkMode`**: Configuração GLOBAL estática. Se `false` (default), dark mode desabilitado em toda aplicação.
- **Prop `use-dark-mode` no `QasAppBar`**: Override LOCAL. Permite desabilitar em tela específica (ex: login) mesmo quando global está habilitado.
- **Hierarquia de precedência**: Prop do componente > Config global.
- Segue o padrão já existente de `useNotifications` no `featureToggle`.

### Alternativas consideradas
- **Apenas prop**: Obrigaria cada componente a receber a prop. Contra o padrão do projeto.
- **Apenas config global**: Sem flexibilidade para cenários pontuais.

---

## 6. Estratégia de CSS Custom Properties

### Decisão
Usar CSS custom properties `--qas-*` definidas em `:root` (light) e redefinidas em `.body--dark` (dark).

### Racional
- O Asteroid já usa `--qas-*` custom properties (background-color, border-grey, scrollbar-*, spacing-*).
- Redefinir essas variáveis dentro de `.body--dark` garante que qualquer componente que as consuma reaja automaticamente ao dark mode.
- Novas variáveis semânticas serão criadas para cores que hoje são hardcoded.

### Novas variáveis propostas
```scss
:root {
  // Existentes (sem mudança no light)
  --qas-background-color: rgba(15, 83, 175, 0.03);
  --qas-border-grey: #{$grey-4};

  // Novas - semânticas
  --qas-text-primary: #{$grey-10};
  --qas-text-secondary: #{$grey-8};
  --qas-text-disabled: #{$grey-6};
  --qas-surface-color: #FFFFFF;
  --qas-surface-variant: #{$grey-2};
}

.body--dark {
  --qas-background-color: #121212;
  --qas-border-grey: #{$grey-7};
  --qas-text-primary: #{$grey-2};
  --qas-text-secondary: #{$grey-4};
  --qas-text-disabled: #{$grey-5};
  --qas-surface-color: #1D1D1D;
  --qas-surface-variant: #{$grey-9};
}
```

---

## 7. Persistência de Preferência (FR-002)

### Decisão
`localStorage` com key `qas-theme-preference`, valores `light` | `dark`.

### Racional
- Spec exige persistência via localStorage.
- Key com prefixo `qas-` para evitar colisão com outras libs.
- Fallback para `light` se: localStorage bloqueado (EC-001), valor inválido (EC-003), ou primeiro acesso (EC-002).

### Implementação
O composable `useDarkMode` será responsável por:
1. Ler `localStorage.getItem('qas-theme-preference')`.
2. Validar valor (`light` ou `dark`, senão fallback para `light`).
3. Aplicar via `$q.dark.set(isDark)`.
4. Persistir mudanças via `watch` reativo.

---

## 8. Prevenção de FOUT (NFR-001)

### Decisão
Boot file com execução prioritária + inline script no template HTML.

### Racional
- O boot file `dark-mode.js` executa antes do app Vue montar.
- Para eliminar completamente o flash, um inline script no `<head>` do HTML lê o localStorage e adiciona `.body--dark` antes do primeiro paint.
- O Quasar já suporta isso — basta configurar `Dark.set()` no boot.

---

## 9. Auditoria de Componentes — Estratégia

### Decisão
Auditoria em 3 categorias com prioridades.

### Categorias

**Categoria A — Adaptação via CSS (sem mudança em JS)**
Componentes que usam apenas classes utilitárias (`text-grey-10`, `bg-white`) e variáveis CSS do Asteroid. O override global via `.body--dark` resolve automaticamente.

**Categoria B — Adaptação via composable**
Componentes que passam cores via props para sub-componentes Quasar (ex: `color="grey-10"` em `<q-icon>`). Precisam usar `useThemeColor` para resolver a cor dinâmica.

**Categoria C — Adaptação de estilos inline/scoped**
Componentes com estilos SCSS scoped que referenciam cores hardcoded. Precisam de override `.body--dark` no scoped style ou migração para CSS custom properties.

### Componentes por categoria (estimativa baseada na auditoria)

| Categoria | Qtd estimada | Exemplos |
|---|---|---|
| A — CSS only | ~40 | QasBox, QasContainer, QasBreakline |
| B — Composable | ~30 | QasAppBar, QasDialog, QasSearchInput, QasCard |
| C — Scoped style | ~17 | QasTooltip, QasPdfViewer, QasDebugger |
