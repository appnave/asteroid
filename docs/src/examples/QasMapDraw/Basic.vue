<template>
  <div class="container q-py-lg">
    <qas-map-draw
      v-model="polygons"
      draw-button-label="Desenhar área"
      image-url="https://upload.wikimedia.org/wikipedia/commons/3/3f/Location_map_Mexico_City_2.svg"
      @area-drawn="onAreaDrawn"
    />

    <div class="q-mt-md">
      model: <qas-debugger :inspect="[polygons]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

const polygons = ref([])

function onAreaDrawn (points) {
  console.log('Área desenhada:', points)
}
</script>
