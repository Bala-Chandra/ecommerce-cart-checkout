<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import { useCartStore } from '@/stores/cart'

const $q = useQuasar()
const router = useRouter()
const cartStore = useCartStore()

const {
  items,
  itemCount,
  subtotal,
  discount,
  shipping,
  total,
} = storeToRefs(cartStore)

const updatingProductId = ref<string | null>(null)

async function updateQuantity(
  productId: string,
  quantity: number,
) {
  updatingProductId.value = productId

  try {
    await cartStore.updateQuantity(
      productId,
      quantity,
    )
  } catch (error) {
    $q.notify({
      type: 'negative',
      message:
        error instanceof Error
          ? error.message
          : 'Cart update failed.',
    })
  } finally {
    updatingProductId.value = null
  }
}

async function removeItem(productId: string) {
  await updateQuantity(productId, 0)
}

function checkout() {
  void router.push('/checkout')
}
</script>

<template>
  <q-page padding>
    <div class="text-h4 text-weight-bold q-mb-lg">
      Cart
    </div>

    <div
      v-if="!items.length"
      class="column items-center q-pa-xl"
    >
      <q-icon
        name="shopping_cart"
        size="64px"
        color="grey-5"
      />

      <div class="text-h6 q-mt-md">
        Your cart is empty
      </div>

      <q-btn
        class="q-mt-md"
        color="primary"
        label="Browse products"
        to="/products"
      />
    </div>

    <div
      v-else
      class="row q-col-gutter-xl"
    >
      <div class="col-12 col-md-8">
        <q-card
          flat
          bordered
        >
          <q-list separator>
            <CartItem
              v-for="item in items"
              :key="item.productId"
              :item="item"
              :updating="
                updatingProductId ===
                item.productId
              "
              @increase="
                updateQuantity(
                  item.productId,
                  item.quantity + 1,
                )
              "
              @decrease="
                updateQuantity(
                  item.productId,
                  item.quantity - 1,
                )
              "
              @remove="
                removeItem(item.productId)
              "
            />
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <CartSummary
          :item-count="itemCount"
          :subtotal="subtotal"
          :discount="discount"
          :shipping="shipping"
          :total="total"
        />

        <q-btn
          color="primary"
          size="lg"
          class="full-width q-mt-md"
          label="Proceed to checkout"
          @click="checkout"
        />
      </div>
    </div>
  </q-page>
</template>
