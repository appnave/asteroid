# Adicionando Documentação de Componente

Passo a passo para documentar um novo componente no site de documentação do Asteroid.

## Passos

### 1. Criar o componente e seu YML

O componente já deve existir em `ui/src/components/<nome>/` com seu arquivo `Qas<Nome>.yml`.

Consulte [component-structure](component-structure.md) e [yml-api-docs](yml-api-docs.md).

### 2. Criar a página Markdown

Criar em `docs/src/pages/components/<nome>.md`:

```markdown
---
title: <Nome do Componente>
---

# Qas<Nome>

Descrição do componente em português brasileiro.

<doc-api file="Qas<Nome>" name="Qas<Nome>" />

## Exemplo básico

<doc-example file="Qas<Nome>/Basic" title="Uso básico" />
```

### 3. Criar exemplos interativos

Criar em `docs/src/examples/Qas<Nome>/Basic.vue`:

```vue
<template>
  <qas-<nome> label="Exemplo" />
</template>
```

Pode criar múltiplos exemplos (ex: `Advanced.vue`, `WithSlots.vue`) e referenciá-los na página com `<doc-example>`.

### 4. Adicionar ao menu

Editar `docs/src/assets/menu.js` e adicionar entrada na seção correta:

```js
{
  name: '<Nome do Componente>',
  path: '/components/<nome>'
}
```

### 5. Validar

```bash
cd docs
npm run dev:pwa
```

Navegar até a página do componente e verificar:
- API renderiza corretamente (props, events, slots)
- Exemplos funcionam e mostram código fonte
- Menu lateral lista o componente

## Componentes de Documentação Disponíveis

| Componente | Uso |
|------------|-----|
| `<doc-api file="QasBtn" name="QasBtn" />` | Renderiza tabela de API do YML |
| `<doc-example file="QasBtn/Basic" title="..." />` | Renderiza exemplo interativo |

## Containers Markdown

```markdown
:::tip Dica
Texto de dica
:::

:::warning Atenção
Texto de aviso
:::
```
