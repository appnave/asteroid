---
title: promiseHandler
---

Função para lidar com promises, por exemplo requests.

Para requisições HTTP em que a mensagem de erro deve priorizar o retorno do back, utilize o [requestHandler](/helpers/request-handler).

#### Definição
```js
const { data, error } = await promiseHandler(
  promise, // pode ser uma promise um ou array de promise, caso seja um array executará o "Promise.all"
  {
    successMessage, // Mensagem que aparecerá no notify caso a promise seja resolvida com sucesso
    errorMessage, // Mensagem que aparecerá no notify caso a promise seja rejeitada',
    useLoading = true, // adiciona um loading na tela enquanto ocorre a execução da promise (padrão já é true)
    onLoading // callback que retorna em seu parâmetro se a promise esta sendo executada ou não
  }
)

data // resultado da promise caso resolvida, se for rejeitada o valor será "null"
error // resultado da promise caso rejeitada, se for resolvida o valor será "null"
```

#### Uso
```js
import { promiseHandler } from 'asteroid'

const { data, error } = await promiseHandler(
  axios.get('alguma-request'),
  {
    successMessage: 'Item carregado com sucesso',
    errorMessage: 'Ocorreu um erro ao carregar o item',
    useLoading = true,
    onLoading: (isLoading) => {
      this.isLoading = isLoading
    }
  }
)
```

###### Com array de promises

```js
import { promiseHandler } from 'asteroid'

const { data, error } = await promiseHandler(
  [
    axios.get('alguma-request-1'),
    axios.get('alguma-request-2')
  ],
  {
    successMessage: 'Item carregado com sucesso',
    errorMessage: 'Ocorreu um erro ao carregar o item',
    useLoading = true,
    onLoading: (isLoading) => {
      this.isLoading = isLoading
    }
  }
)
```
