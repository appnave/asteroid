<template>
  <div class="container spaced">
    <div class="col-12 col-md-6">
      <qas-grid-generator :fields="fields" :result="result" use-box :use-empty-result="false" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UseEmptyResult',

  data () {
    return {
      fields: {
        name: { name: 'name', label: 'Nome', type: 'text' },
        email: { name: 'email', label: 'E-mail (null)', type: 'text' },
        phone: { name: 'phone', label: 'Telefone (vazio)', type: 'text' },
        document: { name: 'document', label: 'Documento (sem a chave)', type: 'text' },
        tags: { name: 'tags', label: 'Tags (lista vazia)', type: 'text' },
        address: { name: 'address', label: 'Endereço (objeto vazio)', type: 'text' }
      },

      result: {
        name: 'Ana Souza',
        email: null,
        phone: '',
        tags: [],
        address: {}
      }
    }
  }
}
</script>
