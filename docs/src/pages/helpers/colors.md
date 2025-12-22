---
title: colors.js
---

Este helper contém funções para manipulação e conversão de cores, permitindo transformar valores em diferentes formatos (HEX, RGB, RGBA) em um objeto RGB, além de outras utilidades para trabalhar com cores.

## Funções

### convertRgbaToRgb

Converte uma cor no formato RGBA para RGB, mesclando-a com um fundo (default: branco).

```js
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
```

### convertHexToRgb

Converte uma cor hexadecimal em um objeto RGB.

```js
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
```

### getRgb

Extrai os valores RGB de uma string no formato RGB para um objeto.

```js
/**
 * Converte uma string rgb em um objeto com propriedades r, g e b.
 *
 * @param {string} color - A cor em formato rgb, por exemplo, "rgb(255, 0, 0)".
 *
 * @example
 * ```js
 * getRgb('rgb(255, 0, 0)') // { r: 255, g: 0, b: 0 }
 * ```
 */
```

### convertToRgb

Recebe uma cor (em formatos hex, rgba ou rgb) e retorna um objeto RGB.

```js
/**
 * Converte uma cor para o formato RGB.
 * Os formatos aceitos são:
 * - Hexadecimal (hex ou #hex)
 * - RGBA
 * - RGB
 *
 * @example
 *
 * ```js
 * convertToRgb('#ff0000') // { r: 255, g: 0, b: 0 }
 * convertToRgb('rgba(255, 0, 0, 0.5)') // { r: 255, g: 0, b: 0 }
 * convertToRgb('rgb(255, 0, 0)') // { r: 255, g: 0, b: 0 }
 * ```
 */
```

### isRgba, isHex e isRgb

Funções auxiliares que verificam se a cor está em um determinado formato.

```js
export function isRgba (color) {
  return color.startsWith('rgba')
}

export function isHex (color) {
  return color.startsWith('#')
}

export function isRgb (color) {
  return color.startsWith('rgb')
}
```

### getCssVar

Retorna o valor de uma variável CSS definida na raiz do documento.

```js
/**
 * Retorna o valor de uma variável CSS.
 *
 * @param {string} name - Nome da variável CSS (sem o prefixo).
 *
 * @example
 * ```js
 * getCssVar('background-color') // ex: "#ff0000"
 * ```
 */
```

## Exemplos de Uso

```js
import { convertToRgb, getCssVar } from 'path/para/colors'

// Converter cores para RGB
const rgbFromHex = convertToRgb('#ff0000') // { r: 255, g: 0, b: 0 }
const rgbFromRgba = convertToRgb('rgba(15,83,175,0.03)') // { r: 15, g: 83, b: 175 }
const rgbFromRgb = convertToRgb('rgb(255, 0, 0)')      // { r: 255, g: 0, b: 0 }

// Obter uma variável CSS
const backgroundColor = getCssVar('background-color')
```
