<template>
  <qas-dialog
    v-model="model"
    class="qas-dialog-file-preview-dialog"
    v-bind="dialogProps"
  >
    <template #description>
      <div class="col column no-wrap">
        <template v-if="isPdf">
          <div v-if="isLoading" class="flex flex-center q-py-xl">
            <q-spinner color="grey" size="3em" />
          </div>

          <div v-show="!isLoading">
            <div v-if="!hasError" ref="pdfWrapper" class="column full-width no-wrap overflow-auto q-gutter-y-sm qas-dialog-file-preview__pdf-container" />

            <div v-else class="flex flex-center q-py-xl text-body1 text-grey-7">
              Erro ao carregar PDF.
            </div>
          </div>
        </template>

        <div v-else class="col flex flex-center overflow-hidden">
          <q-spinner v-if="isLoading" color="grey" size="3em" />

          <div v-else-if="hasError" class="text-body1 text-grey-7">
            Erro ao carregar imagem.
          </div>

          <img
            v-show="!isLoading && !hasError"
            ref="imageRef"
            class="qas-dialog-file-preview__image rounded-borders"
            :src="props.url"
            @error="onImageError"
            @load="onImageLoad"
          >
        </div>

        <div class="items-center justify-between q-mt-lg row">
          <div>
            <qas-btn icon="sym_r_download" label="Download" />
          </div>

          <div class="items-center q-gutter-sm row">
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
import * as PDFJs from 'pdfjs-dist'
import QasDialog from '../dialog/QasDialog.vue'

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
  }
})

// models
const model = defineModel({ type: Boolean })

// refs
const imageRef = ref(null)
const pdfWrapper = ref(null)
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
    size: 'lg',
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
      onClick: handleReset
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
/**
 * Adiciona e remove o listener de zoom com o scroll do mouse.
 */
watch(imageRef, onPreviewRefChange)
watch(pdfWrapper, onPreviewRefChange)

/**
 * Reseta o zoom e carrega o PDF quando o dialog é aberto.
 */
watch(model, async value => {
  if (!value) return

  handleReset()
  hasError.value = false
  isLoading.value = !isPdf.value

  if (isPdf.value) await loadPDF()
})

onBeforeUnmount(() => {
  const activeRef = isPdf.value ? pdfWrapper.value : imageRef.value
  activeRef?.parentElement?.removeEventListener('wheel', panzoom.wheelHandler)
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
    panzoom.instance = Panzoom(element, { maxScale: MAX_SCALE, minScale: MIN_SCALE, step: 0.1 })

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

async function loadPDF () {
  if (!props.url) return

  try {
    isLoading.value = true
    hasError.value = false

    // Limpa páginas de uma exibição anterior.
    if (pdfWrapper.value) pdfWrapper.value.innerHTML = ''

    PDFJs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href

    const pdf = await PDFJs.getDocument(props.url).promise

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = document.createElement('canvas')

      canvas.height = viewport.height
      canvas.width = viewport.width

      pdfWrapper.value.appendChild(canvas)

      await renderPage(canvas, page)
    }
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

async function renderPage (canvas, page) {
  await page.render({
    canvasContext: canvas.getContext('2d'),
    viewport: page.getViewport({ scale: 1.5 })
  }).promise
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

function handleReset () {
  panzoom.instance?.reset()
  scale.value = MIN_SCALE
}
</script>

<style lang="scss">
.qas-dialog-file-preview {
  &__pdf-container {
    max-height: 700px;
  }

  &__image {
    cursor: grab;
    display: block;
    max-width: 100%;
    object-fit: contain;
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
