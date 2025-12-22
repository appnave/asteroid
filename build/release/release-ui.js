function releaseUi ({ execaSync, ora, publishCommands, packages }) {
  const publishSpinner = ora('Publicando "ui"...').start()

  try {
    // reseta o cache do npm
    execaSync('npm', ['cache', 'clean', '--force'])
    execaSync('npm', ['install'], { cwd: packages.ui.resolved })

    execaSync('npm', publishCommands, { cwd: packages.ui.resolved })
    publishSpinner.succeed('"ui" publicada')

    return { success: true, error: false }
  } catch (error) {
    publishSpinner.fail(`Falha ao publicar "ui" - ${error.message}'`)
    return { success: false, error: true }
  }
}

module.exports = releaseUi
