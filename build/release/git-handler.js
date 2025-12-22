function gitHandler ({ ora, execaSync, nextVersion, packages }) {
  // commita as alterações
  const commitSpinner = ora('Commitando alterações...').start()
  execaSync('git', ['add', '.'], { cwd: packages.global.resolved })
  execaSync('git', ['commit', '-m', `Releasing v${nextVersion}`], { cwd: packages.global.resolved })
  commitSpinner.succeed('Commit finalizado!')

  // gera a tag
  const tagSpinner = ora('Criando git tag...').start()
  execaSync('git', ['tag', `v${nextVersion}`], { cwd: packages.global.resolved })
  tagSpinner.succeed('Tag criada!')

  // envia tag para o github
  const pushTagSpinner = ora('Criando git tag...').start()
  execaSync('git', ['push', '--tag'], { cwd: packages.global.resolved })
  pushTagSpinner.succeed('Tag enviada para o github!')

  // envia as alterações para o github
  const pushSpinner = ora('Enviando push para o github...').start()
  const pushCommands = ['push']

  execaSync('git', pushCommands, { cwd: packages.global.resolved })
  pushSpinner.succeed('Push enviado!')
}

module.exports = gitHandler
