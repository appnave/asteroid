<template>
  <div class="container spaced">
    <qas-stepper v-model="model" header-nav>
      <template #default="{ next, previous }">
        <q-step caption="example 1" :done="model > 1" icon="sym_r_article" :name="1" title="Página 1">
          <div class="q-mb-md">Conteúdo da Página 1</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step caption="example 2" :done="model > 2" error icon="sym_r_description" :name="2" title="Página 2">
          <div class="q-mb-md">Conteúdo da Página 2</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Voltar" @click="previous" />
            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step caption="example 3" disable :done="model > 3" icon="sym_r_news" :name="3" title="Página 3">
          <div class="q-mb-md">Conteúdo da Página 3</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Voltar" @click="previous" />

            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step caption="example 4" :done="model > 4" icon="sym_r_event" :name="4" title="Página 4">
          <div class="q-mb-md">Conteúdo da Página 4</div>

          <div class="column items-start q-gutter-sm">
            <qas-btn label="Voltar" @click="previous" />

            <qas-btn label="Próximo" @click="next" />
          </div>
        </q-step>

        <q-step caption="example 5" :done="model > 5" icon="sym_r_check_circle" :name="5" title="Página 5">
          <div class="q-mb-md">Conteúdo da Página 5</div>

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

defineOptions({ name: 'StepperWithError' })

const model = ref(1)
</script>
