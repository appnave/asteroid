<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <qas-card-image :images :skeleton="showSkeleton" use-header>
        <template #default>
          <div>
            Meu conteúdo
          </div>
        </template>
      </qas-card-image>
    </div>

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageSkeleton' })

// refs
const showSkeleton = ref(true)

// consts
const images = [
  'https://placehold.co/600x400',
  'https://placehold.co/600x400/orange/white',
  'https://placehold.co/600x400/blue/white'
]

// computeds
const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
