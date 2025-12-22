import { uid } from 'quasar'
import { convertToRgb } from './colors'

/**
 * @typedef {'start'|'end'} Direction
 */

/**
 * Helper para adicionar um gradiente de scroll em um elemento.
 *
 * @param {object} config
 * @param {object} config.styles
 * @param {string} config.styles.color - precisa ser uma cor RGB|HEX|RGBA
 * @param {string} config.styles.size - tamanho do gradient (mudar somente quando for necessário)
 * @param {'y'|'x'} config.orientation - direção do scroll (vertical ou horizontal)
 */
export default function setScrollGradient (config = {}) {
  const { styles, orientation = 'y' } = config
  const { color = '#FFFFFF', size = '40px' } = styles || {}

  const { r, g, b } = convertToRgb(color) || {}
  const rgbParam = `${r}, ${g}, ${b}`

  const isVertical = orientation === 'y'

  let uuid = ''
  let resizeObserver = null

  // functions
  /**
   * Toda vez que "initializeScrollGradient" for chamado, remove o gradient anterior
   * e cria um novo.
   *
   * @param {HTMLElement} element
   */
  function initializeScrollGradient (element) {
    // remove o gradient anterior caso exista
    removeScrollGradient(element)

    uuid = uid()

    // cria os spans de gradiente
    createSpan({ direction: 'start', element })
    createSpan({ direction: 'end', element })

    // verifica se o elemento tem scroll no final
    if (hasEndScroll(element)) toggleSpan('end', true)

    // adiciona o listener de scroll
    element.addEventListener('scroll', () => toggleSpanByScrollPosition(element))
    setResizeObserver(element)
  }

  /**
   * Remove:
   * - event listener
   * - resize observer
   * - spans
   * - uuid
   *
   * @parm {HTMLElement} element
   */
  function removeScrollGradient (element) {
    if (!uuid) return

    element.removeEventListener('scroll', () => toggleSpanByScrollPosition(element))
    resizeObserver?.unobserve(element)

    // remove scroll gradient spans
    const scrollSpanTop = getSpan('start')
    const scrollSpanBottom = getSpan('end')

    if (scrollSpanTop) scrollSpanTop.remove()
    if (scrollSpanBottom) scrollSpanBottom.remove()

    uuid = ''
  }

  /**
   * mostra ou esconde o span do gradient.
   *
   * @param {Direction} direction
   * @param {boolean} show
   */
  function toggleSpan (direction, show) {
    const span = getSpan(direction)

    if (!span) return

    span.style.display = show ? 'block' : 'none'
  }

  /**
   * @param {Direction} direction
   */
  function getSpan (direction) {
    return document.getElementById(`scroll-gradient-${direction}-${uuid}`)
  }

  /**
   * cria o span do gradient.
   *
   * @param {{
   *  direction: Direction,
   *  element: HTMLElement
   * }}
   */
  function createSpan ({ direction, element }) {
    const span = document.createElement('span')

    // styles
    Object.assign(span.style, {
      pointerEvents: 'none',
      height: isVertical ? size : '100%',
      display: 'none',
      position: 'absolute',
      width: isVertical ? '100%' : size,
      zIndex: 1,
      backgroundImage: (
        `linear-gradient(
          to ${getDirection(direction)},
          rgba(${rgbParam}, 0) 0%,
          rgba(${rgbParam}, 0.9) 51%,
          rgb(${rgbParam}) 75%)`
      )
    })

    // atributos
    span.setAttribute('id', `scroll-gradient-${direction}-${uuid}`)
    span.setAttribute('role', 'presentation') // remove semântica
    span.setAttribute('tabindex', '-1') // remove do foco
    span.setAttribute('aria-hidden', 'true') // remove do leitor de tela

    // adiciona span como irmão do elemento acima (top) ou abaixo dele (bottom)
    element.parentNode.insertBefore(span, direction === 'start' ? element.previousSibling : element.nextSibling)

    // seta posição após inserir o elemento no DOM
    setSpanPosition({ direction, element })
  }

  /**
   * seta a posição do span de acordo com a posição do elemento.
   *
   * @param {{
   *  direction: 'start'|'end',
   *  element: HTMLElement
   * }}
   */
  function setSpanPosition ({ direction, element }) {
    const span = getSpan(direction)

    if (!span) return

    const elementRect = element.getBoundingClientRect()
    const parentRect = element.parentElement.getBoundingClientRect()

    /**
     * diferença entre o bottom do pai e o bottom do filho, valor positivo significa
     * que há espaço livre abaixo do filho.
     */
    const distance = {
      end: isVertical ? (parentRect.bottom - elementRect.bottom) : (parentRect.right - elementRect.right),
      start: isVertical ? (elementRect.top - parentRect.top) : (elementRect.left - parentRect.left)
    }

    span.style[getDirection(direction)] = `${distance[direction]}px`
  }

  /**
   * controla se o gradient deve ser mostrado ou não de acordo com a posição do scroll.
   *
   * @param {HTMLElement} element
   */
  function toggleSpanByScrollPosition (element) {
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth
    } = element

    // Pequena tolerância para lidar com problemas de precisão de ponto flutuante
    const tolerance = 2

    const isScrollAtStart = isVertical ? scrollTop === 0 : scrollLeft === 0
    const isScrollAtEnd = isVertical
      ? scrollTop + clientHeight >= scrollHeight - tolerance
      : scrollLeft + clientWidth >= scrollWidth - tolerance

    toggleSpan('start', !isScrollAtStart)
    toggleSpan('end', !isScrollAtEnd)
  }

  function setResizeObserver (element) {
    let previousSize = isVertical ? element.offsetHeight : element.offsetWidth

    resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        // obtém o elemento que foi redimensionado
        const entryElement = entry.target

        // obtém o novo tamanho
        const currentSize = isVertical ? entryElement.offsetHeight : entryElement.offsetWidth

        // verifica se o elemento tem scroll no final
        if (!hasEndScroll(entryElement)) {
          toggleSpan('end', false)

          return
        }

        // verifica se a altura ou width realmente mudou
        if (previousSize !== currentSize) {
          // atualiza posição do gradient
          setSpanPosition({ direction: 'start', element })
          setSpanPosition({ direction: 'end', element })

          // controla se deve ou não mostrar o gradient
          toggleSpanByScrollPosition(element)

          previousSize = currentSize
        }
      })
    })

    resizeObserver.observe(element)
  }

  /**
   * verifica se o elemento final (bottom|right) tem scroll.
   *
   * @param {HTMLElement} element
   */
  function hasEndScroll (element) {
    return isVertical
      ? element.scrollHeight > element.clientHeight
      : element.scrollWidth > element.clientWidth
  }

  /**
   * retorna a direção do gradient de acordo com a orientação do elemento.
   * - se a orientação for vertical, a direção será "top" ou "bottom".
   * - se a orientação for horizontal, a direção será "left" ou "right".
   *
   * @param {Direction} direction
   */
  function getDirection (direction) {
    return isVertical
      ? (direction === 'start' ? 'top' : 'bottom')
      : (direction === 'start' ? 'left' : 'right')
  }

  return {
    initializeScrollGradient,
    removeScrollGradient,
    uuid,
    resizeObserver
  }
}
