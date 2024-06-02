// User store is used to keep track of all the users in the database and not just one particular user

import { defineStore } from 'pinia'

import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/users`

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    users: []
  }),
  actions: {
    async getAll() {
      console.log('getting all users from user.store.js')
      this.users = { loading: true }
      axios
        .get(API_URL + '/allUsers')
        .then((users) => (this.users = users.data))
        .catch((error) => (this.users = { error }))
    },

    async deleteUser(userId) {
      console.log('Deleting user with id: ', userId)

      await axios
        .delete(`${API_URL}/${userId}`)

        .then(() => {
          const user_index = this.users.findIndex((user) => user._id === userId)
          if (user_index !== -1) {
            this.users.splice(user_index, 1)
          }
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
    }
  }
})
