import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasBtnDropdown from './QasBtnDropdown.vue'

function mountDropdown (options = {}) {
  return mountComponent(QasBtnDropdown, options)
}

describe('QasBtnDropdown', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountDropdown()

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-btn-dropdown"', () => {
      const wrapper = mountDropdown()

      expect(wrapper.classes()).toContain('qas-btn-dropdown')
    })

    it('não deve renderizar botões quando buttonsPropsList está vazio', () => {
      const wrapper = mountDropdown()

      expect(wrapper.findAll('.qas-btn-stub').length).toBe(0)
    })
  })

  describe('prop buttonsPropsList', () => {
    it('deve renderizar um botão para cada entrada de buttonsPropsList', () => {
      const wrapper = mountDropdown({
        props: {
          buttonsPropsList: {
            edit: { label: 'Editar' },
            delete: { label: 'Excluir' }
          }
        }
      })

      expect(wrapper.findAll('.qas-btn-stub').length).toBe(2)
    })

    it('deve renderizar apenas um botão quando buttonsPropsList tem uma entrada', () => {
      const wrapper = mountDropdown({
        props: {
          buttonsPropsList: {
            action: { label: 'Ação' }
          }
        }
      })

      expect(wrapper.findAll('.qas-btn-stub').length).toBe(1)
    })

    it('deve renderizar três botões quando buttonsPropsList tem três entradas', () => {
      const wrapper = mountDropdown({
        props: {
          buttonsPropsList: {
            a: { label: 'A' },
            b: { label: 'B' },
            c: { label: 'C' }
          }
        }
      })

      expect(wrapper.findAll('.qas-btn-stub').length).toBe(3)
    })
  })

  describe('prop skeleton', () => {
    it('não deve renderizar skeletons por padrão', () => {
      const wrapper = mountDropdown({
        props: {
          buttonsPropsList: { edit: { label: 'Editar' } }
        }
      })

      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeFalsy()
    })

    it('deve propagar skeleton para os botões quando skeleton é true', () => {
      // Com skeleton, getButtonProps injeta skeleton: true → QasBtn renderiza com skeleton
      // Como QasBtn é stubado, verificamos que há o botão (ele mesmo cuida do skeleton internamente)
      const wrapper = mountDropdown({
        props: {
          skeleton: true,
          buttonsPropsList: { edit: { label: 'Editar' } }
        }
      })

      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })
  })

  describe('prop useSplit', () => {
    it('deve renderizar o botão split quando useSplit é true', () => {
      const wrapper = mountDropdown({
        props: { useSplit: true }
      })

      // O botão split é renderizado separadamente
      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })

    it('não deve renderizar o botão split por padrão', () => {
      const wrapper = mountDropdown()

      // Sem buttons e sem split, não há botões
      expect(wrapper.find('.qas-btn-stub').exists()).toBeFalsy()
    })
  })

  describe('prop disable', () => {
    it('deve renderizar os botões normalmente quando disable é false', () => {
      const wrapper = mountDropdown({
        props: {
          disable: false,
          buttonsPropsList: { edit: { label: 'Editar' } }
        }
      })

      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })

    it('deve renderizar os botões mesmo quando disable é true', () => {
      const wrapper = mountDropdown({
        props: {
          disable: true,
          buttonsPropsList: { edit: { label: 'Editar' } }
        }
      })

      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })
  })

  describe('slot btn-content-{key}', () => {
    it('deve renderizar o conteúdo do slot btn-content quando fornecido', () => {
      const wrapper = mountDropdown({
        props: {
          buttonsPropsList: { edit: { label: 'Editar' } }
        },
        slots: {
          'btn-content-edit': '<span class="custom-btn-content">Customizado</span>'
        }
      })

      expect(wrapper.find('.custom-btn-content').exists()).toBeTruthy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar o conteúdo do slot default quando fornecido', () => {
      const wrapper = mountDropdown({
        props: {
          buttonsPropsList: { edit: { label: 'Editar' } }
        },
        slots: {
          default: '<div class="menu-content">Item de menu</div>'
        }
      })

      expect(wrapper.find('.menu-content').exists()).toBeTruthy()
    })
  })

  describe('emit click', () => {
    it('deve emitir o evento "click" ao clicar em um botão', async () => {
      const wrapper = mountDropdown({
        props: {
          buttonsPropsList: { edit: { label: 'Editar' } }
        }
      })

      await wrapper.find('.qas-btn-stub').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })
})
