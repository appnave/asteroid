<template>
  <div class="qas-infinite-scroll" :style="containerStyle">
    <q-infinite-scroll
      ref="infiniteScroll"
      v-bind="attributes"
      @load="onLoad"
    >
      <slot />

      <template #loading>
        <div class="justify-center q-my-md row">
          <q-spinner-dots
            color="primary"
            size="3em"
          />
        </div>
      </template>
    </q-infinite-scroll>

    <qas-empty-result-text v-if="hasNoResults" />
  </div>
</template>

<script setup>
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'

import { ref, computed, inject, nextTick } from 'vue'
import { NotifyError } from '../../plugins'

defineOptions({ name: 'QasInfiniteScroll' })

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },

  fields: {
    type: Object,
    default: () => ({})
  },

  limitPerPage: {
    type: Number,
    default: 12
  },

  url: {
    type: String,
    default: '',
    required: true
  },

  params: {
    type: Object,
    default: () => ({})
  },

  infiniteScrollProps: {
    type: Object,
    default: () => ({})
  },

  maxHeight: {
    type: String,
    default: ''
  }
})

defineExpose({ refresh, remove, fetchList })

const emit = defineEmits(['fetch-success', 'fetch-error'])

const modelList = defineModel('list', { type: Array, default: () => [] })
const modelFields = defineModel('fields', { type: Object, default: () => ({}) })

const axios = inject('axios')

const infiniteScroll = ref(null)

const hasFetchingError = ref(false)
const isFetching = ref(false)
const hasMadeFirstFetch = ref(false)
const count = ref(0)
const offset = ref(0)

const listLength = computed(() => modelList.value.length)

const attributes = computed(() => ({
  offset: 100,
  debounce: 0,
  ...(props.maxHeight && { scrollTarget: '.qas-infinite-scroll' }),
  ...props.infiniteScrollProps
}))

const isEmptyList = computed(() => !listLength.value && !isFetching.value)

const hasNoResults = computed(() => isEmptyList.value && hasMadeFirstFetch.value)

const containerStyle = computed(() => ({
  ...(props.maxHeight && { maxHeight: props.maxHeight, overflow: hasNoResults.value ? 'initial' : 'auto' })
}))

async function onLoad (_, done) {
  const hasMadeFirstFetchAndHasNoData = hasMadeFirstFetch.value && !listLength.value
  const hasFetchAllData = listLength.value && listLength.value >= count.value
  const stop = hasFetchingError.value || isFetching.value || hasMadeFirstFetchAndHasNoData || hasFetchAllData

  if (stop) {
    infiniteScroll.value.stop()
  } else {
    infiniteScroll.value.resume()
    await fetchList()
  }

  done()
}

async function fetchList () {
  try {
    isFetching.value = true

    const { data } = await axios.get(props.url, {
      params: { offset: offset.value, limit: props.limitPerPage, ...props.params }
    })

    const newList = [...modelList.value, ...(data.results || [])]

    modelList.value = newList
    offset.value = newList.length
    count.value = data.count
    modelFields.value = data.fields

    /**
     * Sinalizar que houve já uma busca, para evitar que onLoad entre em looping,
     * após buscar uma vez e retornar uma lista vazia.
    */
    hasMadeFirstFetch.value = true

    emit('fetch-success', { list: newList, fields: modelFields.value, offset: offset.value, count: count.value })
  } catch (error) {
    NotifyError('Ops… Não conseguimos acessar as informações. Por favor, tente novamente em alguns minutos.')

    hasFetchingError.value = true

    emit('fetch-error', error)
  } finally {
    isFetching.value = false
  }
}

function refresh () {
  count.value = 0
  offset.value = 0
  modelList.value = []

  hasMadeFirstFetch.value = false

  nextTick(() => {
    infiniteScroll.value.reset()
    infiniteScroll.value.resume()
  })
}

function remove (index) {
  modelList.value.splice(index, 1)
  count.value -= 1
  offset.value -= 1
}
</script>
