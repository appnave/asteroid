<template>
  <q-img :ratio="ratio" spinner-color="grey-7" :src="imageSource">
    <template #error>
      <div class="absolute-full bg-grey-2 flex flex-center text-grey">⚠︎</div>
    </template>
  </q-img>
</template>

<script>
import { getGreatestCommonDivisor } from '../../helpers'

const baseURL = 'https://image-resize.nave.dev/'

export default {
  name: 'QasResizer',

  props: {
    size: {
      default: '',
      type: String
    },

    source: {
      required: true,
      type: String
    },

    resize: {
      default: 'cover',
      type: String,
      validator: value =>
        ['cover', 'contain', 'fill', 'inside', 'outside'].includes(value)
    }
  },

  computed: {
    height () {
      return this.$attrs.height || this.imageSize.height
    },

    imageParameters () {
      const parameters = {
        bucket: import.meta.env.BUCKET,
        key: this.source,
        edits: {}
      }

      if (this.height || this.width) {
        parameters.edits.resize = {
          fit: this.resize,
          height: this.height,
          width: this.width
        }
      }

      return parameters
    },

    imageSize () {
      const [width, height] = this.size.split('x')
      return { height, width }
    },

    imageSource () {
      return baseURL + btoa(JSON.stringify(this.imageParameters))
    },

    ratio () {
      if (!this.height || !this.width) {
        return undefined
      }

      if (this.height === this.width) {
        return 1
      }

      const height = parseInt(this.height)
      const width = parseInt(this.width)

      const divisor = getGreatestCommonDivisor(height, width)

      return (width / divisor) / (height / divisor)
    },

    width () {
      return this.$attrs.width || this.imageSize.width
    }
  }
}
</script>
