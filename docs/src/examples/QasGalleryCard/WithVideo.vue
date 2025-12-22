<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div v-for="item in 4" :key="item" class="col-6">
        <qas-gallery-card v-bind="galleryProps" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'WithVideo' })

const galleryProps = {
  headerProps: {
    labelProps: {
      label: 'Meu titulo'
    }
  },
  useVideo: true,
  url: 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0'
}
</script>
