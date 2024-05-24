<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)

</script>
<template>
  <div>
    <span v-if="user">Welcome, {{ user?.username }}</span>
  </div>
</template>
<script scoped></script>
