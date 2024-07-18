/*
 *   Keep the Pinia Store for:
 *   - Managing application state, performing API requests, handling data.
 */
import axios from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from './auth.store'
import { findLastChildReply } from '@/helpers/findLastChildReply'
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
      console.log(`----------------Add Message To Reply----------------`)
      console.log(`messageId: ${messageId}`)
      console.log(`reply: ${JSON.stringify(reply)}`)
      this.loading = true
      this.error = null
      try {
        //Creates and links new Reply to Message
        const replyResponse = await axios.post(`${API_URL}/messages/${messageId}/reply`, reply)
        // this.replies.push(replyResponse.data) //Retrieve the newly updated Message

        const message = await axios.get(`${API_URL}/messages/${messageId}`)
        const messageIndex = this.messages.findIndex((msg) => msg._id === messageId) //Replace the existing one with the new one

        if (messageIndex !== -1) {
          this.messages[messageIndex] = message.data
        }
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addReplyToReply(sourceId, replyId, reply) {
      console.log(`----------------Add Reply To Reply----------------`)
      console.log(`sourceId: ${sourceId}`)
      console.log(`replyId: ${replyId}`)
      // console.log(`reply: ${JSON.stringify(reply)}`)

      this.loading = true
      this.error = null
      try {
        //Controller Logic
        const response = await axios.post(`${API_URL}/replies/${replyId}/reply`, reply)
        const newReply = response.data
        console.log(`new reply is: ${JSON.stringify(newReply, null, 2)}`)

        //Pinia Logic

        //Find the current reply

        //Find the base Message
        const message = this.messages.find((message) => message._id === sourceId)
        console.log('message:', message)

        //Find the current Reply in the Message's replies list
        const currentReply = findLastChildReply(this.messages, replyId)
        console.log('child:', currentReply)

        // console.log('finall is: ', newReply)

        currentReply.replies.push(newReply)

        //Add the newReply to its replies
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    // async addReplyToReply(replyId, reply) {
    //   console.log(`replyId:${replyId}`)
    //   console.log(`reply:${JSON.stringify(reply)}`)
    //   this.loading = true
    //   this.error = null
    //   try {
    //     //Post new reply to server
    //     const response = await axios.post(`${API_URL}/replies/${replyId}/reply`, reply) //Add new Reply to Reply list
    //     const newReply = response.data
    //     console.log('newReply:', newReply)

    //     // Find the parent reply and update its replies list
    //     const updateReplies = (replies, replyId, newReply) => {
    //       for (let i = 0; i < replies.length; i++) {
    //         if (replies[i]._id === replyId) {
    //           replies[i].replies.push(newReply)
    //           return true
    //         } else if (replies[i].replies.length > 0) {
    //           const updated = updateReplies(replies[i].replies, replyId, newReply)
    //           if (updated) return true
    //         }
    //       }
    //       return false
    //     }
    //     updateReplies(this.replies, replyId, newReply)

    //     const updateMessageReplies = (messages, replyId, newReply) => {
    //       for (let i = 0; i < messages.length; i++) {
    //         const updated = updateReplies(messages[i].replies, replyId, newReply)
    //         if (updated) return true
    //       }
    //       return false
    //     }

    //     updateMessageReplies(this.messages, replyId, newReply)
    //   } catch (error) {
    //     this.error = error
    //   } finally {
    //     this.loading = false
    //   }
    // },
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

    // async deleteReplyById(messageId, replyId) {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     await axios.delete(`${API_URL}/replies/${replyId}`)
    //     const message = this.messages.find((msg) => msg._id === messageId)
    //     if (message) {
    //       message.replies = message.replies.filter((reply) => reply._id !== replyId)
    //     }

    //     this.replies = this.replies.filter((reply) => reply._id !== replyId)
    //   } catch (error) {
    //     this.error = error
    //   } finally {
    //     this.loading = false
    //   }
    // }

    // async deleteReply(msgId, reply, replyId, depth) {
    //   if (depth == 0) {
    //     let message = this.messages.find((message) => message.id === msgId)
    //     let index = message.replies.findIndex((reply) => reply.id === replyId)
    //     let replies = [...message.replies]
    //     replies.splice(index, 1)
    //     message.replies = replies
    //   } else {
    //     console.log('Deleting a reply to a reply')
    //     reply.replies = reply.replies.filter((reply) => reply.id !== replyId)
    //   }
    //   //Need to go in recursively and remove the reply from the parent
    //   // if (deleted) {
    //   //   //TODO do something after deleting
    //   // }
    //   // this.replies = this.replies.filter((reply) => reply.id !== replyId)
    // }
    // async _deleteReply(replyId, replies) {
    //   console.log('replies.length:', replies.length)
    //   for (let i = 0; i < replies.length; i++) {
    //     if (replies[i].id === replyId) {
    //       console.log(`slicing! found ${replies[i].id} == ${replyId}`)
    //       let del = replies.splice(i, 1)
    //       console.log(`ending reply: ${del}`)
    //       return true
    //     } else {
    //       console.log('not found')
    //       if (this._deleteReply(replyId, replies[i].replies)) {
    //         return true
    //       }
    //     }
    //   }
    //   return false
    // }
  }
})
