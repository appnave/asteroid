<template>
  <div class="container spaced">
    <div>Exemplo com path</div>
    <qas-delete v-model:deleting="isDeleting" :custom-id="customId" entity="users" redirect-route="/" />

    <div class="q-mt-lg">Exemplo com objeto</div>
    <qas-delete v-model:deleting="isDeleting" :custom-id="customId" entity="users" :redirect-route="{ path: '/' }" />

    <!-- Remover este código -->
    <div class="q-mt-lg">
      user: <qas-debugger :inspect="[user]" />
      isDeleting: {{ isDeleting }}
    </div>
  </div>
</template>

<script>
// estes scripts tem a finalidade de utilização na documentação.
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isDeleting: false
    }
  },

  computed: {
    ...mapGetters('users', {
      userById: 'byId'
    }),

    customId () {
      return '31362c39-2cb5-4fe2-982a-c270f88d2462'
    },

    user () {
      return this.userById(this.customId)
    }
  },

  created () {
    this.fetchSingle({ id: this.customId })
  },

  methods: {
    ...mapActions('users', ['fetchSingle'])
  }
}
</script>
