import { delay, ApiError } from './api'
import type {
  CheckoutRequest,
  Order,
} from '@/types/checkout'
import type { Cart } from '@/types/cart'

export async function processCheckout(
  cart: Cart,
  request: CheckoutRequest,
): Promise<Order> {
  await delay(500)

  if (!cart.items.length) {
    throw new ApiError(
      'Your cart is empty.',
      'EMPTY_CART',
    )
  }

  if (!request.address.postalCode.trim()) {
    throw new ApiError(
      'A valid address is required.',
      'INVALID_ADDRESS',
    )
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.unitPrice * item.quantity,
    0,
  )

  const shipping = subtotal >= 5000 ? 0 : 199

  return {
    id: `order-${Date.now()}`,
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.unitPrice,
    })),
    subtotal,
    discount: 0,
    shipping,
    total: subtotal + shipping,
    createdAt: new Date().toISOString(),
  }
}
