<template>
  <div class="container q-py-lg">
    <qas-page-header :breadcrumbs :skeleton="showSkeleton" title="Titulo do page header" />

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageSkeleton' })

// refs
const showSkeleton = ref(true)

// constws
const breadcrumbs = [
  {
    label: 'Lista de usuários',
    route: { path: '/' }
  },
  {
    label: 'Usuário',
    route: { path: '/' }
  },
  {
    label: 'Nome do usuário',
    route: { path: '/components/page-header' }
  },
  {
    label: 'Detalhes',
    route: { path: '/components/page-header/details' }
  },
  {
    label: 'Mais detalhes',
    route: { path: '/components/page-header/details/more' }
  }
]

// computeds
const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
