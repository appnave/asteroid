<template>
  <div class="container q-gutter-y-lg spaced">
    <!-- INFO STATUS -->
    <div>
      <qas-alert status="info" :text :use-background="false" />
    </div>

    <div>
      <qas-alert status="info" :text />
    </div>

    <div>
      <qas-alert status="info" :text use-close-button />
    </div>

    <!-- ERROR STATUS -->
    <div>
      <qas-alert status="error" :text :use-background="false" />
    </div>

    <div>
      <qas-alert status="error" :text />
    </div>

    <div>
      <qas-alert status="error" :text use-close-button />
    </div>

    <!-- SUCCESS STATUS -->
    <div>
      <qas-alert status="success" :text :use-background="false" />
    </div>

    <div>
      <qas-alert status="success" :text />
    </div>

    <div>
      <qas-alert status="success" :text use-close-button />
    </div>

    <!-- WARNING STATUS -->
    <div>
      <qas-alert status="warning" :text :use-background="false" />
    </div>

    <div>
      <qas-alert status="warning" :text />
    </div>

    <div>
      <qas-alert status="warning" :text use-close-button />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })

const text = 'Usuário incompleto, atualize para completar.'
</script>
