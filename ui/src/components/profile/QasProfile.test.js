import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasProfile from './QasProfile.vue'

const qasScreenMock = {
  $qas: {
    screen: {
      untilMedium: false,
      isSmall: false
    }
  }
}

function mountProfile (options = {}) {
  return mountComponent(QasProfile, {
    ...options,
    global: {
      ...(options.global || {}),
      mocks: {
        ...qasScreenMock,
        ...((options.global || {}).mocks || {})
      }
    }
  })
}

describe('QasProfile', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente com a prop title obrigatória', () => {
      const wrapper = mountProfile({ props: { title: 'João Silva' } })
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('prop title', () => {
    it('deve exibir o título passado via prop', () => {
      const wrapper = mountProfile({ props: { title: 'João Silva' } })
      expect(wrapper.text()).toContain('João Silva')
    })
  })

  describe('prop subtitle', () => {
    it('deve exibir o subtítulo quando passado via prop', () => {
      const wrapper = mountProfile({
        props: { title: 'João Silva', subtitle: 'Admin' }
      })
      expect(wrapper.text()).toContain('Admin')
    })

    it('não deve renderizar o subtítulo quando não for passado', () => {
      const wrapper = mountProfile({ props: { title: 'João Silva', subtitle: '' } })
      expect(wrapper.text()).not.toContain('Admin')
    })
  })

  describe('prop result', () => {
    it('deve repassar result.image para o QasAvatar via prop image', () => {
      const wrapper = mountProfile({
        props: {
          title: 'João Silva',
          result: { image: 'https://example.com/avatar.jpg' }
        }
      })
      const avatar = wrapper.findComponent({ name: 'QasAvatar' })
      expect(avatar.exists()).toBeTruthy()
    })
  })

  describe('prop tag', () => {
    it('deve renderizar o componente dentro de qas-box-stub quando tag é "qas-box" (padrão)', () => {
      const wrapper = mountProfile({ props: { title: 'João Silva' } })
      expect(wrapper.findComponent({ name: 'QasBox' }).exists()).toBeTruthy()
    })

    it('deve renderizar como div quando tag é "div"', () => {
      const wrapper = mountProfile({
        props: { title: 'João Silva', tag: 'div' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo personalizado no slot default substituindo title/subtitle', () => {
      const wrapper = mountProfile({
        props: { title: 'João Silva' },
        slots: {
          default: '<div class="custom-profile-content">conteúdo customizado</div>'
        }
      })
      expect(wrapper.find('.custom-profile-content').exists()).toBeTruthy()
    })
  })

  describe('slot grid', () => {
    it('deve renderizar conteúdo personalizado no slot grid substituindo o grid generator', () => {
      const wrapper = mountProfile({
        props: { title: 'João Silva' },
        slots: {
          grid: '<div class="custom-grid">grid customizado</div>'
        }
      })
      expect(wrapper.find('.custom-grid').exists()).toBeTruthy()
      expect(wrapper.findComponent({ name: 'QasGridGenerator' }).exists()).toBeFalsy()
    })
  })
})
