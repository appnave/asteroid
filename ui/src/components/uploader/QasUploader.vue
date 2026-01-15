<template>
  <div class="qas-uploader">
    <q-uploader ref="uploader" auto-upload class="bg-transparent" :class="uploaderClasses" v-bind="attributes" :factory flat :max-file-size :max-files method="PUT" @added="onAdded" @factory-failed="factoryFailed" @rejected="onRejected" @uploaded="uploaded" @uploading="updateUploading(true)">
      <template #header="scope">
        <slot name="header" :scope="scope">
          <qas-header v-if="useHeader" class="q-mb-none" v-bind="getHeaderProps(scope)">
            <template #description>
              <div :class="headerDescriptionClasses">
                {{ headerProps.description }}
              </div>
            </template>

            <template v-for="(_, name) in $slots" #[getHeaderSlotName(name)]="context">
              <slot :name v-bind="context" />
            </template>
          </qas-header>

          <!-- ------------------------------------ tags hidden -------------------------------------- -->
          <input ref="hiddenInput" :accept="attributes.accept" class="qas-uploader__input" :multiple="isMultiple" type="file">
        </slot>
      </template>

      <template #list="scope">
        <div v-if="hasGalleryCardSection(getFilesList(scope.files, scope))" class="q-col-gutter-lg row">
          <div v-for="(file, key, index) in getFilesList(scope.files, scope)" :key="index" :class="columnClasses">
            <pv-uploader-gallery-card v-bind="getUploaderGalleryCardProps({ key, scope, file, index })" />
          </div>
        </div>

        <qas-empty-result-text v-else-if="useEmptyResultText" />

        <qas-error-message v-if="errorMessage" :message="errorMessage" />

        <div v-if="hasBottomListSlot" class="q-mt-md">
          <slot :context="self" name="bottom-list" />
        </div>
      </template>
    </q-uploader>

    <slot :context="self" name="custom-upload" />
  </div>
</template>

<script>
import PvUploaderGalleryCard from './private/PvUploaderGalleryCard.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasHeader from '../header/QasHeader.vue'
import QasErrorMessage from '../error-message/QasErrorMessage.vue'

import { baseErrorProps } from '../../composables/private/use-error-message'
import { getImageSize, getResizeDimensions } from '../../helpers/images.js'
import { constructObject } from '../../helpers'

import { uid, extend } from 'quasar'
import { NotifyError } from '../../plugins'

import Pica from 'pica'

export default {
  name: 'QasUploader',

  components: {
    PvUploaderGalleryCard,
    QasEmptyResultText,
    QasHeader,
    QasErrorMessage
  },

  inheritAttrs: false,

  props: {
    ...baseErrorProps,

    errors: {
      type: [Array, Object],
      default: () => ({})
    },

    fieldName: {
      type: String,
      default: ''
    },

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

    headerProps: {
      type: Object,
      default: () => ({})
    },

    label: {
      type: String,
      default: ''
    },

    maxFiles: {
      default: undefined,
      type: Number
    },

    maxFileSize: {
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

    useEmptyResultText: {
      type: Boolean,
      default: true
    },

    useGalleryCard: {
      type: Boolean,
      default: true
    },

    useHeader: {
      type: Boolean,
      default: true
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

  emits: ['update:modelValue', 'update:uploading', 'rejected', 'update:errors'],

  data () {
    return {
      hasError: false,
      hiddenInputElement: null,
      savedFiles: {},
      uploader: null,
      amountFilesSent: 0,
      amountFilesRejected: 0
    }
  },

  computed: {
    attributes () {
      return this.$attrs
    },

    headerDescriptionClasses () {
      return {
        'text-negative': this.error
      }
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

    /**
     * Controla o valor default das colunas do grid
     *
     * Se o usuário passar alguma coluna, utiliza a passada
     * Se for múltiplo e estiver usando o gallery card, exibe 4 "{ col: 12, sm: 6, md: 4, lg: 3 }"
     * Senão, exibe "{ col: 12, sm: 6 }"
     */
    defaultColumns () {
      const hasDefaultColumn = !!Object.keys(this.columns).length

      if (hasDefaultColumn) return this.columns

      const hasSmallSize = this.useGalleryCard && this.isMultiple

      return {
        col: 12,
        sm: 6,
        ...(hasSmallSize && { md: 4, lg: 3 })
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
        dialogProps,
        useGalleryCard
      } = this.$props

      return {
        dialogProps,
        fields,
        formGeneratorProps,
        galleryCardProps,
        gridGeneratorProps,
        useDownload,
        useObjectModel,
        useGalleryCard,

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

    hasBottomListSlot () {
      return this.$slots['bottom-list']
    },

    isMultiple () {
      return this.$attrs.multiple || this.$attrs.multiple === ''
    },

    self () {
      return this
    },

    uploaderClasses () {
      return this.hasCustomUpload ? 'hidden' : 'fit'
    },

    isErrorArray () {
      return Array.isArray(this.errors)
    },

    transformedErrors () {
      return this.isErrorArray ? this.errors : constructObject(this.fieldName, this.errors)
    },

    /**
     * Computada para ser usada para controle externamente do componente.
     *
     * Retorna true quando todos os arquivos enviados foram rejeitados.
     */
    hasAllFileRejected () {
      return this.amountFilesSent === this.amountFilesRejected
    }
  },

  mounted () {
    this.hiddenInputElement = this.$refs.hiddenInput
    this.uploader = this.$refs.uploader

    this.hiddenInputElement?.addEventListener?.('change', () => this.addFiles())

    if (this.useObjectModel) {
      window.addEventListener('submit-success', this.handleSubmitSuccess)
    }
  },

  unmounted () {
    this.hiddenInputElement?.removeEventListener?.('change', () => this.addFiles())

    if (this.useObjectModel) {
      window.removeEventListener('submit-success', this.handleSubmitSuccess)
    }
  },

  methods: {
    /**
     * É possível passar os arquivos como parâmetro ou pegar os arquivos do input hidden,
     * isto será útil para casos onde precisa manipular o QasUploader pelo lado de fora
     * via ref.
     *
     * @param {File[]|FileList} files
     */
    async addFiles (files) {
      const filesList = Array.from(files || this.hiddenInputElement.files)

      const processedFiles = []

      // previne erro caso não exista hiddenInput
      if (this.$refs.hiddenInput) {
        this.$refs.hiddenInput.value = ''
      }

      filesList.forEach(file => processedFiles.push(this.resizeImage(file)))

      this.uploader.addFiles(await Promise.all(processedFiles))
    },

    /**
     * @param {FileList} files
     */
    onAdded (files) {
      // seta a quantidade de arquivos enviados, independentemente se forem aceitos ou rejeitados.
      this.amountFilesSent += files.length
    },

    dispatchUpload () {
      this.uploader?.removeUploadedFiles?.()
      this.hiddenInputElement?.click?.()
    },

    async factory ([file]) {
      if (!this.isMultiple && !this.hasHeaderSlot) {
        this.uploader.removeUploadedFiles()
      }

      const name = `${uid()}.${file.name.split('.').pop()}`
      const { endpoint } = await this.fetchCredentials(name) || {}

      if (!endpoint) return

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
          url: file.xhr ? this.getURLValue(file.xhr) : '',
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
     * Caso useUrlPath seja true, retorna de responseURL, senão tenta retornar o response
     * que pode ser um base64, caso não tenha o response, retorna a responseURL.
    */
    getURLValue (xhr) {
      const responseURL = xhr.responseURL.split('?').shift()

      return this.useUrlPath ? responseURL : (xhr.response || responseURL)
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
        errors: this.transformedErrors[index],
        file,
        fileKey: key,
        savedFiles: this.savedFiles,

        // eventos
        onRemove: () => this.removeFile(key, scope, file, index),
        onUpdateModel: value => this.updateModelValue({ index, payload: value })
      }
    },

    handleSubmitSuccess ({ detail: { entity } }) {
      if (entity === this.entity) this.setSavedFiles()
    },

    hasGalleryCardSection (files) {
      return Object.keys(files).length
    },

    isFailed (file) {
      return file.__status === 'failed'
    },

    onAddButtonClick (scope) {
      return this.addButtonFn ? this.addButtonFn(scope) : this.$refs.hiddenInput.click()
    },

    removeFile (key, scope, file, index) {
      /**
       * Remove o erro referente ao arquivo removido para não correr o risco
       * de manter erros de arquivos que já foram removidos ao adicionar novos arquivos.
       */
      if (this.transformedErrors[index]) {
        const errors = this.isErrorArray ? [...this.transformedErrors] : { ...this.transformedErrors }

        if (this.isErrorArray) {
          errors.splice(index, 1)
        } else {
          delete errors[index]
        }

        this.$emit('update:errors', errors)
      }

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

      const fullPath = this.getURLValue(response.xhr)

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
    },

    getHeaderSlotName (name) {
      return name.replace('header-', '')
    },

    getHeaderProps (scope) {
      const { labelProps, actionsMenuProps, ...othersHeaderProps } = this.headerProps

      const { list, ...othersActionsMenuProps } = actionsMenuProps || {}

      return {
        spacing: 'lg',

        labelProps: {
          label: this.label,

          margin: 'none',

          ...labelProps,

          ...(this.error && { color: 'negative' })
        },

        ...(this.hasAddFile && {
          actionsMenuProps: {
            list: {
              add: {
                icon: 'sym_r_add',
                label: this.addButtonLabel,
                handler: () => this.onAddButtonClick(scope)
              },

              ...list
            },

            ...othersActionsMenuProps
          }
        }),

        ...othersHeaderProps
      }
    },

    /**
     * Trata os erros de arquivos rejeitados pelo QUploader para adicionar
     * feedback com toast, trata os seguintes erros:
     * - accept
     * - maxFileSize
     */
    onRejected (rejectedFiles) {
      // seta a quantidade de arquivos rejeitados.
      this.amountFilesRejected += rejectedFiles.length

      // seta a quantidade de arquivos enviados, é necessário usar no rejected porque esses arquivos não caem no onAdded.
      this.amountFilesSent += rejectedFiles.length

      this.$emit('rejected', rejectedFiles)

      const errorsSize = {
        accept: 0,
        maxFileSize: 0
      }

      rejectedFiles.forEach(({ failedPropValidation }) => {
        if (failedPropValidation === 'accept') {
          errorsSize.accept += 1

          return
        }

        if (failedPropValidation === 'max-file-size') {
          errorsSize.maxFileSize += 1
        }
      })

      const hasMaxFileSizeErrors = !!errorsSize.maxFileSize
      const hasAcceptErrors = !!errorsSize.accept

      // Caso o erro não seja de accept ou maxFileSize, não exibe nenhuma mensagem.
      if (!hasMaxFileSizeErrors && !hasAcceptErrors) return

      /**
       * Mensagem genérica para quando hover erro de accept e maxFileSize de uma vez.
       */
      if (hasMaxFileSizeErrors && hasAcceptErrors) {
        const mergedErrorsSize = errorsSize.maxFileSize + errorsSize.accept

        NotifyError(`Não conseguimos selecionar ${mergedErrorsSize} arquivos. Por favor, escolha arquivos válidos.`)

        return
      }

      /**
       * Mensagens de erro para quando houver apenas erros de maxFileSize.
       */
      if (hasMaxFileSizeErrors) {
        const megaByte = `${this.maxFileSize / 1000000}Mb` // converte para MB

        // TODO-ISSUE: rever essa validação simples até issue #1365 ser resolvida.
        NotifyError(
          errorsSize.maxFileSize === 1
            ? `Não conseguimos selecionar 1 arquivo, ele ultrapassa o limite de ${megaByte}. Por favor, escolha um arquivo dentro do limite permitido.`
            : `Não conseguimos selecionar ${errorsSize.maxFileSize} arquivos, eles ultrapassam o limite de ${megaByte} definido para cada um. Por favor, escolha um arquivo dentro do limite permitido.`
        )

        return
      }

      /**
       * Mensagens de erro para quando houver apenas erros de accept.
       */
      NotifyError(
        errorsSize.accept === 1
          ? 'Não conseguimos selecionar 1 arquivo, este tipo não é permitido. Por favor, escolha um arquivo válido.'
          : `Não conseguimos selecionar ${errorsSize.accept} arquivos, estes tipos não são permitidos. Por favor, escolha arquivos válidos.`
      )
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
    position: relative;
    transition: padding var(--qas-generic-transition) ease, background var(--qas-generic-transition) ease;

    // Referente ao drag and drop.
    &--dnd {
      padding: var(--qas-spacing-md) !important;
    }

    // Referente ao drag and drop.
    &__dnd {
      align-items: center;
      background: $primary !important;
      background: white !important;
      border-radius: $generic-border-radius !important;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      opacity: 0.9;
      outline-offset: 0 !important;
      outline: 1px dashed var(--q-primary) !important;

      // content e font-family para adicionar ícone do material icons.
      &::before {
        color: var(--q-primary);
        content: 'attach_file_add';
        font-family: 'Material Symbols Rounded';
        font-size: 24px;
      }

      &::after {
        @include set-typography($subtitle1);

        color: var(--q-primary);
        content: 'Solte o arquivo aqui.';
      }
    }

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
