<template>
  <q-field class="qas-numeric-input" :class="classes" dense :label="formattedLabel" :model-value="modelValue" no-error-icon>
    <template #control="{ id, floatingLabel }">
      <input :id ref="input" class="q-field__input" :class="getInputClasses(floatingLabel)" :disabled="$attrs.disable" inputmode="numeric" :placeholder :readonly="$attrs.readonly" @blur="emitValue" @click="setSelect" @input="emitUpdateModel($event.target.value)" @keydown.tab="onTabPressed">
    </template>

    <template v-if="icon" #prepend>
      <q-icon :name="icon" size="xs" />
    </template>

    <template v-if="iconRight" #append>
      <q-icon :name="iconRight" size="xs" />
    </template>
  </q-field>
</template>

<script>
import AutoNumeric from 'autonumeric'
import { getRequiredLabel, getPlaceholder } from '../../helpers'

const defaultModes = {
  decimal: 'commaDecimalCharDotSeparator',
  integer: ['commaDecimalCharDotSeparator', 'integer'],
  money: 'Brazilian',
  percent: 'percentageEU2dec'
}

export default {
  name: 'QasNumericInput',

  props: {
    autonumericOptions: {
      default: () => ({}),
      type: Object
    },

    places: {
      default: 2,
      type: Number
    },

    label: {
      type: String,
      default: ''
    },

    mode: {
      default: 'integer',
      type: String,
      validator: value => ['integer', 'decimal', 'percent', 'money'].includes(value)
    },

    modelValue: {
      default: '',
      type: [String, Number],
      validator: value => {
        return (
          typeof value === 'number' ||
          typeof value === 'string' ||
          value === '' ||
          value === null
        )
      }
    },

    preset: {
      default: false,
      type: [Boolean, String]
    },

    required: {
      type: Boolean
    },

    useNegative: {
      type: Boolean
    },

    usePositive: {
      default: true,
      type: Boolean
    },

    icon: {
      type: String,
      default: ''
    },

    iconRight: {
      type: String,
      default: ''
    }
  },

  emits: [
    'update:modelValue',
    'update-model'
  ],

  data () {
    return {
      autoNumeric: null
    }
  },

  computed: {
    defaultMode () {
      return defaultModes[this.mode]
    },

    formattedLabel () {
      return getRequiredLabel({ label: this.label, required: this.required })
    },

    // redesign
    classes () {
      return {
        'qas-numeric-input--has-icon': this.hasPrepend
      }
    },

    hasPrepend () {
      return !!this.$slots.prepend || this.icon
    },

    placeholder () {
      const { placeholder } = this.$attrs

      return placeholder || getPlaceholder(this.mode)
    }
  },

  watch: {
    modelValue (value) {
      if (this.autoNumeric) {
        this.autoNumeric.set(value)
      }
    }
  },

  async created () {
    const autoNumericPredefinedOptions = AutoNumeric.getPredefinedOptions()

    let option = this.preset || this.defaultMode

    if (!Array.isArray(option)) {
      option = [option]
    }

    const options = {}

    for (const value of option) {
      Object.assign(options, autoNumericPredefinedOptions[value])
    }

    if (!this.useNegative) {
      options.minimumValue = 0
    }

    if (!this.usePositive) {
      options.maximumValue = 0
    }

    if (this.mode !== 'integer') {
      options.decimalPlaces = this.places
    }

    if (this.mode === 'money') {
      // TODO
      /*
      * adicionado manualmente por conta do espaçamento, neste formato não esta preparado para
      * outras linguas, teria que adaptar no futuro, o que não é um problema no momento
      */
      options.currencySymbol = 'R$ '
    }

    Object.assign(options, this.autonumericOptions)

    this.$nextTick(() => {
      this.autoNumeric = new AutoNumeric(this.$refs.input, options)
      this.autoNumeric.set(this.modelValue)
    })
  },

  beforeUnmount () {
    this.autoNumeric.remove()
  },

  methods: {
    setSelect () {
      this.$refs?.input?.select()
    },

    /**
     * Quando o label não está flutuando, o input fica com opacidade 0 para evitar exibir o conteúdo do Autonumeric.
     * O elemento input deve estar na DOM, para funcionar a navegação via teclado e leitores de tela.
     *
     * @param {boolean} floatingLabel - Booleano que indica se o label está flutuando, ou seja,
     * se o campo está focado ou preenchido.
     */
    getInputClasses (floatingLabel) {
      return {
        'qas-numeric-input__input': !floatingLabel
      }
    },

    emitValue () {
      /**
       * O autonumeric retorna uma lista de histórico contendo os valores digitados, precisamos pegar
       * pelo histórico porque ele retorna o raw value neste caso.
       */
      const isEmptyValue = this.autoNumeric.historyTable[this.autoNumeric.historyTableIndex]?.value === ''

      /**
       * Essa validação corrige um problema de quando o campo é limpo mais de 1x,
       * que ficava vazio mas com o model de 0, mas sem mostrar o valor em tela, bugando a label.
       */
      if (isEmptyValue) this.autoNumeric.set(0)

      this.$emit('update:modelValue', this.getFormattedNumber())
    },

    emitUpdateModel (value) {
      this.$emit('update-model', {
        value,
        raw: this.getFormattedNumber()
      })
    },

    /**
     * Foi necessário, pois ao pressionar tab para ir para o próximo campo em um formulário,
     * o valor exibido ficava incorreto, exemplo: setei "43%" e apertei tab, formatava para "0,43%".
     * Desa forma, forçamos sempre o valor correto ao pressionar tab.
     */
    onTabPressed () {
      this.autoNumeric.set(this.getFormattedNumber())
    },

    /**
     * Ajusta a quantidade de casas decimais, pois pra um valor "0,35%" por exemplo,
     * o getNumber() pode acabar retornando um valor quebrado, algo como "0.0034999999999999996".
     * Dessa forma, com base no places sempre forçamos o número de casa exatas.
     * Pra this.places = 2, "0,35%" seria 0.0035, seria 4 casas depois do ".", então this.places + 2 casas.
     * Pra this.places = 3, "0,353%" seria 0.00353, seria 5 casas depois do ".",  então this.places + 2 casas.
     */
    getFormattedNumber () {
      const rawValue = this.autoNumeric.getNumber()

      return parseFloat((rawValue).toFixed(this.places + 2))
    }
  }
}
</script>

<style lang="scss">
.qas-numeric-input {
  &__input {
    opacity: 0;
  }
}
</style>
