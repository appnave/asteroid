import { vi } from 'vitest'

// Polyfill ResizeObserver para jsdom
global.ResizeObserver = class ResizeObserver {
  observe () {}
  unobserve () {}
  disconnect () {}
}

// Polyfill IntersectionObserver para jsdom
global.IntersectionObserver = class IntersectionObserver {
  observe () {}
  unobserve () {}
  disconnect () {}
}

// Mock vue-router (centralizado para todos os testes)
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    hasRoute: vi.fn(() => true),
    resolve: vi.fn(({ name }) => ({ path: `/${name}` })),
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    currentRoute: { value: { name: 'home', params: {}, query: {}, meta: {}, path: '/' } }
  })),

  useRoute: vi.fn(() => ({
    name: 'home',
    params: {},
    query: {},
    meta: {},
    path: '/'
  })),

  RouterLink: { template: '<a><slot /></a>' },

  onBeforeRouteLeave: vi.fn()
}))

// Mock @bildvitta/store-adapter
vi.mock('@bildvitta/store-adapter', () => ({
  getAction: vi.fn(),
  getState: vi.fn()
}))

// Mock AutoNumeric
vi.mock('autonumeric', () => {
  const autonumericPresets = {
    commaDecimalCharDotSeparator: { decimalCharacter: ',', digitGroupSeparator: '.', decimalPlaces: 2 },
    Brazilian: { currencySymbol: 'R$ ', decimalCharacter: ',', digitGroupSeparator: '.', decimalPlaces: 2 },
    percentageEU2dec: { suffixText: '%', decimalPlaces: 2 },
    integer: { decimalPlaces: 0 }
  }
  function AutoNumericMock () {
    this.set = vi.fn()
    this.getValue = vi.fn(() => '0')
    this.getNumber = vi.fn(() => 0)
    this.destroy = vi.fn()
    this.remove = vi.fn()
    this.update = vi.fn()
    this.historyTable = [{ value: '0' }]
    this.historyTableIndex = 0
  }
  AutoNumericMock.multiple = vi.fn()
  AutoNumericMock.getPredefinedOptions = vi.fn(() => autonumericPresets)
  return { default: AutoNumericMock }
})

// Mock sortablejs
vi.mock('sortablejs', () => {
  function SortableMock () {
    this.destroy = vi.fn()
    this.option = vi.fn()
  }
  SortableMock.create = vi.fn(function () {
    return { destroy: vi.fn(), option: vi.fn() }
  })
  return { default: SortableMock }
})

// Mock quasar utilities
vi.mock('quasar', async importOriginal => {
  const { ref } = await import('vue')
  const actual = await importOriginal()
  return {
    ...actual,
    useDialogPluginComponent: Object.assign(vi.fn(() => ({
      dialogRef: ref(null),
      onDialogHide: vi.fn(),
      onDialogOK: vi.fn(),
      onDialogCancel: vi.fn()
    })), { emits: [] }),
    LocalStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    },
    SessionStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    },
    Notify: {
      create: vi.fn(),
      registerType: vi.fn()
    },
    Screen: {
      width: 1280,
      height: 800,
      name: 'lg',
      gt: { xs: true, sm: true, md: true, lg: false, xl: false },
      lt: { xs: false, sm: false, md: false, lg: true, xl: true },
      xs: false,
      sm: false,
      md: false,
      lg: true,
      xl: false
    },
    Platform: {
      is: { mobile: false, desktop: true, electron: false },
      has: {}
    },
    copyToClipboard: vi.fn(() => Promise.resolve())
  }
})

import { config } from '@vue/test-utils'
import { markRaw } from 'vue'
import {
  Quasar,
  QCheckbox,
  QCarousel,
  QChip,
  QOptionGroup,
  QBtn,
  QBadge,
  QInput,
  QSelect,
  QField,
  QToggle,
  QRadio,
  QDate,
  QTime,
  QUploader,
  QEditor,
  QTable,
  QTh,
  QTd,
  QTr,
  QCard,
  QItem,
  QList,
  QTab,
  QTabs,
  QTabPanel,
  QTabPanels,
  QStepper,
  QStep,
  QTree,
  QForm,
  QPullToRefresh,
  QLayout,
  QHeader,
  QPageContainer,
  QDrawer,
  QVirtualScroll,
  QRouteTab,
  QDialog,
  QMenu,
  QPopupEdit,
  QPagination,
  QBreadcrumbs,
  QBreadcrumbsEl,
  QSpinner,
  QIcon,
  QExpansionItem,
  QCarouselSlide,
  QImg,
  QInfiniteScroll,

  ClosePopup
} from 'quasar'

// import { RouterLink } from 'vue-router'

config.global.directives = {
  'close-popup': ClosePopup,
  ripple: { mounted () {}, updated () {} }
}

config.global.plugins.push(Quasar)
config.global.mocks = {
  $qas: {
    error: vi.fn(),
    success: vi.fn(),
    dialog: vi.fn(),
    delete: vi.fn(),
    screen: { isSmall: false }
  },
  $axios: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} }))
  },
  $route: {
    name: 'home',
    params: {},
    query: {},
    meta: {},
    path: '/'
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    resolve: vi.fn(path => ({ path })),
    currentRoute: { value: { name: 'home', params: {}, query: {}, meta: {}, path: '/' } }
  }
}

config.global.components = {
  RouterLink: markRaw({ name: 'RouterLink', template: '<a><slot /></a>', props: ['to', 'custom'] }),
  RouterView: markRaw({ name: 'RouterView', template: '<div />' }),
  // Stub para evitar warning "QHeader needs to be child of QLayout" do Quasar
  QHeader,
  // Stub para evitar warning "QStep needs to be a child of QStepper" do Quasar
  QStep,
  QIcon,
  QInfiniteScroll,
  QCarousel,
  QCarouselSlide,
  QCheckbox,
  QBadge,
  QChip,
  QOptionGroup,
  QBtn,
  QInput,
  QSelect,
  QField,
  QToggle,
  QRadio,
  QDate,
  QTime,
  QUploader,
  QEditor,
  QTable,
  QTh,
  QTd,
  QTr,
  QCard,
  QItem,
  QList,
  QTab,
  QTabs,
  QTabPanel,
  QTabPanels,
  QStepper,
  QDialog,
  QMenu,
  QPopupEdit,
  QPagination,
  QBreadcrumbs,
  QBreadcrumbsEl,
  QSpinner,
  QExpansionItem,
  QImg,
  QTree,
  QForm,
  QPullToRefresh,
  QLayout,
  QPageContainer,
  QDrawer,
  QVirtualScroll,
  QRouteTab
}
