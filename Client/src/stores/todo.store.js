import { defineStore } from 'pinia'
import axios from "axios"
const API_URL = 'http://localhost:8080/api'

export const useTodoListStore = defineStore('todoList', {
  state: () => ({
    todoList: [],
    dropZones: [],
    todoIndex: 0,
    dropZoneIndex: 0
  }),
  getters: {
    allTodos: (state) => {
      return state.todos;
    }
  },
  actions: {
    async fetchTodos() {
      try {
        await axios.get(`${API_URL}/todo/allTodos`)
        .then((res) => {
          this.todos = res.data
        })
      } catch (error) {
        console.log("Error: ", error)
      }
    },

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
