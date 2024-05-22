<script setup>
defineProps(['todo'])

import { useTodoListStore } from '../../stores/todo.store'
import { ref } from 'vue'

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
</script>

<template>
  <div class="todo-container">
    <input type="checkbox" class="checkbox" @click="toggleCompleted(todo.id)" />
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
        :class="{ completed: todo.completed }"
        @dblclick="toggleEditMode(todo)"
      >
        <!-- {{ todo.id }} {{ todo.title }} {{ todo.zone }} -->
        {{ todo._id.slice(-5) }} {{ todo.title }} - {{ todo.author }} - {{ todo.completed }}
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
    <!-- <span @click="deleteTodo(todo.id)">&#10060;</span> -->
  </div>
</template>
<style scoped>
.todo-container {
  width: 50%;
  /* outline: 1px solid black; */
  padding: 5px;
  margin: 3px auto;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  outline: 1px solid black;
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
</style>
