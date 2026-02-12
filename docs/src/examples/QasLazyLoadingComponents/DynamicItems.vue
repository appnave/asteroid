<template>
  <div class="container spaced">
    <qas-lazy-loading-components placeholder-height="300px">
      <qas-box v-for="(_, itemIndex) in 20" :key="itemIndex" class="q-mb-lg" :style="styleBox">
        Box {{ itemIndex + 1 }}
      </qas-box>
    </qas-lazy-loading-components>
  </div>
</template>

<script setup>
defineOptions({ name: 'DynamicItems' })

// constants
const styleBox = { height: '300px', width: '300px', background: '#B3E5FC !important' }
</script>
