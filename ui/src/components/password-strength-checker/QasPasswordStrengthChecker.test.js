import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasPasswordStrengthChecker from './QasPasswordStrengthChecker.vue'

function mountChecker (options = {}) {
  return mountComponent(QasPasswordStrengthChecker, {
    ...options,
    global: {
      ...(options.global || {})
    }
  })
}

describe('QasPasswordStrengthChecker', () => {
  describe('renderização com senha vazia', () => {
    it('não deve renderizar nada quando a senha está vazia', () => {
      const wrapper = mountChecker({ props: { password: '' } })
      expect(wrapper.find('div').exists()).toBeFalsy()
    })
  })

  describe('renderização com senha preenchida', () => {
    it('deve renderizar o componente quando a senha tem conteúdo', () => {
      const wrapper = mountChecker({ props: { password: 'abc' } })
      expect(wrapper.find('div').exists()).toBeTruthy()
    })
  })

  describe('emissão de update:currentLevel', () => {
    it('deve emitir update:currentLevel imediatamente ao montar (watcher imediato)', () => {
      const wrapper = mountChecker({ props: { password: 'abc' } })
      expect(wrapper.emitted('update:currentLevel')).toBeTruthy()
    })

    it('deve emitir score baixo para senha fraca', () => {
      const wrapper = mountChecker({ props: { password: 'abc' } })
      const emitted = wrapper.emitted('update:currentLevel')
      const score = emitted[0][0]
      expect(score).toBeLessThan(4)
    })

    it('deve emitir score mais alto para senha forte do que para senha fraca', () => {
      const weakWrapper = mountChecker({ props: { password: 'abc' } })
      const strongWrapper = mountChecker({ props: { password: 'Abc123!@#' } })

      const weakScore = weakWrapper.emitted('update:currentLevel')[0][0]
      const strongScore = strongWrapper.emitted('update:currentLevel')[0][0]

      expect(strongScore).toBeGreaterThan(weakScore)
    })

    it('deve emitir score máximo (4) para senha muito forte', () => {
      const wrapper = mountChecker({ props: { password: 'Abc123!@#' } })
      const score = wrapper.emitted('update:currentLevel')[0][0]
      expect(score).toBe(4)
    })
  })

  describe('exibição do rótulo de nível', () => {
    it('deve exibir o rótulo do nível de segurança da senha', () => {
      const wrapper = mountChecker({ props: { password: 'abc' } })
      const text = wrapper.text()
      expect(text.length).toBeGreaterThan(0)
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo personalizado via slot default com binding de level', () => {
      const wrapper = mountChecker({
        props: { password: 'abc' },
        slots: {
          default: '<div class="custom-level-slot">nível customizado</div>'
        }
      })
      expect(wrapper.find('.custom-level-slot').exists()).toBeTruthy()
    })
  })
})
