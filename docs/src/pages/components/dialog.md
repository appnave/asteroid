---
title: QasDialog
---

Componente de dialog.

<doc-api file="dialog/QasDialog" name="QasDialog" />

:::info
##### Tamanhos
A prop "size" altera os tamanhos do dialog.

- sm: -> 450px (default)
- md: -> 550px
- lg: -> 800px
- xl: -> 1100px
:::

:::info
##### Boas práticas
**Fechamento automático dos botões:**
- Por padrão, os botões de ação fecham o dialog automaticamente
- Se precisar desabilitar esse comportamento, use `useAutoCloseOnActions: false`
- ⚠️ **Evite usar** `useForm: true` só para isso - essa prop adiciona um `QForm` ao redor do conteúdo e deve ser usada apenas quando houver validação de formulário

**Modo persistent:**
- O dialog se torna persistent (não fecha ao clicar fora) automaticamente quando há botões de ação
- Isso evita que o usuário feche o dialog acidentalmente durante uma ação importante

**Botão de fechar (X):**
- Use `useCloseButton` apenas em casos específicos e alinhados com o time de design
:::

## Uso

<doc-example file="QasDialog/Basic" title="Básico" />
<doc-example file="QasDialog/DialogWithTertiary" title="Com botão terciário" />
<doc-example file="QasDialog/DialogWithHtmlDescription" title="Com HTML na descrição" />
<doc-example file="QasDialog/DialogInfoOnly" title="Sem ações" />
<doc-example file="QasDialog/ExDialogCancelAndOk" title="Eventos Ok e Cancel" />
<doc-example file="QasDialog/ExDialogForm" title="Com formulário" />
<doc-example file="QasDialog/ExWithSingleAction" title="Com uma única ação" />

É possível passar um componente para a descrição, caso precise que a descrição seja diferente do padrão.

:::warning
Isso foi desenvolvido para utilizar em casos muitos específicos, não é recomendado o uso dessa funcionalidade com frequência.
Um caso onde a exclusão desse item é de alto impacto, onde devemos ter informações a mais do que somente a descrição padrão.

Exemplo: Tenho um item onde está vinculado a vários empreendimentos, e deverá ser exibido quais empreendimentos estão vinculados mostrando o impacto da exclusão do mesmo.
:::
<doc-example file="QasDialog/DialogWithDescriptionComponent" title="Descrição sendo um componente" />
