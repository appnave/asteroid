import { Screen, Platform } from 'quasar'
import { computed, reactive } from 'vue'

/**
 * @function
 * @returns {{
 *  isSmall: boolean,
 *  isMedium: boolean,
 *  isLarge: boolean,
 *  isXLarge: boolean,
 *  is2XLarge: boolean,
 *  untilMedium: boolean,
 *  untilLarge: boolean,
 *  untilXLarge: boolean,
 *  until2XLarge: boolean,
 *  isMobile: boolean
 * }}
 *
 * @example
 * useScreen().isSmall
 *
 * const { isSmall } = useScreen()
 */
export default function () {
  const screens = reactive({
    // até 599px
    isSmall: computed(() => Screen.xs),

    // de 600 até 1023px
    isMedium: computed(() => Screen.sm),

    // Maior que 1023px
    isLarge: computed(() => Screen.gt.sm),

    // Maior que 1439px
    isXLarge: computed(() => Screen.gt.md),

    // Maior que 1919px
    is2XLarge: computed(() => Screen.gt.lg),

    // de 0 até 599px
    untilMedium: computed(() => Screen.lt.sm),

    // de 0 ate 1023px
    untilLarge: computed(() => Screen.lt.md),

    // de 0 até 1439px
    untilXLarge: computed(() => Screen.lt.lg),

    // de 0 até 1919px
    until2XLarge: computed(() => Screen.lt.xl),

    // Plataforma
    isMobile: computed(() => Platform.is.mobile || false)
  })

  return screens
}
