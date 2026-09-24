<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div class="col-4">
        <qas-card :route="{ name: 'Root' }">
          <template #default>
            <div>
              Meu conteúdo
            </div>
          </template>
        </qas-card>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'PageNoHeader' })
</script>
