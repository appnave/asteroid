<template>
  <qas-checkbox dense :disable="props.readonly" :label="props.result.label" :model-value="props.useActive" @update:model-value="onUpdateModelValue(result)" />
</template>

<script setup>
import QasCheckbox from '../../checkbox/QasCheckbox.vue'

defineOptions({ name: 'PvSelectListCheckbox' })

const props = defineProps({
  result: {
    type: Object,
    default: () => ({})
  },

  readonly: {
    type: Boolean
  },

  useActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'remove'])

function onUpdateModelValue () {
  return emit(props.useActive ? 'remove' : 'add', props.result)
}
</script>
