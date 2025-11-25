<template>
  <qas-drawer v-model="drawerModel" v-bind="drawerProps">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <qas-btn color="grey-10" :disable="isDisabled" icon="sym_r_keyboard_double_arrow_right" label="Fechar" @click="closeOverlay" />

          <q-separator class="q-mx-md" vertical />

          <qas-btn color="grey-10" :disable="isBackButtonDisabled" icon="sym_r_keyboard_arrow_left" tooltip="Voltar para página anterior." @click="router.go(-1)" />

          <qas-btn color="grey-10" :disable="isForwardButtonDisabled" icon="sym_r_keyboard_arrow_right" tooltip="Ir para próxima página." @click="router.go(1)" />
        </div>

        <qas-btn color="grey-10" :disable="isDisabled" icon="sym_r_zoom_out_map" label="Ampliar" @click="expandOverlay" />
      </div>
    </template>

    <template #default>
      <router-view name="overlay" />
    </template>
  </qas-drawer>
</template>

<script setup>
import QasDrawer from '../../drawer/QasDrawer.vue'
import QasBtn from '../../btn/QasBtn.vue'

import useOverlayNavigation from '../../../composables/use-overlay-navigation'

import { ref, watch, computed, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'PvLayoutOverlayDrawer' })

// globals
provide('isOverlay', true)

// composables
const route = useRoute()
const router = useRouter()

const {
  closeOverlay,
  expandOverlay,
  hasNextRoute,
  hasPreviousRoute,
  canLeaveOverlay
} = useOverlayNavigation()

// refs
const drawerModel = ref(false)

// computeds
const isDisabled = computed(() => !canLeaveOverlay.value)

const isBackButtonDisabled = computed(() => !hasPreviousRoute.value || isDisabled.value)
const isForwardButtonDisabled = computed(() => !hasNextRoute.value || isDisabled.value)

const drawerProps = computed(() => {
  return {
    position: 'right',
    maxWidth: '90%',
    dialogProps: {
      onHide: closeOverlay,
      noRouteDismiss: true,
      persistent: isDisabled.value
    }
  }
})

// watchers
watch(() => route.query.overlay, overlay => {
  drawerModel.value = overlay === 'true'
}, { immediate: true })
</script>
