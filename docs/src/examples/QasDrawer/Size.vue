<template>
  <div class="container q-py-lg">
    <qas-select v-model="drawerSize" label="Selecione o tamanho do drawer" :options />

    <qas-btn class="q-mt-md" label="Abrir drawer" @click="toggle" />

    <qas-drawer v-model="isDrawerOpened" v-bind="drawerProps">
      <qas-list-items class="full-width" :list="list" redirect-key="uuid">
        <template #item-section="{ item }">
          <div>
            name: {{ item.name }}
          </div>
        </template>
      </qas-list-items>
    </qas-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// refs
const isDrawerOpened = ref(false)
const drawerSize = ref('sm')

// consts
const list = [
  { name: 'item 1', email: 'email1@example.com', uuid: 'uuid1' },
  { name: 'item 2', email: 'email2@example.com', uuid: 'uuid2' },
  { name: 'item 3', email: 'email3@example.com', uuid: 'uuid3' },
  { name: 'item 4', email: 'email4@example.com', uuid: 'uuid4' },
  { name: 'item 5', email: 'email5@example.com', uuid: 'uuid5' },
  { name: 'item 6', email: 'email6@example.com', uuid: 'uuid6' },
  { name: 'item 7', email: 'email7@example.com', uuid: 'uuid7' },
  { name: 'item 8', email: 'email8@example.com', uuid: 'uuid8' },
  { name: 'item 9', email: 'email9@example.com', uuid: 'uuid9' },
  { name: 'item 10', email: 'email10@example.com', uuid: 'uuid10' }
]

const options = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
  { label: 'xl', value: 'xl' }
]

// computeds
const drawerProps = computed(() => {
  return {
    title: 'Título de exemplo',
    position: 'right',
    size: drawerSize.value
  }
})

// functions
function toggle () {
  isDrawerOpened.value = !isDrawerOpened.value
}
</script>
