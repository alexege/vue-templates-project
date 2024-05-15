import { defineStore } from 'pinia'

export const useTodoListStore = defineStore('todoList', {
  state: () => ({
    todoList: [],
    dropZones: [],
    todoIndex: 0,
    dropZoneIndex: 0
  }),
  getters: {},
  actions: {
    addTodo(title) {
      let todo = { id: this.todoIndex, title, completed: false, zone: this.todoIndex++ }
      this.todoList.push(todo)
      this.dropZones.push({ todo, zoneId: this.dropZoneIndex++ })
    },
    deleteTodo(itemId) {
      console.log('Deleting todo: ', itemId)
      this.todoList = this.todoList.filter((item) => item.id != itemId)
      this.dropZones = this.dropZones.filter((zone) => zone.todo.id != itemId)
    },
    editTodo(itemId) {
      //   this.todoList = this.todoList.filter((item) => item.id != itemId)
      console.log('Attempting to edit todo with id: ', itemId)
    },
    toggleCompleted(itemId) {
      console.log('toggling for : ', itemId)
      const todo = this.todoList.find((todo) => todo.id === itemId)
      if (todo) {
        todo.completed = !todo.completed
      }
    }
  }
})
