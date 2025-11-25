---
title: useAxios
---

O useAxios é um composable para utilizar para requisições ao invés de utilizar o axios diretamente, ele aborta automaticamente as requests `GET` duplicadas e requests `GET` no `unmounted`.

:::info
###### config
```
errorMessage?: string | (error: *) => string,
successMessage?: string | (error: *) => string,
axiosInstance?: import('axios').AxiosInstance,
immediate?: boolean, // (define se vai auto executar no mounted sem precisar do execute)
shallow?: boolean // (define se vai ser um ref ou shallowRef o data|error)
onSuccess?: (data: import('axios').AxiosResponse) => void,
onError?: (error: import('axios').AxiosError) => void
```
:::

```js
import { useAxios } from 'asteroid'

const {
  data,
  error,

  // auxiliares
  isLoading,
  isFinished,
  isSucceeded,

  // funções
  abort,
  execute
} = useAxios('url-da-request', {
  axiosConfig: { method: 'POST' }, // default é o 'GET'
  config: {
    errorMessage: ({ status }) => status?.text || 'Mensagem de erro',
    successMessage: 'Mensagem de sucesso'
  }
})

await execute({ param: { isActive: true } }) // sobrescreve o axiosConfig
```
