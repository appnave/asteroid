<template>
  <q-date
    v-bind="attributes"
    ref="parentDate"
    v-model="model"
  />
</template>

<script setup>
import { date as asteroidDate } from '../../helpers/filters'
import { MaskOptions } from './enums/DateMaskOptions'

import { date } from 'quasar'
import { ref, computed, onMounted, onUnmounted, watch, useAttrs, nextTick } from 'vue'

defineOptions({
  name: 'QasDate',
  inheritAttrs: false
})

const props = defineProps({
  events: {
    type: [Array, Function],
    default: () => []
  },

  eventColor: {
    type: [String, Function],
    default: ''
  },

  mask: {
    type: String,
    default: MaskOptions.Dash,
    validator: value => Object.values(MaskOptions).includes(value)
  },

  modelValue: {
    type: [String, Array],
    default: ''
  },

  multiple: {
    type: Boolean
  },

  options: {
    type: [Array, Function],
    default: undefined
  },

  useIso: {
    type: Boolean
  },

  useInactiveDates: {
    default: true,
    type: Boolean
  },

  useUnmaskOptions: {
    default: true,
    type: Boolean
  },

  width: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'navigation'])

const attrs = useAttrs()

// template refs
const parentDate = ref(null)
const dateElement = ref(null)

const currentDate = ref({})
const dateObserver = ref(undefined)

onMounted(() => {
  dateElement.value = parentDate.value?.$el

  // muda estilo da navegação
  setNewNavigatorDisplay()

  // observa as mudanças no DOM do QDate > .q-date__content
  setObserveDate()

  // seta data atual de acordo com a view do mês atual
  setCurrentDate()

  // seta os eventos, ativos e inativos
  setEvents(currentDate.value)
})

onUnmounted(() => dateObserver.value.disconnect())

const classes = computed(() => {
  return ['qas-date', 'shadow-2', { 'qas-date--inative': props.useInactiveDates }]
})

const styles = computed(() => (props.width && { width: props.width }))

const normalizedOptions = computed(() => {
  return props.useUnmaskOptions ? getUnmaskedList(props.options) : props.options
})

const attributes = computed(() => {
  const {
    color,
    minimal,
    textColor,
    ...restAttrs
  } = attrs

  return {
    class: classes.value,
    color: 'primary',
    mask: props.mask,
    minimal: true,
    multiple: props.multiple,
    options: normalizedOptions.value,
    style: styles.value,
    textColor: 'white',

    // events
    onNavigation,

    ...restAttrs
  }
})

const model = computed({
  get () {
    return props.modelValue
  },

  set (value) {
    emit('update:modelValue', props.useIso ? getISODate(value) : value)
  }
})

const hasModelValue = computed(() => props.multiple ? !!props.modelValue.length : !!props.modelValue)

const isEventColorCallback = computed(() => typeof props.eventColor === 'function')
const isEventsCallback = computed(() => typeof props.events === 'function')

watch(() => props.events, () => setEvents(currentDate.value))

// functions
function createActiveEventElement (dayElement, eventElement) {
  const buttonElement = dayElement.querySelector('.q-btn__content')

  buttonElement?.appendChild?.(eventElement)
}

function createCounterInactiveEventElement (dayElement, eventElement) {
  const spanElement = document.createElement('span')
  const [child] = dayElement.children

  spanElement.setAttribute('data-event', true)
  dayElement.setAttribute('data-has-inactive-event', true)

  spanElement.classList.add('flex', 'items-center', 'justify-center', 'text-center')

  child.setAttribute('data-day-content', child.textContent)

  spanElement.appendChild(child)
  spanElement.appendChild(eventElement)
  dayElement.appendChild(spanElement)
}

function createPointerEventElement (isInactive, currentColor, eventElement) {
  const eventPointerElement = document.createElement('div')

  eventPointerElement.classList.add(
    'qas-date__event-pointer',
    `bg-${isInactive ? 'grey-4' : currentColor || 'primary'}`
  )

  eventElement.appendChild(eventPointerElement)
}

function getCurrentColor (date, color) {
  return (isEventColorCallback.value ? props.eventColor(date) : props.eventColor) || color
}

function getUnmaskedList (list) {
  const invalidTypes = ['function', 'undefined']

  return invalidTypes.includes(typeof list)
    ? list
    : list.map(item => asteroidDate(item, 'yyyy/MM/dd'))
}

function getDate (date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}

function getISODate (value) {
  if (!value || (props.multiple && !value.length)) return value

  return props.multiple
    ? value.map(dateItem => date.extractDate(dateItem, props.mask).toISOString())
    : date.extractDate(value, props.mask).toISOString()
}

function getCurrentDate () {
  const modelDate = props.multiple ? props.modelValue[0] : props.modelValue
  const extractedDate = hasModelValue.value ? date.extractDate(modelDate, props.mask) : new Date()

  return getDate(extractedDate)
}

function getCurrentEvent (date) {
  return props.events.find(event => event.date === date)
}

function getEventClasses (currentColor, hasCounter, isInactive) {
  return [
    'qas-date__event',

    isInactive ? 'qas-date__event--inactive' : 'qas-date__event--active',

    `text-${currentColor || (isInactive ? 'grey-4' : 'primary')}`,

    hasCounter ? 'qas-date__event--counter' : 'qas-date__event--pointer'
  ]
}

function getStatusDay ({ currentDay, index }) {
  const status = {
    isPrevious: false,
    isNext: false,
    isActiveMonthDay: false
  }

  if (currentDay > index) {
    status.isPrevious = true

    return status
  }

  if (index - 7 > currentDay) {
    status.isNext = true

    return status
  }

  status.isActiveMonthDay = true

  return status
}

function isJanuary (month) {
  return month === 1
}

function isDecember (month) {
  return month === 12
}

function getNormalizedYear ({ isNext, isPrevious, month, year }) {
  if (isPrevious && isJanuary(month)) return year - 1

  if (isNext && isDecember(month)) return year + 1

  return year
}

function getNormalizedMonth ({ month, isPrevious, isNext }) {
  if (isPrevious) return isJanuary(month) ? 12 : month - 1

  if (isNext) return isDecember(month) ? 1 : month + 1

  return month
}

function resetActiveEvents () {
  const elementsToRemove = dateElement.value.querySelectorAll('[data-event]')

  elementsToRemove.forEach(nodeElement => nodeElement.remove())
}

function resetInactiveEvents () {
  const inactiveElementsToRemove = dateElement.value.querySelectorAll('[data-has-inactive-event]')

  inactiveElementsToRemove.forEach(inactiveElement => {
    const [element] = inactiveElement.children

    const hasDayContent = element.querySelector('[data-day-content]')

    if (hasDayContent) inactiveElement.append(hasDayContent)
  })
}

function resetEvents () {
  if (props.useInactiveDates) resetInactiveEvents()

  resetActiveEvents()
}

function setCurrentDate (date) {
  currentDate.value = date || getCurrentDate()
}

function setEventClasses (currentColor, eventElement, hasCounter, isInactive) {
  const classes = getEventClasses(currentColor, hasCounter, isInactive)

  eventElement.classList.add(...classes)
}

function setTextCountEvent (eventElement, currentEvent) {
  eventElement.innerText = `(${currentEvent.counter})`
}

function setEvents ({ year, month }) {
  resetEvents()

  if (!props.events.length || !year || !month) return

  const daysElement = dateElement.value.querySelectorAll('.q-date__calendar-days .q-date__calendar-item')
  const daysElementList = Array.from(daysElement)

  daysElementList.forEach((dayElement, index) => {
    const [child] = dayElement.children

    const day = child.textContent

    const { isActiveMonthDay, isNext, isPrevious } = getStatusDay({ currentDay: day, index: index + 1 })

    const normalizedYear = getNormalizedYear({ isNext, month, isPrevious, year })
    const normalizedMonth = getNormalizedMonth({ isNext, isPrevious, month })
    const newDate = date.buildDate({ year: normalizedYear, month: normalizedMonth, day })
    const normalizedDate = asteroidDate(newDate, 'yyyy-MM-dd')

    const currentEvent = isEventsCallback.value ? props.events(normalizedDate) : getCurrentEvent(normalizedDate)

    const hasDisabledClass = dayElement.classList.contains('q-date__calendar-item--out')
    const isInactive = !isActiveMonthDay || hasDisabledClass

    /*
      * Se não tiver evento para o dia atual no loop ou
      * a opção de eventos inativos estiver desabilitada e o dia atual do loop
      * for referente ao mês anterior ou ao mês posterior, então retorna
    */
    if (!currentEvent || (!props.useInactiveDates && !isActiveMonthDay)) return

    const hasCounter = currentEvent.counter

    const currentColor = getCurrentColor(normalizedDate, currentEvent?.color)

    const eventElement = document.createElement('div')

    eventElement.setAttribute('data-event', true)

    dayElement.classList.add('qas-date__calendar-item-event')

    setEventClasses(currentColor, eventElement, hasCounter, isInactive)

    if (hasCounter) {
      setTextCountEvent(eventElement, currentEvent)
    } else {
      createPointerEventElement(isInactive, currentColor, eventElement)
    }

    if (isInactive) {
      createCounterInactiveEventElement(dayElement, eventElement)

      return
    }

    createActiveEventElement(dayElement, eventElement)
  })
}

function setNewNavigatorDisplay () {
  const navigationElement = dateElement.value.querySelector('.q-date__navigation')
  const navigationChildren = navigationElement?.children || []

  const nodesList = Array.from(navigationChildren)

  if (nodesList.length <= 2) return

  const firstDivElement = document.createElement('div')
  const secondDivElement = document.createElement('div')

  firstDivElement.classList.add('flex')
  secondDivElement.classList.add('flex')

  const firstList = nodesList.slice(0, 3)
  const secondList = nodesList.slice(3, 6)

  const newFirstElement = navigationElement.appendChild(firstDivElement)
  const newSecondElement = navigationElement.appendChild(secondDivElement)

  nextTick(() => firstList.forEach(node => newFirstElement.appendChild(node)))
  nextTick(() => secondList.forEach(node => newSecondElement.appendChild(node)))
}

function setObserveDate () {
  const element = dateElement.value.querySelector('.q-date__content')
  const config = { childList: true, subtree: true }

  const callback = mutationList => {
    mutationList.forEach(({ removedNodes, target }) => {
      const [removedNode] = removedNodes

      if (!removedNode) return

      const hasCalendarDaysContainer = target.classList.contains('q-date__calendar-days-container')
      const hasContent = target.classList.contains('q-date__content')
      const hasMonths = removedNode.classList.contains('q-date__months')

      if (hasCalendarDaysContainer || (hasContent && hasMonths)) {
        setEvents(currentDate.value)
      }
    })
  }

  dateObserver.value = new MutationObserver(callback)
  dateObserver.value.observe(element, config)
}

function onNavigation (date) {
  emit('navigation', date)

  setCurrentDate(date)

  nextTick(() => setNewNavigatorDisplay())
}
</script>

<style lang="scss">
.qas-date {
  // $
  min-width: 100%;
  width: 100%;

  &__event {
    @include set-typography($caption);

    color: $primary;
    font-size: 10px !important;
    line-height: 1;
    transition: color var(--qas-generic-transition);
    width: 100%;

    &--pointer {
      bottom: -6px;
      display: flex;
      justify-content: center;
    }
  }

  &__event-pointer {
    border-radius: 100%;
    display: flex;
    height: 6px;
    justify-content: center;
    margin-top: var(--qas-spacing-xs);
    width: 6px;
  }

  .q-date__calendar-item {
    vertical-align: initial;
  }

  &--inative {
    .q-date {
      &__calendar-item--out,
      &__calendar-item--fill {
        @include set-typography($subtitle2);

        color: $grey-4;
        line-height: 1;
        visibility: unset;

        span {
          height: auto;
          padding: var(--qas-spacing-xs);
        }
      }
    }

    .qas-date__event--inactive.qas-date__event--counter {
      color: $grey-4 !important;
    }
  }

  .q-date {
    &__navigation {
      justify-content: space-between;

      > div:last-child,
      > div:first-child {
        min-width: auto;
        width: auto;
      }

      > div:first-child {
        min-width: 120px;
      }

      .q-btn {
        @include set-button(tertiary, false, false, grey-10);
        @include set-typography($subtitle2);

        .q-icon {
          @include set-typography($subtitle1, true);
        }
      }
    }

    &__calendar-weekdays {
      color: $grey-8;

      > div {
        @include set-typography($caption);

        opacity: 1;
      }
    }

    &__calendar-item--out {
      color: $grey-4;
      opacity: 1;
    }

    &__months,
    &__years {
      .q-btn {
        background-color: white !important;

        &.bg-primary {
          color: $primary !important;
        }

        @include set-button(tertiary, false, false, grey-10);
      }
    }

    &__view {
      min-height: 230px;
    }

    &__calendar-days-container {
      color: $grey-10;
      min-height: auto;

      .q-btn {
        @include set-typography($subtitle2);

        border: 1px solid transparent;
        border-radius: $generic-border-radius;
        box-shadow: none;
        height: auto !important;
        line-height: 1;
        min-width: min-content;
        transition: color var(--qas-generic-transition);

        .q-ripple,
        .q-focus-helper {
          display: none !important;
        }

        &.bg-primary .qas-date__event--active {
          color: white !important;
        }

        &.bg-primary .qas-date__event--active .qas-date__event-pointer {
          background-color: white !important;
        }

        &:hover {
          color: var(--q-primary-contrast);
        }

        &.bg-primary,
        &.q-date__today {
          border-color: $primary;
          border-radius: $generic-border-radius;
          font-weight: 700;
        }

        &.q-date__today {
          color: $primary;
        }
      }
    }
  }
}
</style>
