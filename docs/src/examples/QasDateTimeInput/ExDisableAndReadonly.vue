<template>
  <div class="container spaced">
    <div>
      <qas-date-time-input v-model="model" disable label="Meu DateTimeInput" />
    </div>

    <div>
      <qas-date-time-input v-model="model" label="Meu DateTimeInput" readonly />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: new Date().toISOString()
    }
  }
}
</script>
