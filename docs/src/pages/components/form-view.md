---
title: QasFormView
---

Componente para C.R.U.D. responsável pela pela criação (Create) e edição (Update).

<doc-api file="form-view/QasFormView" name="QasFormView" />

:::danger
#### useStore
Caso esteja usando "useStore" como "false", e esteja passando a propriedade "entity", o componente tentará criar uma url automaticamente transformando entity em `kebab-case` e concatenando com o id da URL caso exista, é possível sobrescrever passando a prop "url".
:::

:::danger
###### Propriedade "useNotifySuccess"
Desative as notificações de sucesso apenas em situações particulares, como, por exemplo, em um 'stepper' no qual não é apropriado mostrar uma notificação de sucesso enquanto o processo ainda não atingiu a etapa final.
:::

:::warning
Este componente depende do `Vuex`, utiliza módulos com actions, state e getters para manipular/recuperar os dados. Por exemplo, para você utilizar em uma entidade de show de usuários, você **deve** ter um modulo de `users` e dentro de dele ter os seguinte requisitos:
- state: list.
- getters: list e byId.
- actions: fetchSingle, create, replace e update.

Hoje Utilizamos 2 bibliotecas com propósitos diferentes que são compatíveis com o asteroid para lidar com o Vuex, elas são:
[VuexStoreModule](https://github.com/bildvitta/vuex-store-module) e [VuexOffline](https://github.com/bildvitta/vuex-offline).

Para fazer esses exemplos na documentação, estamos utilizando o `VuexOffline`, para saber mais, veja o código fonte da documentação.
:::

:::warning
Estamos utilizando nos exemplos um `custom-id` pois é necessário para conseguir utilizar os mocks de dados, **não** significa que você precisa sempre utiliza-lo para lidar com o id, na verdade na maioria das vezes você não vai precisar do `custom-id`, ele é para quando precisa de um caso de uso mais específico.
:::

:::tip
Este componente serve para lidar com **criação** e **edição** de dados.
:::

:::info
Componente dispara evento `submit-success` sempre que ocorre sucesso no submit, enviando o payload do método interno `submit` + entity do componente, sendo:

```js
{
  id: this.id,
  payload: this.modelValue,
  url: this.url,
  entity: this.entity,
  ...externalPayload
}
```

Exemplo escutando evento fora do componente QasFormView:

```js
window.addEventListener('submit-success', ({ detail: { id, payload, url, entity, ...externalPayload } }) => {
  // faça alguma coisa.
})
:::

## Uso
<doc-example file="QasFormView/Basic" title="Básico" />

Aqui está alguns exemplos de como normalmente utilizamos este componente, lembrando que isto não é uma regra, porém na maioria das vezes você vai se deparar com códigos semelhantes a este.

<doc-example file="QasFormView/Create" title="Modo de criação (create)" />

<doc-example file="QasFormView/Edit" title="Modo de edição (replace)" />

:::tip
O callback do `beforeSubmit` recebe 2 parâmetros, `:before-submit="onBeforeSubmit({ payload, resolve })"`

##### payload: `Object` -> { id, payload, url }
Retorna `id`, `payload` e `url` que serão enviados por parâmetros para a action do submit.

##### resolve: `Function` -> resolve({ ...payload })
Função que executa o método `submit` dentro do `QasFormView`, você pode enviar como parâmetro algum payload para ser enviada para a action de submit, adicionando ou sobrescrevendo os parâmetros atuais.
Por exemplo, sobrescrever a url enviada para a action:

```js
resolve({ url: 'minha-url-personalizada' })
```

Agora ao fazer o submit, o valor da url enviada para a action do submit será `minha-url-personalizada`.
:::

<doc-example file="QasFormView/BeforeSubmit" title="Controlando submit" />

:::tip
O callback do `beforeFetch` recebe 2 parâmetros, `:before-submit="onBeforeSubmit({ payload, resolve })"`

##### payload: `Object` -> { id, payload, url }
Retorna `form`, `id`, `url` que serão enviados por parâmetros para a action do `fetchSingle`.

##### resolve: `Function` -> resolve({ ...payload })
Função que executa o método `fetch` dentro do `QasFormView`, você pode enviar como parâmetro algum payload para ser enviada para a action de fetch, adicionando ou sobrescrevendo os parâmetros atuais.
Por exemplo, sobrescrever a url enviada para a action:

```js
resolve({ url: 'minha-url-personalizada' })
```

Agora ao fazer o fetch, o valor da url enviada para a action do fetchSingle será `minha-url-personalizada`.
:::

<doc-example file="QasFormView/BeforeFetch" title="Controlando fetch" />

