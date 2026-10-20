function releaseAppExtension ({ execaSync, ora, nextVersion, publishCommands, packages }) {
  const installNextUi = require('./install-next-ui')

  const { error } = installNextUi({ execaSync, ora, nextVersion, packages })

  if (error) return { success: false, error: true }

  const publishAppExtensionSpinner = ora('Publicando "app-extension"...')

  try {
    // publica a nova versão do "app-extension"
    // libera o terminal para o fluxo interativo de autenticação do npm (ex: OTP)
    execaSync('npm', publishCommands, { cwd: packages['app-extension'].resolved, stdio: 'inherit' })
    publishAppExtensionSpinner.succeed('"app-extension" publicada com sucesso')

    return { success: true, error: false }
  } catch (error) {
    publishAppExtensionSpinner.fail(`Falha ao publicar "app-extension" - ${error.message}`)
    return { success: false, error: true }
  }
}

module.exports = releaseAppExtension
