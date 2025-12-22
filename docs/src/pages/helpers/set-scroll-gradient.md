---
title: setScrollGradient
---

Helper para adicionar um gradiente de scroll em um elemento.

:::info
- Adiciona gradiente no final (bottom|right) caso exista uma área de scroll ou o scroll não esteja no final.
- Adiciona gradiente no incio (top|left) caso o scroll não esteja no inicio.
- O Helper já escuta por mudanças de tamanho dentro do container de scroll para recalcular os tamanhos, então não é necessário adicionar algum watch em props para atualizar caso existam novos itens dentro do container.
- toda vez que "initializeScrollGradient" é chamado ele executa o "removeScrollGradient".
:::

```html
<template>
  <div ref="scrollArea">
    scroll area...
  </div>
</template>

<script setup>
import { useTemplateRef, onMounted, onBeforeUnmounted } from 'vue'
import { setScrollGradient } from 'asteroid'

const scrollAreaRef = useTemplateRef('scrollArea')

const { initializeScrollGradient, removeScrollGradient } = setScrollGradient({
  style: {
    size: '40px', // default
    color: '#FFFFFF' // default (precisa ser um rgb|rgba|hexadecimal)
  },

  orientation: 'y' // default
})

onMounted(() => initializeScrollGradient(initializeScrollGradient.value.$el))
onBeforeUnmounted(() => removeScrollGradient(initializeScrollGradient.value.$el))
</script>
```

<doc-print title="Imagem de exemplo - eixo Y" width="100px" :src="require('assets/prints/scroll-gradient-y.png')" />
<doc-print title="Imagem de exemplo - eixo X" width="400px" class="q-mt-lg" :src="require('assets/prints/scroll-gradient-x.png')" />
