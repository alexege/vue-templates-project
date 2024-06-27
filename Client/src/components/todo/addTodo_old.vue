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
    category: []
});

const addItemAndClear = () => {

    let categories = [];
    // if (customValue.value && customValue.value.name) {
    //   categories.push(customValue.value.name)
    // }
    if (selectedOption.value) {
        categories.push(selectedOption.value)
    }

    let todo = {
        title: newTodo.value.title,
        category: categories,
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

</script>
<template>
    <form @submit.prevent="addItemAndClear(newTodo)" class="add-todo-form">

        <!-- Custom Input / DropDown -->
        <!-- <select v-model="selectedOption">
      <option value="" disabled>Category</option>
      <option vale="">None</option>
      <option :value="category.name" v-for="category in allCategories" :key="category">{{ category.name }}</option>
      <option value="custom">Custom</option>
    </select> -->

        <div v-show="selectedOption === 'custom'" class="add-category">
            <input type="text" v-model="customValue.name">
            <button @click.stop="addACategory">Add</button>
        </div>

        <input class="form-input" type="text" v-model="newTodo.title" placeholder="Title" />

        <br />



        <!-- <select v-model="newTodo.author" placeholder="Author">
      <option value="">None</option>
      <option value="" v-for="author in userStore.users" :key="author._id">
        {{ author.username }}
      </option>
    </select> -->
        <!-- <input type="checkbox" v-model="newTodo.completed"> -->
        <button :disabled="newTodo.title == ''">Add</button>
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
