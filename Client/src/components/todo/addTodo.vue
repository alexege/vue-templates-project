<script setup>
import { ref } from "vue";
import { useTodoListStore } from "../../stores/todo.store";
const todoStore = useTodoListStore();

const newTodo = ref({
  title: "",
  completed: false,
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
    //   dropZones.value.push({ zoneId: todoList.value.length - 1 })
  }
};
</script>

<template>
  <form @submit.prevent="addItemAndClear(newTodo)" class="add-todo-form">
    <input class="form-input" type="text" v-model="newTodo.title" placeholder="Title" />
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
</style>
