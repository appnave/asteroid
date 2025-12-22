<template>
  <div class="container q-col-gutter-sm q-py-lg row">
    <div class="col-4">
      <qas-input v-model="model" counter label="Meu input" :maxlength="30" />
    </div>

    <div class="col-4">
      <qas-input v-model="model2" error error-message="Mensagem de erro" icon-right="sym_r_person" label="Meu input" type="textarea" />
    </div>

    <div class="col-4">
      <qas-input v-model="model2" error error-message="Mensagem de erro" label="Meu input" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: '',
      model2: ''
    }
  }
}
</script>
