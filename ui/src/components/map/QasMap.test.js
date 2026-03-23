import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasMap from './QasMap.vue'

const defaultCenterPosition = { lat: -23.5505, lng: -46.6333 }

const defaultMarkers = [
  {
    title: 'Ponto A',
    description: 'Descrição A',
    position: { lat: -23.5505, lng: -46.6333 },
    draggable: false,
    icon: null
  },
  {
    title: 'Ponto B',
    description: 'Descrição B',
    position: { lat: -23.5605, lng: -46.6433 },
    draggable: true,
    icon: null
  }
]

describe('QasMap', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasMap, {
      props: {
        centerPosition: defaultCenterPosition
      },
      global: {
        stubs: {
          'g-map-map': { template: '<div class="g-map-stub"><slot /></div>' },
          'g-map-marker': { template: '<div class="g-map-marker-stub"><slot /></div>', props: ['draggable', 'icon', 'position'] },
          'g-map-info-window': { template: '<div class="g-map-info-window-stub"><slot /></div>', props: ['opened'] }
        }
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza o mapa principal', () => {
      const map = wrapper.find('.g-map-stub')
      expect(map.exists()).toBe(true)
    })

    it('não renderiza marcadores quando markers está vazio', () => {
      const markers = wrapper.findAll('.g-map-marker-stub')
      expect(markers).toHaveLength(0)
    })

    it('renderiza um marcador por cada item em markers', () => {
      const w = mountComponent(QasMap, {
        props: {
          centerPosition: defaultCenterPosition,
          markers: defaultMarkers
        },
        global: {
          stubs: {
            'g-map-map': { template: '<div class="g-map-stub"><slot /></div>' },
            'g-map-marker': { template: '<div class="g-map-marker-stub"><slot /></div>', props: ['draggable', 'icon', 'position'] },
            'g-map-info-window': { template: '<div class="g-map-info-window-stub"><slot /></div>', props: ['opened'] }
          }
        }
      })
      const markers = w.findAll('.g-map-marker-stub')
      expect(markers).toHaveLength(2)
    })
  })

  describe('Props', () => {
    it('centerPosition default é objeto vazio', () => {
      const def = QasMap.props?.centerPosition?.default()
      expect(def).toEqual({})
    })

    it('markers default é array vazio', () => {
      const def = QasMap.props?.markers?.default()
      expect(def).toEqual([])
    })

    it('zoom default é 17', () => {
      expect(QasMap.props?.zoom?.default).toBe(17)
    })

    it('usePopup default é undefined (não definido)', () => {
      expect(wrapper.props('usePopup')).toBeFalsy()
    })
  })

  describe('Comportamento de popup', () => {
    it('canShowPopup retorna false quando isPopupDisplayed é false', () => {
      expect(wrapper.vm.canShowPopup(0)).toBe(false)
    })

    it('canShowPopup retorna false quando usePopup é false', () => {
      expect(wrapper.vm.canShowPopup(0)).toBe(false)
    })

    it('closePopup reseta isPopupDisplayed', () => {
      wrapper.vm.closePopup()
      expect(wrapper.vm.isPopupDisplayed).toBe(false)
    })
  })

  describe('Emits', () => {
    it('emite update-position com coordenadas ao arrastar um marcador', () => {
      const mockEvent = {
        latLng: { toJSON: vi.fn(() => ({ lat: -23.5505, lng: -46.6333 })) }
      }
      wrapper.vm.updatePosition(mockEvent)
      expect(wrapper.emitted('update-position')).toBeTruthy()
      expect(wrapper.emitted('update-position')[0][0]).toEqual({ lat: -23.5505, lng: -46.6333 })
    })
  })
})
