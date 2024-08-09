<script lang="ts" setup>
import { type PropType, ref, computed } from 'vue'
import { removeFromCart, sendToTelegram } from '@/store/cartState'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/toast'
import { toast } from '@/components/ui/toast'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field'
import { Label } from '@/components/ui/label'

type CartItem = {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

const props = defineProps({
  cartItems: {
    type: Array as PropType<CartItem[]>,
    required: true
  }
})

const formSchema = toTypedSchema(
  z.object({
    fullname: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(9).max(11).regex(/^\d+$/, 'Phone number must contain only digits'),
    address: z.string().min(2).max(50)
  })
)

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit((values) => {
  sendToTelegram(values)
  toast({
    variant: 'default',
    description: 'Your Request has been sent to the server'
  })
  resetForm()
})

const updateQuantity = (item: CartItem, quantity: number) => {
  item.quantity = quantity
}

const subtotal = computed(() =>
  props.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
)
const shipping = ref(5)
const tax = computed(() => subtotal.value * 0.08)
const total = computed(() => subtotal.value + shipping.value + tax.value)
</script>

<template>
  <Toaster />
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
                <NumberField
                  id="quantity"
                  :default-value="product.quantity"
                  :min="1"
                  :max="999"
                  class="text-foreground w-1/4 space-y-2"
                  @update:model-value="updateQuantity(product, $event)"
                >
                  <Label for="quantity">Quantity</Label>
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>
              <p class="text-right text-sm font-medium text-blue-500">
                ${{ (product.price * (product.quantity || 1)).toFixed(2) }}
              </p>
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
      <form class="w-2/3 space-y-6 text-foreground" @submit.prevent="onSubmit">
        <FormField name="fullname" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="John Doe" v-bind="field" />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage>{{ errors.length ? errors[0] : '' }}</FormMessage>
          </FormItem>
        </FormField>
        <FormField name="email" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="text" placeholder="example@example.com" v-bind="field" />
            </FormControl>
            <FormDescription>This is your public display email.</FormDescription>
            <FormMessage>{{ errors.length ? errors[0] : '' }}</FormMessage>
          </FormItem>
        </FormField>
        <FormField name="phone" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input type="text" placeholder="1234567890" v-bind="field" />
            </FormControl>
            <FormDescription>This is your public display phone.</FormDescription>
            <FormMessage>{{ errors.length ? errors[0] : '' }}</FormMessage>
          </FormItem>
        </FormField>
        <FormField name="address" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input type="text" placeholder="123 Main St" v-bind="field" />
            </FormControl>
            <FormDescription>This is your public display address.</FormDescription>
            <FormMessage>{{ errors.length ? errors[0] : '' }}</FormMessage>
          </FormItem>
        </FormField>
        <Button type="submit">Submit</Button>
      </form>
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
