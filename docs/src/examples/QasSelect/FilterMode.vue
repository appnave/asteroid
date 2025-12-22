<template>
  <div class="container q-py-lg">
    <div class="q-mb-lg">
      <qas-select v-model="model" v-bind="selectProps" use-filter-mode />
    </div>

    <div class="q-mb-lg">
      <qas-select v-model="model" error error-message="Mensagem de erro" v-bind="selectProps" use-filter-mode />
    </div>

    <qas-box class="q-mb-lg">
      <qas-label label="Dentro de box" />

      <qas-select v-model="model" v-bind="selectProps" use-filter-mode />

      <qas-select v-model="model" class="q-mt-lg" error error-message="Mensagem de erro" v-bind="selectProps" use-filter-mode />
    </qas-box>

    <div>
      <qas-label label="Dentro do dialog" />

      <qas-btn label="Abrir dialog" @click="toggleDialog" />

      <qas-dialog v-bind="dialogProps" v-model="showDialog">
        <template #description>
          <qas-select v-model="model" v-bind="selectProps" use-filter-mode />
        </template>
      </qas-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'FilterMode' })

const model = ref('')
const showDialog = ref(false)

const selectProps = {
  icon: 'sym_r_apartment',

  options: [
    {
      label: 'Opção 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis.',
      value: 1
    },
    {
      label: 'Opção 2',
      value: 2
    },
    {
      label: 'Opção 3',
      value: 3
    },
    {
      label: 'Opção 4',
      value: 4
    },
    {
      label: 'Opção 5',
      value: 5
    },
    {
      label: 'Opção 6',
      value: 6
    },
    {
      label: 'Opção 7',
      value: 7
    },
    {
      label: 'Opção 8',
      value: 8
    },
    {
      label: 'Opção 9',
      value: 9
    },
    {
      label: 'Opção 10',
      value: 10
    },
    {
      label: 'Opção 11',
      value: 11
    },
    {
      label: 'Opção 12',
      value: 12
    },
    {
      label: 'Opção 13',
      value: 13
    },
    {
      label: 'Opção 14',
      value: 14
    },
    {
      label: 'Opção 15',
      value: 15
    },
    {
      label: 'Opção 16',
      value: 16
    },
    {
      label: 'Opção 17',
      value: 17
    },
    {
      label: 'Opção 18',
      value: 18
    },
    {
      label: 'Opção 19',
      value: 19
    },
    {
      label: 'Opção 20',
      value: 20
    }
  ],

  label: 'Meu select!'
}

const dialogProps = {
  card: {
    title: 'Selecione uma opção'
  }
}

function toggleDialog () {
  showDialog.value = !showDialog.value
}
</script>
