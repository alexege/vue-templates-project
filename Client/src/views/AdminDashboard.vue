<script setup>
import { ref } from "vue"
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/user.store";
const userStore = useUsersStore();
const { users } = storeToRefs(userStore);
const { getAll } = useUsersStore();
getAll()

const deleteAUser = (userId) => {
  userStore.deleteUser(userId)
}

import { useTodoListStore } from "@/stores/todo.store";
const todoStore = useTodoListStore();
const { todoList } = storeToRefs(todoStore);
const { fetchTodos } =  useTodoListStore();
fetchTodos()

const deleteATodo = (todoId) => {
  todoStore.deleteTodo(todoId)
}

</script>
<template>
  <div class="main">
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
    
    <h3>All Todos:</h3>

    <table>
      <tr>
        <th>id</th>
        <th>title</th>
        <th>completed</th>
        <th>author</th>
        <th>createdAt</th>
        <th>actions</th>
      </tr>
      <tr v-for="todo in todoList" :key="todo._id">
        <td v-if="todo._id">{{ todo._id.slice(-5) }}</td>
        <td>{{ todo.title }}</td>
        <td>{{ todo.completed }}</td>
        <td>{{ todo.author }}</td>
        <td>{{ todo.createdAt }}</td>
        <td>
          <a @click="deleteATodo(todo._id)">Delete</a>
        </td>
      </tr>
    </table>

    <!-- <pre>{{ users }}</pre> -->
  </div>
</template>
<style scoped>
.main {
  text-align: center;
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

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
