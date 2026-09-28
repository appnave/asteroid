<template>
  <div class="container q-py-lg">
    <qas-btn-dropdown v-bind="btnDropdownProps">
      <q-list>
        <q-item v-for="item in 10" :key="item">
          Meu item - {{ item }}
        </q-item>
      </q-list>
    </qas-btn-dropdown>

    <div class="q-mt-lg">
      <qas-btn :label="buttonLabel" @click="toggleSkeleton" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// refs
const showSkeleton = ref(true)

// computeds
const btnDropdownProps = computed(() => {
  return {
    buttonsPropsList: {
      export: {
        label: 'Exportar arquivo',
        icon: 'sym_r_upload',
        color: 'primary',
        onClick: () => alert('Exportando...')
      },

      sync: {
        label: 'Sincronizar arquivos',
        iconRight: 'sym_r_sync',
        onClick: () => alert('Sincronizando...')
      }
    },

    useSplit: true,
    skeleton: showSkeleton.value
  }
})

const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

// functions
function toggleSkeleton () {
  showSkeleton.value = !showSkeleton.value
}
</script>
