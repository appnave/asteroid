<template>
  <div class="container spaced">
    <div class="q-gutter-x-md">
      <qas-btn v-bind="btnProps" variant="primary" />

      <qas-btn v-bind="btnProps" variant="secondary" />

      <qas-btn v-bind="btnProps" variant="tertiary" />
    </div>

    <div>
      <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageSkeleton' })

// refs
const showSkeleton = ref(true)

// computeds
const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

const btnProps = computed(() => {
  return {
    label: 'Título do botão',
    skeleton: showSkeleton.value
  }
})

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
