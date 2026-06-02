<template>
  <div class="container q-py-lg">
    <qas-map-draw
      ref="mapRef"
      v-model="polygons"
      badge-label-key="name"
      draw-button-label="Desenhar área"
      image-url="https://upload.wikimedia.org/wikipedia/commons/3/3f/Location_map_Mexico_City_2.svg"
      model-key="points"
    >
      <template #polygon-tooltip="context">
        <qas-box class="q-pa-sm">
          Contexto do item:
          <qas-debugger :inspect="[context]" />
          <div class="text-body2 text-grey-10">Polígono</div>

          <div class="column items-start q-gutter-y-sm q-mt-sm">
            <qas-btn icon="sym_r_edit" label="Editar item" variant="primary" @click="editPolygon(context.polygonKey)" />
            <qas-btn icon="sym_r_delete" label="Remover item" variant="secondary" @click="removePolygon(context.polygonKey)" />
          </div>
        </qas-box>
      </template>
    </qas-map-draw>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mapRef = ref(null)
const polygons = ref([])

function editPolygon (polygonKey) {
  mapRef.value.startEditPolygon(polygonKey)
}

function removePolygon (polygonKey) {
  mapRef.value.removePolygon(polygonKey)
}
</script>
