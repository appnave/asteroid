<template>
  <q-dialog ref="dialog" persistent @hide="onDialogHide">
    <q-card class="full-width" style="max-width: 80vw;">
      <q-card-section>
        <component :is="component" v-if="component" :route="normalizedRoute" :use-boundary="false" @hide="hide" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import NotifyError from '../../plugins/notify-error/NotifyError.js'

import { Loading, extend } from 'quasar'
import { ref, markRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineOptions({ name: 'QasDialogRouter' })

const emit = defineEmits(['error', 'hide'])

defineExpose({ show, hide })

const router = useRouter()
const route = useRoute()

// template refs
const dialog = ref(null)

const component = ref(null)
const parentRoute = ref('')
const normalizedRoute = ref(null)

// functions
function hide () {
  dialog.value.hide()
}

function onDialogHide () {
  if (history && parentRoute.value) {
    history.replaceState(null, null, parentRoute.value)
  }

  component.value = ''
  parentRoute.value = ''
  normalizedRoute.value = null

  emit('hide')
}

function getResolvedRoute (path) {
  return router.resolve(path)
}

async function show (routeParam) {
  parentRoute.value = route.fullPath
  normalizedRoute.value = getResolvedRoute(routeParam)

  if (history) {
    history.replaceState(null, null, normalizedRoute.value.fullPath)
  }

  try {
    Loading.show()

    const component = markRaw(
      extend(true, {}, [...normalizedRoute.value.matched].pop().components.default)
    )

    if (typeof component.value !== 'function') {
      component.value = component
      dialog.value.show()
    } else {
      const componentFn = (await component()).default
      component.value = componentFn

      dialog.value.show()
    }
  } catch (error) {
    NotifyError('Ops! Erro ao carregar item.')
    emit('error', error)
  } finally {
    Loading.hide()
  }
}
</script>
