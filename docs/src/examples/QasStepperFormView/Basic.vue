<template>
  <div class="container spaced">
    <qas-stepper-form-view v-model="model" :form-view-props="formViewProps" :steps="steps" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FirstStep from './FirstStep.vue'
import SecondStep from './SecondStep.vue'

defineOptions({ name: 'Basic' })

const model = ref(1)

const formViewProps = {
  entity: 'users',
  mode: 'create'
}

const steps = computed(() => {
  return [
    {
      stepProps: {
        title: 'Página 1',
        caption: '20/04/2024',
        prefix: 1
      },
      component: FirstStep
    },
    {
      stepProps: {
        title: 'Página 2',
        prefix: 2
      },
      component: SecondStep
    }
  ]
})
</script>
