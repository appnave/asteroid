<template>
  <div class="container error-component flex">
    <div class="column full-width items-center justify-center row">
      <h2 :aria-label="ariaLabelCode" class="q-mb-sm text-h2" role="heading">
        {{ code }}
      </h2>

      <div class="q-mb-2xl text-body1 text-center text-grey-8">
        <qas-breakline :text="description" />
      </div>

      <q-img alt="ilustração do código de erro" class="error-component__image" :src="imagePath" />

      <qas-btn v-if="hasButtonProps" class="q-mt-xl" v-bind="buttonProps" color="primary" icon="sym_r_chevron_left" variant="tertiary" />
    </div>
  </div>
</template>

<script>
import QasBreakline from '../components/breakline/QasBreakline.vue'
import QasBtn from '../components/btn/QasBtn.vue'

export default {
  name: 'ErrorComponent',

  components: {
    QasBreakline,
    QasBtn
  },

  props: {
    buttonProps: {
      type: Object,
      default: () => ({})
    },

    code: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ''
    },

    imagePath: {
      type: String,
      default: ''
    }
  },

  computed: {
    hasButtonProps () {
      return !!Object.keys(this.buttonProps).length
    },

    ariaLabelCode () {
      return `Código de erro ${this.code}`
    }
  }
}
</script>

<style lang="scss">
.error-component {
  min-height: 100vh;
  padding: var(--qas-spacing-3xl) 0;

  &__image {
    width: 300px;
  }

  @media (max-width: $breakpoint-xs) {
    padding: var(--qas-spacing-xl) 0;

    &__image {
      width: 265px;
    }
  }
}
</style>
