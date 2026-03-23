import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QasAvatar from './QasAvatar.vue'
import { AvatarColors } from './enums/AvatarColors'

describe('QasAvatar', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mount(QasAvatar)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o ícone padrão quando não há imagem nem título', () => {
      const wrapper = mount(QasAvatar)

      expect(wrapper.find('q-icon').exists()).toBeTruthy()
      expect(wrapper.find('q-img').exists()).toBeFalsy()
    })

    it('deve usar o ícone "sym_r_error" como padrão', () => {
      const wrapper = mount(QasAvatar)

      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_error')
    })

    it('deve renderizar o ícone personalizado quando a prop "icon" é fornecida', () => {
      const wrapper = mount(QasAvatar, {
        props: { icon: 'sym_r_person' }
      })

      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_person')
    })
  })

  describe('prop title', () => {
    it('deve renderizar apenas a inicial do título quando "useCropTitle" é verdadeiro (padrão)', () => {
      const wrapper = mount(QasAvatar, {
        props: { title: 'John Doe' }
      })

      expect(wrapper.find('q-icon').exists()).toBeFalsy()
      expect(wrapper.find('q-img').exists()).toBeFalsy()
      expect(wrapper.text()).toBe('J')
    })

    it('deve renderizar o título em maiúscula', () => {
      const wrapper = mount(QasAvatar, {
        props: { title: 'nome' }
      })

      expect(wrapper.text()).toBe('N')
    })

    it('deve renderizar o título completo quando "useCropTitle" é falso', () => {
      const wrapper = mount(QasAvatar, {
        props: {
          title: 'John Doe',
          useCropTitle: false
        }
      })

      expect(wrapper.text()).toBe('John Doe')
    })

    it('deve renderizar ícone quando o título é uma string vazia', () => {
      const wrapper = mount(QasAvatar, {
        props: { title: '' }
      })

      expect(wrapper.find('q-icon').exists()).toBeTruthy()
    })
  })

  describe('prop image', () => {
    it('deve renderizar a imagem quando a prop "image" é fornecida', () => {
      const wrapper = mount(QasAvatar, {
        props: { image: 'https://example.com/avatar.png' }
      })

      const qimg = wrapper.findComponent({ name: 'QImg' })
      expect(qimg.exists()).toBeTruthy()
      // check native img tag inside component
      const nativeImg = wrapper.find('img')
      expect(nativeImg.exists()).toBeTruthy()
      expect(nativeImg.attributes('src')).toBe('https://example.com/avatar.png')
      expect(wrapper.find('q-icon').exists()).toBeFalsy()
    })

    it('deve priorizar a imagem sobre o título', () => {
      const wrapper = mount(QasAvatar, {
        props: {
          title: 'John Doe',
          image: 'https://example.com/avatar.png'
        }
      })
      const nativeImg = wrapper.find('img')
      expect(nativeImg.exists()).toBeTruthy()
      expect(wrapper.find('q-icon').exists()).toBeFalsy()
    })

    it('deve usar o título como "alt" da imagem', () => {
      const wrapper = mount(QasAvatar, {
        props: {
          title: 'John Doe',
          image: 'https://example.com/avatar.png'
        }
      })

      const nativeImg = wrapper.find('img')
      expect(nativeImg.attributes('alt')).toBe('John Doe')
    })

    it('deve exibir o ícone quando a imagem falha ao carregar', async () => {
      const wrapper = mount(QasAvatar, {
        props: { image: 'https://example.com/broken.png' }
      })

      const nativeImg = wrapper.find('img')
      expect(nativeImg.exists()).toBeTruthy()

      await nativeImg.trigger('error')

      expect(wrapper.find('img').exists()).toBeFalsy()
      expect(wrapper.find('q-icon').exists()).toBeTruthy()
    })

    it('deve resetar o erro de imagem ao trocar a prop "image"', async () => {
      const wrapper = mount(QasAvatar, {
        props: { image: 'https://example.com/broken.png' }
      })

      const nativeImg = wrapper.find('img')
      await nativeImg.trigger('error')
      expect(wrapper.find('img').exists()).toBeFalsy()

      await wrapper.setProps({ image: 'https://example.com/new.png' })

      expect(wrapper.find('img').exists()).toBeTruthy()
    })
  })

  describe('prop color e textColor', () => {
    it('deve aplicar "textColor" branco quando color é "primary"', () => {
      const wrapper = mount(QasAvatar, {
        props: { color: AvatarColors.Primary }
      })

      expect(wrapper.find('q-avatar').attributes('textcolor')).toBe('white')
    })

    it('deve aplicar "textColor" primary quando color é "secondary-contrast"', () => {
      const wrapper = mount(QasAvatar, {
        props: { color: AvatarColors.SecondaryContrast }
      })

      expect(wrapper.find('q-avatar').attributes('textcolor')).toBe('primary')
    })

    it('deve aplicar "textColor" grey-8 quando color é "grey-4"', () => {
      const wrapper = mount(QasAvatar, {
        props: { color: AvatarColors.Grey4 }
      })

      expect(wrapper.find('q-avatar').attributes('textcolor')).toBe('grey-8')
    })

    it('deve aplicar "textColor" branco quando color é "red-14"', () => {
      const wrapper = mount(QasAvatar, {
        props: { color: AvatarColors.Red14 }
      })

      expect(wrapper.find('q-avatar').attributes('textcolor')).toBe('white')
    })

    it('deve usar a prop "textColor" quando a cor não está no mapeamento', () => {
      const wrapper = mount(QasAvatar, {
        props: {
          color: 'blue',
          textColor: 'yellow'
        }
      })

      expect(wrapper.find('q-avatar').attributes('textcolor')).toBe('yellow')
    })
  })

  describe('prop size', () => {
    it('deve repassar a prop "size" ao q-avatar', () => {
      const wrapper = mount(QasAvatar, {
        props: { size: '64px' }
      })

      expect(wrapper.find('q-avatar').attributes('size')).toBe('64px')
    })
  })
})
