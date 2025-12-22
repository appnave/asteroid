<template>
  <qas-input ref="input" v-bind="attributes" v-model="currentValue" inputmode="numeric" :unmasked-value="false" @blur="validateDateTimeOnBlur" @focus="resetError" @update:model-value="updateModelValue">
    <template #append>
      <qas-btn v-if="hasDatePicker" color="primary" :disable="props.disable" icon="sym_r_calendar_today" variant="tertiary">
        <q-popup-proxy ref="dateProxy" transition-hide="scale" transition-show="scale" v-bind="props.datePopupProxyProps">
          <qas-date v-model="currentValue" v-bind="defaultDateProps" :mask="maskDate" width="290px" @update:model-value="updateModelValue" />
        </q-popup-proxy>
      </qas-btn>

      <qas-btn v-if="hasTimePicker" class="q-ml-sm" color="primary" :disable="props.disable" icon="sym_r_access_time">
        <q-popup-proxy ref="timeProxy" transition-hide="scale" transition-show="scale" v-bind="props.timePopupProxyProps">
          <q-time v-model="currentValue" v-bind="defaultTimeProps" format24h :mask="maskDate" @update:model-value="updateModelValue" />
        </q-popup-proxy>
      </qas-btn>
    </template>
  </qas-input>
</template>

<script setup>
import QasInput from '../input/QasInput.vue'
import QasDate from '../date/QasDate.vue'
import QasBtn from '../btn/QasBtn.vue'

import { date as dateFn, getPlaceholder } from '../../helpers'

import { date } from 'quasar'
import { ref, watch, computed, useAttrs, onMounted } from 'vue'

defineOptions({
  name: 'QasDateTimeInput',
  inheritAttrs: false
})

const props = defineProps({
  dateMask: {
    default: 'DD/MM/YYYY',
    type: String
  },

  dateProps: {
    default: () => ({}),
    type: Object
  },

  datePopupProxyProps: {
    default: () => ({}),
    type: Object
  },

  disable: {
    type: Boolean
  },

  readonly: {
    type: Boolean
  },

  timeMask: {
    default: 'HH:mm',
    type: String
  },

  timeProps: {
    default: () => ({}),
    type: Object
  },

  timePopupProxyProps: {
    default: () => ({}),
    type: Object
  },

  useIso: {
    type: Boolean
  },

  useTimeOnly: {
    type: Boolean
  },

  useDateOnly: {
    type: Boolean
  },

  modelValue: {
    default: '',
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()

// template refs
const dateProxy = ref(null)
const timeProxy = ref(null)
const input = ref(null)

// validations
const error = ref(false)
const errorMessage = ref('')
const hasInvalidDate = ref(false)

const currentValue = ref('')
const lastValue = ref('')

// computed
const maskDate = computed(() => {
  const mask = []

  if (!props.useTimeOnly) { mask.push(props.dateMask) }
  if (!props.useDateOnly) { mask.push(props.timeMask) }

  return mask.join(' ')
})

const mask = computed(() => maskDate.value.replace(/\w/g, '#'))

const maskType = computed(() => {
  const types = {
    [props.useDateOnly]: 'date',
    [props.useTimeOnly]: 'time'
  }

  return types.true || 'datetime'
})

const attributes = computed(() => {
  const { modelValue, placeholder, ...restAttributes } = attrs

  return {
    error: error.value,
    errorMessage: errorMessage.value,
    ...restAttributes,
    mask: mask.value,
    readonly: props.readonly,
    disable: props.disable,
    placeholder: placeholder || getPlaceholder(maskType.value)
  }
})

const defaultDateTimeProps = computed(() => {
  return {
    readonly: props.readonly,
    disable: props.readonly
  }
})

const defaultDateProps = computed(() => {
  return {
    ...defaultDateTimeProps.value,
    ...props.dateProps
  }
})

const defaultTimeProps = computed(() => {
  return {
    ...defaultDateTimeProps.value,
    ...props.timeProps
  }
})

const hasDatePicker = computed(() => !props.useTimeOnly && !props.readonly)
const hasTimePicker = computed(() => !props.useDateOnly && !props.readonly)

watch(() => props.modelValue, (current, original) => {
  if (!current || props.useTimeOnly) {
    currentValue.value = current
    return
  }

  if (current !== original && current !== lastValue.value) {
    currentValue.value = toMask(current)
  }
})

onMounted(() => {
  currentValue.value = toMask(props.modelValue)
})

// functions
function toISOString (value) {
  if (!value) return ''

  if (props.useDateOnly && !props.useIso) {
    return dateFn(date.extractDate(value, maskDate.value), 'yyyy-MM-dd')
  }

  if (props.useTimeOnly && !props.useIso) {
    return date.extractDate(value, 'HH:MM')
  }

  return date.extractDate(value, maskDate.value).toISOString()
}

function toMask (value) {
  if (!value || props.useTimeOnly) {
    return value || ''
  }

  const newDate = new Date(value).toISOString()

  return date.formatDate(
    props.useDateOnly ? newDate.slice(0, 23) : newDate,
    maskDate.value
  )
}

function updateModelValue (value) {
  currentValue.value = value

  const valueLength = value?.replace?.(/_/g, '')?.length

  error.value = validateDateAndTime(value)

  if (error.value) {
    hasInvalidDate.value = true
    errorMessage.value = 'Data inválida.'
    return
  }

  hasInvalidDate.value = false

  if (value === '' || valueLength === mask.value.length) {
    lastValue.value = props.useTimeOnly ? value : toISOString(value)
    emit('update:modelValue', lastValue.value)
  }

  if (props.useDateOnly) {
    dateProxy.value.hide()
  }

  if (props.useTimeOnly) {
    timeProxy.value.hide()
  }
}

function validateDateOnly (value = '') {
  const [day, month] = value.split('/')

  return day > 31 || month > 12
}

function validateTimeOnly (value = '') {
  const [hour, minute] = value.split(':')

  return hour > 23 || minute > 59
}

function validateDateAndTime (value) {
  if (!value) return false

  if (props.useDateOnly) return validateDateOnly(value)
  if (props.useTimeOnly) return validateTimeOnly(value)

  const [date, time] = value?.split(' ') || []

  return validateDateOnly(date) || validateTimeOnly(time)
}

function validateDateTimeOnBlur () {
  const valueLength = currentValue.value?.replace?.(/_/g, '')?.length

  // valida se o tamanho digitado é o tamanho que a mascara espera receber
  error.value = !!((valueLength < mask.value.length || error.value) && valueLength)

  if (error.value && !hasInvalidDate.value) {
    errorMessage.value = 'Data incompleta.'
  }

  if (hasInvalidDate.value) {
    currentValue.value = ''
  }

  if (error.value || hasInvalidDate.value) {
    emit('update:modelValue', '')
  }
}

function resetError () {
  if (!currentValue.value) {
    error.value = false
  }
}
</script>
