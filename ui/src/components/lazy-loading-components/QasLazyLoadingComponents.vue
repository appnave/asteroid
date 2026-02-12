<template>
  <!--
    Itera sobre todos os componentes extraídos do slot
    Cada item pode estar em dois estados:
    1. Visível: Renderiza o componente real
    2. Não visível: Renderiza placeholder vazio (reserva espaço)
  -->
  <template
    v-for="(item, index) in items"
    :key="index"
  >
    <transition enter-active-class="animated fadeIn slow">
      <!-- Componente real - renderizado quando visível -->
      <component
        :is="item"
        v-if="visibleItems.has(index)"
      />

      <!-- Placeholder - div vazia que reserva espaço no layout -->
      <div
        v-else
        :ref="element => setPlaceholderRef(element, index)"
        :style="{ height: placeholderHeight }"
      />
    </transition>
  </template>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, useSlots, nextTick, watch } from 'vue'

defineOptions({ name: 'QasLazyLoadingComponents' })

const props = defineProps({
  // Porcentagem de visibilidade necessária para ativar (0.0 a 1.0)
  threshold: {
    type: Number,
    default: 0.1 // 10% visível
  },

  // Margem extra ao redor do viewport para pré-carregamento
  rootMargin: {
    type: String,
    default: '0px'
  },

  // Altura dos placeholders antes de carregar
  placeholderHeight: {
    type: String,
    default: '500px'
  }
})

// refs
/**
 * Lista de VNodes extraídos do slot default
 * Cada item é um VNode que representa um componente filho
 *
 * Exemplo:
 * <qas-lazy-loading-components>
 *   <ComponenteA /> <- items[0]
 *   <ComponenteB /> <- items[1]
 * </qas-lazy-loading-components>
 */
const items = ref([])

/**
 * Set de índices dos componentes que já foram renderizados
 * Quando um placeholder entra no viewport, seu índice é adicionado aqui
 * @type {Ref<Set<number>>}
 */
const visibleItems = ref(new Set())

// composables
const slots = useSlots()

// consts
/**
 * Map que armazena referências aos elementos placeholder
 * Chave: índice do componente
 * Valor: elemento DOM do placeholder
 * @type {Map<number, HTMLElement>}
 */
const placeholderRefs = new Map()

/**
 * Instância do IntersectionObserver
 * Responsável por detectar quando placeholders entram no viewport
 * @type {IntersectionObserver | null}
 */
let observer = null

// lifecycle hooks
onMounted(handleObserver)

// Observa mudanças no slot para atualizar items
watch(
  () => slots.default?.(),
  handleObserver,
  { flush: 'post' }
)

onBeforeUnmount(() => {
  if (!observer) return

  // Limpa o observer para evitar memory leaks
  observer.disconnect()
})

// functions
/**
 * Cria e configura o IntersectionObserver
 * Observa todos os placeholders e renderiza componentes quando visíveis
 *
 * Fluxo:
 * 1. Cria observer com threshold e rootMargin configurados
 * 2. Quando placeholder entra no viewport:
 *    - Encontra o índice correspondente no Map
 *    - Adiciona índice ao visibleItems (renderiza componente)
 *    - Para de observar esse elemento
 * 3. Observa todos os placeholders armazenados no Map
 */
function createObserver () {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        // Converte Map em Array para facilitar busca
        const list = Array.from(placeholderRefs.entries())

        // Encontra o índice do placeholder no Map
        const index = list.findIndex(([_, element]) => element === entry.target)

        // Verifica se encontrou o índice (index !== -1)
        if (!~index) return

        // Adiciona ao Set para renderizar o componente real
        visibleItems.value.add(index)

        // Para de observar - componente já foi renderizado
        observer.unobserve(entry.target)
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  )

  // Observa todos os placeholders do Map
  placeholderRefs.forEach(element => {
    observer.observe(element)
  })
}

function handleObserver () {
  setItems()

  // Reconstrói o observer com os novos items
  if (observer) {
    observer.disconnect()
  }

  nextTick(() => requestAnimationFrame(createObserver))
}

/**
 * Extrai e achata os VNodes do slot default
 * Suporta múltiplos cenários:
 * - Componentes individuais: <ComponenteA /> <ComponenteB />
 * - v-for: <Component v-for="..." />
 * - template v-for: <template v-for="..."><Component /></template>
 *
 * @param {Array} vnodes - Array de VNodes
 * @returns {Array} Array de VNodes achatado
 */
function flattenVNodes (vnodes) {
  const flattened = []

  vnodes.forEach(vnode => {
    // Ignora VNodes inválidos (null, undefined, primitivos)
    if (!vnode || typeof vnode !== 'object') return

    /**
     * Se for um Fragment (v-for, template, v-if, etc), achata recursivamente os children
     * Fragments são wrappers que o Vue cria para agrupar múltiplos elementos
     */
    const isFragment = typeof vnode.type === 'symbol' && Array.isArray(vnode.children)

    if (isFragment) {
      flattened.push(...flattenVNodes(vnode.children))
    } else {
      // VNode normal (componente ou elemento HTML)
      flattened.push(vnode)
    }
  })

  return flattened
}

/**
 * Extrai os VNodes do slot default e armazena em items
 * Achata automaticamente fragments e v-for
 *
 * Exemplo de uso:
 * <qas-lazy-loading-components>
 *   <ComponenteA />  <- vnode 0
 *   <ComponenteB />  <- vnode 1
 *   <Component v-for="item in 10" /> <- vnode 2-11
 * </qas-lazy-loading-components>
 */
function setItems () {
  const slotContent = slots.default?.() || []
  const flattenedItems = flattenVNodes(slotContent)

  items.value = flattenedItems
}

/**
 * Armazena referência do elemento placeholder no Map
 * Chamado automaticamente pelo Vue através do :ref no template
 *
 * @param {HTMLElement | null} element - Elemento DOM do placeholder
 * @param {number} index - Índice do componente
 */
function setPlaceholderRef (element, index) {
  if (!element) return

  placeholderRefs.set(index, element)

  /**
   * Define a altura do placeholder com base no atributo "data-placeholder-height" caso queira customizar pra
   * o elemento específico, e não o definido na prop placeholderHeight.
   */
  element.style.height = items.value[index].props?.['data-placeholder-height'] || props.placeholderHeight
}
</script>
