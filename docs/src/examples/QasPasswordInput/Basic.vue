<template>
  <div class="container q-py-lg">
    <qas-password-input v-model="password" v-model:current-level="currentLevel" label="Senha" />

    <div>
      Senha: {{ password }}
    </div>
    <div>
      currentLevel: {{ currentLevel }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      password: '',
      currentLevel: 0
    }
  }
}
</script>
