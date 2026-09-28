<template>
  <qas-list-view v-model:fields="fields" v-model:results="results" :entity="entity" :use-filter="false">
    <template #default>
      <qas-table-generator :columns :fields="fields" :header-props :results="results" row-key="uuid" />
    </template>
  </qas-list-view>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'WithHeader' })

const entity = 'users'

const fields = ref({})
const results = ref([])

const columns = [
  'isActive',
  'document',
  'companies',
  'createdAt',
  'company',
  'date',
  'email',
  'observation'
]

const headerProps = {
  description: 'Algum texto de exemplo para ficar ao lado do botão de adicionar.',
  labelProps: {
    label: 'Título do header'
  },
  buttonProps: {
    icon: 'sym_r_add',
    label: 'Novo usuário'
  }
}
</script>
