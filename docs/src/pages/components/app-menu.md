---
title: QasAppMenu
---

Model do componente, controla quando o menu lateral é aberto e fechado.

<doc-api file="app-menu/QasAppMenu" name="QasAppMenu" />

:::warning
##### Chat

Use a propriedade `useChat` para controlar se o componente vai ter ou não o chat, se tiver, precisa seguir:

- Adicione a env `GLEAP` no `quasar.config.js`;
- É necessário ter as informações de usuário no local storage na chave `user`, e os dados de usuário sendo atualizado pelo postMessage `type === 'updateUser'`, as informações que devem contem em user:
  - uuid
  - name
  - email
  - callingCode
  - phone
  - companyLink
  - companyLinksOptions
  - mainCompanyOptions (somente na v2 do /me)
  - currentMainCompany (somente na v2 do /me)
:::

:::info
Não adicione prop "to" nos itens do menu que tem "children", é por ela que validamos se mostramos ou não a label no menu caso o children fique vazio (por questões de permissionamento).
:::

## Uso
<doc-example file="QasAppMenu/Basic" title="Básico" />

