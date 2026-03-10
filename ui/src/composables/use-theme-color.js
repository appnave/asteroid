import { computed, unref } from 'vue'
import { Dark } from 'quasar'

import DarkColorMap from '../enums/DarkColorMap.js'

/**
 * Resolve a cor para o tema atual baseado no mapa de cores dark.
 *
 * @function
 * @param {import('vue').Ref<string>|string} color - Cor no formato Quasar (ex: 'grey-10')
 * @returns {import('vue').ComputedRef<string>} - Cor resolvida para o tema atual
 *
 * @example
 * const resolvedColor = useThemeColor('grey-10')
 * // retorna 'grey-10' no light, 'grey-2' no dark
 */
export default function useThemeColor (color) {
  return computed(() => {
    const colorValue = unref(color)

    if (!Dark.isActive) return colorValue

    return DarkColorMap[colorValue] || colorValue
  })
}
