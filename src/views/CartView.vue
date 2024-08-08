<script setup lang="ts">
import CartProduct from '@/components/CartProduct.vue'
import { cartItems } from '@/store/cartState'
</script>

<template>
  <main>
    <CartProduct :cartItems="cartItems" />
  </main>
</template>
