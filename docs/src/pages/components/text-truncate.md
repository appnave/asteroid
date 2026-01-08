---
title: QasTextTruncate
---

Trunca um texto baseado no tamanho do elemento pai e adiciona um rotulo "ver mais" que quando clicado mostra um dialog com o texto original completo (sem ser truncado).

<doc-api file="text-truncate/QasTextTruncate" name="QasTextTruncate" />

:::info
#### Injetando propriedades padrões via provide
Use o provide `textTruncatePropsDefaults` para alterar os valores padrão do QasTextTruncate dentro de um componente pai (ex.: QasTableGenerator). O objeto pode ser parcial — apenas as chaves que quiser sobrescrever — e pode ser reativo (ref/computed) para atualização em tempo de execução.

Comportamento e precedência:
- Valores que podem ser aplicados: `typography`.
- Ordem de prioridade: prop passada > valor vindo do `provide` > defaults internos do QasTextTruncate.

1) Provide simples (não reativo)
```js
// Componente pai
provide('textTruncatePropsDefaults', { typography: 'body2' })
// Todos os QasTextTruncate filhos usarão typography 'body2' a menos que a prop typography seja passada.
```

1) Provide reativo com computed (recomendado quando precisa atualizar dinamicamente)
```js
import { computed, provide } from 'vue'

const textTruncateDefaults = computed(() => {
  return { typography: algumLogica.value ? 'body1' : 'body2' }
})

provide('textTruncatePropsDefaults', textTruncateDefaults)
```

Boas práticas:
- Utilize em casos específicos, exemplos de uso: QasTableGenerator.
- Prefira passar um `ref`/`computed` se espera trocar os defaults dinamicamente.
- Não confunda provide com prop: quando a prop é informada no componente filho, ela sempre sobrescreve o valor passado pelo provide.
- Documente no pai quando estiver alterando os defaults (ex.: comentário `@see QasTextTruncate.vue`) para facilitar manutenção.
:::

## Uso

<doc-example file="QasTextTruncate/Basic" title="Básico" />

<doc-example file="QasTextTruncate/InsideTable" title="Dentro da tabela" />

<doc-example file="QasTextTruncate/WithCounter" title="Com contador" />

<doc-example file="QasTextTruncate/WithManyItems" title="Com mais de 12 itens" />

:::warning
Quando for utilizar por slot, não pode haver nenhum elemento englobando o texto.
:::

<doc-example file="QasTextTruncate/DefaultSlot" title="Slot default" />

:::info
- Quando utilizar com badge, é necessário utilizar junto com a propriedade "useObjectList".
- Só são repassados para o QasBadge props que o mesmo aceite.
- Utilize a propriedade "useWrapBadge" quando utilizar fora de tabela em casos que precise quebrar as badges em mais linhas.
:::
<doc-example file="QasTextTruncate/WithBadge" title="Uso com badges" />

:::info
- Ao utilizar a prop "useAlwaysSeeMore", o botão de "Ver mais" sempre aparecerá, mesmo caso não tenha truncate.
- Recomendado utilizar quando for necessário customizar o o dialog de detalhes.
:::
<doc-example file="QasTextTruncate/AlwaysButtonAndCustomDescription" title="Sempre com botão e descrição personalizada" />
