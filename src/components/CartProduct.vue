<script lang="ts" setup>
import { type PropType, computed, ref } from 'vue'
import { removeFromCart, sendToTelegram } from '@/store/cartState' // Update with new state location

// Define the type for a cart item
type CartItem = {
  id: number
  title: string
  price: number
  thumbnail: string
}

// Props
const props = defineProps({
  cartItems: {
    type: Array as PropType<CartItem[]>,
    required: true
  }
})

// Computed for subtotal, shipping, tax, and total
const subtotal = computed(() => props.cartItems.reduce((total, item) => total + item.price, 0))
const shipping = ref(5) // Fixed shipping for now
const tax = computed(() => subtotal.value * 0.08) // Assuming 8% tax
const total = computed(() => subtotal.value + shipping.value + tax.value)
</script>

<template>
  <h1 class="text-3xl font-bold tracking-tight dark:text-gray-100 text-gray-900">Shopping Cart</h1>
  <div v-if="cartItems.length > 0">
    <h2 class="sr-only">Items in your shopping cart</h2>
    <ul role="list" class="divide-y divide-gray-200 border-b border-t min-h-72 border-gray-200">
      <li v-for="product in cartItems" :key="product.id" class="flex py-6 sm:py-10">
        <div class="flex-shrink-0">
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
          />
        </div>
        <div class="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div>
            <div class="flex justify-between sm:grid sm:grid-cols-2">
              <div class="pr-6">
                <h3 class="text-lg">
                  <RouterLink
                    :to="'/product/' + product.id"
                    class="font-bold text-gray-700 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"
                    >{{ product.title }}
                  </RouterLink>
                </h3>
              </div>
              <p class="text-right text-sm font-medium text-blue-500">${{ product.price }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center sm:absolute sm:left-1/2 sm:top-0 sm:mt-0 sm:block">
            <button
              @click.prevent="() => removeFromCart(product.id)"
              type="button"
              class="ml-4 text-sm font-medium text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else class="flex items-center justify-center h-[700px]">
    <h2 class="text-lg font-medium text-gray-500">No products in yet</h2>
  </div>
  <div v-if="cartItems.length > 0" class="mt-10 sm:ml-32 sm:pl-6">
    <div class="rounded-lg px-4 py-6 sm:p-6 lg:p-8">
      <h2 class="sr-only">Order summary</h2>
      <div class="flow-root">
        <dl class="-my-4 divide-y divide-gray-200 text-sm">
          <div class="flex items-center justify-between py-4">
            <dt class="dark:text-gray-300 text-gray-600">Subtotal</dt>
            <dd class="font-medium dark:text-gray-100 text-gray-900">${{ subtotal.toFixed(2) }}</dd>
          </div>
          <div class="flex items-center justify-between py-4">
            <dt class="dark:text-gray-300 text-gray-600">Shipping</dt>
            <dd class="font-medium dark:text-gray-100 text-gray-900">${{ shipping }}</dd>
          </div>
          <div class="flex items-center justify-between py-4">
            <dt class="text-gray-600 dark:text-gray-300">Tax</dt>
            <dd class="font-medium text-gray-900 dark:text-gray-100">${{ tax.toFixed(2) }}</dd>
          </div>
          <div class="flex items-center justify-between py-4">
            <dt class="text-base font-medium text-gray-900 dark:text-gray-100">Order total</dt>
            <dd class="text-base font-medium text-gray-900 dark:text-gray-100">
              ${{ total.toFixed(2) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="mt-10">
      <button
        @click.prevent="sendToTelegram"
        type="button"
        class="w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        Checkout
      </button>
    </div>
    <div class="mt-6 text-center text-sm text-gray-500">
      <p>
        or
        <RouterLink to="/" class="font-medium text-blue-600 hover:text-blue-500">
          Continue Shopping
          <span aria-hidden="true"> &rarr;</span>
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.cart {
  border: 1px solid #e5e7eb;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}
</style>
