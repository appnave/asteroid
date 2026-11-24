import open from 'open'

async function createGithubReleaseFromBrowser ({ changelogContent, nextVersion, ora }) {
  const tag = `v${nextVersion}`

  // query
  const body = encodeURIComponent(changelogContent)

  const browserSpinner = ora('Abrindo browser e redirecionando para github release...')

  try {
    await open(
      `https://github.com/bildvitta/asteroid/releases/new?tag=${tag}&title=${tag}&body=${body}`
    )

    browserSpinner.succeed('Redirecionado para github release.')
  } catch {
    browserSpinner.fail('Falha ao redirecionar para o github release.')
  }
}

export default createGithubReleaseFromBrowser
