<script setup>
import Todo from "@/components/todo/todo.vue";
import AddTodo from "@/components/todo/addTodo.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useTodoListStore } from "../stores/todo.store";

const todo = ref("");
const todoStore = useTodoListStore();
const { todoList, completedTodos, incompleteTodos } = storeToRefs(todoStore);
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

//Custom Dropdown
const selectedOption = ref()
const customValue = ref()

</script>
<template>
  <div class="todo-container">
    <h2>Add a new Todo Item</h2>

    <!-- Add Todo List Item Form -->
    <AddTodo />

    <!-- Custom Input / DropDown -->
    <select v-model="selectedOption">
      <option value="">Select an option</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
      <option value="custom">Custom</option>
    </select>
    <input type="text" v-model="customValue" v-show="selectedOption === 'custom'">

    <!-- <div v-for="todo in todoList" :key="todo._id">
      <Todo :todo="todo" />
    </div> -->

    <h3 v-if="incompleteTodos.length > 0">Pending ({{ incompleteTodos.length }})</h3>

    <!-- Incomplete Todos -->

    <div class="incomplete-items" v-if="incompleteTodos.length">
      <div v-for="todo in incompleteTodos" :key="todo._id">
        <Todo :todo="todo" />
      </div>
    </div>

    <br>

    <h3 v-if="completedTodos.length > 0">Completed ({{ completedTodos.length }})</h3>

    <!-- Completed Todos -->
    <div class="completed-items" v-if="completedTodos.length">
      <div v-for="todo in completedTodos" :key="todo._id">
        <Todo :todo="todo" />
      </div>
    </div>

  </div>
</template>
<style scoped>
.incomplete-items {
  /* max-height: 40vh; */
  overflow-y: scroll;
}

.completed-items {
  /* height: 40vh; */
  overflow-y: scroll;
}

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
