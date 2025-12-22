<template>
  <q-layout class="app" view="lHh LpR lff">
    <q-header bordered class="app-header text-dark">
      <q-toolbar>
        <q-btn dense flat icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <router-link class="app-header__title" to="/">
            <q-img src="../assets/logo/minimalist_logo.png" width="150px" />
          </router-link>
        </q-toolbar-title>

        <q-space />

        <div class="text-bold">v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerState" bordered show-if-above side="left" @hide="handleRestartDocSearch" @show="handleRestartDocSearch">
      <div class="app-search-bar">
        <div class="app-search-bar__input q-pt-sm">
          <div ref="docSearch" />
        </div>

        <q-separator />
      </div>

      <q-scroll-area class="app-scroll-area-left">
        <doc-menu class="q-mt-md" :items="menuItems" />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <pv-layout-overlay-drawer />
  </q-layout>
</template>

<script>
import PvLayoutOverlayDrawer from '@bildvitta/quasar-ui-asteroid/src/components/layout/private/PvLayoutOverlayDrawer.vue'

import { version } from 'asteroid'
import { createMetaMixin } from 'quasar'

import docsearch from '@docsearch/js'
import menuItems from 'assets/menu.js'

import '@docsearch/css'

export default {
  components: {
    PvLayoutOverlayDrawer
  },

  mixins: [createMetaMixin({
    title: 'Asteroid Docs',
    titleTemplate: title => `${title} | Asteroid Docs`
  })],

  data () {
    return {
      leftDrawerState: false,
      hasSearchButton: false
    }
  },

  computed: {
    menuItems () {
      return menuItems
    },

    version () {
      return version
    }
  },

  mounted () {
    this.leftDrawerState = this.$q.screen.width > 1023

    this.initializeDocSearch(this.$refs.docSearch)
    this.hasSearchButton = true
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerState = !this.leftDrawerState
    },

    handleRestartDocSearch () {
      const container = this.$refs.docSearch
      this.hasSearchButton = !!this.hasDocSearchButton(container)

      if (this.hasSearchButton) return

      this.initializeDocSearch(container)
    },

    initializeDocSearch (container) {
      docsearch({
        container,
        appId: '79KX7BGJMZ',
        // TODO adicionado fixo por enquanto não conseguimos adicionar a variável de ambiente na VirtualTimeScheduler.
        apiKey: 'c6033a408c0b489f1d57783513896367',
        indexName: 'asteroid'
      })
    },

    hasDocSearchButton (element) {
      return !!element.querySelector('.DocSearch-Button')
    }
  }
}
</script>

<style lang="scss">
:root {
  --docsearch-searchbox-background: $grey-4;
}

.app {
  &-header,
  &-search-bar {
    background-color: $grey-4;

    @supports (backdrop-filter: none) {
      backdrop-filter: blur(7px);
      background-color: rgba(black, 0.1);
    }

    &__title {
      text-decoration: none;

      &:visited {
        color: currentColor;
      }
    }
  }

  &-search-bar {
    position: absolute;
    top: 0;
    width: 100%;

    &__input,
    .q-field__control {
      height: 50px;
    }

    &__input {
      width: 90%;
    }

    &__input-element {
      line-height: 38px;
    }

    .q-field__prepend,
    .q-field__append {
      height: 100%;
    }
  }

  &-scroll-area-left {
    height: calc(100% - 51px);
    margin-top: 51px;
  }
}
</style>
