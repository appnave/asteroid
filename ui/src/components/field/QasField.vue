<template>
  <component :is="component.is" v-bind="component.props" :data-cy="field.name" :model-value="formattedValue" @update:model-value="updateModel">
    <template v-for="(_, name) in slots" #[name]="context">
      <slot :name="name" v-bind="context || {}" />
    </template>
  </component>
</template>

<script setup>
import { defineAsyncComponent, computed, useAttrs, useSlots } from 'vue'

defineOptions({
  name: 'QasField',
  inheritAttrs: false
})

const props = defineProps({
  error: {
    type: [Array, String],
    default: ''
  },

  field: {
    type: Object,
    required: true,
    default: () => ({})
  },

  modelValue: {
    type: [Object, Array, String, Number, Boolean],
    default: undefined
  }
})

/**
 * emits
 *
 * TODO: alterar para defineModel após suporte vite estar estabilizado.
 */
const emit = defineEmits(['update:modelValue'])

// dynamic imports
const QasCheckbox = defineAsyncComponent(() => import('../checkbox/QasCheckbox.vue'))
const QasDateTimeInput = defineAsyncComponent(() => import('../date-time-input/QasDateTimeInput.vue'))
const QasInput = defineAsyncComponent(() => import('../input/QasInput.vue'))
const QasNumericInput = defineAsyncComponent(() => import('../numeric-input/QasNumericInput.vue'))
const QasPasswordInput = defineAsyncComponent(() => import('../password-input/QasPasswordInput.vue'))
const QasRadio = defineAsyncComponent(() => import('../radio/QasRadio.vue'))
const QasSelect = defineAsyncComponent(() => import('../select/QasSelect.vue'))
const QasSignatureUploader = defineAsyncComponent(() => import('../signature-uploader/QasSignatureUploader.vue'))
const QasToggle = defineAsyncComponent(() => import('../toggle/QasToggle.vue'))
const QasUploader = defineAsyncComponent(() => import('../uploader/QasUploader.vue'))
const QEditor = defineAsyncComponent(() => import('quasar').then(q => q.QEditor))

// composables
const attributes = useAttrs()
const slots = useSlots()

// computeds
const errorPayload = computed(() => {
  const isArray = Array.isArray(props.error)

  return {
    error: !!(isArray ? props.error.length : props.error) || undefined,
    errorMessage: isArray ? props.error.join(' ') : props.error
  }
})

const formattedField = computed(() => {
  const field = {}

  const attributesProfile = {
    maxLength: 'maxlength',
    minLength: 'minlength',
    readOnly: 'readonly'
  }

  for (const key in props.field) {
    field[attributesProfile[key] || key] = props.field[key]
  }

  return field
})

const formattedValue = computed(() => {
  const isBoolean = props.field.type === 'boolean'

  if (!isBoolean) return props.modelValue

  const isEmptyValue = (
    !props.modelValue && (props.modelValue === undefined || typeof props.modelValue === 'string')
  )

  if (isEmptyValue) return !!props.modelValue

  return JSON.parse(props.modelValue)
})

const defaultInputProps = computed(() => {
  const field = formattedField.value

  return {
    label: field.label,
    hideBottomSpace: !errorPayload.value.error,
    ...errorPayload.value,
    readonly: field.readonly,
    required: field.required,
    disable: field.disable,
    filled: field.filled,
    maxlength: field.maxlength,
    minlength: field.minlength,
    suffix: field.suffix,
    placeholder: field.placeholder,
    prefix: field.prefix,
    useIso: field.useIso
  }
})

// components
const qasInput = computed(() => {
  return {
    is: QasInput,
    props: defaultInputProps.value
  }
})

const qasNumericInput = computed(() => {
  const { places } = formattedField.value

  return {
    is: QasNumericInput,
    props: { ...defaultInputProps.value, places }
  }
})

const qasPasswordInput = computed(() => {
  const { useStrengthChecker } = formattedField.value

  return {
    is: QasPasswordInput,
    props: { ...defaultInputProps.value, useStrengthChecker }
  }
})

const qasDateTimeInput = computed(() => {
  const { useIso } = formattedField.value

  return {
    is: QasDateTimeInput,
    props: { useIso, ...defaultInputProps.value }
  }
})

const qasToggle = computed(() => {
  const { label } = formattedField.value

  return {
    is: QasToggle,
    props: { label, ...errorPayload.value }
  }
})

const qasRadio = computed(() => {
  const { label, options } = formattedField.value

  return {
    is: QasRadio,
    props: { label, options }
  }
})

const qasCheckbox = computed(() => {
  const { label, options, required } = formattedField.value

  return {
    is: QasCheckbox,
    props: { label, options, required, ...errorPayload.value }
  }
})

const qasUploader = computed(() => {
  const { accept, entity, label, multiple, readonly, maxFiles, name } = formattedField.value

  return {
    is: QasUploader,
    props: {
      accept,
      autoUpload: true,
      entity,
      label,
      multiple,
      readonly,
      maxFiles,
      fieldName: name,
      ...errorPayload.value
    }
  }
})

const qEditor = computed(() => {
  return {
    is: QEditor,
    props: {
      toolbar: [
        ['undo', 'redo'],
        ['bold', 'italic', 'underline'],
        ['left', 'center', 'right', 'justify'],
        ['hr', 'link'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['print', 'fullscreen']
      ],
      ...errorPayload.value
    }
  }
})

const qasSignatureUploader = computed(() => {
  const { entity, label } = formattedField.value

  return {
    is: QasSignatureUploader,
    props: {
      uploaderProps: { entity, label, ...errorPayload.value }
    }
  }
})

const qasSelect = computed(() => {
  const { entity, name, multiple, options, useLazyLoading } = formattedField.value

  return {
    is: QasSelect,
    props: { entity, name, multiple, options, useLazyLoading, ...defaultInputProps.value }
  }
})

const component = computed(() => {
  const { mask, type, name } = formattedField.value

  const profiles = {
    default: {
      is: qasInput.value.is,
      props: { ...qasInput.value.props, mask }
    },

    textarea: {
      is: qasInput.value.is,
      props: { ...qasInput.value.props, type: 'textarea' }
    },

    number: {
      is: qasInput.value.is,
      props: { ...qasInput.value.props, type: 'number' }
    },

    hidden: {
      is: 'input',
      props: { name, type: 'hidden' }
    },

    email: {
      is: qasInput.value.is,
      props: { ...qasInput.value.props, type: 'email' }
    },

    money: {
      is: qasNumericInput.value.is,
      props: { ...qasNumericInput.value.props, mode: 'money' }
    },

    decimal: {
      is: qasNumericInput.value.is,
      props: { ...qasNumericInput.value.props, mode: 'decimal' }
    },

    percent: {
      is: qasNumericInput.value.is,
      props: { ...qasNumericInput.value.props, mode: 'percent' }
    },

    date: {
      is: qasDateTimeInput.value.is,
      props: { ...qasDateTimeInput.value.props, useDateOnly: true }
    },

    time: {
      is: qasDateTimeInput.value.is,
      props: { ...qasDateTimeInput.value.props, useTimeOnly: true }
    },

    checkbox: qasCheckbox.value,
    password: qasPasswordInput.value,
    select: qasSelect.value,
    datetime: qasDateTimeInput.value,
    boolean: qasToggle.value,
    radio: qasRadio.value,
    upload: qasUploader.value,
    editor: qEditor.value,
    'signature-uploader': qasSignatureUploader.value
  }

  const payload = (profiles[type] || profiles.default) || {}

  return {
    is: payload.is,
    props: { ...payload.props, ...attributes }
  }
})

// functions
/**
 * @param {(number|string|object|array|boolean)} value
 */
function updateModel (value) {
  const isNumberType = props.field.type === 'number'

  const newValue = isNumberType ? Number(value) : value

  emit('update:modelValue', newValue)
}
</script>
