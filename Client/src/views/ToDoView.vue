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

// Categories
import { useCategoryStore } from "@/stores/category.store";
const categoryStore = useCategoryStore();
categoryStore.fetchCategories()

//Retrieve all custom categories
const { allCategories } = storeToRefs(useCategoryStore());


// Permission to interact / edit content
import { useAuthStore } from "@/stores/auth.store";
const { activeUser } = storeToRefs(useAuthStore())
const permissionToManage = (category) => {

  // Admin, Moderator, Author/Owner

  if (activeUser.value) {

    // Content Owner
    if (category.author && activeUser.value.id === category.author._id) {
      //Has full access, as is owner
    } else if (activeUser.value.roles.includes("ROLE_ADMIN")) {
      //Has full access, as is admin
    } else if (activeUser.value.roles.includes("ROLE_MODERATOR")) {
      //Has full access, as is moderator
    } else {
      return false
    }
    return true
  }
}

</script>
<template>
  <div class="todo-container">
    <h2>Add a new Todo Item</h2>

    <!-- Add Todo List Item Form -->
    <AddTodo />

    <!-- All Categories -->
    <div class="category-list">
      <div v-for="category in allCategories" :key="category" class="category">
        <a :href="`/todo/${category.name}`">
          <span>{{ category.name }}</span>

          <!-- TODO: Add author association to category creation and use it to conditionally render delete -->
          <button v-if="permissionToManage(category)">X</button>
        </a>
      </div>
    </div>


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
  /* padding: 1em; */
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
  width: 75%;
}

.todo-container form input {
  flex: 1;
}

/* Categories */
.category-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: .5em;
  padding: 1em;
}

.category {
  background-color: #EEF;
  border-radius: 3px;
  border: 1px #CCF solid;
  padding: 2px 5px;
  display: inline;
  font-size: .75em;
  cursor: pointer;
}

.category a {
  text-decoration: none;
  color: black;
  font-weight: bold;
}
</style>
