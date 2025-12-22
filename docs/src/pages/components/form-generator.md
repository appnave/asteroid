---
title: QasFormGenerator
---

Componente para criação de múltiplos campos dinâmicos a partir do componente `QasField`.

<doc-api file="form-generator/QasFormGenerator" name="QasFormGenerator" />

:::tip
Este componente renderiza componentes dinamicamente através da prop `fields`, cada field dentro de fields tem um `name`, através dele, você consegue acessar os slots dinâmicos.
:::

:::tip
Para saber mais sobre o **API Design Pattern** clice [aqui](https://www.notion.so/bildvitta/API-Design-Patterns-5c2509b697614bbbac49cbed0aab70a1).
:::

## Uso
<doc-example file="QasFormGenerator/Basic" title="Básico" />
<doc-example file="QasFormGenerator/Boxed" title="Com box" />

:::tip
##### Fieldset

Muitas vezes precisamos adicionar rótulos (label) e descrições (description) a determinados blocos de campos para dar mais contexto, com esta propriedade conseguimos fazer isto de uma forma simples, sem a necessidade de abrir um slot para isto.

> Observação: Se passar a key "label" dentro do `headerProps.labelProps` ela irá sobrescrever a label imediata do fieldset.

```js
{
  personalInformation: {
    label: 'Informações pessoais',
    description: 'Informe o nome e email do usuário.'
    fields: ['name', 'email'],
    headerProps: {
      badges: [
        {
          label: 'Minha badge',
          textColor: 'grey-10'
        }
      ],
      buttonProps: {
        label: 'Atualizar'
      }
    }
  },

  another: {
    label: 'Outras informações',
    description: 'Informe o telefone e empresa do usuário.'
    fields: ['phone', 'company']
  }
}
```
:::

<doc-example file="QasFormGenerator/Fieldset" title="Agrupando fields por rótulo (label)" />
<doc-example file="QasFormGenerator/WithButton" title="Usando botão dentro do fieldset" />

:::info
##### Subset

Além da possibilidade de separar em seções (rótulos), também é possível ter subseções dentro de cada seção.
A mesma estrutura de um fieldset, é aceita dentro de um subset, sendo que será definido dentro do próprio fieldset.

> Observação: A tipografia da label sempre será `h5` para manter a hierarquia da estrutura e não será possível dividir em colunas.

Exemplo:
```js
{
  informations: {
    label: 'Informações',
    description: 'Informe algumas informações do usuário.',
    fields: ['isActive', 'phone', 'name', 'company', 'uuid'],
    subset: {
      others: {
        headerProps: {
          labelProps: { label: 'Uma subseção' },
          badges: [
            {
              label: 'Minha badge',
              textColor: 'grey-10'
            }
          ],
          buttonProps: {
            label: 'Atualizar',
            onClick: () => alert('Atualizando...')
          }
        },
        fields: ['email', 'others']
      },

      description: {
        label: 'Outra subseção',
        description: 'Exemplo utilizando outra subseção.',
        fields: ['comment']
      }
    }
  }
}
```
:::
<doc-example file="QasFormGenerator/WithSubsets" title="Usando com subseções" />
<doc-example file="QasFormGenerator/WithSubsetsSlots" title="Acessando slots de subseções" />

Em alguns casos, queremos acessar todo o conteúdo de um campo especifico para fazer uma logica um pouco mais detalhada, neste caso conseguimos acessar o slot de cada campo individualmente.
<doc-example file="QasFormGenerator/CustomSlot" title="Acessando slots" />
<doc-example file="QasFormGenerator/CustomProps" title="Custom props" />
<doc-example file="QasFormGenerator/ExFormCommonColumns" title="Common columns" />
