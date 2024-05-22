<script setup>
defineProps(['todo'])

import { useTodoListStore } from '../../stores/todo.store'
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'

const todoStore = useTodoListStore()
const { toggleCompleted, editTodo, deleteTodo } = todoStore

const isEditing = ref(false)
const editItem = ref()
const toggleEditMode = (todo) => {
  editItem.value = todo.title
  isEditing.value = !isEditing.value
}
const updateTodo = (todo) => {
  todo.title = editItem.value
  isEditing.value = !isEditing.value

  todoStore.editTodo(todo._id, todo)
}

const deleteTodoItem = (itemId) => {
  todoStore.deleteTodo(itemId)
}

const timeDiff = (date1, date2) => {
  if (date1 > date2) {
    [date1, date2] = [date2, date1]
  }

  // Get the total difference in milliseconds
  const diffInMs = date2 - date1;

  // Calculate the differences
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

const timer = ref()

function timeSince() {
  console.log("tick tick tick")
}

onMounted(() => {
  timer.value = setInterval(() => {
    timeSince()
  }, 3000)
})

onBeforeUnmount(() => {
  timer.value = null;
})

</script>

<template>
  <div class="todo-container" :class="todo.completed ? 'is-completed' : 'is-incomplete'">
    <input type="checkbox" class="checkbox" @click="toggleCompleted(todo)" :checked="todo.completed" />
    <template v-if="isEditing">
      <input
        class="todo-body"
        type="text"
        v-model="editItem"
        @blur="updateTodo(todo)"
        @keydown.enter="$event.target.blur()"
      />
    </template>
    <template v-else>
      <span
        class="todo-body"
        @dblclick="toggleEditMode(todo)"
      >
        <!-- {{ todo.id }} {{ todo.title }} {{ todo.zone }} -->
        <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        <template v-if="todo.author">- {{ todo.author }}</template>
        <!-- <span class="updated-at">{{ new Date(todo.updatedAt).toDateString() }}</span> -->
        
        
      
      <!-- <span class="created-at">Posted: {{ new Date(todo.createdAt).toLocaleString() }}</span> -->
      <div class="created-at" style="font-size: 8px;">
        <template v-if="timeDiff(new Date(), new Date(todo.createdAt)).hours">
          {{ timeDiff(new Date(), new Date(todo.createdAt)).hours }} Hours
        </template>
        
        <template v-if="timeDiff(new Date(), new Date(todo.createdAt)).minutes">
          {{ timeDiff(new Date(), new Date(todo.createdAt)).minutes }} Minutes
        </template>
        
        <template v-if="timeDiff(new Date(), new Date(todo.createdAt)).seconds">
          {{ timeDiff(new Date(), new Date(todo.createdAt)).seconds }} Seconds
        </template>

          <span v-if="timeDiff(new Date(), new Date(todo.createdAt))">ago</span>
      </div>

      </span>
    </template>
    <!-- <span @click.stop="toggleCompleted(todo.id)">&#10004;</span> -->
    <div class="todo-actions">
      <span @click="toggleEditMode(todo)">
        <i class="bx bx-edit"></i>
      </span>
      <span @click="deleteTodoItem(todo._id)">
        <i class="bx bx-trash"></i>
      </span>
    </div>
  </div>
</template>
<style scoped>
.todo-container {
  width: 50%;
  /* outline: 1px solid black; */
  padding: 5px;
  margin: 3px auto;
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  /* outline: 1px solid black; */
  border-radius: 5px;
}

.checkbox {
  margin: 5px;
}

.todo-body {
  flex: 1;
}

.todo-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.todo-actions i {
  font-size: 1em;
  padding: 0 5px;
}

.completed {
  text-decoration: line-through;
}

.updated-at, .created-at {
  font-size: 10px;
}

.is-completed {
  outline: 2px solid lime;
  background-color:rgba(50, 205, 50, 0.25)
}

.is-incomplete {
  outline: 2px solid red;
  background-color: rgba(255, 0, 0, 0.25)
}

.created-at {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>
