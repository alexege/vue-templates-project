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
  author: ""
});

const addItemAndClear = () => {

  let todo = {
    title: newTodo.value.title,
    category: newTodo.value.category,
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
  }
};

//Custom Dropdown
const selectedOption = ref('')
const customValue = ref({
  name: null
})

import { useCategoryStore } from "@/stores/category.store";
const categoryStore = useCategoryStore();

const addACategory = () => {
  if (customValue.value) {
    //Add Category via Category store
    categoryStore.addCategory(customValue.value)
    selectedOption.value = customValue.value.name
  }
}

categoryStore.fetchCategories()

//Retrieve all custom categories
const { allCategories } = storeToRefs(useCategoryStore());


</script>
<template>
  <form @submit.prevent="addItemAndClear(newTodo)" class="add-todo-form">

    <!-- Custom Input / DropDown -->
    <select v-model="selectedOption">
      <option value="" disabled>Category</option>
      <option :value="category.name" v-for="category in allCategories" :key="category">{{ category.name }}</option>
      <option value="custom">Custom</option>
    </select>

    <div v-show="selectedOption === 'custom'" class="add-category">
      <input type="text" v-model="customValue.name">
      <button @click="addACategory">Add</button>
    </div>

    <input class="form-input" type="text" v-model="newTodo.title" placeholder="Title" />
    <select v-model="newTodo.author" placeholder="Author">
      <option value="">None</option>
      <option value="" v-for="author in userStore.users" :key="author._id">
        {{ author.username }}
      </option>
    </select>
    <!-- <input type="checkbox" v-model="newTodo.completed"> -->
    <button>Add</button>
  </form>
</template>

<style scoped>
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
</style>
