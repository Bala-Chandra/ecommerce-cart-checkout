<script setup lang="ts">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useCartStore } from '@/stores/cart';
import { useCheckoutStore } from '@/stores/checkout';

const $q = useQuasar();

const cartStore = useCartStore();
const checkoutStore = useCheckoutStore();

const { items, total } = storeToRefs(cartStore);

const { state } = storeToRefs(checkoutStore);

const address = reactive({
  fullName: '',
  line1: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
});

type PaymentMethod = 'upi' | 'card';

const paymentMethod = reactive<{
  value: PaymentMethod;
}>({
  value: 'upi',
});

const isProcessing = computed(
  () => state.value.status === 'processing' || state.value.status === 'validating',
);

async function submit() {
  const order = await checkoutStore.submit(
    {
      address: {
        id: 'checkout-address',
        ...address,
      },
      paymentMethod: paymentMethod.value,
    },
    cartStore.cart,
  );

  if (order) {
    cartStore.reset();

    $q.notify({
      type: 'positive',
      message: 'Order placed successfully.',
    });
  }
}
</script>

<template>
  <q-page padding>
    <div class="text-h4 text-weight-bold q-mb-lg">Checkout</div>

    <q-banner
      v-if="!items.length && state.status !== 'success'"
      rounded
      class="bg-orange-1 text-orange-10"
    >
      Your cart is empty.
    </q-banner>

    <div v-else-if="state.status === 'success'" class="column items-center q-pa-xl">
      <q-icon name="check_circle" color="positive" size="72px" />

      <div class="text-h5 q-mt-md">Order placed successfully</div>

      <div class="text-body2 text-grey-7 q-mt-sm">
        Order ID:
        {{ state.order.id }}
      </div>

      <q-btn class="q-mt-lg" color="primary" label="Continue shopping" to="/products" />
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Delivery address</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input v-model="address.fullName" outlined label="Full name" />

            <q-input v-model="address.line1" outlined label="Address" />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input v-model="address.city" outlined label="City" />
              </div>

              <div class="col-12 col-sm-6">
                <q-input v-model="address.state" outlined label="State" />
              </div>
            </div>

            <q-input v-model="address.postalCode" outlined label="Postal code" />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-h6 q-mb-md">Payment</div>

            <q-option-group
              v-model="paymentMethod.value"
              :options="[
                {
                  label: 'UPI',
                  value: 'upi',
                },
                {
                  label: 'Card',
                  value: 'card',
                },
              ]"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Total</div>

            <div class="text-h4 q-mt-md">₹{{ total.toLocaleString('en-IN') }}</div>

            <q-btn
              class="full-width q-mt-lg"
              color="primary"
              size="lg"
              label="Place order"
              :loading="isProcessing"
              @click="submit"
            />
          </q-card-section>

          <q-banner v-if="state.status === 'error'" rounded class="bg-red-1 text-negative q-ma-md">
            {{ state.message }}
          </q-banner>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
