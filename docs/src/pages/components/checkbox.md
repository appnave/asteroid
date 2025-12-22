---
title: QasCheckbox
---

Componente para gerar dinamicamente checkbox agrupados.

<doc-api file="checkbox/QasCheckbox" name="QasCheckbox" />

## Uso
:::info
- Por padrão é exibido a label em casos de ser options group, quando se recebe a prop "label". Caso não queria exibir, basta não enviar.
- prop `errorMessage` não funciona no nomo single (apenas 1 opção).
:::

<doc-example file="QasCheckbox/Single" title="Single" />
<doc-example file="QasCheckbox/Options" title="Options" />
<doc-example file="QasCheckbox/Children" title="Children options" />

:::warning
- aplica estilos da tipografia `h5`.
- use a prop `useAsTitle` apenas em casos onde o checkbox será usado como um titulo de uma seção, como por exemplo titulo de um `QasExpansionItem` selecionável.
:::
<doc-example file="QasCheckbox/UseAsTitle" title="Usado como titulo" />
