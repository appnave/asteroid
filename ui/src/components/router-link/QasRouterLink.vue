<!--
  Tratamento feito para ter o comportamento de ao abrir em uma nova guia, direto na página, abre sem overlay.
  Caso contrário, ao clicar normalmente, abrirá no overlay.
-->
<template>
  <router-link
    class="qas-router-link text-no-decoration"
    v-bind="routerLinkProps"
  >
    <slot>
      {{ props.label }}
    </slot>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOverlayNavigation } from 'asteroid'

defineOptions({ name: 'QasRouterLink' })

const props = defineProps({
  label: {
    type: String,
    default: ''
  },

  route: {
    type: Object,
    required: true
  },

  useOverlayRoute: {
    type: Boolean,
    default: false
  }
})

// composables
const router = useRouter()
const { getOverlayRoute } = useOverlayNavigation()

// computeds
const routerLinkProps = computed(() => {
  return {
    to: props.route,

    ...(props.useOverlayRoute && {
      onClick: event => {
        /**
         * @click.prevent pra evitar com que o router-link já trate o clique e tente navegar para a rota
         * normalmente, o que não é o desejado quando queremos abrir um overlay
         */
        event.preventDefault()

        router.push(getOverlayRoute(props.route))
      }
    })
  }
})
</script>

<style lang="scss">
.qas-router-link {
  transition: color var(--qas-generic-transition);
  color: inherit;

  &:hover {
    color: $primary;
  }
}
</style>
