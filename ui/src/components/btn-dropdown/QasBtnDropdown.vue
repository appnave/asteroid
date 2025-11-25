<template>
  <div class="qas-btn-dropdown" :class="classes.parent">
    <div v-if="hasButtons" :class="classes.list">
      <div v-for="(buttonProps, key, index) in props.buttonsPropsList" :key="key">
        <div class="flex no-wrap">
          <qas-btn v-bind="buttonProps" :data-btn-dropdown="key" :disable="props.disable" no-wrap variant="tertiary" @click="onClick">
            <slot v-if="hasBtnContentSlot(key)" :name="`btn-content-${key}`" />

            <q-menu v-else-if="hasMenuOnLeftSide" v-model="isMenuOpened" anchor="bottom right" :auto-close="props.useAutoClose" class="qas-menu" self="top right" @update:model-value="onUpdateMenuValue">
              <div :class="classes.menuContent">
                <slot />
              </div>
            </q-menu>
          </qas-btn>

          <slot :name="`bottom-${key}`" />

          <q-separator v-if="hasSeparator(index)" class="q-mx-sm qas-btn-dropdown__separator self-center" dark vertical />
        </div>
      </div>
    </div>

    <div v-if="props.useSplit">
      <qas-btn v-bind="splittedButtonProps">
        <q-menu v-if="hasDefaultSlot" v-model="isMenuOpened" anchor="bottom right" :auto-close="props.useAutoClose" class="qas-menu" self="top right" @update:model-value="onUpdateMenuValue">
          <div :class="classes.menuContent">
            <slot />
          </div>
        </q-menu>
      </qas-btn>
    </div>
  </div>
</template>

<script setup>
import QasBtn from '../btn/QasBtn.vue'

import useScreen from '../../composables/use-screen'

import { ref, watch, computed, useSlots } from 'vue'

defineOptions({
  name: 'QasBtnDropdown',
  inheritAttrs: false
})

const props = defineProps({
  buttonsPropsList: {
    default: () => ({}),
    type: Object
  },

  dropdownIcon: {
    default: 'sym_r_more_vert',
    type: String
  },

  disable: {
    type: Boolean
  },

  menu: {
    type: Boolean
  },

  useMenuPadding: {
    type: Boolean
  },

  useSplit: {
    type: Boolean
  },

  useTooltip: {
    type: Boolean,
    default: true
  },

  useAutoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'update:menu'])

const slots = useSlots()
const screen = useScreen()

const isMenuOpened = ref(false)

const classes = computed(() => {
  return {
    parent: {
      'flex inline items-center': props.useSplit
    },

    menuContent: {
      'q-pa-md': props.useMenuPadding
    },

    list: {
      'flex no-wrap': !isSingleButton.value
    }
  }
})

const buttonsPropsListSize = computed(() => Object.keys(props.buttonsPropsList).length)
const isSingleButton = computed(() => buttonsPropsListSize.value === 1)

const hasButtons = computed(() => !screen.isSmall || !props.useSplit)
const hasDefaultSlot = computed(() => !!slots.default)
const hasMenuOnLeftSide = computed(() => hasDefaultSlot.value && !props.useSplit && isSingleButton.value)

const splittedButtonProps = computed(() => {
  const iconKey = screen.isSmall ? 'icon' : 'iconRight'

  return {
    color: 'grey-10',
    disable: props.disable,
    [iconKey]: props.dropdownIcon,
    variant: 'tertiary',
    label: 'Opções',
    useLabelOnSmallScreen: false
  }
})

watch(() => props.menu, value => {
  isMenuOpened.value = value
}, { immediate: true })

function onUpdateMenuValue (value) {
  emit('update:menu', value)
}

function onClick (event) {
  emit('click', event)
}

function isLast (index) {
  return index + 1 === buttonsPropsListSize.value
}

function hasSeparator (index) {
  return props.useSplit || !isLast(index)
}

function hasBtnContentSlot (name) {
  return !!slots[`btn-content-${name}`]
}
</script>

<style lang="scss">
.qas-btn-dropdown {
  &__separator {
    height: 18px;
  }
}
</style>
