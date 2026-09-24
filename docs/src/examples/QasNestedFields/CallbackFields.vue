<template>
  <div class="container spaced">
    <div class="full-width">
      <div class="q-mt-lg text-center">
        <div>
          <qas-nested-fields v-model="model" class="full-width" :field="nested" :fields-handler-fn="getFields" :fields-props="getFieldsProps" :form-columns="formColumns" :row-object="rowObject" :use-starts-empty="false" />
        </div>

        <div class="q-my-lg">
          Model: <qas-debugger :inspect="[model]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filterObject from '@appnave/quasar-ui-asteroid/src/helpers/filter-object'

const nested = {
  name: 'nested',
  type: 'nested',
  label: 'Meu nested',
  children: {
    status: {
      name: 'status',
      type: 'boolean',
      label: 'Status'
    },
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
      label: 'Cidade',
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
      model: []
    }
  },

  computed: {
    rowObject () {
      return {
        status: false,
        name: '',
        email: '',
        cities: []
      }
    },

    formColumns () {
      return {
        status: { col: 2 },
        name: { col: 12 },
        email: { col: 12 },
        cities: { col: 12 }
      }
    }
  },

  methods: {
    getFields ({ fields, index, row }) {
      return filterObject(fields, [
        'status',
        'name',
        row.status && 'email',
        'cities'
      ])
    },

    getFieldsProps ({ index, row }) {
      return {
        name: {
          disable: !row.status
        }
      }
    }
  }
}
</script>
