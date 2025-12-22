<template>
  <q-card bordered class="doc-api" flat>
    <q-toolbar>
      <doc-card-title :title="name" />

      <q-space />

      <q-input v-model="search" borderless dense input-class="text-right" placeholder="Buscar..." type="search">
        <template #append>
          <q-btn dense flat icon="sym_r_search" />
        </template>
      </q-input>
    </q-toolbar>

    <q-linear-progress v-if="isLoading" color="brand-primary" indeterminate />

    <template v-else>
      <q-separator />

      <q-tabs v-model="currentTab" align="left" :breakpoint="0" class="doc-api__tabs" dense indicator-color="brand-primary" no-caps>
        <q-tab v-for="(tab, key) in tabs" :key="`tab-${key}`" :name="key">
          <div class="items-center no-wrap row">
            <span class="text-weight-medium">{{ tab }}</span>
            <q-badge v-if="filteredApi[key].length" class="q-ml-sm" color="brand-primary" :label="filteredApi[key].length" />
          </div>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="currentTab" animated class="doc-api__tab-panels">
        <q-tab-panel v-for="(tab, key) in tabs" :key="`panel-${key}`" class="q-pa-none" :name="key">
          <div v-if="hasResults(filteredApi[key])">
            <doc-api-entry :api="filteredApi[key].results" />
          </div>
          <div v-else class="q-pa-md">
            <div>Nenhuma entrada correspondente encontrada nesta guia.</div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- <q-separator />

      <div class="q-pa-md">
        <component :is="name" class="doc-api__component" v-bind="componentProps" />
      </div> -->
    </template>
  </q-card>
</template>

<script>
export default {
  props: {
    file: {
      type: String,
      required: true
    },

    type: {
      default: 'components',
      type: String,
      validator: value => ['components', 'plugins'].includes(value)
    },

    name: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      api: {},
      currentTab: '',
      isLoading: false,
      tabs: {},
      search: ''
    }
  },

  computed: {
    componentProps () {
      const api = this.api?.props || {}
      const props = {}

      for (const key in api) {
        props[key] = api[key].sample || api[key].default || undefined
      }

      return props
    },

    filteredApi () {
      const api = {}

      for (const key in this.api) {
        const results = this.getSearchResults(this.api[key])

        api[key] = {
          results,
          length: Object.keys(results).length
        }
      }

      return api
    }
  },

  mounted () {
    this.loadFile()
  },

  methods: {
    loadFile () {
      this.isLoading = true

      const modules = {
        components: () => import(`asteroid-components/${this.file}.yml`),
        plugins: () => import(`asteroid-plugins/${this.file}.yml`)
      }

      modules[this.type]().then(api => {
        this.isLoading = false
        this.parseApiFile(api.default)
      })
    },

    parseApiFile (api) {
      const tabs = {
        props: 'Props',
        slots: 'Slots',
        events: 'Eventos',
        methods: 'Métodos',
        inject: 'Injeção',
        provide: 'Providers',
        selectors: 'Seletores (data-cy)'
      }

      for (const key in tabs) {
        if (api[key] && Object.keys(api[key]).length) {
          this.api[key] = api[key]
          this.tabs[key] = tabs[key]
        }
      }

      this.currentTab = Object.keys(this.tabs)[0]
    },

    getFormattedString (value) {
      return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },

    getSearchResults (apiData) {
      if (!this.search) return apiData

      const results = {}

      for (const key in apiData) {
        const data = apiData[key]

        if (this.getFormattedString(data.desc).includes(this.getFormattedString(this.search)) || key.includes(this.getFormattedString(this.search))) {
          results[key] = data
        }
      }

      return results
    },

    hasResults (value) {
      return !!Object.keys(value.results).length
    }
  }
}
</script>

<style lang="scss">
.doc-api {
  &__tabs {
    background: $grey-3;
    color: $grey-7;
  }

  &__tab-panels {
    max-height: 600px;
    overflow-y: auto;
  }

  &__component {
    position: relative;
  }
}
</style>
