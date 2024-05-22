<script setup>
import Todo from "@/components/todo/todo.vue";
import AddTodo from "@/components/todo/addTodo.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useTodoListStore } from "../stores/todo.store";

const todo = ref("");
const todoStore = useTodoListStore();
const { todoList } = storeToRefs(todoStore);
const { dropZones } = storeToRefs(todoStore);

const { fetchTodos } = useTodoListStore();
fetchTodos();

const startZoneId = ref();

// Drag and Drop
const startDrag = (event, item) => {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemId", item.id);
  console.log(`startZone: ${JSON.stringify(item)}`);
  startZoneId.value = item;
};

const onDrop = (event, zoneId) => {
  console.log(`endZone:${zoneId}`);

  //Swap contents of dropzones
  let start = dropZones.value.find((zone) => zone.zoneId == startZoneId.value);
  let end = dropZones.value.find((zone) => zone.zoneId == zoneId);
  let temp = end.todo;

  end.todo = start.todo;
  start.todo = temp;
};
</script>
<template>
  <div class="todo-container">
    <h2>Add a new Todo Item</h2>

    <!-- Add Todo List Item Form -->
    <AddTodo />

    <div v-for="todo in todoList" :key="todo._id">
      <Todo :todo="todo" />
    </div>
  </div>
</template>
<style scoped>
.todo-container {
  text-align: center;
  padding: 1em;
}

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
