<template>
  <div class="container spaced">
    <qas-box>
      <qas-label label="Título" />

      <div class="q-col-gutter-md row">
        <div v-for="item in 10" :key="item" class="col-4">
          <qas-gallery-card v-bind="props" />
        </div>
      </div>
    </qas-box>
  </div>
</template>

<script>
export default {
  computed: {
    props () {
      return {
        headerProps: {
          labelProps: {
            label: 'Meu titulo'
          }
        },
        url: 'https://picsum.photos/200/300.jpg'
      }
    }
  }
}
</script>
