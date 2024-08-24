<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTodoListStore } from "@/stores/todo.store";
import { useUsersStore } from "@/stores/user.store";
const todoStore = useTodoListStore();
const userStore = useUsersStore();

userStore.getAll()

const newTodo = ref({
  title: "",
  completed: false,
  author: "",
  category: [],
  priority: "low",
});

const addItemAndClear = () => {

  let categories = [];
  // if (customValue.value && customValue.value.name) {
  //   categories.push(customValue.value.name)
  // }
  // if (selectedOption.value) {
  //   categories.push(selectedOption.value)
  // }

  todoCategories.value.forEach((item) => categories.push(item))

  let todo = {
    title: newTodo.value.title,
    categories: categories,
    priority: newTodo.value.priority,
    completed: newTodo.value.completed,
    author: JSON.parse(localStorage.getItem('user')).id || newTodo.value.author,
  };

  if (newTodo.value.title) {
    //Add new Todo to Pinia
    todoStore.addTodo(todo);

    //Reset properties to their starting values
    newTodo.value.title = "";
    newTodo.value.completed = false;

    selectedOption.value = null
    todoCategories.value = []

    //TODO: Add id of the selected Category to the Todo Object
    // newTodo.value.category = customValue.value._id
  }
};

//Custom Dropdown
const selectedOption = ref('')
const customValue = ref({
  name: null,
  author: JSON.parse(localStorage.getItem('user')).id || newTodo.value.author
})

import { useCategoryStore } from "@/stores/category.store";
import { useAuthStore } from "@/stores/auth.store";
const categoryStore = useCategoryStore();

const addACategory = async () => {
  if (customValue.value) {

    addTodoCategory()

    //Add Category via Category store
    let newCategory = await categoryStore.addCategory(customValue.value)
    console.log("newCat:", newCategory);
    selectedOption.value = customValue.value.name
  }

  customValue.value.name = ''
}

categoryStore.fetchCategories()

//Retrieve all custom categories
const { allCategories } = storeToRefs(useCategoryStore());

const todoCategories = ref([])

const addTodoCategory = () => {

  if (!todoCategories.value.includes(selectedOption.value)) {


    if (selectedOption.value !== "custom" && selectedOption.value !== "All" && selectedOption.value !== "None") {
      todoCategories.value.push(selectedOption.value)
    }

    if (customValue.value.name) {
      todoCategories.value.push(customValue.value.name)
    }

    // if (customValue.value.name !== null) {
    //   todoCategories.value.push(customValue.value)
    // }
  }
}

const removeCategory = (category) => {
  let idxOfCat = todoCategories.value.indexOf(category)
  todoCategories.value.splice(idxOfCat, 1);
}


// Permission to interact / edit content
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
  <form @submit.prevent="addItemAndClear(newTodo)" class="add-todo-form">

    <!-- Custom Input / DropDown -->
    <div class="top">
      <input class="form-input" type="text" v-model="newTodo.title" placeholder="Title" />

      <select name="priority" id="priority" v-model="newTodo.priority">
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <!-- <select v-model="newTodo.author" placeholder="Author">
        <option value="">None</option>
        <option value="" v-for="author in userStore.users" :key="author._id">
          {{ author.username }}
        </option>
      </select> -->
      <!-- <input type="checkbox" v-model="newTodo.completed"> -->
      <button :disabled="newTodo.title == ''">Add</button>
    </div>

    <div class="bottom">
      <select v-model="selectedOption" @change="addTodoCategory">
        <option value="" disabled>Category</option>
        <option vale="">None</option>
        <option :value="category.name" v-for="category in allCategories" :key="category">{{ category.name }}</option>
        <option value="custom">Custom</option>
      </select>

      <div v-show="selectedOption === 'custom'" class="add-category">
        <input type="text" v-model="customValue.name">
        <button @click.prevent="addACategory">Add</button>
      </div>

      <div class="category-list">
        <div class="category" v-for="category in todoCategories" :key="category._id">
          <a>
            <span>{{ category }}</span>
            <span v-if="permissionToManage(category)" @click.prevent="removeCategory(category)">
              <i class='bx bx-x'></i>
            </span>
          </a>
        </div>
      </div>

    </div>


  </form>
</template>

<style scoped>
.add-todo-form {
  display: flex;
  flex-direction: column;
}

.top {
  display: flex;
  flex-direction: row;
}

.bottom {
  display: flex;
  flex-direction: row;
}

form {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}

.form-input {
  width: 100%;
  min-height: 20px;
}

.add-category {
  display: flex;
  flex-direction: row;
}


/* Categories */
.category-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: .25em;
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
  /* font-size: .75em; */
  font-size: 1em;
  cursor: pointer;
  min-width: 30px;
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
  font-family: "Trip Sans VF","Trip Sans",Arial,sans-serif;
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
