<script setup>
import SideNav from './components/nav/SideNav.vue'
import { useUsersStore } from '@/stores/user.store';
const userStore = useUsersStore()
const { getAll } = useUsersStore()
getAll()
</script>

<template>
  <header>
    <SideNav />
  </header>
</template>

<style scoped>
.router-view {
  height: 100vh;
}
</style>
