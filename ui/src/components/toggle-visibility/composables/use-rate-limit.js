import { ref } from 'vue'

/**
 * Lista de horários das ações, um por "group".
 * É module-level de propósito: o limite precisa valer para a página/tabela inteira,
 * compartilhado entre todas as instâncias de QasToggleVisibility, e não por célula.
 *
 * Formato: { [group]: number[] } — cada number é um Date.now() de quando a ação ocorreu.
 */
const timestampsByGroup = ref({})

/**
 * Rate limit de ações (ex.: "10 por minuto").
 *
 * @param {{
 *  group?: string,   // identificador do item; instâncias com o mesmo group compartilham o limite (ex.: uma tabela)
 *  limit?: number,   // máximo de ações permitidas dentro da janela (0 ou menos desativa)
 *  windowMs?: number // duração da janela de tempo. Ex.: limit 10 + windowMs 60000 = 10/min
 * }}
 */
export default function useRateLimit ({ group = 'default', limit = 0, windowMs = 60000 } = {}) {
  timestampsByGroup.value[group] = timestampsByGroup.value[group] || []

  // Retorna (e limpa) apenas os horários dentro da janela de tempo atual.
  function activeTimestamps () {
    const threshold = Date.now() - windowMs

    timestampsByGroup.value[group] = timestampsByGroup.value[group].filter(timestamp => timestamp > threshold)

    return timestampsByGroup.value[group]
  }

  // Ainda há cota para revelar dentro da janela? Com limit <= 0 o controle fica desligado.
  function canReveal () {
    return limit <= 0 || activeTimestamps().length < limit
  }

  // Registra uma revelação (não deve ser chamado ao esconder).
  function registerReveal () {
    if (limit <= 0) return

    activeTimestamps().push(Date.now())
  }

  // Quanto falta (ms) para liberar a próxima revelação quando o limite foi atingido.
  function remainingCooldown () {
    if (limit <= 0) return 0

    const active = activeTimestamps()

    if (active.length < limit) return 0

    // libera quando o registro mais antigo sair da janela
    return Math.max(0, windowMs - (Date.now() - Math.min(...active)))
  }

  return {
    canReveal,
    registerReveal,
    remainingCooldown
  }
}
