<template>
  <div class="container q-py-lg">
    <qas-box :loading="isLoading">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique optio cum eaque minima ipsum consequuntur eos laborum, at dignissimos possimus magnam eligendi veritatis saepe ducimus non quos itaque? Consectetur, modi?
    </qas-box>

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageLoading' })

// refs
const isLoading = ref(true)

// computeds
const buttonLabel = computed(() => isLoading.value ? 'Desativar loading' : 'Ativar loading')

// functions
function onClick () {
  isLoading.value = !isLoading.value
}
</script>
