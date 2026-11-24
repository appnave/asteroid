<template>
  <q-tooltip v-if="!isDragging" ref="tooltipRef" v-bind="tooltipProps" class="bg-grey-10 text-caption" @before-show="onBeforeShow" @hide="onHide">
    <qas-breakline :text="props.text" />
  </q-tooltip>
</template>

<script>
import { ref } from 'vue' // eslint-disable-line import/no-duplicates

// Guarda a ref do QTooltip visível no momento, compartilhada por TODAS as instâncias.
export const activeTooltip = ref(null)
</script>

<script setup>
import QasBreakline from '../breakline/QasBreakline.vue'

import { inject, onUnmounted } from 'vue' // eslint-disable-line import/no-duplicates

defineOptions({ name: 'QasTooltip' })

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

const tooltipRef = ref(null)

/**
 * Guarda a ref do tooltip que ESTE escondeu para aparecer, para reexibi-lo (.show()) quando
 * este sumir e o mouse tiver voltado para a área dele.
 */
let previousTooltip = null

// injects
const isDragging = inject('isDragging', ref(false))

// consts
const tooltipProps = {
  anchor: 'center right',
  self: 'center left',
  offset: [5, 5],
  maxWidth: '300px'
}

function onBeforeShow () {
  /**
   * Existe algum outro tooltip visível (activeTooltip preenchido) e ele não sou eu?
   * Se sim, preciso escondê-lo para manter a regra de "somente um por vez".
   */
  if (activeTooltip.value && activeTooltip.value !== tooltipRef.value) {
    /**
     * Guardo quem eu estou escondendo. Assim, quando EU for escondido depois, consigo
     * reexibi-lo caso o mouse tenha voltado para a área dele.
     */
    previousTooltip = activeTooltip.value

    // Esconde o tooltip anterior
    previousTooltip?.hide()
  }

  // Agora eu passo a ser o tooltip ativo do momento.
  activeTooltip.value = tooltipRef.value
}

function onHide (evt) {
  /**
   * Só limpo o activeTooltip se o ativo ainda for eu. Se outro tooltip já assumiu
   * (ficou ativo depois de mim), não posso apagá-lo — ele ainda está visível.
   */
  if (activeTooltip.value === tooltipRef.value) {
    activeTooltip.value = null
  }

  // Pego o tooltip que eu havia escondido e já limpo a variável.
  const previous = previousTooltip
  previousTooltip = null

  /**
   * Elemento que dispara o previous (aquele em que o usuário passa o mouse). No DOM é o
   * pai onde o <qas-tooltip> foi declarado.
   */
  const triggerElement = previous?.$el?.parentNode

  /**
   * Se o mouse (relatedTarget = para onde ele foi) voltou para dentro do elemento que dispara
   * o previous, reexibo o previous (ex.: saí do tooltip A, fui para o B e voltei para o A).
   */
  if (triggerElement?.contains(evt?.relatedTarget)) {
    previous.show()
  }
}

/**
 * Ao desmontar, limpo a referência compartilhada se este ainda era o ativo, para não
 * deixar o activeTooltip apontando para um componente que não existe mais.
 */
onUnmounted(() => {
  if (activeTooltip.value === tooltipRef.value) {
    activeTooltip.value = null
  }
})
</script>
