<template>
  <div class="container q-py-lg">
    <qas-btn-dropdown :buttons-props-list="buttonsPropsList">
      <template #btn-content-menu>
        <q-menu>
          <q-list>
            <q-item v-for="item in 5" :key="item">
              Opção de exportação - {{ item }}
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </qas-btn-dropdown>
  </div>
</template>

<script setup>
defineOptions({ name: 'BtnContentSlot' })

const buttonsPropsList = {
  menu: {
    label: 'Clique para abrir o QMenu',
    icon: 'sym_r_upload',
    color: 'primary'
  },

  sync: {
    label: 'Sincronizar arquivos',
    iconRight: 'sym_r_sync',
    onClick: () => alert('Sincronizando...')
  }
}
</script>
