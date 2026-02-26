import { vi } from 'vitest'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    currentRoute: { value: { name: 'home', params: {}, query: {}, meta: {} } }
  })),

  useRoute: vi.fn(() => ({
    name: 'home',
    params: {},
    query: {},
    meta: {},
    path: '/'
  })),

  onBeforeRouteLeave: vi.fn()
}))

// Mock @bildvitta/store-adapter
vi.mock('@bildvitta/store-adapter', () => ({
  getAction: vi.fn(),
  getState: vi.fn()
}))

// Mock AutoNumeric
vi.mock('autonumeric', () => {
  const AutoNumericMock = vi.fn(() => ({
    set: vi.fn(),
    getValue: vi.fn(() => '0'),
    getNumber: vi.fn(() => 0),
    destroy: vi.fn(),
    remove: vi.fn(),
    update: vi.fn()
  }))
  AutoNumericMock.multiple = vi.fn()
  return { default: AutoNumericMock }
})

// Mock sortablejs
vi.mock('sortablejs', () => {
  const SortableMock = vi.fn(() => ({
    destroy: vi.fn(),
    option: vi.fn()
  }))
  SortableMock.create = vi.fn(() => ({
    destroy: vi.fn(),
    option: vi.fn()
  }))
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

// // Registrar stubs globais para componentes Quasar usados nos testes
// import { config } from '@vue/test-utils'

// config.global.components = {
//   ...(config.global.components || {}),
//   'q-checkbox': true,
//   'q-option-group': true,
//   'q-icon': true
// }

// 'q-btn',
// 'q-input',
// 'q-select',
// 'q-field',
// 'q-checkbox',
// 'q-toggle',
// 'q-radio',
// 'q-option-group',
// 'q-date',
// 'q-time',
// 'q-uploader',
// 'q-editor',
// 'q-table',
// 'q-th',
// 'q-td',
// 'q-tr',
// 'q-card',
// 'q-item',
// 'q-list',
// 'q-tab',
// 'q-tabs',
// 'q-tab-panel',
// 'q-tab-panels',
// 'q-stepper',
// 'q-step',
// 'q-dialog',
// 'q-menu',
// 'q-popup-edit',
// 'q-pagination',
// 'q-breadcrumbs',
// 'q-breadcrumbs-el'

import { config } from '@vue/test-utils'
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
  'close-popup': ClosePopup
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
  QStep,
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
  QHeader,
  QPageContainer,
  QDrawer,
  QVirtualScroll,
  QRouteTab
}
