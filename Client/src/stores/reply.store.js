import axios from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from './auth.store'

const API_URL = 'http://127.0.0.1:8080/api'

export const useReplyStore = defineStore('reply', {
  state: () => ({
    reply: null,
    replies: [],
    loading: false,
    error: null
  }),
  getters: {
    allReplies() {
      return this.replies
    }
  },
  actions: {
    async fetchReplies() {
      // console.log(`[reply.store replyStore] - fetchReplies`)
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/reply/allReplies`)
        this.replies = response.data
      } catch (error) {
        this.error = error
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async addReply(reply) {
      // console.log(`[reply.store replyStore] - addReply`, JSON.stringify(reply, null, 2))
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/reply/addReply`, reply)
        this.replies.push(response.data)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async deleteReply(replyId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_URL}/reply/deleteReplyById`, replyId)
        this.replies = this.replies.filter((reply) => reply._id !== replyId)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async addReplyToMessage(source, reply) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/reply/addReplyToMessage/${source._id}`, reply)
        console.log('$$$$$$$$$$$$$$response:$$$$$$$$$$$$$$$', response)

        reply.replies.push(reply)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async addReplyToReply(source, reply) {
      console.log('<?><><><><> add reply to reply')
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/reply/addReplyToReply/${source._id}`, reply)

        reply.replies.push(reply)
      } catch (errror) {
        this.error = error
      } finally {
        this.loading = false
      }
      // source.replies.push(reply)
    },

    async fetchReply(id) {
      this.note = null
      this.loading = true
      try {
        this.reply = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
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
        let reply = this.replies.find((reply) => reply.id === msgId)
        let index = reply.replies.findIndex((reply) => reply.id === replyId)
        let replies = [...reply.replies]
        replies.splice(index, 1)
        reply.replies = replies
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
