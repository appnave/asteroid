<template>
  <div ref="signatureContainer" class="qas-signature-pad relative-position">
    <canvas
      :id="canvasId"
      class="qas-signature-pad__canvas rounded-borders vertical-bottom"
      :height="height"
    />

    <qas-btn
      v-if="!empty"
      class="absolute-bottom-right q-mb-sm q-mr-sm"
      icon="sym_r_delete"
      variant="primary"
      @click="clearSignature"
    />
  </div>

  <div>
    <slot
      :clear-signature="clearSignature"
      :get-signature-data="getSignatureData"
    />
  </div>
</template>

<script>
import QasBtn from '../btn/QasBtn.vue'
import { uid } from 'quasar'
import isEqual from 'lodash-es/isEqual'
import SignaturePad from 'signature_pad'

export default {
  name: 'QasSignaturePad',

  components: { QasBtn },

  props: {
    empty: {
      type: Boolean,
      default: true
    },

    height: {
      type: String,
      default: '250'
    },

    signatureOptions: {
      type: Object,
      default: () => ({})
    },

    type: {
      type: String,
      default: 'image/png'
    }
  },

  emits: ['update:empty'],

  expose: ['clearSignature', 'getSignatureData'],

  data () {
    return {
      canvasId: uid(),
      signaturePad: null
    }
  },

  watch: {
    async signatureOptions (newValue, oldValue) {
      if (isEqual(newValue, oldValue)) return

      await this.setupSignaturePad()
      this.updateEmptyModel()
    }
  },

  mounted () {
    window.addEventListener('resize', this.setCanvasWidth)

    this.setCanvasWidth()
    this.setupSignaturePad()
  },

  unmounted () {
    window.removeEventListener('resize', this.setCanvasWidth)

    this.destroySignaturePad()
  },

  methods: {
    destroySignaturePad () {
      if (!this.signaturePad) return

      this.signaturePad.off()
      this.signaturePad.onEnd = null
      this.signaturePad = null
    },

    clearSignature () {
      if (!this.signaturePad) return

      this.signaturePad.clear()
      this.updateEmptyModel()
    },

    getSignatureData () {
      if (!this.signaturePad) return ''

      return this.signaturePad.toDataURL(this.type)
    },

    setCanvasWidth () {
      const container = this.$refs.signatureContainer
      if (!container) return

      const canvas = container.querySelector('canvas')
      if (!canvas) return

      canvas.width = container.offsetWidth
    },

    setupSignaturePad () {
      const canvas = document.getElementById(this.canvasId)
      if (!canvas) return

      this.destroySignaturePad()

      this.signaturePad = new SignaturePad(canvas, this.signatureOptions)

      this.signaturePad.onEnd = this.updateEmptyModel

      this.clearSignature()
    },

    updateEmptyModel () {
      if (!this.signaturePad) return

      this.$emit('update:empty', this.signaturePad.isEmpty())
    }
  }
}
</script>

<style lang="scss">
.qas-signature-pad {
  &__canvas {
    border: 1px solid $separator-color;
  }
}
</style>
