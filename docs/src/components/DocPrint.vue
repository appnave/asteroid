<template>
  <div class="doc-print">
    <h4 class="q-mb-md text-h4">
      {{ title }}
    </h4>

    <q-img :alt="alt" :src="src" :width="width" />
  </div>
</template>

<script>
export default {
  name: 'DocPrint',

  props: {
    title: {
      type: String,
      default: 'Imagem de exemplo'
    },

    alt: {
      type: String,
      default: ''
    },

    src: {
      type: String,
      default: ''
    },

    width: {
      type: String,
      default: '100%'
    }
  }
}
</script>
