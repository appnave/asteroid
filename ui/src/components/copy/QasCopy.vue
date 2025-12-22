<template>
  <span>
    <!-- "data-table-hover" é para habilitar hover no texto no QasTableGenerator -->
    <span data-table-hover>
      <slot v-if="props.useText">
        {{ props.text }}
      </slot>
    </span>

    <qas-btn class="q-ml-xs" color="primary" :icon="props.icon" :loading="isLoading" variant="tertiary" @click.stop.prevent="copy">
      <qas-tooltip text="Copiar" />
    </qas-btn>
  </span>
</template>

<script setup>
import QasBtn from '../btn/QasBtn.vue'
import QasTooltip from '../tooltip/QasTooltip.vue'

import { copyToClipboard } from '../../helpers'
import { ref } from 'vue'

defineOptions({ name: 'QasCopy' })

const props = defineProps({
  icon: {
    default: 'sym_r_file_copy',
    type: String
  },

  text: {
    required: true,
    type: String
  },

  useText: {
    type: Boolean,
    default: true
  },

  rawText: {
    default: '',
    type: String
  }
})

const isLoading = ref(false)

function copy () {
  copyToClipboard(props.rawText || props.text, value => {
    isLoading.value = value
  })
}
</script>
