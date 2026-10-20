<template>
  <div class="qas-uploader">
    <q-uploader ref="uploader" auto-upload class="bg-transparent" :class="uploaderClasses" v-bind="attributes" :factory="factory" flat :max-files="maxFiles" method="PUT" @factory-failed="factoryFailed" @uploaded="uploaded" @uploading="updateUploading(true)">
      <template #header="scope">
        <slot name="header" :scope="scope">
          <div class="flex items-center justify-between">
            <div>
              <qas-label v-bind="labelProps" />

              <div v-if="errorMessage" class="q-mt-xs text-caption text-negative">
                {{ errorMessage }}
              </div>
            </div>

            <div v-if="hasAddFile">
              <qas-btn color="primary" icon="sym_r_add" :label="addButtonLabel" :use-label-on-small-screen="false" variant="tertiary" @click="onAddButtonClick(scope)" />
            </div>
          </div>

          <!-- ------------------------------------ tags hidden -------------------------------------- -->
          <input ref="hiddenInput" :accept="attributes.accept" class="qas-uploader__input" :multiple="isMultiple" type="file">
          <qas-btn ref="buttonCleanFiles" class="hidden" @click="scope.removeUploadedFiles" />
        </slot>
      </template>

      <template #list="scope">
        <div v-if="hasGalleryCardSection(getFilesList(scope.files, scope))" class="q-col-gutter-lg q-mt-sm row">
          <div v-for="(file, key, index) in getFilesList(scope.files, scope)" :key="index" :class="columnClasses">
            <pv-uploader-gallery-card v-bind="getUploaderGalleryCardProps({ key, scope, file, index })" />
          </div>
        </div>

        <div v-else class="q-mt-lg">
          <qas-empty-result-text />
        </div>
      </template>
    </q-uploader>

    <slot :context="self" name="custom-upload" />
  </div>
</template>

<script>
import PvUploaderGalleryCard from './private/PvUploaderGalleryCard.vue'

import { uid, extend } from 'quasar'
import { NotifyError } from '../../plugins'
import { getImageSize, getResizeDimensions } from '../../helpers/images.js'

import Pica from 'pica'

export default {
  name: 'QasUploader',

  components: {
    PvUploaderGalleryCard
  },

  inheritAttrs: false,

  props: {
    addButtonFn: {
      type: Function,
      default: undefined
    },

    addButtonLabel: {
      default: 'Adicionar',
      type: String
    },

    acceptResizeTypes: {
      default: () => [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
        'image/jpg'
      ],
      type: Array
    },

    columns: {
      type: Object,
      default: () => ({})
    },

    dialogProps: {
      type: Object,
      default: () => ({})
    },

    entity: {
      required: true,
      type: String
    },

    error: {
      type: Boolean
    },

    errorMessage: {
      default: '',
      type: String
    },

    fields: {
      default: () => ({}),
      type: Object
    },

    formGeneratorProps: {
      default: () => ({}),
      type: Object
    },

    galleryCardProps: {
      type: [Object, Function],
      default: () => ({})
    },

    gridGeneratorProps: {
      default: () => ({}),
      type: Object
    },

    label: {
      type: String,
      default: ''
    },

    maxFiles: {
      default: undefined,
      type: Number
    },

    modelValue: {
      default: '',
      type: [String, Array, Object]
    },

    picaResizeOptions: {
      default: () => ({}),
      type: Object
    },

    readonly: {
      type: Boolean
    },

    sizeLimit: {
      default: 1280,
      type: Number
    },

    uploadCredentialsParams: {
      type: Object,
      default: () => ({})
    },

    uploading: {
      type: Boolean
    },

    useDownload: {
      default: true,
      type: Boolean
    },

    useObjectModel: {
      type: Boolean
    },

    useResize: {
      default: true,
      type: Boolean
    },

    useUrlPath: {
      type: Boolean,
      default: true
    }
  },

  emits: ['update:modelValue', 'update:uploading'],

  data () {
    return {
      hasError: false,
      hiddenInputElement: null,
      savedFiles: {},
      uploader: null
    }
  },

  computed: {
    attributes () {
      return this.$attrs
    },

    columnClasses () {
      const irregularClasses = ['col']
      const columns = this.defaultColumns

      const classes = []

      const profiles = {
        col: 'col',
        xs: 'col-xs',
        sm: 'col-sm',
        md: 'col-md',
        lg: 'col-lg',
        xl: 'col-xl'
      }

      for (const key in columns) {
        const column = columns[key]

        if (irregularClasses.includes(column)) {
          classes.push(profiles[key])
          continue
        }

        classes.push(`${profiles[key]}-${column}`)
      }

      return classes
    },

    defaultColumns () {
      return {
        ...(this.isMultiple ? { col: 12, sm: 6, md: 4, lg: 3 } : { col: 12, sm: 6 }),
        ...this.columns
      }
    },

    defaultPicaResizeOptions () {
      return {
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
        ...this.picaResizeOptions
      }
    },

    defaultUploaderGalleryCardProps () {
      const {
        fields,
        formGeneratorProps,
        galleryCardProps,
        gridGeneratorProps,
        useDownload,
        useObjectModel,
        dialogProps
      } = this.$props

      return {
        dialogProps,
        fields,
        formGeneratorProps,
        galleryCardProps,
        gridGeneratorProps,
        useDownload,
        useObjectModel,

        useMultiple: this.isMultiple
      }
    },

    hasAddFile () {
      if (this.readonly) return

      const modelLength = this.useObjectModel
        ? Object.keys(this.modelValue).length
        : this.modelValue?.length

      return this.maxFiles && this.isMultiple ? modelLength < this.maxFiles : true
    },

    hasCustomUpload () {
      return this.$slots['custom-upload']
    },

    hasHeaderSlot () {
      return this.$slots.header
    },

    isMultiple () {
      return this.$attrs.multiple || this.$attrs.multiple === ''
    },

    labelProps () {
      return {
        label: this.label,
        margin: 'none',

        ...(this.error && { color: 'negative' })
      }
    },

    self () {
      return this
    },

    uploaderClasses () {
      return this.hasCustomUpload ? 'hidden' : 'fit'
    }
  },

  mounted () {
    this.hiddenInputElement = this.$refs.hiddenInput
    this.uploader = this.$refs.uploader

    this.hiddenInputElement?.addEventListener?.('change', this.addFiles)

    if (this.useObjectModel) {
      window.addEventListener('submit-success', this.handleSubmitSuccess)
    }
  },

  unmounted () {
    this.hiddenInputElement?.removeEventListener?.('change', this.addFiles)

    if (this.useObjectModel) {
      window.removeEventListener('submit-success', this.handleSubmitSuccess)
    }
  },

  methods: {
    async addFiles () {
      const filesList = Array.from(this.hiddenInputElement.files)
      const processedFiles = []

      this.$refs.hiddenInput.value = ''

      filesList.forEach(file => processedFiles.push(this.resizeImage(file)))

      /**
       * Sem "multiple", remove o arquivo anterior antes de adicionar o novo,
       * pois o "max-files" bloquearia a troca.
       */
      if (!this.isMultiple) {
        this.uploader.removeUploadedFiles()
        this.uploader.removeQueuedFiles()
      }

      this.uploader.addFiles(await Promise.all(processedFiles))
    },

    dispatchUpload () {
      this.$refs.buttonCleanFiles.$el.click()
      this.hiddenInputElement.click()
    },

    async factory ([file]) {
      if (!this.isMultiple && !this.hasHeaderSlot) {
        this.$refs.buttonCleanFiles.$el.click()
      }

      const name = `${uid()}.${file.name.split('.').pop()}`
      const { endpoint, fullPath } = await this.fetchCredentials(name) || {}

      if (!endpoint) return

      file.fullPath = fullPath

      return {
        headers: [
          { name: 'Content-Type', value: file.type || 'image/jpeg' },
          { name: 'Content-Disposition', value: 'Attachment' }
        ],
        sendRaw: true,
        url: endpoint
      }
    },

    factoryFailed () {
      this.hasError = true

      this.updateUploading(false)

      NotifyError('Falha ao carregar arquivo.')
    },

    async fetchCredentials (filename) {
      try {
        const { data } = await this.$axios.post('/upload-credentials/', {
          entity: this.entity,
          filename,
          ...this.uploadCredentialsParams
        })

        return data
      } catch {}
    },

    getFilesList (uploadedFiles) {
      uploadedFiles = uploadedFiles.map((file, indexToDelete) => {
        return {
          isUploaded: true,
          url: this.isUploaded(file) ? this.getURLValue(file) : '',
          name: file.name,
          indexToDelete,
          isFailed: this.isFailed(file)
        }
      })

      const pathsList = Array.isArray(this.modelValue)
        ? this.modelValue
        : (this.modelValue ? [this.modelValue] : [])

      const mergedList = [...pathsList, ...uploadedFiles]
      const files = {}

      mergedList.forEach(file => {
        if (this.useObjectModel && file.uuid) {
          files[file.uuid] = file
          return
        }

        if (file.isFailed) {
          files[file.name] = file
          return
        }

        if (typeof file === 'string') {
          const fileName = this.getFileName(file)
          files[fileName] = { url: file, isUploaded: false, name: fileName }
          return
        }

        if (file.url) {
          const fileName = this.getFileName(file.url)
          files[fileName] = file
        }
      })

      return files
    },

    getFileName (value) {
      return value.split('/').pop()
    },

    /**
     * Retorna a URL do arquivo: fullPath (do upload-credentials) ou, na falta dele, a responseURL sem query.
     * Sem useUrlPath, prioriza o response (ex: base64), se existir.
     */
    getURLValue ({ xhr, fullPath }) {
      const url = fullPath || xhr.responseURL.split('?').shift()

      return this.useUrlPath ? url : (xhr.response || url)
    },

    getModelValue (index) {
      if (!this.useObjectModel) return {}

      return this.isMultiple ? this.modelValue[index] || {} : this.modelValue
    },

    getUploaderGalleryCardProps ({ index, key, file, scope }) {
      const modelValue = this.getModelValue(index)

      return {
        ...this.defaultUploaderGalleryCardProps,

        currentModelValue: modelValue,
        file,
        fileKey: key,
        savedFiles: this.savedFiles,

        // eventos
        onRemove: () => this.removeFile(key, scope, file),
        onUpdateModel: value => this.updateModelValue({ index, payload: value })
      }
    },

    handleSubmitSuccess ({ detail: { entity } }) {
      if (entity === this.entity) this.setSavedFiles()
    },

    hasGalleryCardSection (files) {
      return Object.keys(files).length
    },

    // só considera o arquivo enviado após o PUT no endpoint finalizar com sucesso.
    isUploaded (file) {
      return file.__status === 'uploaded'
    },

    isFailed (file) {
      return file.__status === 'failed'
    },

    onAddButtonClick (scope) {
      return this.addButtonFn ? this.addButtonFn(scope) : this.$refs.hiddenInput.click()
    },

    removeFile (key, scope, file) {
      if (file.isUploaded) {
        scope.removeFile(scope.files[file.indexToDelete])
      }

      if (file.isFailed) return

      if (!this.isMultiple) {
        return this.$emit('update:modelValue', this.useObjectModel ? {} : '')
      }

      const clonedValue = extend(true, [], this.modelValue)

      const numberIndex = this.modelValue.findIndex(file => {
        if (this.useObjectModel) {
          return file.uuid === key || file.url.includes(key)
        }

        return this.getFileName(file) === key
      })

      clonedValue.splice(numberIndex, 1)

      this.$emit('update:modelValue', clonedValue)
    },

    // Função para redimensionar imagens
    async resizeImage (file) {
      const { type } = file

      if (!this.acceptResizeTypes.includes(type) || !this.useResize) return file

      try {
        const image = new Image()
        const canvas = document.createElement('canvas')

        image.src = URL.createObjectURL(file)

        // Retorna largura e altura da original da imagem
        const { width, height } = await getImageSize(image)

        // Tamanho da imagem menor que o tamanho limite, sendo assim, não faz o resize
        if (width <= this.sizeLimit) {
          return file
        }

        // Retorna os novos tamanhos redimensionados
        const resizedDimensions = getResizeDimensions(this.sizeLimit, width, height)

        canvas.width = resizedDimensions.width
        canvas.height = resizedDimensions.height

        // Resolve problemas com cors
        image.crossOrigin = ''

        image.width = width
        image.height = height

        const pica = Pica()
        const resizedImage = await pica.resize(image, canvas, this.defaultPicaResizeOptions)
        const blob = await pica.toBlob(resizedImage, type, 0.90)

        const newFile = new File([blob], file.name, { type })

        return newFile
      } catch {
        // Caso não consiga redimensionar retorna o arquivo original
        return file
      }
    },

    setSavedFiles () {
      if (this.isMultiple) {
        this.modelValue.forEach(model => {
          const fileName = this.getFileName(model.url)

          this.savedFiles[fileName] = true
        })

        return
      }

      const fileName = this.getFileName(this.modelValue.url)

      this.savedFiles[fileName] = true
    },

    updateModelValue ({ index, payload = {} }) {
      if (!this.useObjectModel) return

      if (this.isMultiple) {
        const modelValue = [...this.modelValue]
        const value = modelValue[index]

        modelValue[index] = { ...value, ...payload }

        this.$emit('update:modelValue', modelValue)

        return
      }

      this.$emit('update:modelValue', { ...this.modelValue, ...payload })
    },

    updateUploading (uploading) {
      this.$emit('update:uploading', uploading)
    },

    uploaded (response) {
      this.hasError = false

      const fullPath = this.getURLValue({ xhr: response.xhr, fullPath: response.files?.[0]?.fullPath })

      const objectValue = {
        format: response.files[0].type,
        url: fullPath,
        name: response.files[0].name
      }

      const model = this.useObjectModel ? objectValue : fullPath

      this.$emit('update:modelValue', this.isMultiple ? [...this.modelValue, model] : model || '')

      this.updateUploading(false)
    },

    reset () {
      this.$refs.uploader.reset()

      const emptyModel = this.isMultiple ? [] : this.useObjectModel ? {} : ''

      this.$emit('update:modelValue', emptyModel)
    }
  }
}
</script>

<style lang="scss">
.qas-uploader {
  &__input {
    display: none;
  }

  .q-uploader {
    max-height: 100%;

    &__header {
      background-color: transparent;
      color: $grey-10;
    }

    &__list {
      min-height: 0;
      padding: 0;

      &.scroll {
        overflow: unset;
      }
    }
  }
}
</style>
