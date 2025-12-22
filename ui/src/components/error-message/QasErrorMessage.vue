<template>
  <div class="qas-error-message">
    {{ props.message }}
  </div>
</template>

<script setup>
defineOptions({ name: 'QasErrorMessage' })

const props = defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
// $
.qas-error-message {
  @include set-error-message;
}
</style>
