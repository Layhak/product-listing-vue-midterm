<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { Skeleton } from '@/components/ui/skeleton'
import { cartItems, addToCart as sharedAddToCart } from '@/store/cartState' // import shared cart state and functions

type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  rating: number
  thumbnail: string
}

const product = ref<Product | null>(null)
const loading = ref(false)
const route = useRoute()

const fetchProductDetail = async (productId: number) => {
  loading.value = true
  try {
    const response = await axios.get(`https://dummyjson.com/products/${productId}`)
    product.value = response.data
  } catch (error) {
    console.error('Error fetching product detail:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = (product: Product | null) => {
  if (!product) return

  // Check if product is already in cart
  const existingItem = cartItems.value.find((cartItem) => cartItem.id === product.id)
  if (!existingItem) {
    sharedAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail
    })
  } else {
    console.log(`Product with id ${product.id} already exists in the cart`)
  }
}

onMounted(() => {
  const productId = Number(route.params.id)
  if (productId) {
    fetchProductDetail(productId)
  }
})
</script>

<template>
  <div v-if="loading">
    <div
      class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
    >
      <!-- Skeleton for Product Title -->
      <div class="lg:max-w-lg lg:self-end mt-4">
        <Skeleton class="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>

      <!-- Skeleton for Product Price and Description -->
      <div class="lg:max-w-lg lg:self-end mt-4">
        <Skeleton class="h-8 w-1/4 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
        <Skeleton class="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>

      <!-- Skeleton for Product Image -->
      <div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
        <div
          class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <Skeleton class="h-full w-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <!-- Skeleton for Add to Bag Button -->
      <div class="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        <Skeleton class="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  </div>

  <div v-else class="bg-gray-100 dark:bg-gray-950 h-full">
    <div
      class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
    >
      <!-- Product details -->
      <div class="lg:max-w-lg lg:self-end">
        <div class="mt-4" v-if="product">
          <h1
            class="text-3xl font-bold tracking-tight dark:text-gray-100 text-gray-900 sm:text-4xl"
          >
            {{ product.title }}
          </h1>
        </div>

        <section aria-labelledby="information-heading" class="mt-4" v-if="product">
          <h2 id="information-heading" class="sr-only">Product information</h2>

          <div class="flex items-center">
            <p class="text-xl text-blue-500 sm:text-2xl font-bold">${{ product.price }}</p>
          </div>

          <div class="mt-4 space-y-6">
            <p class="text-base text-gray-500">{{ product.description }}</p>
          </div>
        </section>
      </div>

      <!-- Product image -->
      <div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center" v-if="product">
        <div
          class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="h-full w-full bg-gray-700 dark:bg-gray-100 object-cover object-center"
          />
        </div>
      </div>

      <!-- Product form -->
      <div class="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        <section aria-labelledby="options-heading">
          <div class="mt-10">
            <Button
              type="submit"
              class="flex w-full items-center justify-center border border-transparent bg-blue-500 px-8 py-3 text-base font-medium rounded-full text-gray-50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              @click="addToCart(product)"
            >
              Add to bag
            </Button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
