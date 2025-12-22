<template>
  <div class="container spaced">
    <qas-stepper v-model="model">
      <template #default="{ next, previous }">
        <q-step caption="example 1" :done="model > 1" icon="sym_r_article" :name="1" title="Página 1">
          <div class="q-mb-md">Conteúdo da Página 1</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step caption="example 2" :done="model > 2" icon="sym_r_description" :name="2" title="Página 2">
          <div class="q-mb-md">Conteúdo da Página 2</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Voltar" @click="previous" />
            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step caption="example 3" icon="sym_r_news" :name="3" title="Página 3">
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

defineOptions({ name: 'Basic' })

const model = ref(2)
</script>
