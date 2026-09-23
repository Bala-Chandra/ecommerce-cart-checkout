import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { fetchProducts } from '@/services/product.service'
import type { Product } from '@/types/product'

export const useProductsStore = defineStore(
  'products',
  () => {
    const products = ref<Product[]>([])
    const isLoading = ref(false)
    const errorMessage = ref('')

    const availableProducts = computed(() =>
      products.value.filter(
        (product) => product.available,
      ),
    )

    async function loadProducts() {
      if (products.value.length > 0) {
        return
      }

      isLoading.value = true
      errorMessage.value = ''

      try {
        products.value =
          await fetchProducts()
      } catch (error) {
        errorMessage.value =
          error instanceof Error
            ? error.message
            : 'Unable to load products.'
      } finally {
        isLoading.value = false
      }
    }

    function clear() {
      products.value = []
      errorMessage.value = ''
    }

    return {
      products,
      availableProducts,
      isLoading,
      errorMessage,
      loadProducts,
      clear,
    }
  },
)
