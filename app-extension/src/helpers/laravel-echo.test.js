import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const echoOptions = vi.hoisted(() => ({ value: null }))

vi.mock('asteroid', () => ({
  handleProcess: (envGetter, defaultValue) => {
    try {
      return envGetter() || defaultValue
    } catch {
      return defaultValue
    }
  }
}))

vi.mock('laravel-echo', () => ({
  default: class {
    constructor (options) {
      echoOptions.value = options
    }
  }
}))

vi.mock('./get-base-url.js', () => ({
  getBaseURL: () => 'https://api.nave.dev.br/api/'
}))

const { getConnectionOptions, isReverbEnabled, setLaravelEcho } = await import('./laravel-echo.js')

describe('laravel-echo', () => {
  beforeEach(() => {
    echoOptions.value = null
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('sem REVERB_APP_KEY (Ably)', () => {
    beforeEach(() => {
      vi.stubEnv('REVERB_APP_KEY', '')
      vi.stubEnv('ABLY_KEY', 'app.key')
    })

    it('não habilita o Reverb', () => {
      expect(isReverbEnabled()).toBe(false)
    })

    it('mantém a configuração do Ably', () => {
      expect(getConnectionOptions()).toEqual({
        broadcaster: 'pusher',
        key: 'app.key',
        wsHost: 'realtime-pusher.ably.io',
        wsPort: 443,
        encrypted: true,
        cluster: 'eu'
      })
    })
  })

  describe('com REVERB_APP_KEY (Reverb)', () => {
    beforeEach(() => {
      vi.stubEnv('REVERB_APP_KEY', 'hub-key')
      vi.stubEnv('ABLY_KEY', 'app.key')
    })

    it('habilita o Reverb', () => {
      expect(isReverbEnabled()).toBe(true)
    })

    it('conecta via TLS com host e porta do env (staging/produção)', () => {
      vi.stubEnv('REVERB_HOST', 'ws.nave.dev.br')
      vi.stubEnv('REVERB_PORT', '443')
      vi.stubEnv('REVERB_SCHEME', 'https')

      expect(getConnectionOptions()).toEqual({
        broadcaster: 'reverb',
        key: 'hub-key',
        wsHost: 'ws.nave.dev.br',
        wsPort: 443,
        wssPort: 443,
        forceTLS: true
      })
    })

    it('conecta sem TLS no Reverb local', () => {
      vi.stubEnv('REVERB_HOST', 'localhost')
      vi.stubEnv('REVERB_PORT', '8080')
      vi.stubEnv('REVERB_SCHEME', 'http')

      expect(getConnectionOptions()).toEqual({
        broadcaster: 'reverb',
        key: 'hub-key',
        wsHost: 'localhost',
        wsPort: 8080,
        wssPort: 8080,
        forceTLS: false
      })
    })

    it('cria o Echo com o endpoint de autenticação e o token', () => {
      vi.stubEnv('REVERB_HOST', 'ws.nave.dev.br')
      vi.stubEnv('REVERB_PORT', '443')
      vi.stubEnv('REVERB_SCHEME', 'https')

      setLaravelEcho('Bearer token')

      expect(echoOptions.value).toMatchObject({
        broadcaster: 'reverb',
        key: 'hub-key',
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: 'https://api.nave.dev.br/api/broadcasting/auth',
        auth: { headers: { Authorization: 'Bearer token' } }
      })
    })
  })
})
