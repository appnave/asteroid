---
title: QasAlert
---

Componente para informações.

<doc-api file="alert/QasAlert" name="QasAlert" />

:::info
- Quando a propriedade "useRegex" for "true", todo texto da propriedade "text" que estiver dentro de `[]` será substituído pelos componentes:
  - RouterLink (se existir a propriedade `routerLinkProps`).
  - QasBtn (se existir a propriedade `buttonProps`).
- slot "default" só existe se "useRegex" for "false".
:::

## Uso

<doc-example file="QasAlert/Basic" title="Básico" />

:::info
- Quando o componente é chamado dentro de um QasBox ou QasDialog ele automaticamente fica sem box, para não ter box dentro de box.
- É possível configurar manualmente a prop "useBox", porém só use em casos muito específicos e quando realmente é necessário.
:::
<doc-example file="QasAlert/InsideBox" title="Dentro de box" />
<doc-example file="QasAlert/InsideDialog" title="Dentro de dialog" />
<doc-example file="QasAlert/Button" title="Com botão" />
<doc-example file="QasAlert/MultipleButtons" title="Com múltiplos botões / links" />
<doc-example file="QasAlert/ExternalLink" title="Link externo" />
