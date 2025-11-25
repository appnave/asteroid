import { NotifyError } from '../../plugins'
import { camelizeFieldsName } from '../../helpers'

import { useView as useViewComposable } from '@bildvitta/composables'
import { ref, computed, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'

export const baseProps = {
  beforeFetch: {
    default: null,
    type: Function
  },

  errors: {
    default: () => ({}),
    type: Object
  },

  entity: {
    type: String,
    required: ''
  },

  fetching: {
    type: Boolean
  },

  fields: {
    default: () => ({}),
    type: Object
  },

  metadata: {
    default: () => ({}),
    type: Object
  },

  url: {
    default: '',
    type: String
  },

  useBoundary: {
    default: true,
    type: Boolean
  },

  useStore: {
    default: true,
    type: Boolean
  }
}

export const baseEmits = [
  'update:fields',
  'update:errors',
  'update:metadata',
  'update:fetching'
]

/**
 * @param {{
 *  mode: import('@bildvitta/composables').ViewModeTypes,
 *  props: baseProps,
 *  emit: (baseEmits: string) => void,
 *  slots: import('vue').Slots
 * }} config
 */
export default function useView (config) {
  const {
    emit,
    mode,
    slots,
    props
  } = config

  // composables
  const router = useRouter()
  const { viewState } = useViewComposable({ mode })

  // refs
  const cancelBeforeFetch = ref(false)
  const hasFetchError = ref(false)

  // constants
  const fetchErrorMessage = 'Ops… Não conseguimos acessar as informações. Por favor, tente novamente em alguns minutos.'

  // computed
  const hasFooterSlot = computed(() => !!slots.footer)
  const hasHeaderSlot = computed(() => !!slots.header)
  const hasFetchErrorSlot = computed(() => !!slots['fetch-error'])
  const canShowFetchErrorSlot = computed(() => hasFetchErrorSlot.value && hasFetchError.value)

  // watch
  watch(() => viewState.value.fetching, value => emit('update:fetching', value))

  // functions
  function errorHandler (error) {
    const { response } = error

    const status = response?.status

    const redirect = status >= 500
      ? 'ServerError'
      : ({ 403: 'Forbidden', 404: 'NotFound' })[status]

    /**
     * caso exista um desses status será redirecionado sem aparecer o "notify"
     */
    if (redirect) {
      router.replace({ name: redirect })

      return
    }

    hasFetchError.value = true

    NotifyError(fetchErrorMessage)
  }

  function setErrors (errors = {}) {
    viewState.value.errors = markRaw(errors)
  }

  function setFields (fields = {}) {
    const camelizedFields = camelizeFieldsName(fields)

    viewState.value.fields = markRaw(camelizedFields)
  }

  function setMetadata (metadata = {}) {
    viewState.value.metadata = markRaw(metadata)
  }

  function setResult (result = {}) {
    viewState.value.result = result
  }

  function updateModels (models) {
    for (const key in models) {
      if (!models[key]) continue

      emit(`update:${key}`, models[key])
    }
  }

  function fetchHandler (payload, resolve) {
    const hasBeforeFetch = typeof props.beforeFetch === 'function'

    if (hasBeforeFetch && !cancelBeforeFetch.value) {
      return props.beforeFetch({
        payload,
        resolve: payload => resolve(payload),
        done: () => {
          cancelBeforeFetch.value = true
        }
      })
    }

    resolve()
  }

  return {
    // state
    viewState,

    // constants
    fetchErrorMessage,

    // computed
    hasFooterSlot,
    hasHeaderSlot,
    canShowFetchErrorSlot,

    // functions
    errorHandler,
    fetchHandler,
    setErrors,
    setFields,
    setResult,
    setMetadata,
    updateModels
  }
}
