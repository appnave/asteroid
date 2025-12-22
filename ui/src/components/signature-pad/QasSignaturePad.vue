<template>
  <div ref="signatureContainer" class="qas-signature-pad relative-position">
    <canvas :id="canvasId" :ref="$attrs.ref" class="qas-signature-pad__canvas rounded-borders vertical-bottom" :height="height" />
    <qas-btn v-if="!empty" class="absolute-bottom-right q-mb-sm q-mr-sm" icon="sym_r_delete" variant="primary" @click="clearSignature" />
  </div>

  <div>
    <slot :clear-signature="clearSignature" :get-signature-data="getSignatureData" />
  </div>
</template>

<script>
import QasBtn from '../btn/QasBtn.vue'

import { uid } from 'quasar'
import isEqual from 'lodash-es/isEqual'
import SignaturePad from 'signature_pad'

export default {
  name: 'QasSignaturePad',

  components: {
    QasBtn
  },

  props: {
    empty: {
      type: Boolean,
      default: true
    },

    height: {
      default: '250',
      type: String
    },

    signatureOptions: {
      default: () => ({}),
      type: Object
    },

    type: {
      default: 'image/png',
      type: String
    }
  },

  emits: ['update:empty'],

  expose: ['clearSignature', 'getSignatureData'],

  data () {
    return {
      canvasId: uid(),
      hasEndStrokeEvent: false,
      signaturePad: null,
      SignaturePad: null
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
    this.signaturePad.off()
  },

  methods: {
    clearSignature () {
      this.signaturePad.clear()
      this.updateEmptyModel()
    },

    getSignatureData () {
      return this.signaturePad.toDataURL(this.type)
    },

    setCanvasWidth () {
      const signatureContainer = this.$refs.signatureContainer
      const canvasElement = signatureContainer.querySelector('canvas')
      canvasElement.setAttribute('width', signatureContainer.offsetWidth)
    },

    setupSignaturePad () {
      const canvasElement = document.getElementById(this.canvasId)
      this.signaturePad = new SignaturePad(canvasElement, this.signatureOptions)

      if (!this.hasEndStrokeEvent) {
        this.signaturePad.addEventListener('endStroke', this.updateEmptyModel)
      }

      this.hasEndStrokeEvent = true
      this.clearSignature()
    },

    updateEmptyModel () {
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
