<template>
  <qas-box class="bg-white qas-gallery-card" :class="classes" v-bind="boxProps">
    <qas-header v-if="hasHeader" v-bind="defaultHeaderProps" />

    <div v-if="props.useVideo" class="rounded-borders">
      <slot name="video">
        <q-video v-bind="defaultVideoProps" />
      </slot>
    </div>

    <div v-else>
      <div class="qas-gallery-card__image">
        <slot name="image">
          <q-img class="rounded-borders" height="100%" :src="props.url" v-bind="props.imageProps">
            <template #error>
              <slot name="image-error-container">
                <div v-if="hasFileType" class="bg-blue-grey-2 flex full-height full-width items-center justify-center text-blue-grey-8">
                  <div class="text-center">
                    <div>
                      <q-icon name="sym_r_draft" size="lg" />
                    </div>

                    <div class="q-mt-xs text-blue-grey-8 text-center text-h4">
                      {{ normalizedFileType }}
                    </div>
                  </div>
                </div>

                <div v-else class="bg-grey-4 flex full-height full-width items-center justify-center text-grey-10 text-subtitle1">
                  <div class="text-center">
                    <slot name="image-error-icon">
                      <div v-if="props.errorIcon">
                        <q-icon class="text-negative" :name="props.errorIcon" size="md" />
                      </div>
                    </slot>

                    <slot name="image-error-message">
                      <div class="q-mt-xs">
                        {{ props.errorMessage }}
                      </div>
                    </slot>
                  </div>
                </div>
              </slot>
            </template>
          </q-img>
        </slot>
      </div>

      <slot name="image-bottom" />
    </div>

    <div v-if="hasBottom" class="q-mt-md">
      <slot name="bottom">
        <qas-grid-generator v-if="hasGridGenerator" v-bind="props.gridGeneratorProps" />
      </slot>
    </div>
  </qas-box>
</template>

<script setup>
import QasBox from '../box/QasBox.vue'
import QasGridGenerator from '../grid-generator/QasGridGenerator.vue'
import QasHeader from '../header/QasHeader.vue'

import { computed, useSlots, inject } from 'vue'

defineOptions({ name: 'QasGalleryCard' })

const props = defineProps({
  disable: {
    type: Boolean
  },

  errorIcon: {
    type: String,
    default: 'sym_r_error'
  },

  errorMessage: {
    type: String,
    default: 'Falha ao carregar imagem.'
  },

  fileType: {
    type: String,
    default: ''
  },

  headerProps: {
    type: Object,
    default: () => ({})
  },

  gridGeneratorProps: {
    type: Object,
    default: () => ({})
  },

  imageProps: {
    type: Object,
    default: () => ({})
  },

  url: {
    type: String,
    default: ''
  },

  useVideo: {
    type: Boolean
  },

  videoProps: {
    type: Object,
    default: () => ({})
  }
})

// globals
const isInsideBox = inject('isBox', false)
const isInsideDialog = inject('isDialog', false)

// composables
const slots = useSlots()

// computeds
const classes = computed(() => {
  return {
    'text-grey-6': props.disable
  }
})

const hasHeader = computed(() => {
  const { labelProps, actionsMenuProps } = props.headerProps

  return labelProps?.label || Object.keys(actionsMenuProps || {}).length
})

/**
 * Vai ser "outlined" quando:
 * - Estiver dentro de um QasBox (isInsideBox) ou
 * - Estiver dentro de um QasDialog (isInsideDialog) ou
 * - Ou quando houver erro (hasError)
 * Se não, terá shadow.
 */
const boxProps = computed(() => {
  const isOutlined = isInsideBox || isInsideDialog
  const hasPadding = !!(
    props.headerProps.labelProps?.label ||
    hasActions.value ||
    hasBottom.value ||
    hasGridGenerator.value
  )

  return {
    outlined: isOutlined,
    unelevated: isOutlined,
    useSpacing: hasPadding
  }
})

const defaultHeaderProps = computed(() => {
  const { labelProps, actionsMenuProps } = props.headerProps || {}

  return {
    useEllipsis: true,

    ...props.headerProps,

    labelProps: {
      ...labelProps,
      typography: 'h5'
    },

    actionsMenuProps: {
      useLabel: false,

      ...actionsMenuProps,

      buttonProps: {
        disable: props.disable,
        ...actionsMenuProps?.buttonProps
      }
    }
  }
})

const defaultVideoProps = computed(() => {
  return {
    ratio: 16 / 9,

    ...props.videoProps,

    src: props.url
  }
})

/**
 * File type (extensão) do arquivo, usado para mostrar quando a imagem não carrega.
 * Caso passe o prop "fileType", ele tem prioridade.
 * Se não passar, tenta extrair da URL de forma automática (pathname e query parameters).
 */
const normalizedFileType = computed(() => {
  if (props.fileType) {
    return props.fileType.toUpperCase()
  }

  const url = getURL()

  if (props.useVideo || !url) return ''

  // 1. Primeiro tenta extrair da pathname
  let extension = extractExtension(url.pathname)

  // 2. Se não encontrou, procura em TODOS os query parameters
  if (!extension && url.search) {
    const params = new URLSearchParams(url.search)

    for (const [key, value] of params) {
      extension = extractExtension(value)

      if (extension) break

      // Também verifica se o próprio key contém uma extensão
      extension = extractExtension(key)

      if (extension) break
    }
  }

  // 3. Se ainda não encontrou, tenta na URL completa como último recurso
  if (!extension) {
    extension = extractExtension(url.href)
  }

  return extension ? extension.toUpperCase() : ''
})

const hasFileType = computed(() => !!normalizedFileType.value)

const hasActions = computed(() => !!Object.keys(props.headerProps.actionsMenuProps || {}).length)
const hasGridGenerator = computed(() => !!Object.keys(props.gridGeneratorProps).length)
const hasBottom = computed(() => !!slots.bottom || hasGridGenerator.value)

// functions
/**
 * Função que garante o retorno de uma URL válida ou null.
 * Se a URL for inválida, o construtor do objeto URL lança um erro.
 * Se a URL for inválida, retorna null para evitar erros no console.
 */
function getURL () {
  const mergedURL = props.url || props.imageProps?.src

  if (!mergedURL) return null

  try {
    return new URL(props.url || props.imageProps.src)
  } catch {
    return null
  }
}

/**
 * Extrai extensão de uma string se for um tipo de arquivo válido\
 *
 * @param {string} value
 */
function extractExtension (value) {
  if (!value) return ''

  const acceptableTypes = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'csv']

  const parts = value.split('.')

  if (parts.length < 2) return ''

  const ext = parts.pop().toLowerCase()

  return acceptableTypes.includes(ext) ? ext : ''
}
</script>

<style lang="scss">
.qas-gallery-card {
  &__image {
    height: 180px;
  }
}
</style>
