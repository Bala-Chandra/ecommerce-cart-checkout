<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">
          Products
        </div>

        <div class="text-grey-7">
          Choose products to add to your cart.
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="shopping_cart"
          :label="`Cart (${cartStore.itemCount})`"
          to="/cart"
        />

        <q-btn
          v-if="cartStore.itemCount > 0"
          color="primary"
          icon="payment"
          label="Checkout"
          to="/checkout"
        />
      </div>
    </div>

    <q-inner-loading :showing="productsStore.isLoading">
      <q-spinner
        size="50px"
        color="primary"
      />
    </q-inner-loading>

    <q-banner
      v-if="productsStore.errorMessage"
      rounded
      class="bg-red-1 text-negative q-mb-lg"
    >
      {{ productsStore.errorMessage }}
    </q-banner>

    <div
      v-if="
        !productsStore.isLoading &&
        productsStore.products.length
      "
      class="row q-col-gutter-lg"
    >
      <div
        v-for="product in productsStore.products"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <ProductCard
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </div>

    <q-card
      v-else-if="
        !productsStore.isLoading &&
        !productsStore.products.length
      "
      flat
      bordered
      class="q-pa-xl text-center"
    >
      <div class="text-h6">
        No products available
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

import ProductCard from '@/components/products/ProductCard.vue'
import { useProductsStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

const $q = useQuasar()

const productsStore = useProductsStore()
const cartStore = useCartStore()

function addToCart(productId: string) {
  const product =
    productsStore.products.find(
      (item) => item.id === productId,
    )

  if (!product) {
    return
  }

  cartStore.addItem(product)

  $q.notify({
    type: 'positive',
    message: `${product.name} added to cart`,
    position: 'top',
  })
}

onMounted(() => {
  void productsStore.loadProducts()
})
</script>
