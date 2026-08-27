import { LocalStorage } from 'quasar'

// Nome único no localStorage. Todos os scopes ficam agrupados neste objeto.
const STORAGE_KEY = 'qasTV'

/**
 * Controla quantas vezes uma ação pode ocorrer dentro de um período de tempo.
 *
 * @param {{
 *  scope?: string,   // separa o contador por contexto (ex.: e-mail, telefone)
 *  limit?: number,   // máximo de ações dentro do período (0 ou menos desativa)
 *  windowMs?: number // duração do período. Ex.: limit 10 + windowMs 60000 = 10 a cada 1 min
 * }}
 */
export function createRateLimit ({ scope = 'default', limit = 0, windowMs = 60000 } = {}) {
  // Lê o objeto raiz com todos os scopes: { [scope]: { count, resetAt } }.
  function getStore () {
    return LocalStorage.getItem(STORAGE_KEY) || {}
  }

  // Retorna o contador do scope. Se já passou 1 minuto do primeiro clique, começa do zero.
  function getState () {
    const stored = getStore()[scope]

    // resetAt guarda quando o período de 1 minuto acaba; se já passou, reinicia zerado.
    if (!stored || stored.resetAt <= Date.now()) return { count: 0, resetAt: 0 }

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
   * Incrementa o contador. O período de 1 minuto começa no primeiro clique:
   * o resetAt é definido nesse momento e não muda nos cliques seguintes.
   */
  function incrementRateLimit () {
    if (limit <= 0) return

    const { count, resetAt } = getState()

    const nextCount = count + 1

    // Horário em que o contador vai resetar a partir do primeiro click.
    const nextResetAt = resetAt || Date.now() + windowMs

    LocalStorage.set(STORAGE_KEY, { ...getStore(), [scope]: { count: nextCount, resetAt: nextResetAt } })
  }

  return {
    getStatusRateLimit,
    incrementRateLimit
  }
}
