<template>
  <div>
    <qas-uploader ref="uploader" v-model="model" :add-button-fn="openDialog" :use-resize="false" v-bind="defaultUploaderProps" />

    <qas-dialog v-model="isOpenedDialog" v-bind="defaultDialogProps">
      <template #header>
        <div class="text-bold text-center">Insira sua assinatura digital no campo abaixo</div>
      </template>

      <template #description>
        <div :style="signaturePadWidth">
          <qas-signature-pad ref="signaturePadModal" v-model:empty="isEmpty" :height="signaturePadHeight" />
        </div>
      </template>
    </qas-dialog>
  </div>
</template>

<script>
import QasDialog from '../dialog/QasDialog.vue'
import QasUploader from '../uploader/QasUploader.vue'
import QasSignaturePad from '../signature-pad/QasSignaturePad.vue'

import { base64ToBlob } from '../../helpers'
import { NotifyError } from '../../plugins'

export default {
  name: 'QasSignatureUploader',

  components: {
    QasDialog,
    QasUploader,
    QasSignaturePad
  },

  inheritAttrs: false,

  props: {
    dialogProps: {
      type: Object,
      default: () => ({})
    },

    modelValue: {
      default: '',
      type: String
    },

    signatureLabel: {
      default: 'Assinatura',
      type: String
    },

    type: {
      default: 'image/png',
      type: String
    },

    uploaderProps: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update:modelValue'],

  data () {
    return {
      base64: '',
      isEmpty: true,
      isOpenedDialog: false
    }
  },

  computed: {
    defaultUploaderProps () {
      return {
        addButtonLabel: 'Adicionar assinatura',
        ...this.uploaderProps
      }
    },

    defaultDialogProps () {
      return {
        maxWidth: '620px',
        ...this.dialogProps,
        ok: {
          label: 'Salvar',
          onClick: () => this.getSignatureData()
        }
      }
    },

    model: {
      get () {
        return this.modelValue
      },

      set (value) {
        this.$emit('update:modelValue', value)
      }
    },

    signaturePadHeight () {
      const sizes = {
        [this.$qas.screen.isSmall]: '250',
        [this.$qas.screen.isMedium]: '400',
        [this.$qas.screen.isLarge]: '250'
      }

      return sizes.true
    },

    signaturePadWidth () {
      const sizes = {
        [this.$qas.screen.isSmall]: { width: '100%' },
        [this.$qas.screen.isMedium]: { width: '570px' },
        [this.$qas.screen.isLarge]: { width: '350px' }
      }

      return sizes.true
    },

    uploaderScope () {
      return this.$refs?.uploader?.uploader
    }
  },

  methods: {
    closeSignature () {
      this.isOpenedDialog = false
    },

    openDialog () {
      if (this.readonly) return

      this.isOpenedDialog = true
    },

    getSignatureData () {
      this.uploaderScope.removeUploadedFiles()

      this.base64 = this.$refs.signaturePadModal.getSignatureData()

      this.upload(this.uploaderScope)
      this.closeSignature()
    },

    upload () {
      try {
        const fileName = this.signatureLabel.split(' ').join('-')
        const extension = this.type.split('/').pop() || 'png'
        const blob = base64ToBlob(this.base64)
        const file = new File([blob], `${fileName}.${extension}`, { type: this.type })

        this.uploaderScope.addFiles([file])
      } catch {
        NotifyError('Falha ao carregar assinatura.')
      }
    }
  }
}
</script>
