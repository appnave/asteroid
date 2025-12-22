---
title: QasNestedFields
---

Componente para gerar dinamicamente campos nested.

<doc-api file="nested-fields/QasNestedFields" name="QasNestedFields" />

:::tip
- A propriedade `field` deve respeitar a seguinte estrutura:

  ```js
  {
    name: 'nested', // pode ser qualquer nome.
    type: 'nested',
    label: 'Meu nested',
    children: { // aqui dentro vão todos os os campos nested, veja um exemplo.
      name: {
        name: 'name',
        type: 'text',
        label: 'Nome'
      },
      email: {
        name: 'email',
        type: 'email',
        label: 'E-mail'
      },
      cities: {
        name: 'cities',
        type: 'select',
        options: [
          {
            label: 'Cidade 1',
            value: 1
          },
          {
            label: 'Cidade 2',
            value: 2
          },
          {
            label: 'Cidade 3',
            value: 3
          }
        ]
      }
    }
  }
  ```

- A propriedade `rowObject` é usada para definir quais os valores **default** de cada campo na linha, por exemplo, se você quiser que ao adicionar uma nova linha o campo de cidades já venha selecionado:

  ```js
  {
    name: '',
    email: '',
    cities: [1], // aqui o valor default para este campo é 1
    select: ''
  }
  ```
:::

:::warning
A propriedade `useDestroyAlways` caso não seja repassada ao componente, assume o inicial como o mesmo valor da propriedade `useStartsEmpty`.
:::

## Uso

<doc-example file="QasNestedFields/Basic" title="Básico" />
<doc-example file="QasNestedFields/NestedFieldsWithHeaderProps" title="Header personalizável" />
<doc-example file="QasNestedFields/CallbackFields" title="Propriedades fieldsHandlerFn e fieldsProps com função de callback" />

:::tip
Opte por usar o `use-single-label` apenas quando utilizar o `use-inline-actions`.
:::
<doc-example file="QasNestedFields/ExSingleLabel" title="Label única" />
<doc-example file="QasNestedFields/NotHeader" title="Sem header em todas as linhas" />

<doc-example file="QasNestedFields/StartsEmptyFalse" title="Começando com formulário" />
<doc-example file="QasNestedFields/DisabledRowsArray" title="Linhas desabilitadas com um array de uuids" />
<doc-example file="QasNestedFields/DisabledRowsFunction" title="Linhas desabilitadas com uma função de callback" />
<doc-example file="QasNestedFields/ButtonDestroyPropsFunction" title="Com callback na prop buttonDestroyProps" />

:::info
Lembre-se, para utilizar a prop `actionsMenuProps`, é necessário utilizar a prop `useInlineActions`.
:::
<doc-example file="QasNestedFields/ActionsMenuPropsObject" title="Propriedades do QasActionsMenu com objeto" />
<doc-example file="QasNestedFields/ActionsMenuPropsFunction" title="Propriedades do QasActionsMenu com função de callback" />
<doc-example file="QasNestedFields/InlineActions" title="Propriedade useInlineActions" />
<doc-example file="QasNestedFields/SlotBeforeFields" title="Slot before-fields" />
<doc-example file="QasNestedFields/SlotAfterFields" title="Slot after-fields" />
<doc-example file="QasNestedFields/SlotDynamic" title="Slot field-[nome-da-chave]" />
<doc-example file="QasNestedFields/SlotFields" title="Slot fields" />
<doc-example file="QasNestedFields/SlotAddInput" title="Slot add-input" />
<doc-example file="QasNestedFields/ExWithIndexLabel" title="Com index no label" />
