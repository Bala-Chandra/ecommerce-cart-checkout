import {
  describe,
  expect,
  it,
} from 'vitest'
import { mount } from '@vue/test-utils'
import {
  installQuasarPlugin,
} from '@quasar/quasar-app-extension-testing-unit-vitest'
import CartSummary from '@/components/cart/CartSummary.vue'

installQuasarPlugin()

describe('CartSummary', () => {
  it('renders derived cart values', () => {
    const wrapper = mount(CartSummary, {
      props: {
        itemCount: 2,
        subtotal: 2000,
        discount: 100,
        shipping: 199,
        total: 2099,
      },
    })

    expect(wrapper.text()).toContain(
      '2',
    )

    expect(wrapper.text()).toContain(
      '2099',
    )
  })
})
