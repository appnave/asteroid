import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils'
import { useRouter } from 'vue-router'
import QasDialogRouter from './QasDialogRouter.vue'

describe('QasDialogRouter', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasDialogRouter)

      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('métodos expostos', () => {
    it('deve expor o método show()', () => {
      const wrapper = mountComponent(QasDialogRouter)

      expect(typeof wrapper.vm.show).toBe('function')
    })

    it('deve expor o método hide()', () => {
      const wrapper = mountComponent(QasDialogRouter)

      expect(typeof wrapper.vm.hide).toBe('function')
    })
  })

  describe('evento hide', () => {
    it('deve emitir "hide" quando o q-dialog emite o evento hide', async () => {
      const wrapper = mountComponent(QasDialogRouter)

      const dialog = wrapper.find('q-dialog')
      await dialog.trigger('hide')

      expect(wrapper.emitted('hide')).toBeTruthy()
    })
  })

  describe('método show() — erro interno', () => {
    it('deve emitir "error" quando show() encontra erro dentro do try-catch', async () => {
      useRouter.mockReturnValueOnce({
        push: vi.fn(),
        replace: vi.fn(),
        go: vi.fn(),
        back: vi.fn(),
        currentRoute: { value: { name: 'home', params: {}, query: {}, meta: {}, fullPath: '/' } },
        resolve: vi.fn(() => ({
          fullPath: '/fake-route',
          matched: []
        }))
      })

      const wrapper = mountComponent(QasDialogRouter)

      await wrapper.vm.show('/fake-route')

      expect(wrapper.emitted('error')).toBeTruthy()
    })
  })

  describe('método show() — rota inválida antes do try', () => {
    it('deve lidar com erro de rota sem travar a aplicação', async () => {
      useRouter.mockReturnValueOnce({
        push: vi.fn(),
        replace: vi.fn(),
        go: vi.fn(),
        back: vi.fn(),
        currentRoute: { value: { name: 'home', params: {}, query: {}, meta: {}, fullPath: '/' } },
        resolve: vi.fn(() => ({
          fullPath: '/rota',
          matched: [{ components: {} }]
        }))
      })

      const wrapper = mountComponent(QasDialogRouter)

      await wrapper.vm.show('/rota')

      expect(wrapper.emitted('error')).toBeTruthy()
    })
  })

  describe('limpeza após hide', () => {
    it('deve emitir "hide" a cada vez que onDialogHide é acionado', async () => {
      const wrapper = mountComponent(QasDialogRouter)

      const dialog = wrapper.find('q-dialog')
      await dialog.trigger('hide')
      await dialog.trigger('hide')

      expect(wrapper.emitted('hide')).toHaveLength(2)
    })
  })
})
