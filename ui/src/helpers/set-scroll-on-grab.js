/**
* Helper de scroll em uma determinada área (elemento) ao realizar evento de grab (puxar/agarrar) com o mouse/touch.
*
* @param {HTMLElement} element
* @param {{
*  onGrabFn: function({ element: HTMLElement, isGrabbing: boolean }),
*  onMoveFn: function({ element: HTMLElement, event: MouseEvent | TouchEvent }),
*  onScrollFn: function({ element: HTMLElement, event: Event })
* }} options
* @param {String} cancelMouseDownTarget
*
* @returns {{ element: HTMLElement, destroyEvents: function }}
*/
export default function (element, options = {}, cancelMouseDownTarget) {
  let isDown = false
  let startX
  let scrollLeft
  let isGrabbing = false

  onGrab()

  const events = {
    mousedown: onMouseEnter,
    mouseleave: onMouseLeave,
    mousemove: onMouseMove,
    mouseup: onMouseLeave,
    scroll: onScroll,
    touchend: onLeave,
    touchmove: onTouchMove,
    touchstart: onEnter
  }

  addEvents()

  function addEvents () {
    Object.entries(events).forEach(([event, fn]) => element.addEventListener(event, fn))
  }

  function destroyEvents () {
    Object.entries(events).forEach(([event, fn]) => element.removeEventListener(event, fn))
  }

  function onEnter () {
    isDown = true

    element.classList.add('active')
  }

  function onMouseEnter (event) {
    /**
     * closest busca ancestral mais próximo de um elemento, ou seja, verifica se no event que recebo, tenho a classe no qual nao se deve aplicar o grab.
    */

    const elementListToCancel = ['button', '[data-no-grab]']

    if (cancelMouseDownTarget) {
      elementListToCancel.push(`.${cancelMouseDownTarget}`)
    }

    const canCancelMouseDownTarget = elementListToCancel.some(tag => event.target.closest(tag))

    if (canCancelMouseDownTarget) return

    onEnter()

    startX = event.pageX - element.offsetLeft
    scrollLeft = element.scrollLeft
  }

  function onLeave () {
    isDown = false
    isGrabbing = false

    element.classList.remove('active')

    onGrab()
  }

  function onMouseLeave () {
    onLeave()
    blockEvents()
  }

  function onMouseMove (event) {
    if (event) event.preventDefault()

    if (!isDown) return

    isGrabbing = true

    onGrab()
    blockEvents()

    const x = event.pageX - element.offsetLeft
    const walk = (x - startX) * 3 // scroll-fast

    element.scrollLeft = scrollLeft - walk

    options.onMoveFn?.({ element, event })
  }

  function onTouchMove (event) {
    event = event.touches[0]

    if (!isDown) return

    isGrabbing = true

    onGrab()

    options.onMoveFn?.({ element, event })
  }

  function onScroll (event) {
    options.onScrollFn?.({ element, event })
  }

  function onGrab () {
    element.style.cursor = isGrabbing ? 'grabbing' : 'grab'

    options.onGrabFn?.({ element, isGrabbing })
  }

  function blockEvents () {
    Array.from(element.children).forEach(child => {
      child.classList.toggle('no-pointer-events', isGrabbing)
      child.classList.toggle('non-selectable', isGrabbing)
    })
  }

  return {
    element,
    destroyEvents
  }
}
