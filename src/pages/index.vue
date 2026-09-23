<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const cartStore = useCartStore();

const email = ref('');
const password = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

const redirectMessage = computed(() =>
  typeof route.query.message === 'string' ? route.query.message : '',
);

async function login() {
  errorMessage.value = '';

  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Email and password are required.';

    return;
  }

  isSubmitting.value = true;

  try {
    const success = authStore.login(email.value, password.value);

    if (!success) {
      errorMessage.value = 'Unable to sign in.';

      return;
    }

    await cartStore.mergeWithServerCart();

    await router.push('/products');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to initialize your cart.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <q-page class="login-page">
    <div class="login-container">
      <q-card flat bordered class="login-card">
        <q-card-section class="text-center">
          <div class="text-h4 text-weight-bold">E-Commerce</div>

          <div class="text-subtitle1 text-grey-7 q-mt-sm">Sign in to continue</div>
        </q-card-section>

        <q-banner v-if="redirectMessage" rounded class="bg-orange-1 text-orange-10 q-mx-lg">
          {{ redirectMessage }}
        </q-banner>

        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="login">
            <q-input
              v-model="email"
              outlined
              label="Email"
              type="email"
              autocomplete="email"
              :disable="isSubmitting"
            />

            <q-input
              v-model="password"
              outlined
              label="Password"
              type="password"
              autocomplete="current-password"
              :disable="isSubmitting"
            />

            <q-banner v-if="errorMessage" rounded class="bg-red-1 text-negative">
              {{ errorMessage }}
            </q-banner>

            <q-btn
              type="submit"
              color="primary"
              label="Log in"
              class="full-width"
              size="lg"
              :loading="isSubmitting"
            />
          </q-form>
        </q-card-section>

        <q-card-section class="text-center text-caption text-grey-6">
          Demo login — any non-empty credentials work.
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
.login-page {
  min-height: 100%;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f7fb;
}

.login-card {
  width: min(100%, 420px);
  border-radius: 16px;
}
</style>
