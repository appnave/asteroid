import { handleProcess } from 'asteroid'

import debug from 'debug'

export default async () => {
  const debuggingEnv = handleProcess(() => process.env.DEBUGGING, false)
  const debugEnv = handleProcess(() => process.env.DEBUG, '')

  debug.enable(debuggingEnv && !debugEnv ? 'asteroid-*:*' : debugEnv)
}
