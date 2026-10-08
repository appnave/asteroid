---
title: useRequestHandler
---

Composable para requisições do axios feitas manualmente (fora dos componentes de view, como `QasFormView`, `QasListView` e `QasSingleView`, que já tratam suas requisições). Utiliza o [promiseHandler](/helpers/promise-handler) internamente e exibe a mensagem de erro retornada pelo back, seguindo a regra do [getErrorMessage](/helpers/get-error-message).

Para outros tipos de promise, utilize o [promiseHandler](/helpers/promise-handler).

A requisição só é feita ao chamar o `execute`.

#### Definição
```js
const { data, error, isLoading, execute } = useRequestHandler(
  request, // config do axios (ex.: { method, url, params, data }), o "method" é obrigatório
  {
    successMessage, // mensagem do notify de sucesso, só é exibido caso informada. Prioriza o "status.text" retornado pelo back
    errorMessage, // mensagem de erro caso o back não retorne "status.text"
    useNotifyError = true, // exibe o notify de erro
    useLoading = true, // adiciona um loading na tela enquanto ocorre a requisição
    loadingConfig = {}, // configurações do loading do Quasar
    onLoading // callback que retorna em seu parâmetro se a requisição esta sendo executada ou não
  }
)

data // ref com o retorno da requisição, "null" em caso de erro
error // ref com o erro da requisição, "null" em caso de sucesso
isLoading // ref indicando se a requisição está em andamento
execute // função que executa a requisição e retorna { data, error }
```

#### execute
Recebe uma config do axios que é mesclada à config inicial, útil para valores que só existem no momento da execução, como o payload ou uma URL com id (ex.: `execute({ data: payload })` ou ``execute({ url: `sales/${id}` })``).

:::warning
O `method` é obrigatório, informado na config inicial ou na do `execute`. Sem ele, o `execute` lança um erro, evitando que uma ação seja feita como `GET` (padrão do axios) sem perceber.
:::

#### Mensagem de erro
A mensagem é definida pelo [getErrorMessage](/helpers/get-error-message). Requisições `POST`, `PUT` e `PATCH` são tratadas como formulário (`useForm: true`): quando o back retornar erros de campo sem `status.text`, é exibida a mensagem padrão de validação.

#### Uso
```js
import { useRequestHandler } from 'asteroid'

const { isLoading, execute } = useRequestHandler(
  { method: 'post', url: `sales/${saleId}/retry` },
  {
    successMessage: 'Proposta reenviada com sucesso.',
    useLoading: false
  }
)

async function resendProposal () {
  const { error } = await execute()

  if (error) return

  // ...
}
```

###### Enviando o payload no momento da execução

```js
const { execute } = useRequestHandler(
  { method: 'post', url: `/sales/${saleId}/justify` },
  { successMessage: 'Aprovação realizada com sucesso.' }
)

const { error } = await execute({ data: viewState.value.values })
```

###### URL definida no momento da execução

```js
const { execute } = useRequestHandler(
  { method: 'patch', data: { status: 'canceled' } }
)

await execute({ url: `sales/${saleId}` })
```

###### Em componentes Options API

O composable pode ser criado no `data`, onde o `inject` do axios também funciona.

```js
export default {
  data () {
    return {
      cancelRequest: useRequestHandler(
        { method: 'patch', data: { status: 'canceled' } },
        { useLoading: false }
      )
    }
  },

  methods: {
    async cancelSale () {
      const { error } = await this.cancelRequest.execute({ url: `sales/${this.unit.saleUuid}` })

      if (error) return

      // ...
    }
  }
}
```

No template, os refs são acessados sem o `.value` (ex.: `cancelRequest.isLoading`).
