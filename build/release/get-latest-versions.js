function getLatestVersions ({ execaSync, ora }) {
  const getNormalizedVersions = require('./get-normalized-versions')
  const getNearestVersion = require('./get-nearest-version')

  const latestVersionsSpinner = ora('Obtendo versões atualizadas no npm...').start()

  const appExtensionVersions = JSON.parse(execaSync('npm', [
    'show',
    '@bildvitta/quasar-app-extension-asteroid',
    'time',
    '--json'
  ]).stdout)

  const uiVersions = JSON.parse(execaSync('npm', [
    'show',
    '@bildvitta/quasar-ui-asteroid',
    'time',
    '--json'
  ]).stdout)

  const normalizedAppExtensionVersions = getNormalizedVersions(appExtensionVersions)
  const normalizedUiVersions = getNormalizedVersions(uiVersions)
  const today = new Date()

  const versions = {
    ui: {
      stable: getNearestVersion(normalizedUiVersions.stable, today),
      beta: getNearestVersion(normalizedUiVersions.beta, today),
      alpha: getNearestVersion(normalizedUiVersions.alpha, today),
      latest: getNearestVersion(normalizedUiVersions.all, today)
    },
    appExtension: {
      stable: getNearestVersion(normalizedAppExtensionVersions.stable, today),
      beta: getNearestVersion(normalizedAppExtensionVersions.beta, today),
      alpha: getNearestVersion(normalizedAppExtensionVersions.alpha, today),
      latest: getNearestVersion(normalizedAppExtensionVersions.all, today)
    }
  }

  latestVersionsSpinner.succeed('Versões do npm obtidas!')

  return versions
}

module.exports = getLatestVersions
