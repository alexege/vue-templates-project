import { defineStore } from 'pinia'
import axios from 'axios'
const API_URL = 'http://127.0.0.1:8080/api'

import { useUsersStore } from '@/stores/user.store'
import { useAuthStore } from '@/stores/auth.store'
import { useCategoryStore } from './category.store'

export const useTodoListStore = defineStore('todoList', {
  state: () => ({
    todoList: [],
    todoIndex: 0
  }),
  getters: {
    allTodos: (state) => {
      return state.todoList
    },
    completedTodos: (state) => {
      return state.todoList.filter((todo) => todo.completed).reverse()
    },
    incompleteTodos: (state) => {
      return state.todoList.filter((todo) => !todo.completed).reverse()
    },
    myTodos: (state) => {
      console.log(state.todoList[0].author._id)
      console.log(useAuthStore.user)
      // return state.todoList.filter((todo) => todo.author._id == )
      return
    },
    getTodosByCategory: (state) => (category) => {
      // return state.todoList.filter((todo) => todo.categories.some((cat) => cat.name == category))
      return state.todoList
        .filter((todo) => !todo.completed)
        .filter((todo) => todo.categories.some((cat) => cat.name == category))
      // todo.categories.some((cat) => cat.name == category))
    },
    getCompleteTodosByCategory: (state) => (category) => {
      if (category == 'All') return state.todoList.filter((todo) => todo.completed)
      return state.todoList
        .filter((todo) => todo.completed)
        .filter((todo) => todo.categories.some((cat) => cat.name == category))
    },
    getInCompleteTodosByCategory: (state) => (category) => {
      if (category == 'All') return state.todoList.filter((todo) => !todo.completed)
      return state.todoList
        .filter((todo) => !todo.completed)
        .filter((todo) => todo.categories.some((cat) => cat.name == category))
    }
  },
  actions: {
    async fetchTodos() {
      try {
        await axios.get(`${API_URL}/todo`).then((res) => {
          this.todoList = res.data
        })
      } catch (error) {
        console.log('Error: ', error)
      }
    },

    // async fetchCategoryTodos(category) {
    //   try {
    //     await axios.get(`${API_URL}/todo/category/${category}`).then((res) => {
    //       this.todoList = res.data
    //     })
    //   } catch (error) {
    //     console.log('Error: ', error)
    //   }
    // },

    async addTodo(todo) {
      const author = useUsersStore().users.find((user) => user._id == todo.author)
      console.log('author:', author.username)

      var todoItem = await axios.post(`${API_URL}/todo`, todo)

      //Newly created todo will have author as an ID reference.
      //For the sake of functionality, we will add in the user object using the id
      if (author) {
        // todoItem.data.author = { username: author.username }
        todoItem.data.author = author
      }

      const category = useCategoryStore().categories.find(
        (category) => category.name == todo.category
      )

      if (category) {
        todoItem.data.categories.push(category)
      }

      console.log('response:', todoItem.data)
      await this.todoList.push(todoItem.data)
    },
    async deleteTodo(itemId) {
      console.log('Deleting todo: ', itemId)

      await axios
        .delete(`${API_URL}/todo/${itemId}`)

        .then(() => {
          const todoIndex = this.todoList.findIndex((todo) => todo._id === itemId)
          console.log(`todoIndex: ${todoIndex}`)
          if (todoIndex !== -1) {
            this.todoList.splice(todoIndex, 1)
          }
        })
        .catch((error) => {
          console.log('Error: ', error)
        })

      this.todoList = this.todoList.filter((item) => item.id != itemId)
    },
    async editTodo(itemId, item) {
      //   this.todoList = this.todoList.filter((item) => item.id != itemId)
      console.log('Attempting to edit todo with id: ', itemId)
      await axios.patch(`${API_URL}/todo/${itemId}`, item)

      const todoIndex = this.todoList.findIndex((todo) => todo._id === itemId)
      this.todoList.splice(todoIndex, 1, item)
    },
    async toggleCompleted(item) {
      const updateData = item
      updateData.completed = !updateData.completed

      await axios.patch(`${API_URL}/todo/${item._id}`, updateData)

      const todo = this.todoList.find((todo) => todo.id === item._id)
      if (todo) {
        todo.completed = !todo.completed
      }
    }
  }
})
