<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div v-for="item in 10" :key="item" class="col-4">
        <qas-gallery-card v-bind="props" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    props () {
      return {
        url: 'https://picsum.photos/200/300.jpg'
      }
    }
  }
}
</script>
