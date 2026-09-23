<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()

const authStore = useAuthStore()
const cartStore = useCartStore()

const { displayName } = storeToRefs(authStore)
const { itemCount } = storeToRefs(cartStore)

const cartLabel = computed(() =>
  itemCount.value > 0
    ? `Cart (${itemCount.value})`
    : 'Cart',
)

function logout() {
  authStore.logout()
  cartStore.reset()

  void router.push('/')
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered>
      <q-toolbar>
        <q-toolbar-title>
          <span class="text-weight-bold">
            E-Commerce
          </span>

          <span class="text-caption q-ml-sm">
            {{ displayName }}
          </span>
        </q-toolbar-title>

        <q-btn
          flat
          no-caps
          label="Products"
          to="/products"
        />

        <q-btn
          flat
          no-caps
          :label="cartLabel"
          to="/cart"
        />

        <q-btn
          flat
          no-caps
          label="Checkout"
          to="/checkout"
        />

        <q-btn
          flat
          round
          icon="logout"
          aria-label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
