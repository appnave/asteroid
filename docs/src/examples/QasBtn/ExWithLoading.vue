<template>
  <div class="container q-py-lg">
    <div class="q-mb-sm text-body1">
      Clique em uma ação para visualizar o exemplo com loading
    </div>

    <div class="column q-gutter-y-md">
      <div>
        <qas-btn icon="sym_r_create" label="Visualizar" :loading="loading.visibility" @click="handleLoading('visibility')" />
      </div>

      <div>
        <qas-btn icon="sym_r_person" label="Editar" :loading="loading.edit" variant="secondary" @click="handleLoading('edit')" />
      </div>

      <div>
        <qas-btn icon-right="sym_r_person" label="Editar" :loading="loading.edit" variant="secondary" @click="handleLoading('edit')" />
      </div>

      <div>
        <qas-btn icon="sym_r_person" label="Perfil" :loading="loading.person" variant="primary" @click="handleLoading('person')" />
      </div>

      <div>
        <qas-btn icon="sym_r_person" :loading="loading.person" variant="primary" @click="handleLoading('person')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'ExWithLoading' })

// refs
const loading = ref({
  visibility: false,
  edit: false,
  person: false
})

// functions
async function handleLoading (fieldKey) {
  loading.value[fieldKey] = true

  await sleepPromise()

  loading.value[fieldKey] = false
}

function sleepPromise () {
  return new Promise(resolve => setTimeout(() => resolve(), 3000))
}
</script>
