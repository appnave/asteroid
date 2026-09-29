<template>
  <div class="container spaced">
    <qas-filters v-model:current-filters="currentFilters" :entity="entity" :use-update-route="false" />
    Valor filtrado: <qas-debugger :inspect="[currentFilters]" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentFilters: {}
    }
  },

  computed: {
    entity () {
      return 'users'
    }
  }
}
</script>
