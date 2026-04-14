<template>
  <div class="container spaced">
    <div>
      <qas-tree-generator v-model:lazy-nodes="lazyNodes" :form-view-props="formViewProps" :nodes="nodes" resource="tree-nodes" use-form-view-add use-form-view-edit />
    </div>

    <div class="q-my-lg">
      lazyNodes:
    </div>
    <qas-debugger :inspect="[lazyNodes]" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      lazyNodes: []
    }
  },

  computed: {
    formViewProps () {
      return {
        entity: 'treeNodes'
      }
    },

    nodes () {
      return [
        {
          label: 'Nó pai',
          uuid: 'no-pai',
          lazy: true,
          children: [
            {
              label: 'Nó filho 1',
              uuid: 'no-filho-1',
              lazy: true,
              children: [
                {
                  label: 'Nó filho 1.1',
                  uuid: 'no-filho-1.1',
                  lazy: true,
                  children: [
                    {
                      label: 'Nó filho 1.1.1',
                      uuid: 'no-filho-1.1.1',
                      lazy: true
                    },
                    {
                      label: 'Nó filho 1.2.1',
                      uuid: 'no-filho-1.2.1',
                      lazy: true
                    },
                    {
                      label: 'Nó filho 1.3.1',
                      uuid: 'no-filho-1.3.1',
                      lazy: true
                    }
                  ]
                },
                {
                  label: 'Nó filho 1.2',
                  uuid: 'no-filho-1.2',
                  lazy: true
                },
                {
                  label: 'Nó filho 1.3',
                  uuid: 'no-filho-1.3',
                  lazy: true
                }
              ]
            },
            {
              label: 'Nó filho 2',
              uuid: 'no-filho-2'
            },
            {
              label: 'Nó filho 3',
              uuid: 'no-filho-3'
            }
          ]
        }
      ]
    }
  }
}
</script>
