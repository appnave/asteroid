<template>
  <div class="container q-py-lg">
    <qas-box :skeleton="showSkeleton">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique optio cum eaque minima ipsum consequuntur eos laborum, at dignissimos possimus magnam eligendi veritatis saepe ducimus non quos itaque? Consectetur, modi?
    </qas-box>

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

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
