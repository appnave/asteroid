<template>
  <div class="container spaced">
    <qas-field v-model="model" :field="fieldWithChildren" />

    <div class="q-my-lg">
      model: <qas-debugger :inspect="[model]" />
    </div>

    <qas-field v-model="model2" :field="fieldWithoutChildren" />

    <div class="q-my-lg">
      model2: <qas-debugger :inspect="[model2]" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: [],
      model2: []
    }
  },

  computed: {
    fieldWithChildren () {
      return {
        name: 'checkbox',
        type: 'checkbox',
        label: 'Campo checkbox com children',
        options: [
          {
            label: 'Opção 1',
            value: 1,
            children: [
              {
                label: 'Opção 2',
                value: 2
              },
              {
                label: 'Opção 3',
                value: 3
              }
            ]
          }
        ]
      }
    },

    fieldWithoutChildren () {
      return {
        name: 'checkbox',
        type: 'checkbox',
        label: 'Campo checkbox sem children',
        options: [
          {
            label: 'Opção 2',
            value: 2
          },
          {
            label: 'Opção 3',
            value: 3
          }
        ]
      }
    }
  }
}
</script>
