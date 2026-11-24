<template>
  <details class="bg-grey-3 q-my-md q-pa-md qas-debugger rounded-borders">
    <summary>Debugger</summary>

    <div class="row">
      <pre v-for="(item, index) in props.inspect" :key="index" class="col q-pa-sm qas-debugger__code scroll">
        {{ item }}
      </pre>
    </div>
  </details>
</template>

<script setup>
defineOptions({ name: 'QasDebugger' })

const props = defineProps({
  inspect: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss">
.qas-debugger {
  &__code {
    max-height: 300px;
  }
}
</style>
