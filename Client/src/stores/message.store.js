import axios from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from './auth.store'

const API_URL = 'http://localhost:8080/api'

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
    }
  },
  actions: {
    async fetchMessages() {
      // console.log(`[message.store messageStore] - fetchMessages`)
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/message/allMessages`)
        this.messages = response.data
      } catch (error) {
        this.error = error
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async addMessage(message) {
      // console.log(`[message.store messageStore] - addMessage`, JSON.stringify(message, null, 2))
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/message/addMessage`, message)
        this.messages.push(response.data)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async deleteMessage(messageId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_URL}/message/deleteMessageById`, messageId)
        this.messages = this.messages.filter((message) => message._id !== messageId)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async addReplyToMessage(message, reply) {
      this.loading = true
      this.error = null
      try {
        const replyResponse = await axios.post(
          `${API_URL}/reply/addReplyToMessage/${message._id}`,
          reply
        )

        console.log(`$$$$$$$$$$$$$$ ${JSON.stringify(replyResponse.data, null, 2)}`)

        const messageResponse = await axios.get(`${API_URL}/message/${message._id}`)
        const messageIndex = this.messages.findIndex((msg) => msg._id === message._id)

        if (messageIndex !== -1) {
          this.messages[messageIndex] = messageResponse.data
        }

        // this.messages = messageResponse.data

        // messageResponse.data.replies.push(replyResponse)
        // console.log('message Response: ', messageResponse.data)

        // const foundReply = replyResponse.data
        // const foundMessage = messageResponse.data

        // console.log(`rep:${JSON.stringify(foundReply, null, 2)}`)
        // console.log(`msg:${JSON.stringify(foundMessage, null, 2)}`)

        // if (replyResponse) {
        //   this.replies.push(foundReply)
        // }

        // if (foundMessage) {
        //   console.log('---------------------msg found --------------------')
        //   this.replies.push(foundReply)
        //   foundMessage.replies.push(foundReply)
        //   console.log('Found Message: ', foundMessage)
        // }
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async addReplyToReply(source, reply) {
      source.replies.push(reply)
    },

    async fetchMessage(id) {
      this.note = null
      this.loading = true
      try {
        this.message = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
          (response) => response.json()
        )
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
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

    async deleteReply(msgId, reply, replyId, depth) {
      if (depth == 0) {
        let message = this.messages.find((message) => message.id === msgId)
        let index = message.replies.findIndex((reply) => reply.id === replyId)
        let replies = [...message.replies]
        replies.splice(index, 1)
        message.replies = replies
      } else {
        console.log('Deleting a reply to a reply')

        reply.replies = reply.replies.filter((reply) => reply.id !== replyId)
      }

      //Need to go in recursively and remove the reply from the parent

      // if (deleted) {
      //   //TODO do something after deleting
      // }

      // this.replies = this.replies.filter((reply) => reply.id !== replyId)
    }
    // async _deleteReply(replyId, replies) {
    //   console.log('replies.length:', replies.length)
    //   for (let i = 0; i < replies.length; i++) {
    //     if (replies[i].id === replyId) {
    //       console.log(`slicing! found ${replies[i].id} == ${replyId}`)
    //       let del = replies.splice(i, 1)
    //       console.log(`ending reply: ${del}`)
    //       return true
    //     } else {
    //       console.log('not found')
    //       if (this._deleteReply(replyId, replies[i].replies)) {
    //         return true
    //       }
    //     }
    //   }
    //   return false
    // }
  }
})
