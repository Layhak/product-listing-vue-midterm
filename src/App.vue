<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { cartItems } from '@/store/cartState'
import { computed } from 'vue'

const cartItemCount = computed(() => cartItems.value.length)

const navitems = [
  {
    icon: 'radix-icons:home', // Iconify icon for Home
    href: '/',
    label: 'Home'
  },
  {
    icon: 'radix-icons:info-circled', // Iconify icon for About
    href: '/about',
    label: 'About'
  }
  // Add more items as needed
]

const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="sticky top-0 z-50 dark:bg-gray-900 bg-gray-200 py-2">
    <NavigationMenu
      class="flex justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 dark:text-gray-100 text-gray-900"
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            as="div"
            class="flex items-center gap-2 justify-center rounded-md p-2 text-sm font-medium transition-colors"
          >
            <RouterLink to="/" class="flex items-center gap-2 justify-center">
              <Icon icon="fluent-emoji:shopping-bags" class="h-[2rem] w-[2rem] transition-all" />
              <span class="font-semibold">Hak Shop</span>
            </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem v-for="item in navitems" :key="item.href">
          <NavigationMenuLink as="div">
            <RouterLink
              :to="item.href"
              class="flex items-center gap-2 justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              <Icon :icon="item.icon" class="h-[1rem] w-[1rem] transition-all" />
              {{ item.label }}
            </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem
          class="flex items-center gap-2 justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
        >
          <Button variant="ghost" class="flex gap-2 justify-center" as-child>
            <RouterLink to="/cart">
              <Icon
                icon="lucide:shopping-bag"
                class="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all"
              />
              <span class="sr-only">cart</span>
              <span>{{ cartItemCount }}</span>
            </RouterLink>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Toggle
            :pressed="colorMode === 'dark'"
            @update:pressed="toggleColorMode"
            size="lg"
            variant="outline"
            clsx="p-2 rounded-full dark:bg-gray-950 bg-gray-200"
            class="rounded-full p-2"
          >
            <Button variant="ghost">
              <Icon
                icon="radix-icons:moon"
                class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
              <Icon
                icon="radix-icons:sun"
                class="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </Toggle>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </header>
  <main class="bg-gray-50 min-h-full py-10 dark:bg-gray-950">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <RouterView />
    </div>
  </main>
</template>
