<template>
  <div class="qas-gallery">
    <div class="q-col-gutter-md row">
      <div v-for="(image, index) in getInitialImages()" :key="index" :class="galleryColumnsClasses" :data-cy="`gallery-image-${index}`">
        <qas-gallery-card :key="galleryCardCountToReRender" v-bind="getGalleryCardProps({ image, index })">
          <template v-for="(_, name) in slots" #[name]="context">
            <slot v-bind="context" :image="image" :index="index" :name="name" />
          </template>
        </qas-gallery-card>
      </div>
    </div>

    <div class="q-mt-md">
      <slot>
        <div v-if="!hideShowMore" :class="actionsClasses">
          <qas-btn color="primary" data-cy="gallery-btn-show-more" :label="props.showMoreLabel" variant="tertiary" @click="showMore" />
        </div>
      </slot>
    </div>

    <pv-gallery-carousel-dialog v-model="carouselDialog" v-model:image-index="imageIndex" :images="normalizedImages" />

    <pv-gallery-delete-dialog v-model="showDeleteDialog" v-bind="deleteGalleryDialogProps" @cancel="resetCurrentModel" @error="onDeleteError" @success="onDeleteSuccess" />
  </div>
</template>

<script setup>
import PvGalleryCarouselDialog from './private/PvGalleryCarouselDialog.vue'
import PvGalleryDeleteDialog from './private/PvGalleryDeleteDialog.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasGalleryCard from '../gallery-card/QasGalleryCard.vue'

import { baseProps } from './composables/use-delete'
import { useScreen } from '../../composables'

import { extend } from 'quasar'
import { ref, computed, watch, useSlots } from 'vue'

defineOptions({ name: 'QasGallery' })

const props = defineProps({
  ...baseProps,

  galleryCardProps: {
    type: Object,
    default: () => ({})
  },

  initialSize: {
    type: Number,
    default: 4,
    validator: value => [1, 2, 3, 4, 6, 12].includes(value)
  },

  showMoreAlign: {
    type: String,
    default: 'center',
    validator: value => ['center', 'left', 'right'].includes(value)
  },

  showMoreLabel: {
    type: String,
    default: 'Ver mais'
  },

  useLoadAll: {
    type: Boolean
  },

  useDestroy: {
    type: Boolean
  },

  useObjectModel: {
    type: Boolean
  },

  modelValue: {
    type: Array,
    default: () => []
  },

  modelKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'delete-error',
  'delete-success',
  'update:modelValue'
])

const screen = useScreen()
const slots = useSlots()

const carouselDialog = ref(false)
const imageIndex = ref(0)
const displayedImages = ref(props.initialSize)
const showDeleteDialog = ref(false)
const currentModel = ref([])
const imageToBeDestroyed = ref({ index: null })

// contador para key
const galleryCardCountToReRender = ref(1)

// computed
const actionsClasses = computed(() => `text-${props.showMoreAlign}`)

const galleryColumnsClasses = computed(() => {
  const size = 12 / props.initialSize
  const col = `col-${size}`

  return screen.isSmall ? 'col-12' : col
})

const clonedImages = computed(() => extend(true, [], props.modelValue))

const normalizedImages = computed(() => {
  if (props.useObjectModel) return clonedImages.value

  return clonedImages.value.map(url => ({ url }))
})

const hideShowMore = computed(() => {
  return (normalizedImages.value.length <= displayedImages.value) || props.useLoadAll
})

const deleteGalleryDialogProps = computed(() => {
  return {
    customId: props.customId,
    dialogProps: props.dialogProps,
    entity: props.entity,
    modelKey: props.modelKey,
    payload: currentModel.value,
    url: props.url
  }
})

watch(() => normalizedImages.value, value => {
  currentModel.value = extend(true, [], value)
}, { immediate: true })

// functions
function getActionsMenuProps ({ image, index }) {
  if (!props.useDestroy) return {}

  return {
    useLabel: false,

    list: {
      destroy: {
        label: 'Excluir',
        color: 'grey-10',
        icon: 'sym_r_delete',
        disable: isDestroyDisabled(image),
        handler: () => onDelete(image, index)
      }
    }
  }
}

function getGalleryCardProps ({ image, index }) {
  const { headerProps } = props.galleryCardProps

  return {
    imageProps: getImageProps({ image, index }),

    ...image,

    headerProps: {
      ...image.headerProps,
      ...headerProps,

      actionsMenuProps: {
        ...getActionsMenuProps({ image, index }),
        ...image.headerProps?.actionsMenuProps,
        ...headerProps?.actionsMenuProps
      }
    },

    ...props.galleryCardProps
  }
}

function getImageProps ({ image, index }) {
  return {
    class: 'cursor-pointer',

    onClick: () => toggleCarouselDialog(index),
    onError: () => onError(image.url)
  }
}

function getInitialImages () {
  return props.useLoadAll
    ? normalizedImages.value
    : normalizedImages.value.slice(0, displayedImages.value)
}

function isDestroyDisabled (image) {
  return 'destroyable' in image && !image.destroyable
}

function resetCurrentModel () {
  currentModel.value = extend(true, [], normalizedImages.value)
}

function onError (error) {
  const index = normalizedImages.value.findIndex(image => image.url === error)

  if (~index) {
    normalizedImages.value.splice(index, 1)

    /**
     * Posteriormente no Options API estava sendo usado "this.$forceUpdate()"
     * porém agora estamos usando uma forma mais apropriada que é atualizar através de key
     * com contadores.
     */
    galleryCardCountToReRender.value += 1
  }
}

function onDeleteError (error) {
  resetCurrentModel()

  emit(
    'delete-error',
    { data: error, index: imageToBeDestroyed.value.index }
  )
}

function onDelete (image, index) {
  if (isDestroyDisabled(image)) return

  imageToBeDestroyed.value.index = index

  currentModel.value.splice(imageToBeDestroyed.value.index, 1)

  showDeleteDialog.value = !showDeleteDialog.value
}

function onDeleteSuccess () {
  normalizedImages.value.splice(imageToBeDestroyed.value.index, 1)

  emit('update:modelValue', normalizedImages.value)

  emit(
    'delete-success',
    { data: normalizedImages.value, index: imageToBeDestroyed.value.index }
  )
}

function toggleCarouselDialog (index) {
  imageIndex.value = index
  carouselDialog.value = !carouselDialog.value
}

function showMore () {
  displayedImages.value += displayedImages.value
}
</script>

<style lang="scss">
.qas-gallery {
  .qas-gallery-card__image {
    transition: transform var(--qas-generic-transition);
    border-radius: var(--qas-generic-border-radius);
    position: relative;

    &::before,
    &::after {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      transition: transform var(--qas-generic-transition);
      transform: scale(0);
      pointer-events: none;
    }

    &::before {
      border-radius: var(--qas-generic-border-radius);
      background-color: black;
      content: '';
      opacity: 0.7;
      z-index: 2;
    }

    &::after {
      color: white;
      content: 'zoom_out_map';
      align-items: center;
      font-family: 'Material Symbols Rounded';
      display: flex;
      justify-content: center;
      font-size: 24px;
      z-index: 3;
    }

    &:hover {
      &::after,
      &::before {
        transform: scale(100%);
      }
    }
  }
}
</style>
