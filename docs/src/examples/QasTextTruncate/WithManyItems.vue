<template>
  <div class="container q-gutter-md q-py-lg">
    <qas-text-truncate class="text-negative" dialog-title="Aqui está meu título!" :list :max-visible-item="3" :max-width="310" use-object-list />

    <qas-text-truncate class="text-negative" dialog-title="Aqui está meu título!" :list="normalizedItems" :max-visible-item="3" :max-width="310" />
  </div>
</template>

<script setup>
defineOptions({ name: 'WithManyItems' })

// Com array de objetos
const list = [
  { label: 'Primeiro', color: 'green-8' },
  { label: 'Segundo item', color: 'blue-8', textColor: 'white' },
  { label: 'Terceiro item', color: 'red-8' },
  { label: 'Quarto item', color: 'yellow-8' },
  { label: 'Quinto item', color: 'purple-8' },
  { label: 'Sexto item', color: 'orange-8' },
  { label: 'Sétimo item', color: 'green-8' },
  { label: 'Oitavo item', color: 'blue-8' },
  { label: 'Nono item', color: 'red-8' },
  { label: 'Décimo item', color: 'yellow-8' },
  { label: 'Décimo primeiro item', color: 'purple-8' },
  { label: 'Décimo segundo item', color: 'orange-8' },
  { label: 'Décimo terceiro item', color: 'green-8' },
  { label: 'Décimo quarto item', color: 'blue-8' },
  { label: 'Décimo quinto item', color: 'red-8' },
  { label: 'Décimo sexto item', color: 'yellow-8' },
  { label: 'Décimo sétimo item', color: 'purple-8' },
  { label: 'Décimo oitavo item', color: 'orange-8' },
  { label: 'Décimo nono item', color: 'green-8' },
  { label: 'Vigésimo item', color: 'blue-8' },
  { label: 'Vigésimo primeiro item', color: 'red-8' },
  { label: 'Vigésimo segundo item', color: 'yellow-8' },
  { label: 'Vigésimo terceiro item', color: 'purple-8' },
  { label: 'Vigésimo quarto item', color: 'orange-8' },
  { label: 'Vigésimo quinto item', color: 'green-8' },
  { label: 'Vigésimo sexto item', color: 'blue-8' },
  { label: 'Vigésimo sétimo item', color: 'red-8' },
  { label: 'Vigésimo oitavo item', color: 'yellow-8' },
  { label: 'Vigésimo nono item', color: 'purple-8' },
  { label: 'Trigésimo item', color: 'orange-8' }
]

// Somente um array de strings
const normalizedItems = list.map(item => item.label)
</script>
