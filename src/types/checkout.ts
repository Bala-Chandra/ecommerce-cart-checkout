import type { Address } from './user'

export type PaymentState =
  | {
      status: 'idle'
    }
  | {
      status: 'validating'
    }
  | {
      status: 'processing'
      paymentId: string
    }
  | {
      status: 'success'
      transactionId: string
    }
  | {
      status: 'error'
      message: string
      retryable: boolean
    }

export interface CheckoutRequest {
  address: Address
  paymentMethod: 'card' | 'upi'
}

export interface OrderLineItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  items: OrderLineItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  createdAt: string
}

export type CheckoutState =
  | {
      status: 'idle'
    }
  | {
      status: 'validating'
      request: CheckoutRequest
    }
  | {
      status: 'processing'
      request: CheckoutRequest
      paymentId: string
    }
  | {
      status: 'success'
      order: Order
    }
  | {
      status: 'error'
      message: string
      retryable: boolean
    }
