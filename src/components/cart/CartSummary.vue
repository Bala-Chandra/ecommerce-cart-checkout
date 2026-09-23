<script setup lang="ts">
defineProps<{
  itemCount: number
  subtotal: number
  discount: number
  shipping: number
  total: number
}>()

const format = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`
</script>

<template>
  <q-card
    flat
    bordered
  >
    <q-card-section>
      <div class="text-h6">
        Order Summary
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-gutter-sm">
      <div class="row justify-between">
        <span>Items</span>
        <span>{{ itemCount }}</span>
      </div>

      <div class="row justify-between">
        <span>Subtotal</span>
        <span>{{ format(subtotal) }}</span>
      </div>

      <div class="row justify-between">
        <span>Discount</span>
        <span>-{{ format(discount) }}</span>
      </div>

      <div class="row justify-between">
        <span>Shipping</span>
        <span>{{ format(shipping) }}</span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row justify-between text-h6">
        <span>Total</span>
        <span>{{ format(total) }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>
