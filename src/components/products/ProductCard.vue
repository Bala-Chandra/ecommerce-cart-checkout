<script setup lang="ts">
import type { Product } from '@/types/product'

defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  add: [product: Product]
}>()
</script>

<template>
  <q-card
    bordered
    flat
    class="full-height"
  >
    <q-card-section>
      <div class="text-h6">
        {{ product.name }}
      </div>

      <div class="text-body2 text-grey-7 q-mt-sm">
        {{ product.description }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-h6">
        ₹{{ product.price.toLocaleString('en-IN') }}
      </div>

      <q-badge
        :color="
          product.available
            ? 'positive'
            : 'negative'
        "
        :label="
          product.available
            ? `${product.inventory} available`
            : 'Out of stock'
        "
        class="q-mt-sm"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        color="primary"
        label="Add to cart"
        :disable="
          !product.available ||
          product.inventory === 0
        "
        @click="emit('add', product)"
      />
    </q-card-actions>
  </q-card>
</template>
