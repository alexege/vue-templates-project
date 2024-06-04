<script setup>
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();

const roleConverter = (role) => {

  let roles = []

  console.log("role", role)
  const roleNames = {
    "ROLE_USER": "User",
    "ROLE_MODERATOR": "Moderator",
    "ROLE_ADMIN": "Admin"
  }

  role.map((role) => roles.push(roleNames[role]))

  return roles.join(', ')
}

</script>
<template>
  <div class="profile">
    <h2>{{ authStore.user.username }}</h2>
    <p>Roles:</p>
    <span>{{ roleConverter(authStore.user.roles) }}</span>
    <span style="font-size: 3em" class="profile-image">
      <img
        src="https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU="
        alt="" width="200px;" height="200px;">
    </span>

    <!-- Info Boxes -->
    <div class="profile-numbers">
      <div class="profile-statistic">
        <label>Posts:</label>
        <p v-if="authStore.user.posts">{{ authStore.user.posts.length ? authStore.user.posts.length : 0 }}</p>
      </div>
      <div class="profile-statistic">
        <label>Todos:</label>
        <p v-if="authStore.user.todos">{{ authStore.user.todos.length }}</p>
      </div>
      <div class="profile-statistic">
        <label>Timers:</label>
        <p v-if="authStore.user.timers">{{ authStore.user.timers.length }}</p>
      </div>
    </div>

  </div>
</template>
<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.profile-image {}

.profile-numbers {}
</style>