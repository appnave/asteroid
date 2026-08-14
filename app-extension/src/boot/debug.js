import { handleProcess } from 'asteroid'

import debug from 'debug'

export default async () => {
  const debuggingEnv = handleProcess(() => import.meta.env.DEBUGGING, false)
  const debugEnv = handleProcess(() => import.meta.env.DEBUG, '')

  debug.enable(debuggingEnv && !debugEnv ? 'asteroid-*:*' : debugEnv)
}
