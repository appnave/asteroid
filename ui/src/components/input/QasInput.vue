<template>
  <q-input ref="input" v-model="model" :autogrow="isTextarea" bottom-slots :class="classes" :counter="hasCounter" :dense="dense" :error="errorData" v-bind="$attrs" :error-message="errorMessage" :inputmode="defaultInputmode" :label="formattedLabel" :mask="currentMask" no-error-icon :outlined="outlined" :placeholder="placeholder" :readonly :unmasked-value="unmaskedValue" @paste="onPaste">
    <template v-if="icon" #prepend>
      <q-icon :name="icon" size="xs" />
    </template>

    <template v-if="hasAppendComponent" #append>
      <component
        :is="appendComponent.is"
        v-bind="appendComponent.props"
      />
    </template>

    <template v-for="(_, name) in $slots" #[name]="context">
      <slot :name="name" v-bind="context || {}" />
    </template>
  </q-input>
</template>

<script>
import { getRequiredLabel, getPlaceholder } from '../../helpers'

import { defineAsyncComponent, computed } from 'vue'

const Masks = {
  CompanyDocument: 'company-document',
  Document: 'document',
  PersonalDocument: 'personal-document',
  Phone: 'phone',
  PostalCode: 'postal-code'
}

export default {
  name: 'QasInput',

  components: {
    QasCopy: defineAsyncComponent(() => import('../copy/QasCopy.vue'))
  },

  provide () {
    return {
      /**
       * @see QasBtn.vue - Injetando os valores padrões para o QasBtn.
       */
      btnPropsDefaults: computed(() => {
        return {
          size: 'md',
          variant: 'tertiary',
          ...(this.hasError && { color: 'negative' })
        }
      })
    }
  },

  inheritAttrs: false,

  props: {
    dense: {
      default: true,
      type: Boolean
    },

    error: {
      type: Boolean
    },

    errorMessage: {
      type: String,
      default: ''
    },

    mask: {
      type: String,
      default: ''
    },

    modelValue: {
      default: '',
      type: [String, Number]
    },

    outlined: {
      type: Boolean
    },

    readonly: {
      type: Boolean
    },

    required: {
      type: Boolean
    },

    unmaskedValue: {
      default: true,
      type: Boolean
    },

    useRemoveErrorOnType: {
      type: Boolean
    },

    icon: {
      type: String,
      default: ''
    },

    iconRight: {
      type: String,
      default: ''
    },

    useCopy: {
      type: Boolean
    }
  },

  emits: ['update:modelValue'],

  data () {
    return {
      errorData: false,
      currentMask: '',
      inputReference: null
    }
  },

  computed: {
    hasError () {
      return this.inputReference?.hasError
    },

    masks () {
      return {
        [Masks.CompanyDocument]: () => 'XX.XXX.XXX/XXXX-##',

        [Masks.Document]: () => this.toggleDocumentMask({
          firstMask: 'XXX.XXX.XXX-XXX',
          secondMask: 'XX.XXX.XXX/XXXX-##'
        }),

        [Masks.PersonalDocument]: () => '###.###.###-##',
        [Masks.Phone]: () => this.toggleMask({ firstMask: '(##) ####-#####', secondMask: '(##) #####-####' }),
        [Masks.PostalCode]: () => '#####-###'
      }
    },

    defaultInputmode () {
      const { inputmode, type } = this.$attrs

      const defaults = {
        [Masks.CompanyDocument]: 'text',
        [Masks.Document]: 'text',
        [Masks.PersonalDocument]: 'numeric',
        [Masks.Phone]: 'tel',
        [Masks.PostalCode]: 'numeric',

        // types
        email: 'email'
      }

      return inputmode || defaults[this.mask || type]
    },

    model: {
      get () {
        return this.modelValue
      },

      set (value) {
        this.handleErrors()

        return this.$emit('update:modelValue', value)
      }
    },

    formattedLabel () {
      const { label } = this.$attrs

      return getRequiredLabel({ label, required: this.required })
    },

    // redesign
    classes () {
      return {
        'qas-input--has-icon': this.hasPrepend
      }
    },

    isTextarea () {
      return this.$attrs.type === 'textarea'
    },

    placeholder () {
      return this.$attrs.placeholder || getPlaceholder(this.mask || this.$attrs.type)
    },

    hasCounter () {
      return this.$attrs.counter ?? (this.$attrs.maxlength && this.isTextarea)
    },

    hasPrepend () {
      return !!this.$slots.prepend || this.icon
    },

    /**
     * Só existe o componente QasCopy quando utilizado em conjunto com a prop readonly.
     */
    hasCopy () {
      return this.useCopy && this.readonly
    },

    hasAppendComponent () {
      return this.hasCopy || !!this.iconRight
    },

    /**
     * Importa o dinamicamente os componentes para ser usado no append.
     *
     * a propriedade "useCopy" tem prioridade sobre a propriedade "iconRight".
     */
    appendComponent () {
      return {
        is: this.hasCopy ? 'qas-copy' : 'q-icon',
        props: {
          ...(this.hasCopy && {
            text: this.model,
            useText: false,
            disable: true
          }),

          ...(this.iconRight && {
            name: this.iconRight,
            size: 'xs'
          })
        }
      }
    }
  },

  watch: {
    currentMask (value) {
      if (!value) return

      const input = this.getInput()

      requestAnimationFrame(() => {
        input.selectionStart = input.value ? input.value.length : ''
      })
    },

    modelValue: {
      handler () {
        this.handleMask()
      },
      immediate: true
    },

    error: {
      handler (value) {
        this.errorData = value
      },

      immediate: true
    },

    /**
     * Pode acontecer da máscara ser alternada, entre CNPJ e CPF por exemplo.
     */
    mask () {
      this.handleMask()
    }
  },

  mounted () {
    this.inputReference = this.$refs.input
  },

  methods: {
    focus () {
      return this.inputReference.focus()
    },

    resetValidation () {
      return this.inputReference.resetValidation()
    },

    /**
     * Com base na quantidade de caracteres digitados, alterna entre duas máscaras.
     * @param {Object} params
     * @param {string} params.firstMask - Máscara inicial (ex: CPF -> ###.###.###-##)
     * @param {string} params.secondMask - Máscara secundária (ex: CNPJ -> XX.XXX.XXX/XXXX-##)
     * @param {string} [params.character='#'] - Token da máscara
     */
    toggleMask ({ firstMask, secondMask, character = '#' }) {
      const length = firstMask.split(character).length - 2

      return this.modelValue?.length > length ? secondMask : firstMask
    },

    /**
     * Com base na quantidade de caracteres digitados, alterna entre duas máscaras de CPF e CNPJ.
     * @param {Object} params
     * @param {string} params.firstMask - Máscara inicial -> ###.###.###-##
     * @param {string} params.secondMask - Máscara secundária -> XX.XXX.XXX/XXXX-##
     */
    toggleDocumentMask ({ firstMask, secondMask }) {
      // Verifica se tem letras no model.
      const regex = /[a-zA-Z]/
      const containsLyrics = regex.test(this.modelValue)

      // Caso contenha letras, aplica a máscara de CNPJ, pois o CPF não possui letras.
      if (containsLyrics) return secondMask

      return this.toggleMask({ firstMask, secondMask, character: 'X' })
    },

    validate (value) {
      return this.inputReference.validate(value)
    },

    onPaste (event) {
      if (!this.currentMask) return

      const value = event.clipboardData.getData('text')
      const input = this.getInput()

      requestAnimationFrame(() => {
        this.$emit('update:modelValue', value)
        input.selectionStart = input.value ? input.value.length : ''
      })
    },

    getInput () {
      return this.inputReference?.$el?.querySelector('input')
    },

    handleErrors () {
      if (this.useRemoveErrorOnType && this.error) {
        this.errorData = false
      }
    },

    handleMask () {
      const hasDefaultMask = Object.prototype.hasOwnProperty.call(this.masks, this.mask)

      this.$nextTick(() => {
        this.currentMask = hasDefaultMask ? this.masks[this.mask]() : this.mask
      })
    }
  }
}
</script>
