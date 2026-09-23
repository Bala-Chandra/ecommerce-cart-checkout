import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import {
  createPinia,
  setActivePinia,
} from 'pinia'
import { useCheckoutStore } from '@/stores/checkout'
import type { Cart } from '@/types/cart'

const cart: Cart = {
  version: 1,
  items: [
    {
      productId: 'p-1',
      quantity: 1,
      product: {
        productId: 'p-1',
        name: 'Test Product',
        unitPrice: 1000,
      },
    },
  ],
}

describe('Checkout store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('moves through checkout to success', async () => {
    const store = useCheckoutStore()

    const order = await store.submit(
      {
        address: {
          id: 'address-1',
          fullName: 'Test User',
          line1: 'Test Street',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500001',
          country: 'India',
        },
        paymentMethod: 'upi',
      },
      cart,
    )

    expect(order).not.toBeNull()
    expect(store.state.status).toBe(
      'success',
    )
  })
})
