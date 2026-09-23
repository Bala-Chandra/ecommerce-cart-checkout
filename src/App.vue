<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const navigateTo = async (path: string) => {
  await router.push(path)
}

const logout = async () => {
  authStore.logout()
  await router.push('/')
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header v-if="isAuthenticated" elevated>
      <q-toolbar>
        <q-toolbar-title>
          E-Commerce
        </q-toolbar-title>

        <q-btn
          flat
          no-caps
          label="Products"
          @click="navigateTo('/products')"
        />

        <q-btn
          flat
          no-caps
          label="Cart"
          @click="navigateTo('/cart')"
        />

        <q-btn
          flat
          no-caps
          label="Checkout"
          @click="navigateTo('/checkout')"
        />

        <q-separator vertical spaced />

        <q-btn
          flat
          no-caps
          label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
