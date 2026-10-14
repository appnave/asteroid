---
title: getErrorMessage
---

Retorna a mensagem de erro que deve ser exibida ao usuário a partir do erro de uma requisição do axios, priorizando a mensagem retornada pelo back (`status.text`). Quando o back não retorna mensagem, utiliza a mensagem padrão com base no método da requisição (`error.config.method`). É a mesma regra utilizada pelo [useRequestHandler](/composables/use-request-handler) e pelos componentes da lib.

#### Definição
```js
const message = getErrorMessage(error) // erro da requisição (axios)
```

#### Regra
| Situação | POST / PUT / PATCH | DELETE | GET |
|---|---|---|---|
| Sem resposta (timeout, rede) ou status 5xx | "Não conseguimos salvar as informações…" | "Não conseguimos excluir as informações…" | "Ops… Não conseguimos acessar as informações…" |
| Back retornou `status.text` | `status.text` | `status.text` | `status.text` |
| Status 422 sem `status.text` | "Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente." | "Não conseguimos excluir as informações…" | "Ops… Não conseguimos acessar as informações…" |
| Demais casos | "Não conseguimos salvar as informações…" | "Não conseguimos excluir as informações…" | "Ops… Não conseguimos acessar as informações…" |

As mensagens ficam no arquivo `shared/error-messages.js`.

:::tip
Em erros 5xx o texto do back não é exibido, pois ele é genérico em produção e técnico (mensagem da exceção) nos demais ambientes.
:::

:::warning
O método é lido de `error.config.method`, que o axios sempre preenche (com `get` por padrão). Erros que não vêm do axios não possuem `config` e recebem a mensagem do `GET`.
:::

#### Uso
```js
import { getErrorMessage, NotifyError } from 'asteroid'

try {
  await axios.post('alguma-request', payload)
} catch (error) {
  NotifyError(getErrorMessage(error))
}
```
