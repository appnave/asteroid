function releaseAppExtension ({ execaSync, ora, nextVersion, publishCommands, packages }) {
  const installNextUi = require('./install-next-ui')

  const { error } = installNextUi({ execaSync, ora, nextVersion, packages })

  if (error) return { success: false, error: true }

  const publishAppExtensionSpinner = ora('Publicando "app-extension"...')

  try {
    // reseta o cache do npm
    execaSync('npm', ['cache', 'clean', '--force'])

    // publica a nova versão do "app-extension"
    execaSync('npm', publishCommands, { cwd: packages['app-extension'].resolved })
    publishAppExtensionSpinner.succeed('"app-extension" publicada com sucesso')

    return { success: true, error: false }
  } catch (error) {
    publishAppExtensionSpinner.fail(`Falha ao publicar "app-extension" - ${error.message}`)
    return { success: false, error: true }
  }
}

module.exports = releaseAppExtension
