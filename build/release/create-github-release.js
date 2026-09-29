import { Octokit } from '@octokit/rest'

async function createGithubRelease ({ body, isBeta, version, ora, onSuccess = () => {} }) {
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN
  })

  const versionTag = `v${version}`

  const publishReleaseSpinner = ora('Publicando release no github...').start()

  try {
    await octokit.request('POST /repos/bildvitta/asteroid/releases', {
      owner: 'bildvitta',
      repo: 'asteroid',
      tag_name: versionTag,
      target_commitish: isBeta ? 'develop' : 'main',
      name: versionTag,
      body,
      draft: false,
      prerelease: isBeta,
      generate_release_notes: false
    })

    publishReleaseSpinner.succeed('Publicado release no github com sucesso!')

    return { success: true, error: false }
  } catch {
    publishReleaseSpinner.fail('Falha ao publicar release no github.')
    return { success: false, error: true }
  }
}

export default createGithubRelease
