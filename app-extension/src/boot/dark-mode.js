/**
 * Boot file que inicializa dark mode baseado na preferência salva.
 * Executa antes do app montar para evitar FOUT.
 *
 * Só é adicionado dinamicamente na aplicação caso a opção
 * "asteroidConfig.framework.featureToggle.useDarkMode" esteja ativada.
 */

import useDarkMode from '@bildvitta/quasar-ui-asteroid/src/composables/use-dark-mode.js'

export default () => {
  const { initialize } = useDarkMode()
  initialize()
}
