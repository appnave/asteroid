<template>
  <qas-input v-model="model" class="qas-password-input" :hide-bottom-space="hideBottomSpace" v-bind="$attrs" :type="type" use-remove-error-on-type>
    <template #prepend>
      <q-icon color="grey-8" name="sym_r_lock" />
    </template>

    <template #append>
      <qas-btn color="primary" :disable="isButtonDisabled" :icon="icon" variant="tertiary" @click="toggle" />
    </template>

    <template v-for="(_, name) in $slots" #[name]="context">
      <slot :name="name" v-bind="context || {}" />
    </template>

    <template v-if="hasStrengthChecker" #hint>
      <qas-password-strength-checker v-bind="strengthCheckerProps" :password="model" @update:current-level="updateCurrentLevel" />
    </template>
  </qas-input>
</template>

<script>
import QasBtn from '../btn/QasBtn.vue'
import QasInput from '../input/QasInput.vue'
import passwordMixin from '../../mixins/password.js'
import QasPasswordStrengthChecker from '../password-strength-checker/QasPasswordStrengthChecker.vue'

export default {
  name: 'QasPasswordInput',

  components: {
    QasInput,
    QasPasswordStrengthChecker,
    QasBtn
  },

  mixins: [passwordMixin],

  inheritAttrs: false,

  props: {
    useStrengthChecker: {
      default: true,
      type: Boolean
    },

    modelValue: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue', 'update:currentLevel'],

  data () {
    return {
      toggleType: true
    }
  },

  computed: {
    icon () {
      return this.toggleType ? 'sym_r_visibility' : 'sym_r_visibility_off'
    },

    isButtonDisabled () {
      return !this.model.length
    },

    model: {
      get () {
        return this.modelValue
      },

      set (value) {
        return this.$emit('update:modelValue', value)
      }
    },

    strengthCheckerProps () {
      const {
        modelValue,
        useStrengthChecker,
        ...props
      } = this.$props

      return props
    },

    type () {
      return this.toggleType ? 'password' : 'text'
    },

    hasBottomSlots () {
      return !!this.model.length
    },

    hasStrengthChecker () {
      return this.useStrengthChecker && this.hasBottomSlots
    },

    hideBottomSpace () {
      return this.$attrs.error || !!this.model.length
    }
  },

  methods: {
    toggle () {
      this.toggleType = !this.toggleType
    },

    updateCurrentLevel (currentLevel) {
      this.$emit('update:currentLevel', currentLevel)
    }
  }
}
</script>
