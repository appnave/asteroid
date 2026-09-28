<template>
  <div class="container spaced">
    <qas-lazy-loading-components>
      <qas-box class="q-mb-md" :style="styleBox">
        Primeira box
      </qas-box>

      <!-- atributo pra sobrepor a altura do placeholder(prop placeholderHeight) -->
      <qas-box class="q-mb-md" data-placeholder-height="200px">
        <grid-generator />
      </qas-box>

      <qas-box class="q-mb-md">
        <ex-grid-common-columns />
      </qas-box>
    </qas-lazy-loading-components>
  </div>
</template>

<script setup>
import GridGenerator from '../QasGridGenerator/Basic.vue'
import ExGridCommonColumns from '../QasGridGenerator/ExGridCommonColumns.vue'

defineOptions({ name: 'Basic' })

// constants
const styleBox = { width: '250px', height: '250px' }
</script>
