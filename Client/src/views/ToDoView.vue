<script setup>
import Todo from '@/components/todo/todo.vue'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useTodoListStore } from '../stores/todo.store'

const todo = ref('')
const todoStore = useTodoListStore()
const { todoList } = storeToRefs(todoStore)
const { dropZones } = storeToRefs(todoStore)

const addItemAndClear = (item) => {
  if (item.length === 0) return
  todoStore.addTodo(item)
  todo.value = ''
  //   dropZones.value.push({ zoneId: todoList.value.length - 1 })
}

const startZoneId = ref()

// Drag and Drop
const startDrag = (event, item) => {
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('itemId', item.id)
  console.log(`startZone: ${JSON.stringify(item)}`)
  startZoneId.value = item
}

const onDrop = (event, zoneId) => {
  console.log(`endZone:${zoneId}`)

  //Swap contents of dropzones
  let start = dropZones.value.find((zone) => zone.zoneId == startZoneId.value)
  let end = dropZones.value.find((zone) => zone.zoneId == zoneId)
  let temp = end.todo

  end.todo = start.todo
  start.todo = temp
}

onMounted(() => {
  //Seed with default data for testing purposes
  if (todoStore.todoList.length == 0) {
    todoStore.addTodo('one')
    todoStore.addTodo('two')
    todoStore.addTodo('three')
  }
})
</script>
<template>
  <div class="todo-container">
    <!-- Add Todo List Item Form -->
    <form @submit.prevent="addItemAndClear(todo)" class="add-todo-form">
      <input v-model="todo" type="text" /><button>Add</button>
    </form>
    <template v-for="(zone, idx) in dropZones" :key="zone.id">
      <div class="drop-zone" @drop="onDrop($event, idx)" @dragenter.prevent @dragover.prevent>
        <Todo :todo="zone.todo" draggable="true" @dragstart="startDrag($event, idx)" />
      </div>
    </template>
  </div>
</template>
<style scoped>
.add-todo-form {
  padding: 1em;
}

.add-todo-form input {
  padding: 0.25em;
  border-radius: 5px;
}

.add-todo-form button {
  padding: 0.25em;
}

.todo-container form {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: 50%;
}

.todo-container form input {
  flex: 1;
}

/* Drag and drop */
.drop-zone {
  min-height: 40px;
  /* outline: 1px dashed red; */
}
</style>
