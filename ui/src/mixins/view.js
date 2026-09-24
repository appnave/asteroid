import { camelizeFieldsName } from '../helpers'

import { markRaw } from 'vue'

export default {
  props: {
    entity: {
      required: true,
      type: String
    },

    url: {
      default: '',
      type: String
    },

    fields: {
      default: () => ({}),
      type: Object
    },

    errors: {
      default: () => ({}),
      type: Object
    },

    metadata: {
      default: () => ({}),
      type: Object
    },

    fetching: {
      type: Boolean
    },

    useBoundary: {
      default: true,
      type: Boolean
    },

    beforeFetch: {
      default: null,
      type: Function
    }
  },

  emits: [
    'update:fields',
    'update:errors',
    'update:metadata',
    'update:fetching'
  ],

  data () {
    return {
      mx_errors: {},
      mx_fields: {},
      mx_metadata: {},
      mx_cancelBeforeFetch: false,
      mx_isFetching: false,
      mx_hasFetchError: false
    }
  },

  watch: {
    mx_isFetching (value) {
      this.$emit('update:fetching', value)
    }
  },

  computed: {
    mx_hasFooterSlot () {
      return !!(this.$slots.footer)
    },

    mx_hasHeaderSlot () {
      return !!(this.$slots.header)
    },

    mx_hasFetchErrorSlot () {
      return !!(this.$slots['fetch-error'])
    },

    mx_fetchErrorMessage () {
      return 'Ops… Não conseguimos acessar as informações. Por favor, tente novamente em alguns minutos.'
    },

    mx_canShowFetchErrorSlot () {
      return this.mx_hasFetchError && this.mx_hasFetchErrorSlot
    }
  },

  methods: {
    mx_fetchError (error) {
      const { response } = error

      const status = response?.status

      const redirect = status >= 500
        ? 'ServerError'
        : ({ 403: 'Forbidden', 404: 'NotFound' })[status]

      // caso exista um desses status será redirecionado sem aparecer o "notify"
      if (redirect) {
        this.$router.replace({ name: redirect })

        return
      }

      this.mx_hasFetchError = true

      this.$qas.error(this.mx_fetchErrorMessage)
    },

    mx_setErrors (errors = {}) {
      this.mx_errors = markRaw(errors)
    },

    mx_setFields (fields = {}) {
      const camelizedFields = camelizeFieldsName(fields)

      this.mx_fields = markRaw(camelizedFields)
    },

    mx_setMetadata (metadata = {}) {
      this.mx_metadata = markRaw(metadata)
    },

    mx_updateModels (models) {
      for (const key in models) {
        if (!models[key]) continue

        this.$emit(`update:${key}`, models[key])
      }
    },

    mx_fetchHandler (payload, resolve) {
      const hasBeforeFetch = typeof this.beforeFetch === 'function'

      if (hasBeforeFetch && !this.mx_cancelBeforeFetch) {
        return this.beforeFetch({
          payload,
          resolve: payload => resolve(payload),
          done: () => {
            this.mx_cancelBeforeFetch = true
          }
        })
      }

      resolve()
    }
  }
}
