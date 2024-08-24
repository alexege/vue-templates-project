<script setup>
import Todo from "@/components/todo/todo.vue";
import AddTodo from "@/components/todo/addTodo.vue";
import { storeToRefs } from "pinia";
import { ref, computed, watch } from "vue";
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


//Delete Category
const deleteCategory = (id) => {
  categoryStore.deleteCategory(id)
}

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

//Get params value
import { useRoute } from "vue-router";
const route = useRoute();
const category = ref(route.params.category);
const filteredTodos = computed(() => todoStore.getTodosByCategory(category.value))

watch(() => route.params.category, (newCategory) => {
  category.value = newCategory
})

// if (Object.keys(route.params).length === 0) {
//   todoFilter = 
// }

// if (route.params === undefined) {
//   console.log("Undefined");
// } else {
//   console.log("category is: ", route.params.category)
// }

// const { getCompleteTodosByCategory } = storeToRefs(useTodoListStore());

const filteredTodosComplete = computed(() => {
  if (category.value) {
    return todoStore.getCompleteTodosByCategory(category.value)
  } else {
    return todoStore.completedTodos
  }
})

const filteredTodosIncomplete = computed(() => {
  if (category.value) {
    return todoStore.getInCompleteTodosByCategory(category.value)
  } else {
    return todoStore.incompleteTodos
  }
})

// Category Filtering
const activeCategoryFilter = ref('All')

const activeCategory = (cat) => {
  activeCategoryFilter.value = cat
  category.value = cat
  console.log("active category: ", cat)
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
        <template v-if="category.name == 'All'">
          <a @click.prevent="activeCategory('All')">All</a>
          <!-- <a href="/todo/">All</a> -->
        </template>
        <template v-else>
          <!-- <a :href="`/todo/category/${category.name}`"> -->
          <a @click.prevent="activeCategory(category.name)">
            <span>{{ category.name }}</span>
            <span v-if="permissionToManage(category)" @click.prevent="deleteCategory(category._id)">
              <i class="bx bx-x"></i>

            </span>
          </a>
        </template>
      </div>
    </div>


    <!-- <div v-for="todo in todoList" :key="todo._id">
      <Todo :todo="todo" />
    </div> -->

    <h3 v-if="filteredTodosIncomplete.length > 0">Pending ({{ filteredTodosIncomplete.length }})</h3>

    <!-- Incomplete Todos -->

    <ul class="todo-headers">
      <li>Completion</li>
      <li>Category</li>
      <li>Priority</li>
      <li>Content</li>
      <li>Author</li>
      <li>Actions</li>
    </ul>
    <div class="incomplete-items" v-if="filteredTodosIncomplete.length">
      <div v-for="todo in filteredTodosIncomplete" :key="todo._id">
        <Todo :todo="todo" @category="activeCategory" />
      </div>
    </div>

    <br>

    <h3 v-if="filteredTodosComplete.length > 0">Completed ({{ filteredTodosComplete.length }})</h3>

    <!-- Completed Todos -->
    <div class="completed-items" v-if="filteredTodosComplete.length">
      <div v-for="todo in filteredTodosComplete" :key="todo._id">
        <Todo :todo="todo" @category="activeCategory" />
      </div>
    </div>

  </div>
</template>
<style scoped>
.todo-headers {
  max-width: 80%;

  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-content: space-between;
  padding: 0.5em;
  border-bottom: 1px solid white;
}

.todo-headers li {
  list-style: none;
}

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
  color: white;
  height: 100%;
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
  /* background-color: #EEF; */
  border-radius: 20px;
  border: 1px #CCF solid;
  /* padding: 2px 5px; */
  padding: 8px 12px;
  /* display: inline; */
  display: flex;
  justify-content: center;
  font-size: .75em;
  cursor: pointer;
  min-width: 30px;
  font-family: "Trip Sans VF","Trip Sans",Arial,sans-serif;
}

.category:hover {
  outline: 1px solid lime;
}

.category a {
  min-height: 20px;
  text-decoration: none;
  /* color: black; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

i {
  padding: .10em .25em;
  font-size: 20px;
  cursor: pointer;

  display: flex;
  justify-content: center;
}

i:hover {
  color: red;
}
</style>
