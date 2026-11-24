<template>
  <qas-list-view v-model:fields="fields" v-model:results="results" :entity="entity" :use-filter="false">
    <template #default>
      <qas-table-generator :fields="fields" :results="results" row-key="uuid" :row-route-fn="rowRouteFn" />
    </template>
  </qas-list-view>
</template>

<script>
export default {
  name: 'TableLink',

  data () {
    return {
      fields: {},
      results: []
    }
  },

  computed: {
    entity () {
      return 'users'
    }
  },

  methods: {
    rowRouteFn (row) {
      // tratamento feito pra deixar somente as linhas que são ativas clicaveis.
      if (!row.default.isActive) return

      /*
        Poderá ter acesso ao row, caso precise passar uma rota com id da linha por exemplo:
        { path: 'table-generator', params: { id: row.uuid } }
      */
      return { path: 'table-generator' }
    }
  }
}
</script>
