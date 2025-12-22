<template>
  <div :key="counterKey" class="qas-map">
    <component :is="mapsComponents.GMapMap" :center="props.centerPosition" class="qas-map__draw" :zoom="props.zoom">
      <component :is="mapsComponents.GMapMarker" v-for="(marker, index) in props.markers" :key="index" :draggable="marker.draggable" :icon="marker.icon" :position="marker.position" @dragend="updatePosition" @mouseout="closePopup" @mouseover="openPopup(marker, index)">
        <component :is="mapsComponents.GMapInfoWindow" :opened="canShowPopup(index)">
          <div class="text-weight-bold">
            {{ marker.title }}
          </div>

          <div>
            {{ marker.description }}
          </div>
        </component>
      </component>
    </component>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue'
import { handleProcess } from '../../helpers'

defineOptions({ name: 'QasMap' })

const props = defineProps({
  centerPosition: {
    type: Object,
    default: () => ({})
  },

  markers: {
    type: Array,
    default: () => []
  },

  zoom: {
    type: Number,
    default: 17
  },

  usePopup: {
    type: Boolean
  }
})

// emits
const emit = defineEmits(['update-position'])

// refs
const isPopupDisplayed = ref(false)
const indexMarker = ref(null)
const counterKey = ref(0)

// consts
/**
 * Se usar diretamente o componente no template, o Vue não consegue interpretar
 * corretamente os componentes do plugin e gera um erro.
 * Por isso, usamos <component :is /> para renderizar dinamicamente.
 */
const mapsComponents = {
  GMapMap: 'g-map-map',
  GMapMarker: 'g-map-marker',
  GMapInfoWindow: 'g-map-info-window'
}

// hooks
onBeforeMount(initializeMap)

// functions
function canShowPopup (index) {
  return isPopupDisplayed.value && props.usePopup && index === indexMarker.value
}

function closePopup () {
  isPopupDisplayed.value = false
}

function openPopup ({ title, description }, index) {
  indexMarker.value = index
  isPopupDisplayed.value = !!(title || description)
}

function updatePosition (mouseEvent) {
  emit('update-position', mouseEvent.latLng.toJSON())
}

async function initializeMap () {
  const instance = getCurrentInstance()
  const app = instance?.appContext.app

  if (!app) return

  // Importa o plugin dinamicamente
  const { default: VueGoogleMaps } = await import('@fawmi/vue-google-maps')

  const key = handleProcess(() => process.env.MAPS_API_KEY)

  app.use(VueGoogleMaps, {
    load: { libraries: 'places', key }
  })

  // Força o re-render do componente para garantir que o mapa seja inicializado
  counterKey.value += 1
}
</script>

<style lang="scss">
.qas-map {
  &__draw {
    height: 300px !important;
    width: 100%;
  }
}
</style>
