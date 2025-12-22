<template>
  <qas-list-view v-model:fields="viewState.fields" v-model:results="viewState.results" :entity :use-filter="false">
    <template #default>
      <qas-table-generator v-model:selected="selectedUsers" v-bind="tableGeneratorProps" />

      <qas-debugger :inspect="[selectedUsers]" />

      <qas-btn label="Alterar valor" @click="changeSelection" />
    </template>
  </qas-list-view>
</template>

<script setup>
import { useView } from '@bildvitta/composables'
import { computed, ref } from 'vue'

defineOptions({ name: 'Selection' })

// composables
const { viewState } = useView({ mode: 'list' })

// refs
const selectedUsers = ref([])

// consts
const entity = 'users'

// computeds
const tableGeneratorProps = computed(() => {
  return {
    fields: viewState.value.fields,
    results: viewState.value.results,
    rowKey: 'uuid',
    useSelection: true
  }
})

// functions
function changeSelection () {
  selectedUsers.value = [
    '2f8856d0-8eca-4e41-8146-63ed2a4f23ff4c',
    '943e4923-12c0-473e-a07f-63eb28201a91-24'
  ]
}
</script>
