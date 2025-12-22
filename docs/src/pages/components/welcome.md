---
title: QasWelcome
---

Componente de boas-vindas para ser usado na Home dos sistemas.

<doc-api file="welcome/QasWelcome" name="QasWelcome" />

:::tip
##### Propriedade `shortcuts`
```js
[
  {
    title: 'Assistência digital BPO',
    icon: 'sym_r_person_add_alt',
    to: { path: '/components/avatar' }
  },
  {
    title: 'Nova tarefa',
    icon: 'sym_r_edit_calendar',
    to: { path: '/components/avatar' }
  },
  {
    title: 'Troca de base',
    icon: 'sym_r_swap_horiz',
    to: { path: '/components/avatar' }
  },
  {
    title: 'Configurações',
    icon: 'sym_r_settings',
    to: { path: '/components/avatar' }
  }
]
```

É recomendado sempre enviar o `name` da rota ao invés do `path`, no caso na documentação na trabalhamos com name por isto o path.

##### Passando link externo
Para passar um link externo basta passar a propriedade `externalLink` ao invés de `to`

Ex:
```js
[
  {
    title: 'Youtube',
    icon: 'sym_r_youtube_activity',
    externalLink: 'https://www.youtube.com/'
  }
]
:::

## Uso

<doc-example file="QasWelcome/Basic" title="Básico" />

<doc-example file="QasWelcome/ActionsMenu" title="Com QasActionsMenu" />

<doc-example file="QasWelcome/SlotAfterGreeting" title="Acessando after-greeting slot" />
