/* eslint-disable no-console */

require('colors') // https://github.com/Marak/colors.js
const { prompt } = require('enquirer') // https://github.com/enquirer/enquirer
const jetpack = require('fs-jetpack') // https://github.com/szwacz/fs-jetpack
const path = require('path') // https://nodejs.org/api/path.html
const semver = require('semver') // https://github.com/npm/node-semver

// Options
const packages = {
  global: {
    path: './',
    resolved: path.resolve('./')
  },

  'app-extension': {
    path: 'app-extension/',
    resolved: path.resolve('app-extension/')
  },

  docs: {
    path: 'docs/',
    resolved: path.resolve('docs/')
  },

  ui: {
    path: 'ui/',
    resolved: path.resolve('ui/')
  }
}

const packageCore = {
  author: 'Bild & Vitta <systemteam@bild.com.br>',
  license: 'MIT'
}

// Main
async function main () {
  const { execaSync } = await import('execa') // https://github.com/sindresorhus/execa
  const { default: ora } = await import('ora') // https://github.com/sindresorhus/ora

  const notifyDiscordChat = require('./release/notify-discord-chat')
  const createGithubRelease = require('./release/create-github-release')
  const getLatestVersions = require('./release/get-latest-versions')
  const changelogHandler = require('./release/changelog-handler')
  const releaseAppExtension = require('./release/release-app-extension')
  const releaseUi = require('./release/release-ui')
  const createGithubReleaseFromBrowser = require('./release/create-github-release-from-browser')
  const gitHandler = require('./release/git-handler')

  // Start!
  console.clear()

  console.log(
    '\n  ========================'.bold.dim.yellow +
    '\n  === ASTEROID BUILDER ==='.bold.yellow +
    '\n  ========================'.bold.dim.yellow +
    '\n'
  )

  const currentBranch = execaSync('git', ['branch', '--show-current']).stdout
  const acceptableBranch = ['main', 'develop', /^feature\/.+/]
  const isBeta = currentBranch === 'develop'
  const isAlpha = /^feature\/.+/.test(currentBranch)

  const isAcceptableBranch = acceptableBranch.some(branch => {
    return typeof branch === 'string' ? branch === currentBranch : branch.test(currentBranch)
  })

  if (!isAcceptableBranch) {
    ora('Só é possível publicar nas branchs "main", "develop" e "feature/*"').fail()
    return
  }

  const latestVersions = getLatestVersions({ execaSync, ora, isBeta })
  const model = isBeta ? 'beta' : isAlpha ? 'alpha' : 'stable'

  const currentVersion = require('../package.json').version

  const responses = await prompt({
    name: 'nextVersion',
    type: 'input',
    message: 'Qual será o número da próxima versão?',
    initial: currentVersion
  })

  const nextVersion = semver.clean(responses.nextVersion)

  for (const packageName in packages) {
    const packageData = packages[packageName]

    // Update package.json
    const packagePath = `${packageData.path}package.json`
    const resolvedPackagePath = path.resolve(packagePath)

    const packageSpinner = ora(`Alterando versão em "${packagePath}"...`).start()
    const currentPackage = jetpack.read(resolvedPackagePath, 'json')

    jetpack.write(resolvedPackagePath, {
      ...currentPackage,
      ...packageCore,

      version: nextVersion
    })

    packageSpinner.succeed(`Versão alterada em "${packagePath}".`)

    // Install dependencies
    const installSpinner = ora(`Instalando dependências em "${packageName}"...`).start()
    execaSync('npm', ['install'], { cwd: packageData.resolved })
    installSpinner.succeed(`Dependências instaladas em "${packageName}".`)
  }

  // TODO: "API" não usado por hora
  // const apiSpinner = ora('Gerando arquivos da "API"...').start()
  // execaSync('node', ['./api.js'], { cwd: __dirname })
  // apiSpinner.succeed('Arquivos da "API" gerados.')

  // TODO: "Vetur" não usado por hora
  // const veturSpinner = ora('Gerando arquivos para o "Vetur"...').start()
  // execaSync('node', ['./vetur.js'], { cwd: __dirname })
  // veturSpinner.succeed('Arquivos para o "Vetur" gerados.')

  // Lint
  const lintSpinner = ora('Lintando arquivos...').start()
  execaSync('npm', ['run', 'lint'], { cwd: packages.global.resolved })
  lintSpinner.succeed('Arquivos lintados.')

  // ----------------------- A partir daqui tudo é referente a publicação do asteroid -----------------------

  /*
  * Algumas informações importantes para utilização deste script:
  *
  * - A publicação só é possível dentro das branchs "main" e "develop", sendo "main" -> stable e "develop" -> beta
  * - Você precisa ter acesso de publicação dentro do NPM
  * - Você precisa ter acesso "write" nas branchs para conseguir dar push nas alterações
  * - Para ser gerado a release no github automaticamente você precisa ter setado em seu pc a variável "GITHUB_TOKEN"
  * caso não tenha, será aberta uma aba para a criação manual. Para saber mais sobre github token:
  * https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
  * - Para notificar o discord no canal "frontend" através do webhook você precisa ter setado em seu pc a variável "DISCORD_WEBHOOK_CHANGELOG"
  * - Para mencionar todos do canal "frontend" você precisa ter setado em seu pc a variável "DISCORD_ROLE_ID"
  * - Para conseguir as envs "DISCORD_WEBHOOK_CHANGELOG" e "DISCORD_ROLE_ID" falar com algum administrador do grupo
  */
  const {
    hasUnreleased,
    updateContent,
    getContent
  } = changelogHandler({
    ora,
    nextVersion,
    isBeta,
    packages,
    latestVersions
  })

  if (!isAlpha && !hasUnreleased) {
    ora(
      'Não foi possível encontrar o "## Não publicado" dentro do CHANGELOG.md por favor adicione para continuar'
    ).fail()

    return
  }

  const publishCommands = ['publish']

  if (isBeta) {
    publishCommands.push('--tag', 'beta')
  } else if (isAlpha) {
    publishCommands.push('--tag', 'alpha')
  }

  // Se a proxima versão for diferente da ultima versão publicada, então significa que podemos lançar uma nova versão do ui
  if (nextVersion !== latestVersions.ui[model]) {
    const { error: uiError } = releaseUi({
      execaSync,
      ora,
      nextVersion,
      publishCommands,
      packages
    })

    if (uiError) return
  }

  const { error: appExtensionError } = releaseAppExtension({
    execaSync,
    ora,
    nextVersion,
    publishCommands,
    packages
  })

  if (appExtensionError) return

  // atualiza o CHANGELOG.md
  if (!isAlpha) updateContent()

  // commita, faz o push, cria tag e faz push da tag
  gitHandler({
    ora,
    execaSync,
    nextVersion,
    packages
  })

  if (!isAlpha) {
    const changelogContent = getContent()

    let createdReleaseFromAPI = false

    if (process.env.GITHUB_TOKEN) {
      const { success } = await createGithubRelease({
        body: changelogContent,
        isBeta,
        ora,
        version: nextVersion
      })

      createdReleaseFromAPI = success
    } else {
      createGithubReleaseFromBrowser({
        changelogContent,
        nextVersion,
        ora
      })
    }

    if (process.env.DISCORD_WEBHOOK_CHANGELOG) {
      notifyDiscordChat({
        changelogContent,
        ora,
        nextVersion,
        isBeta,
        hasGithubRelease: !!process.env.GITHUB_TOKEN && createdReleaseFromAPI
      })
    }
  }
}

main()
