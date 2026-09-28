<template>
  <div class="container spaced">
    <qas-header v-bind="headerProps" />

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageSkeleton' })

// refs
const showSkeleton = ref(true)

// computeds
const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

const headerProps = computed(() => {
  return {
    description: 'Algum texto de descrição.',
    skeleton: showSkeleton.value,

    labelProps: {
      label: 'Título do header'
    },

    buttonProps: {
      icon: 'sym_r_add',
      label: 'Novo usuário'
    },

    badges: [
      {
        label: 'Badge 1'
      },
      {
        label: 'Badge 2',
        color: 'red-14',
        textColor: 'white'
      },
      {
        label: 'Badge 3',
        color: 'primary',
        textColor: 'white'
      }
    ]
  }
})

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
