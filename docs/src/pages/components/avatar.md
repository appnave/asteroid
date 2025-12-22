---
title: QasAvatar
---

Cria um elemento escalável e colorido que pode ter texto, ícone ou imagem em sua forma. Usa como base o componente [QAvatar](https://quasar.dev/vue-components/avatar#introduction).

<doc-api file="avatar/QasAvatar" name="QasAvatar" />

:::info
A prioridade de exibição do avatar é a imagem, caso não exista, será exibido o título, caso também não exista, será exibido o ícone.
> **image > title > icon**
:::

:::info
Existem cores pré definidas que aplicam cor de fundo, é possível trocar a cor de texto apenas de cores que não fazem parte das pré definidas.

```js
// chave: fundo | valor: texto
const colors = {
  [AvatarColors.Primary]: 'white',
  [AvatarColors.SecondaryContrast]: 'primary',
  [AvatarColors.Grey4]: 'grey-8',
  [AvatarColors.Red14]: 'white'
}
```

Porém só **deve** trocar a cor da font em casos realmente necessários.
:::

## Uso

<doc-example file="QasAvatar/Basic" title="Variações de cores" />
<doc-example file="QasAvatar/Image" title="Com imagem" />
<doc-example file="QasAvatar/Title" title="Com título" />
<doc-example file="QasAvatar/Icon" title="Com ícone" />
