<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import AboutIcon from '@/components/icons/AboutIcon.vue'
import ContactIcon from '@/components/icons/ContactIcon.vue'
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
import { clsx } from 'clsx'

const navitems = [
  {
    icon: HomeIcon,
    href: '/',
    label: 'Home'
  },
  {
    icon: AboutIcon,
    href: '/about',
    label: 'About'
  },
  {
    icon: ContactIcon,
    href: '/contact',
    label: 'Contact'
  }
  // Add more items as needed
]

const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header>
    <NavigationMenu class="dark:bg-gray-900 bg-gray-200 flex justify-between">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink as="div">
            <RouterLink to="/">
              <img src="" alt="Logo" />
            </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <!-- Dynamically create navigation items -->
        <NavigationMenuItem v-for="item in navitems" :key="item.href">
          <NavigationMenuLink as="div">
            <RouterLink :to="item.href" class="navigation-link">
              <component :is="item.icon" class="icon" />
              {{ item.label }}
            </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
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
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.navigation-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}

.navigation-link .icon {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .navigation-link {
    padding: 0.5rem;
  }
}
</style>
