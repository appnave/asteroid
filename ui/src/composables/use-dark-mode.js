import { computed } from 'vue'
import { Dark, LocalStorage } from 'quasar'

const STORAGE_KEY = 'qas-theme-preference'
const VALID_THEMES = ['light', 'dark']

/**
 * Composable para gerenciamento do dark mode no Asteroid.
 *
 * @function
 * @returns {{
 *  isDark: import('vue').Ref<boolean>,
 *  toggle: Function,
 *  setTheme: Function,
 *  initialize: Function,
 *  getStoredTheme: Function
 * }}
 *
 * @example
 * const { isDark, toggle, setTheme } = useDarkMode()
 */
export default function useDarkMode () {
  const isDark = computed(() => Dark.isActive)

  function getStoredTheme () {
    try {
      const stored = LocalStorage.getItem(STORAGE_KEY)

      if (stored && typeof stored === 'object' && VALID_THEMES.includes(stored.theme)) {
        return stored.theme
      }
    } catch {
      // localStorage indisponível — fallback silencioso
    }

    return 'light'
  }

  function persistTheme (theme) {
    try {
      LocalStorage.set(STORAGE_KEY, {
        theme,
        updatedAt: new Date().toISOString()
      })
    } catch {
      // localStorage indisponível — ignora silenciosamente
    }
  }

  function setTheme (theme) {
    if (!VALID_THEMES.includes(theme)) return

    const isDarkTheme = theme === 'dark'

    Dark.set(isDarkTheme)
    persistTheme(theme)
  }

  function toggle () {
    const newTheme = Dark.isActive ? 'light' : 'dark'
    setTheme(newTheme)
  }

  function initialize () {
    const theme = getStoredTheme()
    Dark.set(theme === 'dark')
  }

  return {
    isDark,
    toggle,
    setTheme,
    initialize,
    getStoredTheme
  }
}
