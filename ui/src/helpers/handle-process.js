/**
 * @param {function} envGetter função que retorna o valor da env.
 * @param {string} defaultValue valor default caso a env não exista
 *
 * @example handleProcess(() => import.meta.env.MY_ENV, 'meu-valor-default')
 */
export default (envGetter = () => {}, defaultValue) => {
  try {
    return envGetter() || defaultValue
  } catch {
    return defaultValue
  }
}
