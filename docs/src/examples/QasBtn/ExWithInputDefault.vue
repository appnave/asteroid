<template>
  <div class="container q-py-lg">
    <div class="column q-gutter-y-md">
      <qas-input>
        <template #append>
          <qas-btn icon="sym_r_add" label="Botão" />
        </template>
      </qas-input>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'ExWithInputDefault' })
</script>
