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
  <div class="app" :class="theme">
    <SideNav />
    <RouterView class="router-view" />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.router-view {
  flex: 1 1 0;
}

.app {
  display: flex;
}

.app main {
  flex: 1 1 0;
  padding: 2rem;

}

@media (max-width: 1024px) {
  .app {
    padding-left: 6rem;
  }
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
