<template>
  <doc-page>
    <div class="column items-center q-gutter-y-lg q-mt-lg text-center text-grey-7">
      <q-img src="../assets/logo/dashboard_logo.png" width="300px" />
      <q-badge class="q-pa-xs" color="primary" :label="version" />
      <q-badge class="q-pa-xs" color="quasar" :label="quasarVersion" />
      <div>
        Asteroid é uma extensão do Quasar contendo coleções de componentes, plugins, estilos, utilitários, focado na produtividade.
      </div>
      <div class="q-gutter-sm">
        <q-btn color="primary" label="Começando" to="/start/usage" unelevated />
        <q-btn color="primary" label="Porque existe?" outline to="/why-asteroid" />
        <q-btn color="black" href="https://github.com/bildvitta/asteroid" label="github" target="blank" unelevated />
      </div>

      <div class="column q-gutter-y-sm">
        <div class="text-bold text-primary">
          Doação
        </div>
        <div>
          Se você aprecia o trabalho que encontrou neste projeto, considere doar para o
          <a href="https://quasar.dev" target="blank">Quasar Framework</a>.
        </div>
        <div class="text-bold text-primary">
          Licença
        </div>
        <div>
          <span class="non-selectable"> MIT (c) Bild & Vitta </span>
          <span class="text-primary"> systemteam@bild.com.br </span>
        </div>
      </div>
    </div>
  </doc-page>
</template>

<script>
import { version } from 'asteroid'
import packageInfo from '../../package.json'

export default {
  computed: {
    version () {
      return `Asteroid - v${version}`
    },

    quasarVersion () {
      const version = packageInfo.dependencies.quasar.replace('^', '')

      return `Quasar - v${version}`
    }
  }
}
</script>
