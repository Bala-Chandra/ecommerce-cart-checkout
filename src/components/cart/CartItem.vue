<script setup lang="ts">
import type { CartItem } from '@/types/cart'

const props = defineProps<{
  item: CartItem
  updating: boolean
}>()

const emit = defineEmits<{
  increase: []
  decrease: []
  remove: []
}>()
</script>

<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-weight-medium">
        {{ props.item.product.name }}
      </q-item-label>

      <q-item-label caption>
        ₹{{
          props.item.product.unitPrice.toLocaleString(
            'en-IN',
          )
        }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row items-center q-gutter-sm">
        <q-btn
          round
          dense
          flat
          icon="remove"
          :disable="updating"
          @click="emit('decrease')"
        />

        <span class="text-weight-medium">
          {{ props.item.quantity }}
        </span>

        <q-btn
          round
          dense
          flat
          icon="add"
          :disable="updating"
          @click="emit('increase')"
        />

        <q-btn
          flat
          round
          color="negative"
          icon="delete"
          :loading="updating"
          @click="emit('remove')"
        />
      </div>
    </q-item-section>
  </q-item>
</template>
