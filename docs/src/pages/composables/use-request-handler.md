---
title: useRequestHandler
---

Composable para requisições do axios feitas manualmente (fora dos componentes de view, como `QasFormView`, `QasListView` e `QasSingleView`, que já tratam suas requisições). Utiliza o [promiseHandler](/helpers/promise-handler) internamente e exibe a mensagem de erro retornada pelo back, seguindo a regra do [getErrorMessage](/helpers/get-error-message).

Para outros tipos de promise, utilize o [promiseHandler](/helpers/promise-handler).

Por padrão, a requisição só é feita ao chamar o `execute`. Com `immediate: true`, ela é feita ao criar o composable.

#### Definição
```js
const { data, error, isLoading, execute } = useRequestHandler(
  {
    axiosConfig, // config do axios (ex.: { method, url, params, data })
    promiseHandlerConfig: {
      successMessage, // mensagem do notify de sucesso, só é exibido caso informada. Prioriza o "status.text" retornado pelo back
      useLoading = true, // adiciona um loading na tela enquanto ocorre a requisição
      loadingConfig = {}, // configurações do loading do Quasar
      onLoading // callback que retorna em seu parâmetro se a requisição esta sendo executada ou não
    }
  },
  {
    immediate = false // executa a requisição ao criar o composable
  }
)

data // ref com o retorno da requisição, "null" em caso de erro
error // ref com o erro da requisição, "null" em caso de sucesso
isLoading // ref indicando se a requisição está em andamento
execute // função que executa a requisição e retorna { data, error }
```

:::tip
O `successMessage` é tratado pelo próprio composable e não é repassado ao `promiseHandler`. A mensagem de erro é sempre definida pelo [getErrorMessage](/helpers/get-error-message).
:::

#### execute
Recebe uma config do axios que é mesclada ao `axiosConfig` inicial, útil para valores que só existem no momento da execução, como o payload ou uma URL com id (ex.: `execute({ data: payload })` ou ``execute({ url: `sales/${id}` })``).

:::warning
Quando o `method` não é informado, o axios utiliza `GET` por padrão. Informe sempre o `method` no `axiosConfig` ou na config do `execute`.
:::

#### Mensagem de erro
A mensagem é definida pelo [getErrorMessage](/helpers/get-error-message): prioriza o `status.text` retornado pelo back e, caso não exista, utiliza a mensagem padrão com base no método da requisição (`save` para `POST`, `PUT` e `PATCH`, `delete` para `DELETE` e `fetch` para `GET`). Em `POST`, `PUT` e `PATCH` com status 422 sem `status.text`, é exibida a mensagem padrão de validação.

#### Uso
```js
import { useRequestHandler } from 'asteroid'

const { isLoading, execute } = useRequestHandler({
  axiosConfig: { method: 'post', url: `sales/${saleId}/retry` },
  promiseHandlerConfig: {
    successMessage: 'Proposta reenviada com sucesso.',
    useLoading: false
  }
})

async function resendProposal () {
  const { error } = await execute()

  if (error) return

  // ...
}
```

###### Executando ao criar o composable (immediate)

```js
const { data, isLoading } = useRequestHandler(
  {
    axiosConfig: { method: 'get', url: `sales/${saleId}/approvers` },
    promiseHandlerConfig: {
      useLoading: false
    }
  },
  { immediate: true }
)
```

###### Enviando o payload no momento da execução

```js
const { execute } = useRequestHandler({
  axiosConfig: { method: 'post', url: `/sales/${saleId}/justify` },
  promiseHandlerConfig: { successMessage: 'Aprovação realizada com sucesso.' }
})

const { error } = await execute({ data: viewState.value.values })
```

###### URL definida no momento da execução

```js
const { execute } = useRequestHandler({
  axiosConfig: { method: 'patch', data: { status: 'canceled' } }
})

await execute({ url: `sales/${saleId}` })
```

###### Em componentes Options API

O composable pode ser criado no `data`, onde o `inject` do axios também funciona.

```js
export default {
  data () {
    return {
      cancelRequest: useRequestHandler({
        axiosConfig: { method: 'patch', data: { status: 'canceled' } },
        promiseHandlerConfig: { useLoading: false }
      })
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

:::warning
Com `immediate: true` no `data`, a requisição é feita durante o `data`, antes do `created`. Os valores usados no `axiosConfig` (como props) precisam estar disponíveis nesse momento.
:::
