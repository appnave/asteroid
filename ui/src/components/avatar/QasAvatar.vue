<template>
  <q-avatar class="text-bold" v-bind="attributes">
    <q-img v-if="hasImage" :alt="props.title" :ratio="1" spinner-color="primary" spinner-size="16px" :src="props.image" @error="onImageLoadedError" />
    <template v-else-if="hasTitle">{{ label }}</template>
    <q-icon v-else :name="props.icon" />
  </q-avatar>
</template>

<script setup>
import { AvatarColors } from './enums/AvatarColors'

import { ref, computed, watch, useAttrs } from 'vue'

defineOptions({
  name: 'QasAvatar',
  inheritAttrs: false
})

const props = defineProps({
  color: {
    type: String,
    default: AvatarColors.Primary
  },

  size: {
    type: String,
    default: ''
  },

  icon: {
    default: 'sym_r_error',
    type: String
  },

  image: {
    default: '',
    type: String
  },

  textColor: {
    default: '',
    type: String
  },

  title: {
    default: '',
    type: String
  },

  useCropTitle: {
    type: Boolean,
    default: true
  }
})

const attrs = useAttrs()

const hasImageError = ref(false)

const attributes = computed(() => {
  const {
    rounded,
    square,
    fontSize,
    ...attributes
  } = attrs

  const colors = {
    [AvatarColors.Primary]: 'white',
    [AvatarColors.SecondaryContrast]: 'primary',
    [AvatarColors.Grey4]: 'grey-8',
    [AvatarColors.Red14]: 'white'
  }

  return {
    size: props.size,
    color: props.color,
    textColor: colors[props.color] || props.textColor,
    ...attributes
  }
})

const label = computed(() => props.useCropTitle ? props.title[0]?.toUpperCase?.() : props.title)

const hasImage = computed(() => !hasImageError.value && !!props.image)
const hasTitle = computed(() => !!props.title)

watch(() => props.image, () => {
  hasImageError.value = false
})

function onImageLoadedError () {
  hasImageError.value = true
}
</script>
