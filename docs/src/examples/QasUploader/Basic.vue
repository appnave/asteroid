<template>
  <q-form class="container spaced">
    <qas-uploader v-model="model" add-button-label="Adicionar imagem" entity="customers/import/upload" label="Meu uploader" />
    <qas-debugger :inspect="[model]" />
  </q-form>
</template>

<script>
export default {
  data () {
    return {
      model: 'https://placehold.co/600x400/orange/white?text=img1'
    }
  }
}
</script>
