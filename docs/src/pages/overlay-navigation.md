---
title: Navegação em overlay (drawer)
---

## Visão rápida

Overlays são rotas que abrem em um painel lateral sem fechar a tela atual. Pense neles como duas camadas trabalhando juntas:

- **Background** continua visível ao fundo.
- **Overlay** mostra o conteúdo novo por cima.

Use quando quiser manter o contexto do usuário e evitar recarregar páginas inteiras.

**Benefícios em poucas palavras:** fluxo mais rápido, histórico inteligente e possibilidade de comunicar overlay e background entre si.

---

## Comece em 3 passos

1. **Marque as rotas** que participam do overlay com `meta.useOverlay = true`.
2. **Gere links** usando `getOverlayRoute()` em vez de montar a rota manualmente.
3. **Deixe o boot `overlay-navigation` fazer o resto**: histórico, fallback de background e troca de componentes.

```js
// routes/users.js
export default [
  {
    name: 'UsersList',
    path: '/users',
    meta: { useOverlay: true },
    component: () => import('./pages/UsersList.vue')
  },
  {
    name: 'UsersEdit',
    path: '/users/:id',
    meta: { useOverlay: true },
    component: () => import('./pages/UsersEdit.vue')
  }
]
```

```html
<!-- Lista de usuários chamando o overlay -->
<script setup>
import { ref } from 'vue'
import { useOverlayNavigation } from 'asteroid'

const { getOverlayRoute } = useOverlayNavigation()
const users = ref([{ id: 1, name: 'João' }])

function openEdit(user) {
  return getOverlayRoute({ name: 'UsersEdit', params: { id: user.id } })
}
</script>

<template>
  <qas-card v-for="user in users" :key="user.id" :title="user.name">
    <qas-btn :to="openEdit(user)" label="Editar" color="primary" />
  </qas-card>
</template>
```

---

## Cenários rápidos

### 1. Lista ➡️ detalhes
Abra detalhes sem sair da listagem. Ao fechar o overlay, você volta para a lista exatamente como deixou.

### 2. Multietapas no overlay
Rotas filhas herdam `useOverlay`. Ex.: `/customers/:id` pode ter `/info`, `/orders`, `/settings` todas no mesmo painel.

### 3. Comunicação entre camadas
O background pode avisar o overlay (e vice-versa) sobre atualizações de dados com `triggerBackgroundChange` e `triggerOverlayChange`.

```html
<script setup>
const { onBackgroundChange, triggerOverlayChange } = useOverlayNavigation()

onBackgroundChange((payload) => {
  console.log('Background avisou:', payload)
})

function notifyBackground() {
  triggerOverlayChange({ action: 'refresh-list' })
}
</script>
```

---

## Dicas de configuração

- **Rota em background fixa:** use `meta.backgroundOverlayName` para escolher manualmente qual rota fica por trás.
- **Bloquear saída:** `toggleCanLeaveOverlay(false)` evita fechar o painel durante edições importantes.
- **Fallback automático:** se não houver `backgroundOverlay`, o boot tenta achar uma rota base (por exemplo, `/customers`).

---

## Checklist final

- [ ] Rotas com `meta.useOverlay = true`.
- [ ] Links criados com `getOverlayRoute()`.
- [ ] Componentes usando `useOverlayNavigation()` para controlar histórico e eventos.

Com isso, a experiência de overlay fica previsível, rápida e fácil de manter.
