<template>
  <div class="doc-heading">
    <component :is="tag" :id="titleId" ref="parentComponent" class="doc-heading__title" :class="titleClass">
      <slot>{{ title }}</slot>

      <q-badge v-if="badge" class="doc-heading__badge q-ml-sm" color="brand-primary" :label="badge" />

      <q-btn v-if="hasOverlayButton" class="q-ml-sm" color="primary" label="Abrir em overlay" outline size="sm" :to="overlayNavigation.getOverlayRoute({ name: $route.name })" unelevated />
    </component>
  </div>
</template>

<script>
import { useOverlayNavigation } from '@bildvitta/quasar-ui-asteroid/src/composables'

export default {
  props: {
    badge: {
      default: '',
      type: String
    },

    level: {
      default: 1,
      type: Number,
      validator: value => {
        return value > 0 && value < 7
      }
    },

    title: {
      default: '',
      type: String
    }
  },

  data () {
    return {
      titleId: '',
      overlayNavigation: useOverlayNavigation()
    }
  },

  computed: {
    tag () {
      return `h${this.level}`
    },

    titleClass () {
      return `doc-heading__title--level-${this.level}`
    },

    /**
     * Só tem botão de overlay em headings de nível 1 e que não estão dentro de um overlay.
     */
    hasOverlayButton () {
      return this.level === 1 && !this.overlayNavigation.isOverlay
    }
  },

  mounted () {
    const element = this.$refs.parentComponent
    this.titleId = element.textContent.trim().split(' ').join('-')
  }
}
</script>

<style lang="scss">
.doc-heading {
  color: $brand-primary;

  &__title {
    line-height: 1;

    // &::after {
    //   content: ' #';
    //   font-size: 75%;
    //   opacity: 0;
    //   transition: opacity 250ms;
    // }

    // &:hover::after {
    //   opacity: 1;
    // }
  }

  &__title--level- {
    &1 {
      font-size: 3rem;
      font-weight: 600;
      margin: 0 0 0.5em;
      padding: 1rem 0;
    }

    &2 {
      border-bottom: 1px solid $grey-4;
      font-size: 2rem;
      font-weight: 600;
      margin: 4rem 0 1.5rem;
      padding: 0.5rem 0;
    }

    &3 {
      font-size: 1.7rem;
      margin: 2.5rem 0 1.5rem;
      padding: 0.45rem 0;
    }

    &4 {
      font-size: 1.4rem;
      margin: 1.6rem 0 1.3rem;
      padding: 0.25rem 0;
    }

    &5 {
      font-size: 0.9rem;
      margin: 1.5rem 0;
    }

    &6 {
      font-size: 0.8rem;
      margin: 1.5rem 0;
    }
  }

  &__badge {
    vertical-align: super;
  }
}
</style>
