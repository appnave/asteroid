---
title: QasBtnDropdown
---

Componente semelhante ao QBtnDropdown porém utilizando o QasBtn e QSeparator.

<doc-api file="btn-dropdown/QasBtnDropdown" name="QasBtnDropdown" />

:::danger
Este é um componente puro de dropdown, é utilizado para situações especificas, na maioria dos casos é **recomendado** a utilização do `QasActionsMenu` que implementa este componente e adiciona recursos a mais, utilize este componente com atenção!
:::

:::info
- A propriedade `useEllipsis` dentro do `buttonPropsList` só funciona quando existe apenas 1 botão.
:::

## Uso

<doc-example file="QasBtnDropdown/Basic" title='Básico' />
<doc-example file="QasBtnDropdown/BtnContentSlot" title='Slot btn-content-[key]' />
<doc-example file="QasBtnDropdown/ExWithSplit" title='Uso com divisão' />
<doc-example file="QasBtnDropdown/ExWithMenuPadding" title='Uso com padding no dropdown menu' />
<doc-example file="QasBtnDropdown/ExWithClickEvent" title='Uso do evento de click' />
