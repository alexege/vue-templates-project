<script setup>
import SideNav from './components/nav/SideNav.vue'

import { useUsersStore } from '@/stores/user.store';
const userStore = useUsersStore()
const { getAll } = useUsersStore()

console.log("user store length: ", userStore.users.length)

// if (userStore.users.length < 1) {
// }
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
