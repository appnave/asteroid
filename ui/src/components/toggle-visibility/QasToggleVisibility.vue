<template>
  <!-- "data-no-grab" para prevenir o click drag  -->
  <div class="qas-toggle-visibility" data-no-grab>
    <!-- "data-table-ignore-tr-hover" é para desabilitar o hover do tr no QasTableGenerator -->
    <div :aria-expanded="isVisible" aria-label="Alternar visibilidade do conteúdo" class="cursor-pointer items-center no-wrap qas-toggle-visibility__container row" data-table-ignore-tr-hover role="button" :style @click.prevent.stop="onToggleVisibility">
      <div class="ellipsis qas-toggle-visibility__content">
        <div
          v-if="isVisible"
          class="ellipsis full-width"
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

import NotifyError from '../../plugins/notify-error/NotifyError'

import { createRateLimit } from './helpers/create-rate-limit.js'

import { uid } from 'quasar'
import { computed } from 'vue'

defineOptions({ name: 'QasToggleVisibility' })

const props = defineProps({
  group: {
    type: String,
    default: ''
  },

  scope: {
    type: String,
    default: 'default'
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

const {
  getStatusRateLimit,
  incrementRateLimit
} = createRateLimit({ scope: props.scope, limit: 10 })

const icon = computed(() => isVisible.value ? 'sym_r_visibility' : 'sym_r_visibility_off')
const style = computed(() => ({ width: props.width }))
const tooltipText = computed(() => isVisible.value ? props.visibleTooltip : props.hiddenTooltip)

function onToggleVisibility (event) {
  // Só alterna se o clique for um gesto real do usuário.
  if (!event.isTrusted) return

  // Esconder é sempre permitido e não consome cota.
  if (isVisible.value) {
    toggleVisibility()

    return
  }

  // Verifica a situação do rate limit (só leitura).
  const { allowed, retryAfterSeconds } = getStatusRateLimit()

  if (!allowed) {
    NotifyError(`Limite de visualizações atingido. Tente novamente em ${retryAfterSeconds}s.`)

    return
  }

  // Incrementa o contador do rate limit.
  incrementRateLimit()

  toggleVisibility()
}
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
    user-select: none;
  }

  &__button {
    flex-grow: 0;
  }
}
</style>
