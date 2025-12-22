<template>
  <div class="container q-py-lg">
    <qas-text-truncate class="text-negative" dialog-title="Aqui está meu título!" :list :max-visible-item="2" :max-width="100" use-badge use-object-list />
  </div>
</template>

<script setup>
defineOptions({ name: 'WithBadge' })

const list = [
  {
    label: 'Primeiro item',
    color: 'green-8'
  },
  {
    label: 'Segundo item',
    color: 'blue-8',
    textColor: 'white'
  },
  {
    label: 'Terceiro item',
    color: 'red-8'
  },
  {
    label: 'Quarto item',
    color: 'yellow-8'
  },
  {
    label: 'Quinto item',
    color: 'purple-8'
  },
  {
    label: 'Sexto item',
    color: 'orange-8'
  }
]
</script>
