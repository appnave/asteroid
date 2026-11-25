<template>
  <div class="container spaced">
    <div class="full-width">
      <div class="q-mt-lg text-center">
        <div>
          <qas-nested-fields v-model="model" class="full-width" :field="nested" :fields-props="fieldsProps" :form-columns="formColumns" :row-object="rowObject" :use-duplicate="false" use-inline-actions />
        </div>

        <div class="q-my-lg">
          Model: <qas-debugger :inspect="[model]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const nested = {
  name: 'nested',
  type: 'nested',
  label: 'Meu nested',
  children: {
    name: {
      name: 'name',
      type: 'text',
      label: 'Nome'
    },
    email: {
      name: 'email',
      type: 'email',
      label: 'E-mail'
    },
    cities: {
      name: 'cities',
      type: 'select',
      options: [
        {
          label: 'Cidade 1',
          value: 1
        },
        {
          label: 'Cidade 2',
          value: 2
        },
        {
          label: 'Cidade 3',
          value: 3
        }
      ]
    }
  }
}

export default {
  data () {
    return {
      nested,
      model: [
        {
          name: 'John',
          email: 'john@teste.com',
          cities: 1
        },
        {
          name: 'John 2',
          email: 'john@teste.com',
          cities: 2
        }
      ]
    }
  },

  computed: {
    rowObject () {
      return {
        name: '',
        email: '',
        cities: []
      }
    },

    formColumns () {
      return {
        name: { col: 12 },
        email: { col: 12 },
        cities: { col: 12 }
      }
    },

    fieldsProps () {
      return {
        name: {
          label: 'Novo label'
        }
      }
    }
  }
}
</script>
