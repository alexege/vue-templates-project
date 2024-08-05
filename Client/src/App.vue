<script setup>
import { RouterView } from 'vue-router'
import SideNav from './components/nav/SideNav.vue'
import { computed } from 'vue'
import { useUsersStore } from '@/stores/user.store';
const userStore = useUsersStore()
const { getAll } = useUsersStore()
getAll()

import { onMounted } from 'vue'
onMounted(() => {
  console.log("App mounted")

  //Color Logic
  //Get theme from LocalStorage
  const theme = localStorage.getItem('theme')
  console.log("starting theme is: ", theme);
  if (theme === 'light') {
    document.documentElement.style.setProperty('--primary-color', '#000000');
    document.documentElement.style.setProperty('--secondary-color', '#ffffff');
    document.documentElement.style.setProperty('--third-color', '#000000');
    document.documentElement.style.setProperty('--fourth-color', '#000000');
  } else if (theme === 'dark') {
    document.documentElement.style.setProperty('--primary-color', '#ffffff');
    document.documentElement.style.setProperty('--secondary-color', '#000000');
    document.documentElement.style.setProperty('--third-color', '#ffffff');
    document.documentElement.style.setProperty('--fourth-color', '#ffffff');
  } else if (theme === 'custom') {
    const primaryColor = localStorage.getItem('--primary-color')
    const secondaryColor = localStorage.getItem('--secondary-color')
    const thirdColor = localStorage.getItem('--third-color')
    const fourthColor = localStorage.getItem('--fourth-color')

    //Set theme colors
    if (primaryColor) document.documentElement.style.setProperty('--primary-color', primaryColor)
    if (secondaryColor) document.documentElement.style.setProperty('--secondary-color', secondaryColor)
    if (thirdColor) document.documentElement.style.setProperty('--third-color', thirdColor)
    if (fourthColor) document.documentElement.style.setProperty('--fourth-color', fourthColor)
  }

})

</script>

<template>
  <div class="app">
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
  color: var(--primary-color);
  background-color: var(--secondary-color);
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

:root {
  --primary-color: #42b883;
  --secondary-color: #35495e;
  --third-color: #2c3e50;
  --fourth-color: #f1f1f1;
}
</style>
