---
title: getErrorMessage
---

Retorna a mensagem de erro que deve ser exibida ao usuário a partir do erro de uma requisição, priorizando a mensagem retornada pelo back (`status.text`). É a mesma regra utilizada pelo [useRequestHandler](/composables/use-request-handler) e pelos componentes da lib.

#### Definição
```js
const message = getErrorMessage(
  error, // erro da requisição (axios)
  {
    defaultMessage, // mensagem utilizada caso o back não retorne "status.text"
    useForm = false // quando true e o back retornar erros de campo sem "status.text", retorna a mensagem padrão de validação
  }
)

message // string com a mensagem ou "null" quando não deve ser exibida mensagem
```

#### Regra
| Situação | Retorno |
|---|---|
| Requisição cancelada ou status 401 | `null` (o 401 já é tratado pelo hub) |
| Sem resposta (timeout, rede) ou status 5xx | "Ops… Tivemos uma instabilidade. Por favor, tente novamente em alguns minutos." |
| Back retornou `status.text` | `status.text` |
| `useForm: true` e o back retornou `errors` | "Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente." |
| Demais casos | `defaultMessage` ou "Não conseguimos concluir a solicitação. Por favor, tente novamente em alguns minutos." |

:::tip
Em erros 5xx o texto do back não é exibido, pois ele é genérico em produção e técnico (mensagem da exceção) nos demais ambientes.
:::

#### Uso
```js
import { getErrorMessage, NotifyError } from 'asteroid'

try {
  await axios.post('alguma-request')
} catch (error) {
  const message = getErrorMessage(error, { defaultMessage: 'Não conseguimos salvar as informações.' })

  if (message) NotifyError(message)
}
```
