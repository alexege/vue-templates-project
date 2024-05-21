<script setup>
    import { ref } from 'vue'
    import { useTodoListStore } from "../../stores/todo.store"
    const todoStore = useTodoListStore()

    const newTodo = ref({
        title: '',
    })
    
    const addItemAndClear = () => {
        let todo = {
            title: newTodo.value.title,
            category: newTodo.value.category,
            priority: newTodo.value.priority,
            completed: newTodo.value.completed,
            author: newTodo.value.author
        }
        
        //Add new Todo to Pinia
        todoStore.addTodo(todo)

        //Reset properties to their starting values
        newTodo.value.title = ''
        newTodo.value.completed = false
        //   dropZones.value.push({ zoneId: todoList.value.length - 1 })
    }
</script>


<template>
    <div>
        {{ newTodo }}
        <form @submit.prevent="addItemAndClear(newTodo)" class="add-todo-form">
            <input type="text" v-model="newTodo.title" />
            <input type="checkbox" v-model="newTodo.completed">
            <button>Add</button>
        </form>
    </div>
</template>