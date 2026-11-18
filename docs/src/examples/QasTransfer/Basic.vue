<template>
  <div class="container q-py-lg">
    <div class="q-gutter-sm q-mb-md">
      <qas-btn label="Recarregar options" variant="secondary" @click="reloadOptions" />
      <qas-btn label="Limpar model" variant="secondary" @click="clearModel" />
    </div>

    <qas-transfer v-model="model" label="Selecionar" :options="list" />

    <div>
      model: <qas-debugger :inspect="model" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: [],
      model2: [
        {
          label: 'item 3',
          email: 'email3@example.com',
          value: 'uuid3'
        },
        {
          label: 'item 1',
          email: 'email1@example.com',
          value: 'uuid1'
        }
      ],
      list: [
        {
          label: 'item 1',
          email: 'email1@example.com',
          value: 'uuid1'
        },
        {
          label: 'item 2',
          email: 'email2@example.com',
          value: 'uuid2'
        },
        {
          label: 'item 3',
          email: 'email3@example.com',
          value: 'uuid3'
        }
      ]
    }
  },

  methods: {
    // simula um refetch: mesma lista em um array novo
    reloadOptions () {
      this.list = this.list.map(item => ({ ...item }))
    },

    clearModel () {
      this.model = []
    }
  }
}
</script>
