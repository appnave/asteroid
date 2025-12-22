<template>
  <div class="app-select-list-dialog full-width">
    <qas-header v-bind="headerProps" />

    <component
      :is="containerListComponent"
      v-if="canShowContainerList"
      class="q-mt-md relative-position"
    >
      <span class="text-grey-10 text-subtitle1">
        {{ props.listLabel }}
      </span>

      <slot name="selected-content">
        <q-virtual-scroll #default="{ item, index }" class="app-select-list-dialog__list q-mt-md" :items="selectedOptions" separator>
          <q-item class="q-px-none text-body1 text-grey-8">
            <q-item-section>
              {{ item.label }}
            </q-item-section>

            <q-item-section avatar>
              <qas-btn v-bind="getRemoveButtonProps({ index, option: item })" />
            </q-item-section>
          </q-item>
        </q-virtual-scroll>
      </slot>

      <q-inner-loading :showing="props.loading">
        <q-spinner
          color="grey"
          size="2em"
        />
      </q-inner-loading>
    </component>

    <span
      v-if="hasError"
      class="app-select-list-dialog__error"
    >
      {{ errorMessage }}
    </span>

    <qas-dialog
      v-bind="defaultDialogProps"
      v-model="showDialog"
    >
      <template v-for="(_, name) in slots" #[getDialogSlot(name)]="context">
        <slot :name v-bind="context || {}" />
      </template>

      <template #description>
        <slot name="dialog-description">
          <div v-if="dialogDescription" class="q-mb-xl text-center">
            {{ dialogDescription }}
          </div>

          <qas-select-list
            v-model="selectListModel"
            v-bind="defaultSelectListProps"
          />
        </slot>
      </template>
    </qas-dialog>
  </div>
</template>

<script setup>
import QasHeader from '../header/QasHeader.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasDialog from '../dialog/QasDialog.vue'
import QasSelectList from '../select-list/QasSelectList.vue'

import { computed, ref, watch, useSlots, inject } from 'vue'

defineOptions({ name: 'QasSelectListDialog' })

const props = defineProps({
  addButtonProps: {
    type: Object,
    default: () => ({})
  },

  description: {
    type: String,
    default: ''
  },

  disable: {
    type: Boolean
  },

  error: {
    type: [String, Array],
    default: ''
  },

  dialogProps: {
    type: Object,
    default: () => ({})
  },

  options: {
    type: Array,
    default: () => []
  },

  label: {
    type: String,
    default: ''
  },

  listLabel: {
    type: String,
    default: ''
  },

  loading: {
    type: Boolean
  },

  modelValue: {
    type: Array,
    default: () => []
  },

  selectListProps: {
    type: Object,
    default: () => ({})
  },

  useLazyLoading: {
    type: Boolean
  }
})

// emits
const emit = defineEmits(['add', 'remove', 'update:modelValue'])

// slots
const slots = useSlots()

// globals
const isBox = inject('isBox', false)

// models
const selectListModel = defineModel('selectListModel', { default: () => [], type: Array })

// composables
const {
  showDialog,

  defaultDialogProps,
  defaultSelectListProps,
  dialogDescription,

  toggleDialog
} = useSelectDialog()

const {
  selectedOptions,

  canShowContainerList,

  add,
  removeAll,
  remove,
  getRemoveButtonProps
} = useList()

// expose
defineExpose({ add, removeAll, remove, toggleDialog })

// refs
const model = ref([...props.modelValue])

// computeds
const hasError = computed(() => Array.isArray(props.error) ? !!props.error.length : !!props.error)
const errorMessage = computed(() => Array.isArray(props.error) ? props.error.join(' ') : props.error)
const containerListComponent = computed(() => isBox ? 'div' : 'qas-box')

const headerProps = computed(() => {
  return {
    ...(props.label && {
      labelProps: {
        label: props.label,
        margin: 'none',
        color: hasError.value ? 'negative' : 'grey-10'
      }
    }),

    spacing: 'none',
    description: props.description,

    buttonProps: {
      icon: 'sym_r_add',
      useLabelOnSmallScreen: false,
      ...props.addButtonProps,
      disable: props.disable,
      loading: props.loading,

      // events
      onClick: toggleDialog
    }
  }
})

const hasLazyLoading = computed(() => {
  return props.useLazyLoading || !!props.selectListProps?.searchBoxProps?.useLazyLoading
})

watch(() => props.modelValue, newValue => {
  model.value = [...newValue]
})

// functions
function updateModel () {
  emit('update:modelValue', model.value)
}

/**
 * Retorna o nome do slot do dialog removendo o prefixo 'dialog-'
 * Isso é necessário para pois os slots recebidos nesse componente tem o prefixo `dialog`, porém o QasDialog não.
 */
function getDialogSlot (name) {
  return name.replace('dialog-', '')
}

// ------------------------- composable functions ------------------------------
function useList () {
  const filteredOptions = ref(props.options)

  const selectedOptions = computed(() => {
    const options = []

    model.value.forEach(value => {
      const option = filteredOptions.value.find(option => option.value === value)

      if (option) return options.push(option)

      options.push({ label: value })
    })

    return options
  })

  watch(() => props.options, options => {
    filteredOptions.value = [...options]
  })

  /**
   * Valida se tenho opções ou se está carregando para mostrar o container da listagem.
   */
  const canShowContainerList = computed(() => hasFilteredOptions.value || props.loading || !!slots['selected-content'])
  const hasFilteredOptions = computed(() => model.value.length)

  /*
   * caso não passe o value, o valor sera automaticamente o value da option
  */
  function add ({ options = [], value }) {
    const normalizedItems = Array.isArray(options) ? options : [options]

    /*
     * Validação necessária pois se não estiver com lazyloading e adicionar mais opções, as options vai vir duplicadas
     * com as opções que já foram adicionadas
    */
    if (hasLazyLoading.value) {
      filteredOptions.value.push(...normalizedItems)
    }

    const newModel = value || normalizedItems.map(item => item.value)

    model.value.push(...newModel)

    emit('add', normalizedItems)

    updateModel()
  }

  function removeAll () {
    model.value = []
    filteredOptions.value = []

    updateModel()
  }

  function remove (value) {
    const index = model.value.findIndex(item => item === value)
    const optionIndex = filteredOptions.value.findIndex(option => option.value === value)

    if (~index) model.value.splice(index, 1)
    if (~optionIndex) filteredOptions.value.splice(optionIndex, 1)

    emit('remove', value)
    updateModel()
  }

  function getRemoveButtonProps ({ option }) {
    return {
      color: 'grey-10',
      icon: 'sym_r_delete',
      variant: 'tertiary',
      disable: props.disable || !!option.disable,
      onClick: () => remove(option.value)
    }
  }

  return {
    filteredOptions,
    selectedOptions,

    canShowContainerList,
    hasFilteredOptions,

    add,
    removeAll,
    remove,
    getRemoveButtonProps
  }
}

function useSelectDialog () {
  const showDialog = ref(false)

  const defaultDialogProps = computed(() => {
    return {
      useFullMaxWidth: true,

      ...props.dialogProps,

      onBeforeShow: event => {
        resetSelectListModel()

        props.dialogProps.onBeforeShow && props.dialogProps.onBeforeShow(event)
      },

      ok: {
        label: 'Adicionar',

        disable: !selectListModel.value.length,

        ...props.dialogProps.ok,

        onClick: () => {
          props.dialogProps.ok?.onClick?.()
          onAdd()
        }
      }
    }
  })

  const defaultSelectListProps = computed(() => {
    return {
      emitValue: false,

      ...props.selectListProps,

      searchBoxProps: {
        useLazyLoading: props.useLazyLoading,
        list: props.options,
        height: '160px',
        optionsToExclude: model.value,

        ...props.selectListProps.searchBoxProps
      }
    }
  })

  const dialogDescription = computed(() => props.dialogProps.card?.description)

  function toggleDialog () {
    showDialog.value = !showDialog.value
  }

  function resetSelectListModel () {
    selectListModel.value = []
  }

  function onAdd () {
    if (selectListModel.value.length) add({ options: selectListModel.value })
  }

  return {
    showDialog,

    defaultDialogProps,
    defaultSelectListProps,
    dialogDescription,

    toggleDialog
  }
}
</script>

<style lang="scss">
.app-select-list-dialog {
  .q-item {
    @include set-typography($body1)
  }

  // simulando q-field--error
  &__error {
    padding-top: var(--qas-spacing-sm);
    color: var(--q-negative) !important;
    font-size: 12px;
  }

  &__list {
    max-height: 250px;
    overflow-y: auto;
  }
}
</style>
