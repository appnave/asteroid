---
title: QasDrawer
---

Componente de drawer que implementa o QasDialog.

<doc-api file="drawer/QasDrawer" name="QasDrawer" />

:::info
Como é um componente wrapper do QasDialog, é possível repassar props diretamente para ele por meio da propriedade dialogProps. Contudo, vale notar que nem todas as props podem ser repassadas. Aquelas que **não** têm essa possibilidade são:

- cancel;
- maxWidth (use a prop maxWidth do componente);
- maximized;
- ok;
- position (use a prop position do componente);
- useFullMaxWidth.
:::

## Uso

<doc-example file="QasDrawer/Basic" title="Básico" />

<doc-example file="QasDrawer/Size" title="Tamanho do drawer" />
