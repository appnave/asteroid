<template>
  <div class="container spaced">
    <qas-sortable v-model:sorted="model" class="row" entity="users" :list="list">
      <div v-for="(item, index) in list" :key="index">
        <img :src="item.photo" style="max-width: 300px;">
      </div>
    </qas-sortable>

    Model: <pre>{{ model }}</pre>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: [],
      options: {}
    }
  },

  computed: {
    list () {
      return [
        { photo: 'https://placehold.co/600x400', id: '1w312l' },
        { photo: 'https://placehold.co/600x400/orange/white', id: '3x432q' },
        { photo: 'https://placehold.co/600x400/blue/white', id: '2y927s' }
      ]
    }
  }
}
</script>
