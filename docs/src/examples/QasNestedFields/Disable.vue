<template>
  <div class="container spaced">
    <div class="full-width">
      <div class="q-mt-lg text-center">
        <div>
          <qas-nested-fields v-model="model" v-bind="nestedFieldsProps" />
        </div>

        <q-separator class="q-my-lg" />

        <div>
          <qas-nested-fields v-model="model" v-bind="nestedFieldsProps" use-inline-actions />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// models
const model = ref([])

// consts
const field = {
  name: 'nested',
  type: 'nested',
  label: 'Meu nested',
  children: {
    status: {
      name: 'status',
      type: 'boolean',
      label: 'Status'
    },
    name: {
      name: 'name',
      type: 'text',
      label: 'Nome'
    },
    email: {
      name: 'email',
      type: 'email',
      label: 'E-mail'
    }
  }
}

const nestedFieldsProps = {
  disable: true,
  formCommonColumns: '12',
  field,
  useStartsEmpty: false
}
</script>
