<template>
  <qas-dialog
    v-model="model"
    class="qas-dialog-file-preview-dialog"
    v-bind="dialogProps"
  >
    <template #description>
      <div class="col column no-wrap">
        <!-- PDF -->
        <iframe
          v-if="isPdf"
          class="qas-dialog-file-preview__pdf-iframe"
          :src="props.url"
        />

        <!-- Image -->
        <div v-else class="col flex flex-center overflow-hidden">
          <div v-if="hasError" class="flex flex-center q-py-xl">
            <span class="text-body1 text-grey-7">Erro ao carregar imagem.</span>
          </div>

          <template v-else>
            <q-spinner v-if="isLoading" color="grey" size="3em" />

            <img
              v-show="!isLoading"
              ref="imageRef"
              class="block qas-dialog-file-preview__image rounded-borders"
              fit="contain"
              :src="props.url"
              @error="onImageError"
              @load="onImageLoad"
            >
          </template>
        </div>

        <!-- Controls (zoom, download) -->
        <div class="items-center justify-between q-mt-lg row">
          <div>
            <qas-btn icon="sym_r_download" label="Download" @click="handleDownload" />
          </div>

          <div v-if="!isPdf" class="items-center q-gutter-sm row">
            <qas-btn v-bind="zoomButtonsProps.zoomOut" />

            <q-slider
              class="qas-dialog-file-preview__slider"
              v-bind="sliderProps"
            />

            <qas-btn v-bind="zoomButtonsProps.zoomIn" />

            <qas-btn v-bind="zoomButtonsProps.zoomReset" />
          </div>
        </div>
      </div>
    </template>
  </qas-dialog>
</template>

<script setup>
import Panzoom from '@panzoom/panzoom'
import QasDialog from '../dialog/QasDialog.vue'
import downloadFile from '../../helpers/download-file'

import { computed, ref, watch, onBeforeUnmount } from 'vue'

defineOptions({ name: 'QasDialogFilePreview' })

const props = defineProps({
  fileType: {
    type: String,
    default: ''
  },

  title: {
    type: String,
    default: ''
  },

  url: {
    type: String,
    default: ''
  },

  customDownload: {
    type: Function,
    default: null
  }
})

// models
const model = defineModel({ type: Boolean })

// refs
const imageRef = ref(null)
const isLoading = ref(false)
const hasError = ref(false)
const scale = ref(1)

// consts
const MIN_SCALE = 1
const MAX_SCALE = 10

const panzoom = { instance: null, wheelHandler: null }

// computeds
const isPdf = computed(() => {
  if (props.fileType === 'pdf') return true

  return props.url.split('?')[0].endsWith('.pdf')
})

const dialogProps = computed(() => {
  return {
    title: props.title,
    size: 'xl',
    ok: false,
    cancel: false
  }
})

const zoomButtonsProps = computed(() => {
  return {
    zoomOut: {
      disable: scale.value <= MIN_SCALE,
      icon: 'sym_r_zoom_out',
      size: 'lg',
      variant: 'tertiary',
      color: 'grey-10',
      onClick: zoomOut
    },

    zoomIn: {
      disable: scale.value >= MAX_SCALE,
      icon: 'sym_r_zoom_in',
      size: 'lg',
      variant: 'tertiary',
      color: 'grey-10',
      onClick: zoomIn
    },

    zoomReset: {
      icon: 'sym_r_youtube_searched_for',
      size: 'lg',
      variant: 'tertiary',
      color: 'grey-10',
      onClick: resetZoom
    }
  }
})

const sliderProps = computed(() => {
  return {
    color: 'primary',
    max: MAX_SCALE * 100,
    min: MIN_SCALE * 100,
    modelValue: scale.value * 100,
    step: 1,
    'onUpdate:modelValue': handleSliderZoom
  }
})

// hooks
watch(imageRef, onPreviewRefChange)

watch(model, value => {
  if (!value || isPdf.value) return

  resetZoom()
  isLoading.value = true
})

onBeforeUnmount(() => {
  imageRef.value?.parentElement?.removeEventListener('wheel', panzoom.wheelHandler)
  panzoom.instance?.destroy()
})

// functions
function onImageLoad () {
  isLoading.value = false
}

function onImageError () {
  isLoading.value = false
  hasError.value = true
}

function onPreviewRefChange (element, oldElement) {
  // Cleanup: chamado quando o elemento anterior sai do DOM (ex: dialog fechado ou src trocado).
  if (oldElement) {
    // Remove o listener de zoom via scroll do mouse no container pai para não vazar memória.
    oldElement.parentElement?.removeEventListener('wheel', panzoom.wheelHandler)

    // Destrói a instância do panzoom, removendo todos os event listeners internos que ele criou.
    panzoom.instance?.destroy()

    // Limpa a referência para evitar que o objeto fique preso na memória após destruído.
    panzoom.instance = null

    // Volta o scale para o valor inicial para que o slider fique na posição correta na próxima abertura.
    scale.value = MIN_SCALE
  }

  // Setup: chamado quando um novo elemento entra no DOM.
  if (element) {
    // Cria a instância do panzoom no <img>, habilitando pan (arrastar) e zoom programático.
    panzoom.instance = Panzoom(element, { maxScale: MAX_SCALE, minScale: MIN_SCALE, step: 0.5 })

    // Guarda o handler de zoom via scroll — o panzoom expõe esse método pronto para uso como listener.
    panzoom.wheelHandler = panzoom.instance.zoomWithWheel

    /**
     * Registra o zoom via scroll no container pai (não no <img>) porque o scroll no próprio <img>
     * é cancelado pelo panzoom.
     */
    element.parentElement.addEventListener('wheel', panzoom.wheelHandler)

    // Escuta o evento nativo do panzoom que dispara a cada mudança de escala para manter o slider sincronizado.
    element.addEventListener('panzoomzoom', ({ detail }) => {
      scale.value = detail.scale
    })
  }
}

function zoomIn () {
  panzoom.instance?.zoomIn()
}

function zoomOut () {
  panzoom.instance?.zoomOut()
}

function handleSliderZoom (value) {
  panzoom.instance?.zoom(value / 100)
}

function resetZoom () {
  panzoom.instance?.reset()
  scale.value = MIN_SCALE
}

function handleDownload () {
  props.customDownload
    ? props.customDownload(props.url)
    : downloadFile({ url: props.url, fileName: props.fileName })
}
</script>

<style lang="scss">
.qas-dialog-file-preview {
  &__pdf-iframe {
    border: none;
    height: 700px;
    width: 100%;
  }

  &__image {
    cursor: grab;
    max-width: 100%;
    user-select: none;

    &:active {
      cursor: grabbing;
    }
  }

  &__slider {
    width: 120px;
  }
}
</style>
