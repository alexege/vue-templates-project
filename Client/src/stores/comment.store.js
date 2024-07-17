import axios from 'axios'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:8080/api'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [],
    loading: false,
    error: null
  }),
  getters: {
    allComments() {
      return this.comments
    }
  },
  actions: {
    async createComment(comment) {
      this.loading = true
      this.error = null
      try {
        console.log(`creatingComment: ${JSON.stringify(comment)}`)

        const response = await axios.post(`${API_URL}/comments`, comment)

        this.comments.push(response.data)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async getAllComments(comment) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/comments`)
        this.comments = response.data
        return [...this.comments]
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async getCommentById(commentId) {
      this.loading = true
      this.error = null
      try {
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async deleteCommentById(commentId) {
      this.loading = true
      this.error = null
      try {
        //Controller Logic
        await axios.delete(`${API_URL}/comments/${commentId}`)

        //Pinia Logic to delete Comment
        this.comments = this.comments.filter((comment) => comment._id !== commentId)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async updateCommentById(commentId, updateData) {
      this.loading = true
      this.error = null
      try {
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addCommentToComment(commentId, comment) {
      this.loading = true
      this.error = null
      try {
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})
