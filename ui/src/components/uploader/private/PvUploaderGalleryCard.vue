<template>
  <div>
    <qas-gallery-card v-if="useGalleryCard" v-bind="defaultGalleryCardProps">
      <template v-if="hasGenerator" #bottom>
        <div>
          <qas-grid-generator v-if="hasGridGenerator" v-bind="defaultGridGeneratorProps" />

          <qas-form-generator v-else-if="hasFormGenerator" v-bind="defaultFormGeneratorProps" />
        </div>
      </template>

      <template v-if="hasURLError" #image-bottom>
        <qas-error-message :message="urlError" />
      </template>
    </qas-gallery-card>

    <qas-box v-else v-bind="cardBoxProps">
      <qas-header v-bind="cardHeaderProps" />
    </qas-box>

    <qas-dialog v-model="showDialog" use-form use-validation-all-at-once v-bind="dialogProps" @validate="onValidate">
      <template #description>
        <qas-form-generator v-bind="dialogFormGeneratorProps" v-model="dialogValues" />
      </template>
    </qas-dialog>
  </div>
</template>

<script>
import QasErrorMessage from '../../error-message/QasErrorMessage.vue'
import QasDialog from '../../dialog/QasDialog.vue'
import QasFormGenerator from '../../form-generator/QasFormGenerator.vue'
import QasGalleryCard from '../../gallery-card/QasGalleryCard.vue'
import QasGridGenerator from '../../grid-generator/QasGridGenerator.vue'
import QasBox from '../../box/QasBox.vue'
import QasHeader from '../../header/QasHeader.vue'

import downloadFile from '../../../helpers/download-file.js'

export default {
  name: 'PvUploaderGalleryCard',

  components: {
    QasBox,
    QasDialog,
    QasErrorMessage,
    QasFormGenerator,
    QasGalleryCard,
    QasGridGenerator,
    QasHeader
  },

  inject: {
    isBox: {
      default: false
    }
  },

  inheritAttrs: false,

  props: {
    currentModelValue: {
      default: '',
      type: [String, Array, Object]
    },

    dialogProps: {
      type: Object,
      default: () => ({})
    },

    errors: {
      default: () => ({}),
      type: Object
    },

    fields: {
      type: Object,
      default: () => ({})
    },

    file: {
      type: Object,
      default: () => ({})
    },

    fileKey: {
      type: String,
      default: ''
    },

    formGeneratorProps: {
      type: Object,
      default: () => ({})
    },

    galleryCardProps: {
      type: [Object, Function],
      default: () => ({})
    },

    gridGeneratorProps: {
      type: Object,
      default: () => ({})
    },

    savedFiles: {
      type: Object,
      default: () => ({})
    },

    useDownload: {
      type: Boolean
    },

    useMultiple: {
      type: Boolean
    },

    useObjectModel: {
      type: Boolean
    },

    useGalleryCard: {
      type: Boolean,
      default: true
    }
  },

  emits: ['update-model', 'remove'],

  data () {
    return {
      dialogValues: {},
      showDialog: false,
      hasErrorOnUploadedFile: false
    }
  },

  computed: {
    dialogFormGeneratorProps () {
      const { modelValue, 'onUpdate:modelValue': _, ...props } = this.defaultFormGeneratorProps

      return props
    },

    defaultFormGeneratorProps () {
      // url é reservado para erro de URL, é exibido o erro como um todo e não em um campo.
      const { url, ...errors } = this.errors

      return {
        errors,
        modelValue: this.currentModelValue,
        disable: this.hasError,
        columns: this.getDefaultColumns(this.formFields),
        ...this.defaultGeneratorProps,
        ...this.formGeneratorProps,

        'onUpdate:modelValue': this.updateModel
      }
    },

    normalizedCardGalleryProps () {
      const isFunction = typeof this.galleryCardProps === 'function'

      const functionPayload = {
        hasError: this.hasErrorOnUploadedFile,
        file: this.file
      }

      return (isFunction ? this.galleryCardProps(functionPayload) : this.galleryCardProps) || {}
    },

    defaultGalleryCardProps () {
      const {
        list,
        imageProps,

        buttonProps: btnProps,
        errorMessage: error,

        ...actionsMenuProps
      } = this.normalizedCardGalleryProps

      /**
       * Quando hasError for "true", significa que é falha ao enviar o arquivo ao servidor (upload), e nestes casos:
       *
       * buttonProps: deve sempre ser possível excluir a imagem, por isso o disable do botão é "false".
       */
      const buttonProps = this.hasError ? { ...btnProps, disable: false } : btnProps

      return {
        disable: this.hasError,

        ...this.normalizedCardGalleryProps,

        errorMessage: 'Falha ao carregar o arquivo.',

        imageProps: {
          ...imageProps,

          // callback para sinalizar que houve erro em arquivos já upados.
          onError: () => {
            this.hasErrorOnUploadedFile = true

            this.galleryCardProps.imageProps?.onError?.()
          }
        },

        headerProps: {
          labelProps: {
            label: this.normalizedModelValue.name,
            ...(this.hasError && { color: 'negative' })
          },

          actionsMenuProps: {
            ...actionsMenuProps,

            buttonProps: {
              disable: false,
              ...buttonProps,
              ...(this.hasError && { color: 'negative' })
            },

            list: {
              ...(
                this.hasEditButton &&
                {
                  edit: {
                    label: 'Editar',
                    icon: 'sym_r_edit',

                    // callback
                    handler: () => {
                      this.dialogValues = { ...this.currentModelValue }
                      this.toggleDialog()
                    }
                  }
                }
              ),

              ...(
                this.hasDownloadButton &&
                {
                  download: {
                    label: 'Baixar arquivo',
                    icon: 'sym_r_download',

                    // callback
                    handler: () => downloadFile(this.normalizedModelValue)
                  }
                }
              ),

              destroy: {
                label: 'Excluir',
                color: 'grey-10',
                icon: 'sym_r_delete',

                // callback
                handler: () => this.$emit('remove')
              },

              ...list
            }
          }
        },

        url: this.normalizedModelValue?.url
      }
    },

    defaultGeneratorProps () {
      return {
        fields: this.fields,
        gutter: 'md'
      }
    },

    defaultGridGeneratorProps () {
      return {
        useEmptyResult: false,
        result: this.currentModelValue,
        columns: this.getDefaultColumns(this.gridFields),

        ...this.defaultGeneratorProps,
        ...this.gridGeneratorProps
      }
    },

    fileName () {
      return this.url ? this.url.split('/').pop() : ''
    },

    formFields () {
      return this.formGeneratorProps.fields
    },

    gridFields () {
      return this.gridGeneratorProps.fields
    },

    hasDownloadButton () {
      return this.useDownload && !this.hasError
    },

    hasEditButton () {
      return this.isGalleryMode && this.useObjectModel && this.hasFormFields
    },

    hasError () {
      return this.file.isFailed || this.hasURLError
    },

    hasFormFields () {
      const { fields } = this.defaultFormGeneratorProps

      return !!Object.keys(fields).length
    },

    hasFormGenerator () {
      const { fields } = this.defaultFormGeneratorProps

      return !!Object.keys(fields).length && !this.isGalleryMode
    },

    hasGenerator () {
      if (!this.useObjectModel) return false

      return (this.hasGridGenerator) || this.hasFormGenerator
    },

    hasGridGenerator () {
      const { fields } = this.defaultGridGeneratorProps
      const hasFields = !!Object.keys(fields).length

      if (!this.hasFormFields && hasFields) return true

      return this.isGalleryMode && hasFields && !this.file.isFailed
    },

    isGalleryMode () {
      return (!('isUploaded' in this.file) || this.savedFiles[this.fileKey])
    },

    normalizedModelValue () {
      return (
        this.useObjectModel && !this.hasError
          ? this.currentModelValue

          /**
           * Quando da erro ao enviar, a url não é enviada no model, desta forma para aparecer a imagem
           * de "Falha ao enviar arquivo." é necessário que a "url" exista, então é criada uma url fake.
           *
           * Obs: esta URL fake é usada apenas para aparecer a imagem de "Falha ao enviar arquivo."
           * e não é adicionada ao model.
           */
          : { ...this.file, url: this.file.url || this.url || 'error-on-upload-file' }
      )
    },

    url () {
      return this.defaultGalleryCardProps?.url
    },

    cardBoxProps () {
      const isBordered = (this.isBox || this.hasError)

      return {
        outlined: isBordered,
        unelevated: isBordered
      }
    },

    cardHeaderProps () {
      return {
        actionsMenuProps: {
          useLabel: false,
          ...this.defaultGalleryCardProps.headerProps?.actionsMenuProps
        },

        labelProps: {
          label: this.file.name || this.fileName,
          typography: 'h5',

          ...(this.hasError && { color: 'negative' })
        },

        ...(this.hasError && { description: 'Falha ao carregar o arquivo.' }),

        spacing: 'none',
        useEllipsis: true
      }
    },

    /**
     * Indica se há slot customizado para exibir o erro somente nos casos onde:
     */
    hasCustomErrorSlot () {
      return !this.hasError && this.file.isUploaded
    },

    urlError () {
      const { url } = this.errors || {}
      const isArray = Array.isArray(url)

      return isArray ? url.join(' ') : url
    },

    hasURLError () {
      return !!this.urlError
    }
  },

  methods: {
    getDefaultColumns (fields) {
      fields ??= this.fields

      const columns = {}

      for (const key in fields) {
        columns[key] = { col: 12 }
      }

      return columns
    },

    getFileName (value) {
      return value.split('/').pop()
    },

    onValidate (isValid) {
      if (!isValid) return

      this.toggleDialog()
      this.updateModel(this.dialogValues)
    },

    toggleDialog () {
      this.showDialog = !this.showDialog
    },

    updateModel (value) {
      this.$emit('update-model', value)
    }
  }
}
</script>
