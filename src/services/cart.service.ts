import { delay, ApiError } from './api'
import type { Cart } from '@/types/cart'

let serverCart: Cart = {
  version: 1,
  items: [],
}

let shouldFailNextMutation = false

export function simulateNextCartFailure() {
  shouldFailNextMutation = true
}

export async function fetchServerCart(): Promise<Cart> {
  await delay(250)

  return structuredClone(serverCart)
}

export async function updateServerCartQuantity(
  productId: string,
  quantity: number,
): Promise<Cart> {
  await delay(400)

  if (shouldFailNextMutation) {
    shouldFailNextMutation = false

    throw new ApiError(
      'Unable to update the cart. Please try again.',
      'CART_UPDATE_FAILED',
    )
  }

  const existingItem = serverCart.items.find(
    (item) => item.productId === productId,
  )

  if (quantity <= 0) {
    serverCart.items = serverCart.items.filter(
      (item) => item.productId !== productId,
    )
  } else if (existingItem) {
    existingItem.quantity = quantity
  } else {
    throw new ApiError(
      'Cart item does not exist on the server.',
      'CART_ITEM_NOT_FOUND',
    )
  }

  serverCart.version += 1

  return structuredClone(serverCart)
}

export async function replaceServerCart(
  cart: Cart,
): Promise<Cart> {
  await delay(350)

  serverCart = {
    ...structuredClone(cart),
    version: serverCart.version + 1,
  }

  return structuredClone(serverCart)
}
