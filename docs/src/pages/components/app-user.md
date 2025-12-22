---
title: QasAppUser
---

Componente utilizado no `QasAppBar` e `QasAppMenu` para exibir o nome do usuário e a foto de perfil.

<doc-api file="app-user/QasAppUser" name="QasAppUser" />

:::warning
##### process.env.ME_VERSION
Adicione a env `ME_VERSION` obrigatoriamente no `quasar.config.js`, com os dois possíveis valores `1|2` sendo number e não string.

A funcionalidade de troca de vínculo de empresa é ativada quando existe mais de 1 opção na prop `companyProps.options`:
- Quando existe apenas uma opção, é exibido o select como forma de informação de vinculo atual.
- Se estiver na nova versão antiga do /me (versão 1), é necessário adicionar o valor `1` na env `ME_VERSION` no projeto e adicionar nos options o "companyLinksOptions".
- Se estiver na nova versão do /me (versão 2), é necessário adicionar o valor `2` na env `ME_VERSION` no projeto e adicionar nos options o "mainCompanyOptions".

**Endpoint executado ao trocar de empresa: `PATCH -> users/me`**

**ME_VERSION: 1** -> Enviando para o body da requisição o novo `companies`.

```js
// body
{
  companies: 'xpto'
}
```

**ME_VERSION: 2** -> Enviando para o body da requisição o novo `currentMainCompany`.

```js
// body
{
  currentMainCompany: 'xpto'
}
```
:::

:::danger
##### Propriedade "useDataOnSmallScreen"
Esta propriedade é usada para controle dentro do `QasAppMenu` e `QasAppBar`, não altere sem a necessidade extrema.
:::

## Uso
<doc-example file="QasAppUser/Basic" title="Básico" />
