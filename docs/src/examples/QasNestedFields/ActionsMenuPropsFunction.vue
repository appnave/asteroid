<template>
  <div class="container spaced">
    <div class="full-width">
      <div class="q-mt-lg text-center">
        <div>
          <qas-nested-fields v-model="model" :actions-menu-props="getActionsMenuProps" class="full-width" :field="nested" :form-columns :row-object use-inline-actions :use-starts-empty="false" />
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
    getActionsMenuProps ({ row, list }) {
      return {
        list: {
          ...(row.status && {
            visibility: {
              icon: 'sym_r_visibility',
              label: 'Visualizar',
              handler: () => alert('Clicou em visualizar!')
            }
          }),

          ...list
        }
      }
    }
  }
}
</script>
