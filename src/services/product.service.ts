import { delay } from './api'
import type { Product } from '@/types/product'

const products: Product[] = [
  {
    id: 'p-001',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones for everyday listening.',
    price: 4999,
    currency: 'INR',
    available: true,
    inventory: 12,
  },
  {
    id: 'p-002',
    name: 'Mechanical Keyboard',
    description: 'Compact mechanical keyboard for productivity.',
    price: 6999,
    currency: 'INR',
    available: true,
    inventory: 8,
  },
  {
    id: 'p-003',
    name: '4K Monitor',
    description: '27-inch 4K monitor for development and design.',
    price: 28999,
    currency: 'INR',
    available: true,
    inventory: 5,
  },
  {
    id: 'p-004',
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub for modern laptops.',
    price: 3499,
    currency: 'INR',
    available: false,
    inventory: 0,
  },
]

export async function fetchProducts(): Promise<Product[]> {
  await delay(250)

  return structuredClone(products)
}

export async function fetchProduct(
  productId: string,
): Promise<Product | undefined> {
  await delay(150)

  const product = products.find((item) => item.id === productId)

  return product ? structuredClone(product) : undefined
}
