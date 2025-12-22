/**
 * Converte uma cor RGBA para RGB, mesclando com um fundo.
 *
 * @param {string} rgba - Cor em formato rgba, por exemplo, "rgba(15, 83, 175, 0.03)".
 * @param {object} background - Objeto com as propriedades r, g e b para a cor de fundo (default: branco).
 *
 * @example
 * ```js
 * convertRgbaToRgb('rgba(15, 83, 175, 0.03)') // { r: 15, g: 83, b: 175 }
 * ```
 */
export function convertRgbaToRgb (rgba, background = { r: 255, g: 255, b: 255 }) {
  // Extrai os valores com uma expressão regular
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)

  if (!match) return background

  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)
  const a = parseFloat(match[4])

  return {
    r: Math.round(r * a + background.r * (1 - a)),
    g: Math.round(g * a + background.g * (1 - a)),
    b: Math.round(b * a + background.b * (1 - a))
  }
}

/**
 * Função que converte uma cor hexadecimal para um objeto RGB.
 *
 * @param {string} hex - A cor em formato hexadecimal, por exemplo, "#ff0000" ou "ff0000".
 *
 * @example
 * ```js
 * convertHexToRgb('#ff0000') // { r: 255, g: 0, b: 0 }
 * convertHexToRgb('ff0000') // { r: 255, g: 0, b: 0 }
 * ```
 */
export function convertHexToRgb (hex) {
  // Remove o '#' se existir
  let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex

  // Se for o formato curto, expande para 6 dígitos
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(item => item + item).join('')
  }

  // Converte o hexadecimal para inteiro
  const bigint = parseInt(cleanHex, 16)

  // Extrai os valores de r, g, b
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

/**
 * converte um rgb em string para objeto rgb
 *
 * @param {string} color - A cor em formato rgb, por exemplo, "rgb(255, 0, 0)".
 *
 * @example
 * ```js
 * getRgb('rgb(255, 0, 0)') // { r: 255, g: 0, b: 0 }
 * ```
 */
function getRgb (color) {
  // Extrai os valores com uma expressão regular
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)

  if (!match) return {}

  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)

  return { r, g, b }
}

/**
 * função que recebe uma cor como parâmetro string, e retorna sempre um rgb,
 * os possíveis formatos de entrada são:
 * - rgb
 * - rgba
 * - hex
 *
 * @example
 *
 * ```js
 * convertToRgb('#ff0000') // { r: 255, g: 0, b: 0 }
 * convertToRgb('rgba(255, 0, 0, 0.5)') // { r: 255, g: 0, b: 0 }
 * convertToRgb('rgb(255, 0, 0)') // { r: 255, g: 0, b: 0 }
 * ```
 *
 */
export function convertToRgb (color) {
  if (!color) return {}

  // Verifica se a cor está no formato hex
  if (isHex(color)) return convertHexToRgb(color)

  // Verifica se a cor está no formato rgba
  if (isRgba(color)) return convertRgbaToRgb(color)

  // Se não for nenhum dos formatos conhecidos, retorna a cor original
  return getRgb(color)
}

export function isRgba (color) {
  return color.startsWith('rgba')
}

export function isHex (color) {
  return color.startsWith('#')
}

export function isRgb (color) {
  return color.startsWith('rgb') && !isRgba(color)
}

/**
 * função para retornar css vars do asteroid
 *
 * @param {string} name - nome da variável css
 *
 * @example
 * ```js
 * getCssVar('background-color') // #ff0000
 * ```
 */
export function getCssVar (name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--qas-${name}`)
}
