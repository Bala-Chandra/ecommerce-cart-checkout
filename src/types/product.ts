export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: 'INR'
  available: boolean
  inventory: number
}

export interface ProductSnapshot {
  productId: string
  name: string
  unitPrice: number
}
