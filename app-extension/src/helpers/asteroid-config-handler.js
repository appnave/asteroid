import fs from 'fs'
import ora from 'ora'

export default function (api) {
  const FILE_NAME = 'asteroid.config.js'

  return {
    async validate () {
      const hasAsteroidConfigFile = fs.existsSync(FILE_NAME)

      if (!hasAsteroidConfigFile) {
        ora('Você deve criar um arquivo asteroid.config.js na raiz do projeto').fail()

        throw new Error()
      }
    },

    getAsteroidConfigPath () {
      return api.resolve.app(FILE_NAME)
    }
  }
}
