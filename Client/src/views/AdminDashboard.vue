<script setup>
import { ref } from "vue"
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/user.store";
const userStore = useUsersStore();
const { users } = storeToRefs(userStore);

const deleteAUser = (userId) => {
  userStore.deleteUser(userId)
}
</script>
<template>
  <div>
    Admin Dashboard

    <h3>All Users:</h3>

    <table>
      <tr>
        <th>id</th>
        <th>Name</th>
        <th>Email</th>
        <th>Roles</th>
        <th>Actions</th>
      </tr>
      <tr v-for="user in users" :key="user._id">
        <td v-if="user._id">{{ user._id.slice(-5) }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td v-if="user.roles">{{ user.roles[0].name }}</td>
        <td>
          <a @click="deleteAUser(user._id)">Delete</a>
        </td>
      </tr>
    </table>

    <pre>{{ users }}</pre>
  </div>
</template>
<style scoped>
table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid black;
  padding: 0.5em;
}

th {
  background-color: rgba(0, 0, 0, 0.274);
}
</style>
