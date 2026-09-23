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

import { useCartStore } from '@/stores/cart'
import {
  simulateNextCartFailure,
} from '@/services/cart.service'
import type { Product } from '@/types/product'

const product: Product = {
  id: 'p-001',
  name: 'Headphones',
  description: 'Test product',
  price: 1000,
  currency: 'INR',
  available: true,
  inventory: 10,
}

describe('Cart store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds an item to the cart', () => {
    const store = useCartStore()

    store.addItem(product)

    expect(store.items).toHaveLength(1)

    const item = store.items[0]

    expect(item).toBeDefined()
    expect(item?.quantity).toBe(1)
  })

  it('derives subtotal and total', () => {
    const store = useCartStore()

    store.addItem(product)
    store.addItem(product)

    expect(store.itemCount).toBe(2)
    expect(store.subtotal).toBe(2000)
    expect(store.shipping).toBe(199)
    expect(store.total).toBe(2199)
  })

  it('rolls back when the server rejects the mutation', async () => {
    const store = useCartStore()

    store.addItem(product)

    const item = store.items[0]

    expect(item).toBeDefined()

    if (!item) {
      throw new Error(
        'Expected cart item to exist after adding product',
      )
    }

    const originalQuantity = item.quantity

    simulateNextCartFailure()

    await expect(
      store.updateQuantity(
        product.id,
        originalQuantity + 1,
      ),
    ).rejects.toThrow()

    const rolledBackItem =
      store.items[0]

    expect(rolledBackItem).toBeDefined()

    if (!rolledBackItem) {
      throw new Error(
        'Expected cart item to exist after rollback',
      )
    }

    expect(rolledBackItem.quantity).toBe(
      originalQuantity,
    )
  })

  it('persists the cart', () => {
    const store = useCartStore()

    store.addItem(product)

    const raw =
      localStorage.getItem('ecommerce-cart')

    expect(raw).not.toBeNull()

    expect(JSON.parse(raw!)).toMatchObject({
      version: 1,
    })
  })
})
