<template>
  <div class="container spaced">
    <qas-gallery v-model="images" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      images: [
        'https://placehold.co/600x400',
        'https://placehold.co/600x400/orange/white',
        'https://placehold.co/600x400/blue/white',
        'https://placehold.co/600x400/red/white',
        'https://placehold.co/600x400/yellow/white',
        'https://placehold.co/600x400',
        'https://placehold.co/600x400/orange/white',
        'https://placehold.co/600x400/blue/white',
        'https://placehold.co/600x400/red/white',
        'https://placehold.co/600x400/yellow/white',
        'https://placehold.co/600x400',
        'https://placehold.co/600x400/orange/white',
        'https://placehold.co/600x400/blue/white',
        'https://placehold.co/600x400/red/white',
        'https://placehold.co/600x400/yellow/white'
      ]
    }
  }
}
</script>
