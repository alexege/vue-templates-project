<script setup>
import { RouterView } from 'vue-router'
import SideNav from './components/nav/SideNav.vue'
import { computed } from 'vue'
import { useUsersStore } from '@/stores/user.store';
const userStore = useUsersStore()
const { getAll } = useUsersStore()
getAll()

//Theme Logic
import { useThemeStore } from './stores/theme.store';
const themeStore = useThemeStore()
const theme = computed(() => themeStore.theme);

</script>

<template>
  <div class="main" :class="theme">
    <SideNav class="side-nav" />
    <RouterView class="router-view" />
  </div>
</template>

<style scoped>
.main {
  display: flex;
}

.router-view {
  /* height: 100vh; */
  width: 100%;
}

.side-nav {
  background: rgb(16, 15, 28);
}

/* Default (Light Mode) Theme */
:root {
  --font-color: #fff;
  /* Default text color for light mode */
  --background-color: #34363b;
  /* Background color for light mode */
}

/* Dark Mode Theme */
.dark-mode {
  --font-color: #ddd;
  /* Text color for dark mode */
  --background-color: #333;
  /* Background color for dark mode */
}

/* Custom Mode Theme */
.custom-mode {
  --font-color: #ddd;
  /* Text color for dark mode */
  --background-color: #333;
  /* Background color for dark mode */
}

.main {
  color: var(--font-color);
  background-color: var(--background-color);
}
</style>
