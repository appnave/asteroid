<template>
  <div class="qas-checkbox" :class="classes">
    <!-- Single -->
    <q-checkbox v-if="isSingle" v-model="model" v-bind="singleAttributes" dense>
      <slot />
    </q-checkbox>

    <!-- Group -->
    <div v-else>
      <qas-label v-if="props.label" :color="labelColor" :label="formattedLabel" margin="sm" typography="h5" />

      <div class="flex q-col-gutter-md" :class="contentClasses">
        <div v-for="(option, index) in props.options" :key="index">
          <!-- Com children -->
          <q-checkbox v-if="hasChildren(option)" :class="getCheckboxClass(option)" dense :disable="props.disable" :indeterminate-value="false" :label="option.label" :model-value="getModelValue(index)" @update:model-value="updateCheckbox($event, option, index)" />

          <!-- Com children -->
          <q-option-group v-if="hasChildren(option)" class="q-ml-sm q-mt-sm" :class="gutterClasses" dense :disable="props.disable" :inline="isInline" :model-value="props.modelValue" :options="option.children" type="checkbox" @update:model-value="updateChildren($event, option, index)" />

          <!-- Sem children -->
          <q-option-group v-else v-model="model" v-bind="attrs" dense :disable="props.disable" inline :options="[option]" type="checkbox" />
        </div>
      </div>
    </div>

    <qas-error-message v-if="hasErrorMessage" :message="props.errorMessage" />
  </div>
</template>

<script setup>
import QasLabel from '../label/QasLabel.vue'
import QasErrorMessage from '../error-message/QasErrorMessage.vue'

import useErrorMessage, { baseErrorProps } from '../../composables/private/use-error-message'
import useScreen from '../../composables/use-screen'

import { getRequiredLabel } from '../../helpers'

import { watch, computed, ref, onMounted, useAttrs } from 'vue'

defineOptions({
  name: 'QasCheckbox',
  inheritAttrs: false
})

const props = defineProps({
  ...baseErrorProps,

  disable: {
    type: Boolean
  },

  label: {
    default: '',
    type: String
  },

  options: {
    default: () => [],
    type: Array
  },

  modelValue: {
    default: () => [],
    type: [Array, String, Number, Boolean, Object]
  },

  inline: {
    default: true,
    type: Boolean
  },

  required: {
    type: Boolean
  },

  useAsTitle: {
    type: Boolean,
    default: false
  }
})

// emits
const emit = defineEmits(['update:modelValue'])

// globals
const attrs = useAttrs()

// composables
const { color } = useErrorMessage(props)
const screen = useScreen()

// refs
const group = ref({})

// hooks
onMounted(handleParent)

// computed
const isInline = computed(() => !screen.isSmall)
const isSingle = computed(() => !props.options.length)
const isTitleMode = computed(() => props.useAsTitle && isSingle.value)

const classes = computed(() => {
  return {
    'qas-checkbox--title': isTitleMode.value,
    'qas-checkbox--error': props.error && isSingle.value
  }
})

const labelColor = computed(() => props.disable ? 'grey-6' : color.value)
const contentClasses = computed(() => !isInline.value && 'column')
const gutterClasses = computed(() => isInline.value ? 'q-gutter-x-md' : 'q-gutter-y-md')

const hasErrorMessage = computed(() => props.errorMessage && !isSingle.value)

const model = computed({
  get () {
    return props.modelValue
  },

  set (value) {
    updateModelValue(value)
  }
})

const singleAttributes = computed(() => {
  return {
    ...attrs,
    disable: props.disable,
    label: props.label
  }
})

const formattedLabel = computed(() => {
  return getRequiredLabel({ label: props.label, required: props.required })
})

// watch
watch(() => props.options, handleParent)

// functions
function handleParent () {
  if (isSingle.value) return

  for (const index in props.options) {
    const option = props.options[index]

    if (hasChildren(option)) {
      setGroupIntersection(props.modelValue, option, index)
    }
  }
}

function hasChildren (option) {
  return Object.prototype.hasOwnProperty.call(option, 'children')
}

function setGroupIntersection (value, option, index) {
  const options = option.children.map(item => item.value)
  const intersection = options.filter(item => value.includes(item))

  group.value[index] = intersection.length ? (intersection.length === options.length ? true : null) : false
}

function updateCheckbox (value, option, index) {
  group.value[index] = value

  const groupValues = option.children.map(item => item.value)

  const updatedValue = value
    ? [...new Set([...props.modelValue, ...groupValues])]
    : props.modelValue.filter(item => !groupValues.includes(item))

  updateModelValue(updatedValue)
}

function updateChildren (value, option, index) {
  setGroupIntersection(value, option, index)
  updateModelValue(value)
}

function updateModelValue (value) {
  emit('update:modelValue', value)
}

function getCheckboxClass (option) {
  return hasChildren(option) && 'text-weight-bold'
}

function getModelValue (index) {
  return group.value[index]
}
</script>

<style lang="scss">
.qas-checkbox {
  $root: &;

  // aplica pra todos que não for title, uma vez que title tem tipografia própria
  &:not(&--title) {
    color: $grey-8;

    .q-checkbox__label {
      @include set-typography($body1);
    }
  }

  .q-checkbox {
    &__label {
      padding-left: var(--qas-spacing-sm) !important;
    }

    &__inner {
      width: 18px;
      height: 18px;
      min-width: 18px;
    }

    &.disabled {
      opacity: 1 !important;

      .q-checkbox__label,
      .q-checkbox__bg,
      .q-checkbox__inner {
        color: $grey-6;
      }
    }
  }

  &--title {
    color: $grey-10;

    &:not(#{$root}--error) {
      .q-checkbox__inner--falsy .q-checkbox__bg {
        border-color: $grey-10;
      }
    }

    .q-checkbox__label {
      @include set-typography($h5);
    }
  }

  &--error {
    color: $negative;

    .q-checkbox__bg {
      color: $negative;
    }
  }
}
</style>
