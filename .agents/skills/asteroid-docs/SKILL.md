# Módulo Docs (`docs/`)

Aplicação Quasar dedicada à documentação do Asteroid, hospedada como PWA em https://asteroid-v3.vercel.app/.

## Estrutura

```
docs/
├── package.json             # @appnave/asteroid-docs (privado)
├── quasar.config.js         # Config do Quasar (Vite)
├── asteroid.config.js       # Config do Asteroid para a própria doc
├── babel.config.js
├── build/                   # Plugins de build para Markdown
│   ├── markdown.js          # Pipeline de processamento Markdown
│   ├── markdown-plugin-code.js      # Syntax highlight com highlight.js
│   ├── markdown-plugin-container.js # Containers customizados (:::tip, :::warning)
│   ├── markdown-plugin-heading.js   # Processamento de headings
│   └── markdown-plugin-table.js     # Tabelas responsivas
└── src/
    ├── App.vue
    ├── assets/
    │   ├── menu.js           # Estrutura completa do menu lateral (~673 linhas)
    │   ├── images/
    │   └── logo/
    ├── boot/
    │   ├── asteroid.js       # Configura Asteroid para a doc
    │   ├── components.js     # Registra componentes de documentação globalmente
    │   ├── redirect.js       # Redirect de rotas
    │   └── vitals.js         # Web Vitals tracking
    ├── components/           # Componentes de UI da documentação
    │   ├── DocApi.vue        # Renderiza documentação de API a partir dos YMLs
    │   ├── DocExample.vue    # Renderiza exemplos interativos
    │   └── ...
    ├── examples/             # ~90 pastas com exemplos Vue por componente
    │   ├── QasBtn/
    │   │   └── Basic.vue
    │   ├── QasFormView/
    │   │   └── Basic.vue
    │   └── ...
    ├── pages/                # Cada .md gera uma página de documentação
    │   ├── components/       # Uma página .md por componente
    │   ├── composables/      # Páginas de composables
    │   ├── helpers/          # Páginas de utilitários
    │   ├── plugins/          # Páginas de plugins
    │   ├── start/            # Guias iniciais (usage, develop, structure, upgrade-guide)
    │   ├── styles/           # Documentação de estilos
    │   ├── style-guide/      # Guia de estilo de código
    │   └── boot/             # Documentação dos boots
    ├── layouts/
    ├── router/
    ├── store/
    ├── mocks/                # Dados mock para exemplos
    └── css/
```

## Como Funciona

### Páginas Markdown
Cada página usa **YAML frontmatter** + Markdown + componentes Vue inline:

```markdown
---
title: Button
---

# QasBtn

Descrição do componente.

<doc-api file="QasBtn" name="QasBtn" />

## Exemplo básico

<doc-example file="QasBtn/Basic" title="Uso básico" />

:::tip Dica
Texto de dica aqui
:::
```

### Componentes de Documentação

| Componente | Uso | Descrição |
|------------|-----|-----------|
| `<doc-api>` | `<doc-api file="QasBtn" name="QasBtn" />` | Renderiza tabela de API (props, events, slots) a partir do YML |
| `<doc-example>` | `<doc-example file="QasBtn/Basic" title="..." />` | Renderiza exemplo Vue interativo com código fonte |

### Menu Lateral (`assets/menu.js`)
Array de objetos com `name`, `path` (ou `children`), e `icon`. Cada seção do menu mapeia para uma pasta em `pages/`.

### Build do Markdown
O `quasar.conf.js` utiliza plugins `markdown-it` customizados para:
- **Code blocks:** Syntax highlight via `highlight.js`
- **Containers:** `:::tip`, `:::warning` com estilos customizados
- **Headings:** Auto-geração de anchors
- **Tables:** Wrapper responsivo

Arquivos `.md` são tratados como componentes Vue via plugin Vite customizado usando `getVueComponent()`.

## Como Adicionar Documentação de um Novo Componente

1. Criar o componente em `ui/src/components/<nome>/`
2. Criar o arquivo `Qas<Nome>.yml` na mesma pasta
3. Criar página em `docs/src/pages/components/<nome>.md` com `<doc-api>` e `<doc-example>`
4. Criar exemplos em `docs/src/examples/Qas<Nome>/Basic.vue` (e outros)
5. Adicionar entrada no `docs/src/assets/menu.js`

## Scripts

```bash
cd docs
npm run dev:pwa    # Desenvolvimento local (PWA mode)
npm run build      # Build para produção (Quasar PWA)
```

## Dependências Notáveis

- `@bildvitta/quasar-ui-asteroid: file:../ui` — consome o UI localmente
- `highlight.js` — Syntax highlighting
- `markdown-it` + plugins — Processamento de Markdown
- `@docsearch/js` — Busca via Algolia
- `web-vitals` — Métricas de performance
- `unplugin-vue-components` — Auto-import dos componentes Asteroid
