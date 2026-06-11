<template>
  <div class="container q-py-lg">
    <qas-map-draw
      v-model="polygons"
      v-bind="mapDrawProps"
    />

    <div class="q-mt-md">
      model: <qas-debugger :inspect="[polygons]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

// consts
const mapDrawProps = {
  drawButtonLabel: 'Desenhar área',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Location_map_Mexico_City_2.svg',
  onAreaDrawn
}

// refs
const polygons = ref([])

// functions
function onAreaDrawn (points) {
  alert(`Área desenhada: ${JSON.stringify(points)}`)
}
</script>
