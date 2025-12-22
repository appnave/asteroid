<template>
  <qas-stepper ref="stepper" v-model="model" v-bind="stepperProps">
    <template #default>
      <q-step v-for="(step, stepIndex) in props.steps" :key="stepIndex" :done="isDone(stepIndex)" :name="getStepName({ step, stepIndex })" v-bind="stepPropsList[stepIndex]">
        <component :is="step.component" />
      </q-step>
    </template>
  </qas-stepper>
</template>

<script setup>
import QasStepper from '../stepper/QasStepper.vue'

import { ref, provide, computed } from 'vue'

defineOptions({ name: 'QasStepperFormView' })

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },

  formViewProps: {
    type: Object,
    default: () => ({})
  },

  stepperProps: {
    type: Object,
    default: () => ({})
  }
})

defineExpose({ setStepProps })

const model = defineModel({ type: [Number, String], default: 1 })

const values = ref({})
const stepPropsList = ref([])
const stepper = ref(null)

setStepProps({ payload: [...props.steps.map(({ stepProps }) => stepProps)] })

const defaultFormViewProps = computed(() => {
  return {
    useBoundary: false,
    useNotifySuccess: false,
    ...props.formViewProps
  }
})

function setStepProps ({ step, payload }) {
  if (step) {
    stepPropsList.value[step - 1] = payload
  } else {
    stepPropsList.value = payload
  }
}

/*
* - Merge do payload com objetivo de enviar o payload completo de todos steps no stepper final
* - É possível ir para um step especifico ou somente ir para o próximo.
*/
function nextStep ({ payload = {} }) {
  Object.assign(values.value, payload)

  stepper.value.next()
}

function isDone (stepIndex) {
  return model.value > stepIndex + 1
}

function getStepName ({ step, stepIndex }) {
  return step.name || stepIndex + 1
}

provide('stepper', {
  stepperModel: model,
  formViewProps: defaultFormViewProps,
  goTo: step => stepper.value.goTo(step),
  next: nextStep,
  previous: () => stepper.value.previous(),
  setStepProps,
  stepsValues: values
})
</script>
