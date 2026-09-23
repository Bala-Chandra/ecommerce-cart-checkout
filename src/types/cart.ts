import type { ProductSnapshot } from './product'

export interface CartItem {
  productId: string
  quantity: number
  product: ProductSnapshot
}

export interface Cart {
  version: number
  items: CartItem[]
}

export interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
}

export interface CartTotals {
  itemCount: number
  subtotal: number
  discount: number
  shipping: number
  total: number
}
