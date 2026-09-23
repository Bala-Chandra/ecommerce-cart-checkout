import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  processCheckout,
} from '@/services/checkout.service'
import type {
  CheckoutRequest,
  CheckoutState,
} from '@/types/checkout'

export const useCheckoutStore = defineStore(
  'checkout',
  () => {
    const state = ref<CheckoutState>({
      status: 'idle',
    })

    async function submit(
      request: CheckoutRequest,
      cart: Parameters<typeof processCheckout>[0],
    ) {
      state.value = {
        status: 'validating',
        request,
      }

      await Promise.resolve()

      const paymentId = `payment-${Date.now()}`

      state.value = {
        status: 'processing',
        request,
        paymentId,
      }

      try {
        const order = await processCheckout(
          cart,
          request,
        )

        state.value = {
          status: 'success',
          order,
        }

        return order
      } catch (error) {
        state.value = {
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Checkout failed.',
          retryable: true,
        }

        return null
      }
    }

    function reset() {
      state.value = {
        status: 'idle',
      }
    }

    return {
      state,
      submit,
      reset,
    }
  },
)
