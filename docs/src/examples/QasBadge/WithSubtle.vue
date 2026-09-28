<template>
  <div class="container q-gutter-md q-py-lg">
    <qas-badge v-for="(color, index) in badges" :key="index" :color="color" icon="sym_r_flag" :label="color" removable use-subtle />
  </div>
</template>

<script setup>
defineOptions({ name: 'WithSubtle' })

const badges = [
  'green-6',
  'yellow-8',
  'orange-6',
  'red-8',
  'green-7',
  'light-blue-5'
]
</script>
