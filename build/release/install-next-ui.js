const UI_PACKAGE_NAME = '@bildvitta/quasar-ui-asteroid'
const WAIT_INTERVAL = 15 * 1000 // 15 segundos
const WAIT_TIMEOUT = 30 * 60 * 1000 // 30 minutos

function sleep (ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function isVersionAvailable ({ execaSync, nextVersion }) {
  try {
    const { stdout } = execaSync('npm', ['view', `${UI_PACKAGE_NAME}@${nextVersion}`, 'version'])
    return stdout.trim() === nextVersion
  } catch {
    return false
  }
}

/*
* Após o publish, o npm pode levar alguns minutos para processar o pacote
* e deixá-lo disponível no registry, então aguarda a versão do "ui" ficar
* disponível antes de tentar instalar no "app-extension".
*/
function waitForUiVersion ({ execaSync, ora, nextVersion }) {
  const waitSpinner = ora(`Aguardando "${UI_PACKAGE_NAME}@${nextVersion}" ficar disponível no npm...`).start()
  const startTime = Date.now()

  while (Date.now() - startTime < WAIT_TIMEOUT) {
    if (isVersionAvailable({ execaSync, nextVersion })) {
      waitSpinner.succeed(`"${UI_PACKAGE_NAME}@${nextVersion}" disponível no npm`)
      return true
    }

    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000)
    waitSpinner.text = `Aguardando "${UI_PACKAGE_NAME}@${nextVersion}" ficar disponível no npm... (${elapsedSeconds}s)`

    // o loop é síncrono e bloqueia a animação do spinner, então força a renderização do texto
    waitSpinner.render()

    sleep(WAIT_INTERVAL)
  }

  waitSpinner.fail(`"${UI_PACKAGE_NAME}@${nextVersion}" não ficou disponível no npm após ${WAIT_TIMEOUT / 60000} minutos`)
  return false
}

function installNextUi ({ execaSync, ora, nextVersion, packages, retry = false }) {
  const jetpack = require('fs-jetpack') // https://github.com/szwacz/fs-jetpack
  const getAppExtensionPackage = require('./get-app-extension-package')

  if (!retry && !waitForUiVersion({ execaSync, ora, nextVersion })) {
    return { success: false, error: true }
  }

  const installSpinner = ora('Instalando "ui" no "app-extension"...').start()

  try {
    // recupera o package.json do app-extension
    const { packageData, resolvedPackagePath } = getAppExtensionPackage(packages)

    // atualiza o package.json do app-extension com a nova versão do "ui"
    const nextDependencies = packageData.dependencies
    nextDependencies[UI_PACKAGE_NAME] = nextVersion

    jetpack.write(resolvedPackagePath, {
      ...packageData,

      dependencies: nextDependencies
    })

    // instala a nova versão do "ui"
    execaSync('npm', ['install'], { cwd: packages['app-extension'].resolved })
    installSpinner.succeed('Instalado "ui" no "app-extension"')

    return { success: true, error: false }
  } catch (error) {
    if (retry) {
      installSpinner.fail('Falha ao instalar "ui" no "app-extension')
      return { success: false, error: true }
    }

    /*
    * Se der erro ao instalar ele tenta novamente mas desta vez removendo
    * o package-lock e node_modules antes
    */
    execaSync('rm', ['-rf', 'node_modules'], { cwd: packages['app-extension'].resolved })
    execaSync('rm', ['-rf', 'package-lock.json'], { cwd: packages['app-extension'].resolved })

    return installNextUi({ execaSync, ora, nextVersion, packages, retry: true })
  }
}

module.exports = installNextUi
