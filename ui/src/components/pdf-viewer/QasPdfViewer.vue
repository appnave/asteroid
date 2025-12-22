<template>
  <div class="qas-pdf-viewer">
    <div class="border-grey qas-pdf-viewer__container">
      <!-- Estado de Loading: Exibe spinner e mensagem enquanto carrega o PDF -->
      <div
        v-if="isLoading"
        class="items-center justify-center q-my-md row"
      >
        <q-spinner
          color="grey"
          size="3em"
        />

        <div class="full-width q-mt-md text-body2 text-center">
          Carregando PDF...
        </div>
      </div>

      <!-- Utilizado o v-show pq preciso sempre desse elemento na dom -->
      <div v-show="!isLoading">
        <div
          v-if="!hasError"
          ref="pdfWrapper"
          class="column full-width no-wrap q-gutter-y-sm"
        />

        <!-- Estado de Erro: Exibe mensagem quando falha ao carregar PDF -->
        <div
          v-else
          class="bg-grey-4 q-py-xl text-center text-grey-10 text-subtitle1"
        >
          <div>
            <q-icon class="text-negative" name="sym_r_error" size="md" />
          </div>

          <div class="q-mt-xs">
            Falha ao carregar o arquivo.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as PDFJs from 'pdfjs-dist'
import { onMounted, ref, watch } from 'vue'

defineOptions({ name: 'QasPdfViewer' })

const props = defineProps({
  url: {
    type: String,
    default: ''
  },

  maxHeight: {
    type: String,
    default: undefined
  }
})

// refs
const pdfWrapper = ref(null)
const hasError = ref(false)
const isLoading = ref(false)

// watch
watch(() => props.url, loadPDF)

/**
 * Lifecycle hook que:
 * 1. Importa o worker do PDF.js para processamento em background
 * 2. Carrega o PDF inicial se a URL estiver disponível
 */
onMounted(async () => {
  await import('pdfjs-dist/build/pdf.worker.min.mjs')

  loadPDF()
})

// functions
/**
 * Função principal para carregar e renderizar o PDF
 */
async function loadPDF () {
  if (!props.url) return

  try {
    isLoading.value = true

    // Limpa o container antes de carregar novo PDF
    if (pdfWrapper.value) {
      pdfWrapper.value.innerHTML = ''
    }

    // Carrega o documento PDF
    const PDF = await PDFJs.getDocument(props.url).promise

    // Itera por todas as páginas do documento
    for (let pageNum = 1; pageNum <= PDF.numPages; pageNum++) {
      const page = await PDF.getPage(pageNum)

      // Cria viewport com escala 1.5 para melhor qualidade de renderização
      const viewport = page.getViewport({ scale: 1.5 })

      // Cria elemento canvas para renderizar a página
      const canvas = document.createElement('canvas')

      // Define dimensões do canvas baseadas no viewport
      canvas.height = viewport.height
      canvas.width = viewport.width

      /**
       * Configura altura máxima do container
       * Usa viewBox[3] que representa a altura correta da folha do PDF
       */
      pdfWrapper.value.style.maxHeight = props.maxHeight ?? `${viewport.viewBox[3]}px`

      // Adiciona canvas ao container DOM
      pdfWrapper.value.appendChild(canvas)

      // Renderiza a página no canvas
      await renderPage(canvas, page)
    }
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

/**
 * Função responsável por renderizar uma página específica do PDF em um canvas
 *
 * @param {HTMLCanvasElement} canvas - Canvas onde a página será renderizada
 * @param {number} page - Página do PDF a ser renderizada
 */
async function renderPage (canvas, page) {
  // Obtém contexto 2D do canvas para desenho
  const canvasContext = canvas.getContext('2d')

  // Configura contexto de renderização com viewport escalado
  const renderContext = {
    canvasContext,
    viewport: page.getViewport({ scale: 1.5 }) // Escala 1.5 para melhor qualidade
  }

  // Renderiza a página no canvas de forma assíncrona
  await page.render(renderContext).promise
}
</script>

<style lang="scss">
.qas-pdf-viewer {
  &__container {
    overflow-y: auto; // Scroll vertical quando conteúdo excede altura máxima
  }
}
</style>
