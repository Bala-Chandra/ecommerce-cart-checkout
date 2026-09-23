import {
  describe,
  expect,
  it,
} from 'vitest'

import type { Product } from '@/types/product'

import ProductCard from '@/components/products/ProductCard.vue'

import { mountWithQuasar } from '../../utils/mountWithQuasar'

const product: Product = {
  id: 'p-001',
  name: 'Wireless Headphones',
  description: 'Premium wireless headphones',
  price: 4999,
  currency: 'INR',
  available: true,
  inventory: 12,
}

describe('ProductCard', () => {
  it('renders product information', () => {
    const wrapper = mountWithQuasar(
      ProductCard,
      {
        props: {
          product,
        },
      },
    )

    expect(wrapper.text()).toContain(
      'Wireless Headphones',
    )

    expect(wrapper.text()).toContain(
      '4,999',
    )

    expect(wrapper.text()).toContain(
      '12 available',
    )
  })

  it('emits add-to-cart when the button is clicked', async () => {
    const wrapper = mountWithQuasar(
      ProductCard,
      {
        props: {
          product,
        },
      },
    )

    await wrapper
      .get('button')
      .trigger('click')

    expect(
      wrapper.emitted('add-to-cart'),
    ).toBeTruthy()

    expect(
      wrapper.emitted('add-to-cart')?.[0],
    ).toEqual([product])
  })

  it('disables add to cart when product is unavailable', () => {
    const unavailableProduct: Product = {
      ...product,
      available: false,
      inventory: 0,
    }

    const wrapper = mountWithQuasar(
      ProductCard,
      {
        props: {
          product: unavailableProduct,
        },
      },
    )

    expect(
      wrapper.get('button').attributes('disabled'),
    ).toBeDefined()
  })
})
