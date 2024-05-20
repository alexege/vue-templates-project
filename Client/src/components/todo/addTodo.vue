<script setup>
    import { ref } from 'vue'
    import { useTodoListStore } from "../../stores/todo.store"
    const todoStore = useTodoListStore()

    const todo = ref()
    
    const addItemAndClear = (item) => {
        if (item.length === 0) return
        todoStore.addTodo(item)
        todo.value = ''
        //   dropZones.value.push({ zoneId: todoList.value.length - 1 })
    }
</script>


<template>
    <div>
        <form @submit.prevent="addItemAndClear(todo)" class="add-todo-form">
            <input v-model="todo" type="text" /><button>Add</button>
        </form>
    </div>
</template>