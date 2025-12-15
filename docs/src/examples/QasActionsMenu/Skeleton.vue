<template>
  <div class="container q-gutter-y-md q-py-lg">
    <qas-actions-menu v-bind="props1" />

    <qas-actions-menu v-bind="props2" />

    <qas-actions-menu v-bind="props3" />

    <qas-actions-menu v-bind="props4" />

    <qas-btn :label="buttonLabel" @click="toggleSkeleton" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

defineOptions({ name: 'PageSkeleton' })

const showSkeleton = ref(true)

// consts
const visibility = {
  icon: 'sym_r_visibility',
  label: 'Visualizar'
}

const edit = {
  icon: 'sym_r_edit',
  label: 'Editar'
}

// computeds
const props1 = computed(() => {
  return {
    skeleton: showSkeleton.value,
    list: { visibility }
  }
})

const props2 = computed(() => {
  return {
    skeleton: showSkeleton.value,
    list: { visibility, edit }
  }
})

const props3 = computed(() => {
  return {
    skeleton: showSkeleton.value,
    list: { visibility, edit },
    splitName: 'edit'
  }
})

const props4 = computed(() => {
  return {
    skeleton: showSkeleton.value,
    list: {
      visibility,
      edit,
      delete: {
        icon: 'sym_r_delete',
        label: 'Excluir'
      }
    },
    splitName: 'nonexistent'
  }
})

const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

// functions
function toggleSkeleton () {
  showSkeleton.value = !showSkeleton.value
}
</script>
