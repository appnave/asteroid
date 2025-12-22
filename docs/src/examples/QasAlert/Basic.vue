<template>
  <div class="container q-gutter-y-lg spaced">
    <div>
      <qas-alert :text />
    </div>

    <div>
      <qas-alert status="error" :text />
    </div>

    <div>
      <qas-alert status="success" :text />
    </div>

    <div>
      <qas-alert :text use-close-button />
    </div>

    <div>
      <qas-alert :text use-close-button use-persistent-model-on-close />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })

const text = 'Usuário incompleto, atualize para completar.'
</script>
