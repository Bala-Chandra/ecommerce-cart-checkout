import { computed, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'

import {
  fetchServerCart,
  replaceServerCart,
  updateServerCartQuantity,
} from '@/services/cart.service'

import type {
  Cart,
  CartItem,
  CartTotals,
} from '@/types/cart'

import type { Product } from '@/types/product'

const STORAGE_KEY = 'ecommerce-cart'
const STORAGE_VERSION = 1

interface PersistedCart {
  version: number
  cart: Cart
}

function emptyCart(): Cart {
  return {
    version: STORAGE_VERSION,
    items: [],
  }
}

function isCart(value: unknown): value is Cart {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false
  }

  const candidate =
    value as Record<string, unknown>

  return (
    typeof candidate.version === 'number' &&
    Array.isArray(candidate.items)
  )
}

function readPersistedCart(): Cart {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return emptyCart()
    }

    const parsed: unknown =
      JSON.parse(raw)

    if (
      typeof parsed !== 'object' ||
      parsed === null
    ) {
      return emptyCart()
    }

    const persisted =
      parsed as Partial<PersistedCart>

    if (
      persisted.version !==
      STORAGE_VERSION
    ) {
      return emptyCart()
    }

    if (!isCart(persisted.cart)) {
      return emptyCart()
    }

    return persisted.cart
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return emptyCart()
  }
}

function clonePlainCart(cart: Cart): Cart {
  return JSON.parse(
    JSON.stringify(toRaw(cart)),
  ) as Cart
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const cart = ref<Cart>(
      readPersistedCart(),
    )

    const mutationIds =
      new Map<string, number>()

    const items = computed(
      () => cart.value.items,
    )

    const itemCount = computed(() =>
      cart.value.items.reduce(
        (count, item) =>
          count + item.quantity,
        0,
      ),
    )

    const subtotal = computed(() =>
      cart.value.items.reduce(
        (sum, item) =>
          sum +
          item.product.unitPrice *
            item.quantity,
        0,
      ),
    )

    const shipping = computed(() => {
      if (subtotal.value === 0) {
        return 0
      }

      return subtotal.value >= 5000
        ? 0
        : 199
    })

    const discount = computed(() => 0)

    const total = computed(
      () =>
        subtotal.value -
        discount.value +
        shipping.value,
    )

    const totals = computed<CartTotals>(
      () => ({
        itemCount: itemCount.value,
        subtotal: subtotal.value,
        discount: discount.value,
        shipping: shipping.value,
        total: total.value,
      }),
    )

    function persist() {
      const snapshot =
        clonePlainCart(cart.value)

      const persisted: PersistedCart = {
        version: STORAGE_VERSION,
        cart: snapshot,
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(persisted),
      )
    }

    function findItem(
      productId: string,
    ) {
      return cart.value.items.find(
        (item) =>
          item.productId === productId,
      )
    }

    function createCartItem(
      product: Product,
      quantity = 1,
    ): CartItem {
      return {
        productId: product.id,
        quantity,
        product: {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
        },
      }
    }

    function setQuantityLocal(
      productId: string,
      quantity: number,
    ) {
      if (quantity <= 0) {
        cart.value.items =
          cart.value.items.filter(
            (item) =>
              item.productId !== productId,
          )

        return
      }

      const item = findItem(productId)

      if (item) {
        item.quantity = quantity
      }
    }

    function addItem(
      product: Product,
    ) {
      if (
        !product.available ||
        product.inventory <= 0
      ) {
        return
      }

      const existingItem =
        findItem(product.id)

      if (existingItem) {
        existingItem.quantity =
          Math.min(
            existingItem.quantity + 1,
            product.inventory,
          )
      } else {
        cart.value.items.push(
          createCartItem(product),
        )
      }

      persist()
    }

    async function updateQuantity(
      productId: string,
      quantity: number,
    ) {
      const currentItem =
        findItem(productId)

      if (!currentItem) {
        return
      }

      const previousCart =
        clonePlainCart(cart.value)

      const mutationId =
        (mutationIds.get(productId) ?? 0) +
        1

      mutationIds.set(
        productId,
        mutationId,
      )

      setQuantityLocal(
        productId,
        quantity,
      )

      persist()

      try {
        const serverCart =
          await updateServerCartQuantity(
            productId,
            quantity,
          )

        if (
          mutationIds.get(productId) !==
          mutationId
        ) {
          return
        }

        cart.value = serverCart

        persist()
      } catch {
        if (
          mutationIds.get(productId) ===
          mutationId
        ) {
          cart.value = previousCart
          persist()
        }

        throw new Error(
          'Cart update failed and was rolled back.',
        )
      }
    }

    async function removeItem(
      productId: string,
    ) {
      await updateQuantity(
        productId,
        0,
      )
    }

    async function clear() {
      const previousCart =
        clonePlainCart(cart.value)

      cart.value = emptyCart()
      persist()

      try {
        await replaceServerCart(
          emptyCart(),
        )
      } catch {
        cart.value = previousCart
        persist()

        throw new Error(
          'Unable to clear the cart.',
        )
      }
    }

    async function restoreServerCart() {
      const serverCart =
        await fetchServerCart()

      cart.value = serverCart
      persist()
    }

    async function mergeWithServerCart() {
      const guestCart =
        clonePlainCart(cart.value)

      const serverCart =
        await fetchServerCart()

      const mergedCart: Cart = {
        version: STORAGE_VERSION,
        items: serverCart.items.map(
          (item) => ({
            productId: item.productId,
            quantity: item.quantity,
            product: {
              productId:
                item.product.productId,
              name: item.product.name,
              unitPrice:
                item.product.unitPrice,
            },
          }),
        ),
      }

      for (const guestItem of
        guestCart.items) {
        const existingItem =
          mergedCart.items.find(
            (item) =>
              item.productId ===
              guestItem.productId,
          )

        if (existingItem) {
          existingItem.quantity +=
            guestItem.quantity
        } else {
          mergedCart.items.push({
            productId:
              guestItem.productId,
            quantity:
              guestItem.quantity,
            product: {
              productId:
                guestItem.product.productId,
              name:
                guestItem.product.name,
              unitPrice:
                guestItem.product.unitPrice,
            },
          })
        }
      }

      const savedCart =
        await replaceServerCart(
          mergedCart,
        )

      cart.value = savedCart
      persist()

      return savedCart
    }

    function reset() {
      cart.value = emptyCart()

      localStorage.removeItem(
        STORAGE_KEY,
      )
    }

    return {
      cart,
      items,
      itemCount,
      subtotal,
      discount,
      shipping,
      total,
      totals,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      restoreServerCart,
      mergeWithServerCart,
      reset,
    }
  },
)
