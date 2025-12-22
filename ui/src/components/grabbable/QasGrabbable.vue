<template>
  <div class="qas-grabbable relative-position">
    <div
      ref="grabContainer"
      class="flex no-wrap qas-grabbable__container secondary-scroll"
      :class="classes"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { setScrollOnGrab } from '../../helpers'

defineOptions({ name: 'QasGrabbable' })

const props = defineProps({
  useScrollBar: {
    type: Boolean
  },

  cancelMouseDownTarget: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['grabbing'])

const grabContainer = ref(null)
const grabPosition = ref(null)
const isGrabbing = ref(false)
const scrollOnGrab = ref({})
const resizeObserver = ref(null)

const classes = computed(() => {
  const baseClass = 'qas-grabbable__container'

  return [
    {
      [`${baseClass}--grabbing`]: isGrabbing.value,
      [`${baseClass}--no-grab`]: !hasScrollOnGrab.value,
      [`${baseClass}--no-scroll`]: !props.useScrollBar
    },
    `${baseClass}--grab-${grabPosition.value}`
  ]
})

const hasScrollOnGrab = computed(() => !!Object.keys(scrollOnGrab.value).length)

function handleEnableScrollOnGrab () {
  const { scrollWidth, offsetWidth } = grabContainer.value

  if (scrollWidth > offsetWidth) {
    initScrollOnGrab()
    setGrabPosition()

    return
  }

  destroyScrollOnGrab()
}

function initScrollOnGrab () {
  if (hasScrollOnGrab.value) return

  scrollOnGrab.value = setScrollOnGrab(
    grabContainer.value,
    {
      onGrabFn: onGrab,
      onMoveFn: setGrabPosition,
      onScrollFn: setGrabPosition
    },
    props.cancelMouseDownTarget
  )
}

function destroyScrollOnGrab () {
  if (!hasScrollOnGrab.value) return

  scrollOnGrab.value.element.style.cursor = 'auto'
  scrollOnGrab.value = {}

  grabPosition.value = null
}

function onGrab ({ isGrabbing: grabbing }) {
  isGrabbing.value = grabbing

  emit('grabbing', grabbing)
}

function setGrabPosition () {
  const { offsetWidth, scrollLeft, scrollWidth } = grabContainer.value
  const offset = 16

  if (scrollLeft <= offset) {
    /**
     * Se o scroll estiver no início, o valor de `scrollLeft` será 0. No entanto,
     * é necessário verificar se o valor de `scrollLeft` é menor ou igual a `offset`
     * para garantir um espaço de segurança.
     */
    grabPosition.value = 'start'
  } else if (scrollLeft + offsetWidth + offset >= scrollWidth) {
    /**
     * Se o scroll estiver no final, o valor de `scrollLeft` + `offsetWidth` será
     * igual a `scrollWidth`. Porém, estamos levamos em consideração um espaço de
     * segurança contido na variável `offset`.
     */
    grabPosition.value = 'end'
  } else {
    /**
     * Se o scroll não estiver no início e nem no final, ele estará no meio.
     */
    grabPosition.value = 'middle'
  }
}

function setResizeObserver () {
  resizeObserver.value = new ResizeObserver(handleEnableScrollOnGrab)

  resizeObserver.value.observe(grabContainer.value)
}

function destroyResizeObserver () {
  resizeObserver.value.unobserve(grabContainer.value)
}

onMounted(() => {
  setResizeObserver()
})

onBeforeUnmount(() => {
  destroyResizeObserver()
  destroyScrollOnGrab()
})
</script>

<style lang="scss">
.qas-grabbable {
  &__container {
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    overflow-x: auto;

    &::before,
    &::after {
      content: '';
      width: 24px;
      height: 100%;
      position: absolute;
      top: 0;
      pointer-events: none;
      z-index: 1;
    }

    &::before {
      background: linear-gradient(-270deg, rgba($grey-1, 0.7) 0%, rgba(251, 251, 251, 0) 100%);
      left: 0;
    }

    &::after {
      background: linear-gradient(270deg, rgba($grey-1, 0.7) 0%, rgba(251, 251, 251, 0) 100%);
      right: 0;
    }

    &--no-scroll {
      scrollbar-width: none;

      &::-webkit-scrollbar {
        width: 0;
      }
    }

    &--no-grab::before,
    &--no-grab::after,
    &--grab-start::before,
    &--grab-end::after {
      content: none !important;
    }
  }
}
</style>
