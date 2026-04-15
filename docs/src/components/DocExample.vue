<template>
  <q-card bordered class="q-my-lg" flat>
    <q-toolbar>
      <doc-card-title :title="title" />

      <q-space />

      <div v-if="isLoaded" class="col-auto">
        <q-btn color="grey-7" dense flat :icon="brandIcons.github" round size="12px" @click="openRepository">
          <q-tooltip>Ver no GitHub</q-tooltip>
        </q-btn>

        <q-btn :color="sourceButtonColor" dense flat icon="code" round @click="toggleSource">
          <q-tooltip>Ver código</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>

    <q-separator />

    <q-slide-transition>
      <div v-show="showSource">
        <q-tabs v-model="currentTab" align="left" :breakpoint="0" class="doc-example__tabs" dense indicator-color="brand-primary" no-caps>
          <q-tab v-for="(source, tag) in sources" :key="`tab-${tag}`" :label="tag" :name="tag" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="currentTab" animated>
          <q-tab-panel v-for="(source, tag) in sources" :key="`panel-${tag}`" class="q-pa-none" :name="tag">
            <doc-code class="doc-example__code" :code="source" />
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />
      </div>
    </q-slide-transition>

    <div>
      <q-linear-progress v-if="isLoading" color="brand-primary" indeterminate />
      <div v-else class="doc-example__component">
        <component :is="component" />
      </div>
    </div>
  </q-card>
</template>

<script>
import { markRaw } from 'vue'
import { openURL } from 'quasar'
import { fabGithub } from '@quasar/extras/fontawesome-v5'

const exampleModules = import.meta.glob('../examples/**/*.vue')
const exampleRawModules = import.meta.glob('../examples/**/*.vue', { query: '?raw', import: 'default' })

export default {
  props: {
    file: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      component: null,
      currentTab: '',
      isLoading: false,
      showSource: false,
      sources: {}
    }
  },

  computed: {
    brandIcons () {
      return {
        github: fabGithub
      }
    },

    isLoaded () {
      return !this.isLoading
    },

    sourceButtonColor () {
      return this.showSource ? 'brand-primary' : 'grey-7'
    }
  },

  mounted () {
    this.loadFile()
  },

  methods: {
    extractTag (tag, template) {
      const regex = new RegExp(`(<${tag}(.*)?>[\\w\\W]*<\\/${tag}>)`, 'g')
      const match = regex.exec(template)

      return match ? match[1] : ''
    },

    loadFile () {
      this.isLoading = true

      const modulePath = `../examples/${this.file}.vue`
      const loadComponent = exampleModules[modulePath]
      const loadRaw = exampleRawModules[modulePath]

      if (!loadComponent) {
        console.warn(`[DocExample] File not found: ${this.file}.vue`)
        this.isLoading = false
        return
      }

      Promise.all([
        loadComponent().then(component => {
          this.component = markRaw(component.default)
        }),

        loadRaw().then(source => {
          this.parseSource(source)
        })
      ]).then(() => {
        this.isLoading = false
      })
    },

    openRepository () {
      openURL(`https://github.com/bildvitta/asteroid/tree/main/docs/src/examples/${this.file}.vue`)
    },

    parseSource (source) {
      const tabs = {
        Template: 'template',
        Script: 'script',
        Style: 'style'
      }

      for (const tab in tabs) {
        const extracted = this.extractTag(tabs[tab], source)

        if (extracted) {
          this.sources[tab] = extracted
        }
      }

      const sourceKeys = Object.keys(this.sources)

      if (sourceKeys.length > 1) {
        this.sources.Vue = source
      }

      this.currentTab = sourceKeys[0]
    },

    toggleSource () {
      this.showSource = !this.showSource
    }
  }
}
</script>

<style lang="scss">
.doc-example {
  &__tabs {
    background: $grey-3;
    color: $grey-7;
  }

  &__code {
    border-radius: 0;
    margin-bottom: 0;
  }

  &__component {
    position: relative;
  }
}
</style>
