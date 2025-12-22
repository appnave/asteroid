<template>
  <div class="container spaced">
    <qas-stepper v-model="model" use-vertical>
      <template #default="{ next, previous }">
        <q-step :done="model > 1" :name="1" prefix="1" title="Página 1">
          <div class="q-mb-md">Conteúdo da Página 1</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step :done="model > 2" :name="2" prefix="2" title="Página 2">
          <div class="q-mb-md">Conteúdo da Página 2</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Voltar" @click="previous" />

            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step :name="3" prefix="3" title="Página 3">
          <div class="q-mb-md">Conteúdo da Página 3</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Voltar" @click="previous" />
          </div>
        </q-step>
      </template>
    </qas-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Vertical' })

// models
const model = ref(1)
</script>
