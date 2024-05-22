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
      return state.todoList;
    }
  },
  actions: {
    async fetchTodos() {
      try {
        await axios.get(`${API_URL}/todo/allTodos`)
        .then((res) => {
          this.todoList = res.data
        })
      } catch (error) {
        console.log("Error: ", error)
      }
    },

    async addTodo(todo) {
      console.log("todo.store.js - ", todo)
      const todoItem = await axios.post(`${API_URL}/todo/addTodo`, todo)
      console.log("response:", todoItem.data)
      await this.todoList.push(todoItem.data)
      
      this.dropZones.push({ todo, zoneId: this.dropZoneIndex++ })
    },
    async deleteTodo(itemId) {
      console.log('Deleting todo: ', itemId)

      await axios.delete(`${API_URL}/todo/${itemId}`)

      .then(() => {
        const todoIndex = this.todoList.findIndex(todo => todo._id === itemId)
        console.log(`todoIndex: ${todoIndex}`)
        if(todoIndex !== -1) {
          this.todoList.splice(todoIndex, 1)
        }
      })
      .catch((error) => {
        console.log("Error: ", error)
      })

      this.todoList = this.todoList.filter((item) => item.id != itemId)
      this.dropZones = this.dropZones.filter((zone) => zone.todo.id != itemId)
    },
    async editTodo(itemId, item) {
      //   this.todoList = this.todoList.filter((item) => item.id != itemId)
      console.log('Attempting to edit todo with id: ', itemId)
      const response = await axios.patch(`${API_URL}/todo/update/${itemId}`, item)
      
      const todoIndex = this.todoList.findIndex(todo => todo._id === itemId)
      this.todoList.splice(todoIndex, 1, item)

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
