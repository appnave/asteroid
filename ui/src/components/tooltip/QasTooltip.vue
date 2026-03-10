<template>
  <q-tooltip v-bind="tooltipProps" class="qas-tooltip text-caption">
    <qas-breakline :text="props.text" />
  </q-tooltip>
</template>

<script setup>
import QasBreakline from '../breakline/QasBreakline.vue'

defineOptions({ name: 'QasTooltip' })

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

// consts
const tooltipProps = {
  anchor: 'center right',
  self: 'center left',
  offset: [5, 5],
  maxWidth: '300px'
}
</script>

<style lang="scss">
.qas-tooltip {
  background-color: $grey-10;
  color: white;
}

.body--dark {
  .qas-tooltip {
    background-color: $grey-2;
    color: $grey-10;
  }
}
</style>
