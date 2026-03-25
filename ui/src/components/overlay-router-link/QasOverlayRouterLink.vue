<template>
  <!--
    Tratamento feito para ter o comportamento de ao abrir em uma nova guia, direto na página, abre sem overlay.
    Caso contrário, ao clicar normalmente, abrirá no overlay.
  -->
  <router-link
    class="qas-overlay-router-link text-no-decoration"
    v-bind="routerLinkProps"
  >
    <slot>
      {{ props.title }}
    </slot>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOverlayNavigation } from 'asteroid'

defineOptions({ name: 'QasOverlayRouterLink' })

const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  route: {
    type: Object,
    required: true
  },

  overlayRoute: {
    type: Object,
    default: () => ({})
  }
})

// composables
const router = useRouter()
const { getOverlayRoute } = useOverlayNavigation()

// computeds
const routerLinkProps = computed(() => {
  const hasOverlayRoute = !!Object.keys(props.overlayRoute).length

  return {
    to: props.route,

    ...(hasOverlayRoute && {
      onClick: event => {
        /**
         * @click.prevent pra evitar com que o router-link já trate o clique e tente navegar para a rota
         * normalmente, o que não é o desejado quando queremos abrir um overlay
         */
        event.preventDefault()

        router.push(getOverlayRoute(props.overlayRoute))
      }
    })
  }
})
</script>

<style lang="scss">
.qas-overlay-router-link {
  color: inherit;

  &:hover {
    color: $primary;
  }
}
</style>
