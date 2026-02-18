import handleProcess from '@bildvitta/quasar-ui-asteroid/src/helpers/handle-process.js'

import debug from 'debug'

export default async () => {
  const debuggingEnv = handleProcess(() => process.env.DEBUGGING, false)
  const debugEnv = handleProcess(() => process.env.DEBUG, '')

  debug.enable(debuggingEnv && !debugEnv ? 'asteroid-*:*' : debugEnv)
}
