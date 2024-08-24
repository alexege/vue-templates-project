/*
 *   Keep the Pinia Store for:
 *   - Managing application state, performing API requests, handling data.
 */
import axios from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from './auth.store'
const API_URL = 'http://127.0.0.1:8080/api'
export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    message: null,
    replies: [],
    loading: false,
    error: null
  }),
  getters: {
    allMessages() {
      return this.messages
    },
    allReplies() {
      return this.replies
    }
  },
  actions: {
    async createMessage(message) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/messages`, message)
        this.messages.push(response.data)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async getAllMessages() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/messages`)
        this.messages = response.data
      } catch (error) {
        this.error = error
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async getAllReplies() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/replies`)
        this.replies = response.data
      } catch (error) {
        this.error = error
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async getMessageById(messageId) {
      this.note = null
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/messages/${messageId}`)
        this.message = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async deleteMessageById(messageId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_URL}/messages/${messageId}`)
        this.messages = this.messages.filter((message) => message._id !== messageId)

        //Delete all Reply Objects associated with the Parent Message
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async updateMessageById(messageId, updateData) {
      this.loading = true
      this.error = null
      try {
        await axios.put(`${API_URL}/messages/${messageId}`, updateData)
        const index = this.messages.findIndex((msg) => msg._id === messageId)
        if (index !== -1) {
          this.messages[index] = updateData
        }
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addReplyToMessage(messageId, reply) {
      this.loading = true
      this.error = null
      try {
        //Creates and links new Reply to Message
        const response = await axios.post(`${API_URL}/messages/${messageId}/reply`, reply)
        const newReply = response.data

        //TODO: Update this function to somehow incorporate populating the author
        //This may require going into the controller too

        const message = await axios.get(`${API_URL}/messages/${messageId}`)
        const messageIndex = this.messages.findIndex((msg) => msg._id === messageId) //Replace the existing one with the new one

        if (messageIndex !== -1) {
          this.messages[messageIndex] = message.data
        }

        // const msg = this.messages.find((msg) => msg._id === message._id)
        // msg.replies.push(newReply)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addReplyToReply(sourceId, replyId, reply) {
      this.loading = true
      this.error = null
      try {
        //Controller Logic
        const response = await axios.post(`${API_URL}/replies/${replyId}/reply`, reply)
        const newReply = response.data

        //Pinia Logic
        //Find the base Message
        const message = this.messages.find((message) => message._id === sourceId)

        //Find the current Reply in the Message's replies list
        const currentReply = this.findLastChildReply(this.messages, replyId)

        //Add the newReply to its replies
        currentReply.replies.push(newReply)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    findLastChildReply(messages, replyId) {
      for (let message of messages) {
        if (message._id === replyId) {
          return message
        }
        if (message.replies && message.replies.length > 0) {
          let found = this.findLastChildReply(message.replies, replyId)
          if (found) {
            return found
          }
        }
      }
      return null
    },

    async findReplyToDelete(replyId, replies) {
      for (let i = 0; i < replies.length; i++) {
        if (replies[i].id === replyId) {
          return replies[i]
        } else {
          const nestedReply = this.findReplyToDelete(replyId, replies[i].replies)
          if (nestedReply) {
            return nestedReply
          }
        }
      }
      return null
    },

    async deleteReplyById(messageId, replyId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_URL}/replies/${replyId}`)

        // Recursive function to delete nested replies
        const deleteNestedReplies = (replies, replyId) => {
          return replies.filter((reply) => {
            if (reply.replies.length > 0) {
              reply.replies = deleteNestedReplies(reply.replies, replyId)
            }
            return reply._id !== replyId
          })
        }

        const message = this.messages.find((msg) => msg._id === messageId)
        if (message) {
          message.replies = deleteNestedReplies(message.replies, replyId)
        }

        this.replies = deleteNestedReplies(this.replies, replyId)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})
