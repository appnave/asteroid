import { LocalStorage } from 'quasar'

// Prefixo do nome no localStorage
const STORAGE_PREFIX = 'qasTv:'

/**
 * Controla quantas vezes uma ação pode ocorrer dentro de uma janela de tempo.
 *
 * @param {{
 *  scope?: string,   // separa o contador por contexto (ex.: uma tabela/tela)
 *  limit?: number,   // máximo de ações dentro da janela (0 ou menos desativa)
 *  windowMs?: number // duração do cooldown. Ex.: limit 10 + windowMs 60000 = 10 a cada 1 min
 * }}
 */
export default function useRateLimit ({ scope = 'default', limit = 0, windowMs = 60000 } = {}) {
  const storageKey = `${STORAGE_PREFIX}${scope}`

  // Estado atual já tratando a expiração do cooldown (se acabou, volta zerado).
  function getState () {
    const stored = LocalStorage.getItem(storageKey)

    // Verifica se o contador atingiu o limite E o cooldown já passou (resetAt no passado).
    const cooldownEnded = stored?.count >= limit && stored.resetAt <= Date.now()

    if (!stored || cooldownEnded) return { count: 0, resetAt: 0 }

    return stored
  }

  /**
   * Situação atual do contador (só leitura, não incrementa):
   *  - { allowed: true }                      → pode revelar
   *  - { allowed: false, retryAfterSeconds }  → em cooldown (segundos até liberar)
   */
  function getStatusRateLimit () {
    if (limit <= 0) return { allowed: true }

    const { count, resetAt } = getState()

    if (count >= limit) {
      return { allowed: false, retryAfterSeconds: Math.ceil((resetAt - Date.now()) / 1000) }
    }

    return { allowed: true }
  }

  /**
   * Incrementa o contador. O cooldown começa quando o limite é atingido,
   * contado a partir do momento que o limite é atingido.
   */
  function incrementRateLimit () {
    if (limit <= 0) return

    const { count } = getState()

    const nextCount = count + 1
    const resetAt = nextCount >= limit ? Date.now() + windowMs : 0

    LocalStorage.set(storageKey, { count: nextCount, resetAt })
  }

  return {
    getStatusRateLimit,
    incrementRateLimit
  }
}
