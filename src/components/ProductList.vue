<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Skeleton } from '@/components/ui/skeleton'
import Button from '@/components/ui/button/Button.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  rating: number
  thumbnail: string
}

type ApiResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

const plugin = Autoplay({
  delay: 2000,
  stopOnMouseEnter: true,
  stopOnInteraction: false
})

const products = ref<Product[]>([])
const loading = ref(false)

const fetchProducts = async () => {
  loading.value = true
  const limit = 12
  const skip = 0 // Adjust this if you want to fetch all products
  try {
    const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    const data: ApiResponse = await response.json()
    products.value = data.products
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="bg-gray-50 min-h-full dark:bg-gray-950 my-10">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 my-10 lg:max-w-7xl lg:px-8">
      <Carousel
        class="relative w-full max-w-7xl"
        :plugins="[
          Autoplay({
            delay: 2000
          })
        ]"
        :opts="{
          loop: true
        }"
        @mouseenter="plugin.stop"
        @mouseleave="[plugin.reset(), plugin.play()]"
      >
        <CarouselContent>
          <CarouselItem v-for="product in products" :key="product.id">
            <div class="p-1">
              <Card class="h-96">
                <CardContent class="flex h-full items-center justify-center p-6">
                  <img :src="product.thumbnail" alt="Product Thumbnail" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <!-- <CarouselPrevious />
        <CarouselNext /> -->
      </Carousel>
    </div>

    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-50">Customers also bought</h2>

      <div
        v-if="loading"
        class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        <div class="flex flex-col space-y-3" v-for="n in 8" :key="n">
          <Skeleton class="h-[288px] w-[280px] bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[250px] bg-gray-200 dark:bg-gray-800" />
            <Skeleton class="h-4 w-[200px] bg-gray-200 dark:bg-gray-800" />
          </div>
          <Skeleton class="h-10 w-full space-y-10 rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      <div
        v-else
        class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        <div v-for="product in products" :key="product.id">
          <div class="relative">
            <div class="relative h-72 w-full overflow-hidden rounded-lg">
              <img
                :src="product.thumbnail"
                :alt="product.title"
                class="h-full w-full bg-gray-100 object-cover object-center"
              />
            </div>
            <div class="relative mt-4">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ product.title }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">{{ product.category }}</p>
            </div>
            <div
              class="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4"
            >
              <div
                aria-hidden="true"
                class="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-gray-950 opacity-70"
              ></div>
              <p class="relative text-lg font-semibold text-gray-50">${{ product.price }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-between gap-3">
            <RouterLink :to="'/product/' + product.id">
              <Button
                variant="outline"
                class="bg-yellow-500 hover:bg-yellow-600 text-gray-50 hover:text-gray-100 flex items-center gap-2"
              >
                <Icon icon="lucide:shopping-bag" class="w-4 h-4" />
                Product Detail<span class="sr-only">, {{ product.title }}</span>
              </Button>
            </RouterLink>
            <Button
              class="bg-blue-500 hover:bg-blue-600 text-gray-50 hover:text-gray-100 flex items-center gap-2"
            >
              <Icon icon="ion:cart-outline" class="w-6 h-6" />
              Add to cart<span class="sr-only">, {{ product.title }}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
