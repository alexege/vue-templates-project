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
        // console.log(`creatingComment: ${JSON.stringify(comment)}`)

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

    async addCommentToComment(sourceId, commentId, comment) {
      console.log(`adding comment to commentId: ${sourceId}`)
      console.log(`adding comment to commentId: ${commentId}`)
      console.log(`adding comment to commentId: comment: ${JSON.stringify(comment)}`)
      this.loading = true
      this.error = null
      try {
        //Controller Logic
        const response = await axios.post(`${API_URL}/comments/${commentId}/comment`, comment)
        const newComment = response.data

        //Pinia Logic

        //Option 1:
        // const sourceComment = this.comments.find((comment) => comment._id == sourceId)
        const resp = await axios.get(`${API_URL}/comments/${sourceId}`)
        const sourceComment = resp.data
        console.log('sourceComment:', sourceComment)

        // this.comments.find((comment) => comment._id == sourceId)

        function findParent(sourceComment) {
          for (const comment in sourceComment.comments) {
            if (comment.comments && comment.comments.length > 0) {
              for (let i = 0; i < comment.comments.length; i++) {
                console.log('log:', comment.comments[i])
                comment.comments[i] = findParent(comment.comments[i])
              }
            } else {
              return comment
            }
          }
        }

        const found = findParent(sourceComment)
        console.log('found:', found)

        const parentComment = this.comments.find((com) => com._id === commentId)
        console.log('found parent comment: ', JSON.stringify(parentComment))
        if (parentComment) {
          comment._id = newComment._id
          parentComment.comments.push(comment)
        }
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})
