<template>
  <div class="container q-py-lg">
    <div class="q-mb-sm text-body1">
      Clique em uma ação para visualizar o exemplo com loading
    </div>

    <qas-actions-menu v-bind="props" />

    <qas-actions-menu v-bind="propsWithoutSplit" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'ExWithLoading' })

// refs
const loading = ref({
  visibility: false,
  edit: false,
  person: false
})

// computeds
const list = computed(() => {
  return {
    visibility: {
      icon: 'sym_r_visibility',
      label: 'Visualizar',
      handler: () => handleLoading('visibility'),
      loading: loading.value.visibility
    },
    edit: {
      icon: 'sym_r_create',
      label: 'Editar',
      handler: () => handleLoading('edit'),
      loading: loading.value.edit
    },
    person: {
      icon: 'sym_r_person',
      label: 'Perfil',
      handler: () => handleLoading('person'),
      loading: loading.value.person
    },
    actionWithoutPromise: {
      icon: 'sym_r_person',
      label: 'Ação sem loading',
      handler: () => {}
    }
  }
})

const props = computed(() => {
  return {
    list: list.value,
    splitName: 'edit'
  }
})

const propsWithoutSplit = computed(() => {
  return {
    list: list.value
  }
})

// functions
async function handleLoading (fieldKey) {
  loading.value[fieldKey] = true

  await sleepPromise()

  loading.value[fieldKey] = false
}

function sleepPromise () {
  return new Promise(resolve => setTimeout(() => resolve(), 3000))
}
</script>
