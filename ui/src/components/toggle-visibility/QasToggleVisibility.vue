<template>
  <div class="qas-toggle-visibility">
    <!-- "data-table-ignore-tr-hover" é para desabilitar o hover do tr no QasTableGenerator -->
    <div :aria-expanded="isVisible" aria-label="Alternar visibilidade do conteúdo" class="cursor-pointer items-center no-wrap qas-toggle-visibility__container row" data-table-ignore-tr-hover role="button" :style @click.prevent.stop="toggleVisibility">
      <div class="ellipsis qas-toggle-visibility__content">
        <div
          v-if="isVisible"
          class="ellipsis full-width"
          :title="props.text"
        >
          <slot>
            {{ props.text }}
          </slot>
        </div>

        <q-separator
          v-else
          class="qas-toggle-visibility__separator"
          size="4px"
        />
      </div>

      <qas-btn class="q-ml-sm qas-toggle-visibility__button" :icon />

      <qas-tooltip :text="tooltipText" />
    </div>
  </div>
</template>

<script setup>
import QasBtn from '../btn/QasBtn.vue'
import QasTooltip from '../tooltip/QasTooltip.vue'

import { useToggleVisibility } from '../../composables/private'

import { uid } from 'quasar'
import { computed } from 'vue'

defineOptions({ name: 'QasToggleVisibility' })

const props = defineProps({
  group: {
    type: String,
    default: ''
  },

  text: {
    type: String,
    default: ''
  },

  uuid: {
    type: String,
    default: ''
  },

  width: {
    type: String,
    default: '140px'
  },

  visibleTooltip: {
    type: String,
    default: 'Ocultar conteúdo'
  },

  hiddenTooltip: {
    type: String,
    default: 'Visualizar conteúdo'
  }
})

const {
  isVisible,
  toggleVisibility
} = useToggleVisibility({ group: props.group, uuid: props.uuid || uid() })

const icon = computed(() => isVisible.value ? 'sym_r_visibility' : 'sym_r_visibility_off')
const style = computed(() => ({ width: props.width }))
const tooltipText = computed(() => isVisible.value ? props.visibleTooltip : props.hiddenTooltip)
</script>

<style lang="scss">
.qas-toggle-visibility {
  &__separator {
    border-radius: var(--qas-generic-border-radius);
  }

  &__container:hover .qas-toggle-visibility__separator {
    background-color: var(--q-primary-contrast);
  }

  &__container:hover .qas-toggle-visibility__button {
    color: var(--q-primary-contrast) !important;
  }

  &__content {
    flex-grow: 1;
  }

  &__button {
    flex-grow: 0;
  }
}
</style>
