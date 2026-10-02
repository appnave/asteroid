---
title: requestHandler
---

Função para lidar com requisições HTTP. Utiliza o [promiseHandler](/helpers/promise-handler) internamente e trata o notify de erro e sucesso priorizando a mensagem retornada pelo back (`status.text`).

Para promises que não são requisições, utilize o `promiseHandler`.

#### Definição
```js
const { data, error } = await requestHandler(
  promise, // pode ser uma promise, uma função que retorna uma promise ou um array de promises (executará o "Promise.all")
  {
    successMessage, // Mensagem do notify de sucesso, só é exibido caso informada. Prioriza o "status.text" retornado pelo back
    errorMessage, // Mensagem do notify de erro caso o back não retorne "status.text" (padrão: "Não conseguimos concluir a solicitação...")
    useForm = false, // Quando true e o back retornar erros de campo sem "status.text", exibe a mensagem padrão de validação
    useLoading = true, // adiciona um loading na tela enquanto ocorre a execução da promise (padrão já é true)
    loadingConfig = {}, // configurações do loading do Quasar
    onLoading // callback que retorna em seu parâmetro se a promise esta sendo executada ou não
  }
)

data // resultado da promise caso resolvida, se for rejeitada o valor será "null"
error // resultado da promise caso rejeitada, se for resolvida o valor será "null"
```

#### Mensagem de erro
O notify de erro é sempre exibido, seguindo esta ordem de prioridade:

| Situação | Mensagem exibida |
|---|---|
| Sem resposta (timeout, rede) ou status 5xx | "Ops… Tivemos uma instabilidade. Por favor, tente novamente em alguns minutos." |
| Back retornou `status.text` | `status.text` |
| `useForm: true` e o back retornou `errors` | "Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente." |
| Demais casos | `errorMessage` ou "Não conseguimos concluir a solicitação. Por favor, tente novamente em alguns minutos." |

:::tip
Em erros 5xx o texto do back não é exibido, pois ele é genérico em produção e técnico (mensagem da exceção) nos demais ambientes.
:::

#### Uso
```js
import { requestHandler } from 'asteroid'

const { data, error } = await requestHandler(
  axios.post('sales/123/retry'),
  {
    successMessage: 'Proposta reenviada com sucesso.',
    errorMessage: 'Não conseguimos reenviar a proposta. Por favor, tente novamente em alguns minutos.',
    useLoading: false,
    onLoading: isLoading => {
      this.isLoading = isLoading
    }
  }
)
```

###### Em formulários

```js
import { requestHandler } from 'asteroid'

const { error } = await requestHandler(
  axios.post('customers', values),
  {
    errorMessage: 'Não conseguimos salvar as informações. Por favor, tente novamente em alguns minutos.',
    useForm: true
  }
)

if (error) {
  errors.value = error.response?.data?.errors
}
```
