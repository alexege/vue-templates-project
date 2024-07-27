<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import ConfirmationDialog from "@/components/modals/ConfirmationDialog.vue";

//Users
import { useUsersStore } from "@/stores/user.store";
const userStore = useUsersStore();
const { users } = storeToRefs(userStore);
const { getAll } = useUsersStore();
getAll();

const userToDelete = ref()
const showUserDialog = ref(false)
const deleteAUser = (user) => {
  showUserDialog.value = true;
  // userStore.deleteUser(userId);
  userToDelete.value = user
};

const dialogConfirmUsers = (confirm) => {
  if (!confirm) showUserDialog.value = false;
  else {
    userStore.deleteUser(userToDelete.value._id)
    showUserDialog.value = false;
  }
}

//Todos
import { useTodoListStore } from "@/stores/todo.store";
const todoStore = useTodoListStore();
const { todoList } = storeToRefs(todoStore);
const { fetchTodos } = useTodoListStore();
fetchTodos();

const todoToDelete = ref()
const showTodoDialog = ref(false)
const deleteATodo = (todo) => {
  showTodoDialog.value = true;
  // todoStore.deleteTodo(todoId);
  todoToDelete.value = todo
};

const dialogConfirmTodos = (confirm) => {
  if (!confirm) showTodoDialog.value = false;
  else {
    todoStore.deleteTodo(todoToDelete.value._id)
    showTodoDialog.value = false
  }
}

//Timers
import { useTimerStore } from "@/stores/timer.store";
const timerStore = useTimerStore();
const { allTimers } = storeToRefs(timerStore);
const { fetchTimers } = useTimerStore();
fetchTimers();

const timerToDelete = ref()
const showTimerDialog = ref(false)
const deleteATimer = (timer) => {
  showTimerDialog.value = true;
  // timerStore.deleteTimer(timerId);
  timerToDelete.value = timer
}

const dialogConfirmTimers = (confirm) => {
  if (!confirm) showTimerDialog.value = false;
  else {
    timerStore.deleteTimer(timerToDelete.value._id)
    showTimerDialog.value = false;
  }
}

//Messages
import { useMessageStore } from "@/stores/message.store";
const messageStore = useMessageStore();
const { allMessages } = storeToRefs(messageStore);
const { getAllMessages } = useMessageStore();
getAllMessages();

const messageToDelete = ref()
const showMessageDialog = ref(false)
const deleteAMessage = (timer) => {
  showMessageDialog.value = true;
  // messageStore.deleteTimer(timerId);
  messageToDelete.value = timer
}

const dialogConfirmMessages = (confirm) => {
  if (!confirm) showMessageDialog.value = false;
  else {
    messageStore.deleteMessageById(messageToDelete.value._id)
    showMessageDialog.value = false;
  }
}

</script>
<template>
  <div class="main">

    <ConfirmationDialog :item="userToDelete" :show="showUserDialog" @result="dialogConfirmUsers" />
    <ConfirmationDialog :item="todoToDelete" :show="showTodoDialog" @result="dialogConfirmTodos" />
    <ConfirmationDialog :item="timerToDelete" :show="showTimerDialog" @result="dialogConfirmTimers" />
    <ConfirmationDialog :item="messageToDelete" :show="showMessageDialog" @result="dialogConfirmMessages" />

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
          <a @click="deleteAUser(user)">
            <i class="bx bx-trash"></i>
          </a>
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
        <td>
          <span v-if="todo.author">{{ todo.author.username }}</span>
          <span v-else>-</span>
        </td>
        <td>{{ todo.createdAt }}</td>
        <td>
          <a @click="deleteATodo(todo)">
            <i class="bx bx-trash"></i>

          </a>
        </td>
      </tr>
    </table>

    <h3>All Timers:</h3>
    <table>
      <tr>
        <th>id</th>
        <th>name</th>
        <th>type</th>
        <th>duration</th>
        <th>isActive</th>
        <th>endDateTime</th>
        <th>creator</th>
        <th>img</th>
        <th>author</th>
        <th>createdAt</th>
        <th>actions</th>
      </tr>
      <tr v-for="timer in allTimers" :key="timer._id">
        <td v-if="timer._id">{{ timer._id.slice(-5) }}</td>
        <td>{{ timer.name }}</td>
        <td>{{ timer.type }}</td>
        <td>{{ timer.duration }}</td>
        <td>{{ timer.isActive }}</td>
        <td>{{ timer.endDateTime }}</td>
        <td>{{ timer.creator }}</td>
        <td>{{ timer.img }}</td>
        <td>
          <span v-if="timer.author">{{ timer.author.username }}</span>
          <span v-else>-</span>
        </td>
        <td>{{ timer.createdAt }}</td>
        <td>
          <a @click="deleteATimer(timer)">
            <i class="bx bx-trash"></i>
          </a>
        </td>
      </tr>
    </table>

    <h3>All Messages:</h3>
    <table>
      <tr>
        <th>id</th>
        <th>title</th>
        <th>content</th>
        <th>replies</th>
        <th>author</th>
        <th>endDateTime</th>
        <th>creator</th>
        <th>img</th>
        <th>createdAt</th>
        <th>actions</th>
      </tr>
      <tr v-for="message in allMessages" :key="message._id">
        <td v-if="message._id">{{ message._id.slice(-5) }}</td>
        <td>{{ message.title }}</td>
        <td>{{ message.content }}</td>
        <td>{{ message.replies.length }}</td>
        <td>{{ message.author.username }}</td>
        <td>{{ message.endDateTime }}</td>
        <td>{{ message.img }}</td>
        <td>
          <span v-if="message.author">{{ message.author.username }}</span>
          <span v-else>-</span>
        </td>
        <td>{{ message.createdAt }}</td>
        <td>
          <a @click="deleteAMessage(message)">
            <i class="bx bx-trash"></i>
          </a>
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
  margin-bottom: 2em;
}

th,
td {
  border: 1px solid black;
  padding: 0.5em;
}

td {
  /* color: white; */
}

th {
  background-color: rgba(0, 0, 0, 0.274);
}

i:hover {
  cursor: pointer;
}
</style>
