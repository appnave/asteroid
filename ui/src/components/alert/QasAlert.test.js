import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QasAlert from './QasAlert.vue'

describe('QasAlert', () => {
  it('should render', () => {
    const wrapper = mount(QasAlert, {
      slots: {
        default: 'Default Text'
      }
    })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render title correctly', () => {
    const wrapper = mount(QasAlert, {
      props: {
        title: 'Test Title'
      }
    })

    const titleElement = wrapper.get('[data-test="alert-title"]')

    expect(titleElement.text()).toBe('Test Title')
  })
})
