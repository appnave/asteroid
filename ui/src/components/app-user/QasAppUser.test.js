import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasAppUser from './QasAppUser.vue'

const mockAxios = { patch: vi.fn() }

const defaultUser = {
  name: 'João Silva',
  email: 'joao@empresa.com',
  photo: '',
  to: '/profile'
}

describe('QasAppUser', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasAppUser, {
      props: {
        user: defaultUser
      },
      global: {
        provide: {
          axios: mockAxios
        }
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('tem atributo data-cy="app-user"', () => {
      expect(wrapper.find('[data-cy="app-user"]').exists()).toBe(true)
    })

    it('renderiza o avatar do usuário', () => {
      const avatars = wrapper.findAllComponents({ name: 'QasAvatar' })
      expect(avatars.length).toBeGreaterThan(0)
    })

    it('não exibe select de empresas quando companyProps não tem options', () => {
      const select = wrapper.findComponent({ name: 'QasSelect' })
      expect(select.exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('user é obrigatório', () => {
      expect(QasAppUser.props?.user?.required).toBe(true)
    })

    it('avatarSize tem default "40px"', () => {
      expect(QasAppUser.props?.avatarSize?.default).toBe('40px')
    })

    it('useDataOnSmallScreen tem default true', () => {
      expect(QasAppUser.props?.useDataOnSmallScreen?.default).toBe(true)
    })
  })

  describe('Computed', () => {
    it('userName retorna user.name', () => {
      expect(wrapper.vm.userName).toBe('João Silva')
    })

    it('userName usa user.givenName quando name não está disponível', () => {
      const w = mountComponent(QasAppUser, {
        props: { user: { givenName: 'Maria', email: 'm@m.com' } },
        global: { provide: { axios: mockAxios } }
      })
      expect(w.vm.userName).toBe('Maria')
    })

    it('hasCompaniesSelect é false quando companyProps não tem options', () => {
      expect(wrapper.vm.hasCompaniesSelect).toBe(false)
    })

    it('hasCompaniesSelect é true quando companyProps tem options', () => {
      const w = mountComponent(QasAppUser, {
        props: {
          user: defaultUser,
          companyProps: { options: [{ label: 'Empresa A', value: 'a' }] }
        },
        global: { provide: { axios: mockAxios } }
      })
      expect(w.vm.hasCompaniesSelect).toBe(true)
    })
  })

  describe('Emits', () => {
    it('emite sign-out ao chamar signOut', async () => {
      wrapper.vm.signOut()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('sign-out')).toBeTruthy()
    })

    it('emite toggle-notifications ao chamar toggleNotificationsDrawer', async () => {
      wrapper.vm.toggleNotificationsDrawer()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('toggle-notifications')).toBeTruthy()
    })
  })
})
