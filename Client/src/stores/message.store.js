import { defineStore } from 'pinia'
export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    message: null,
    replies: [],
    loading: false,
    error: null,
    id: 0
  }),
  getters: {
    allMessages() {
      return this.messages
    }
  },
  actions: {
    async fetchMessages() {
      // console.log(`[message.store messageStore] - fetchMessages`)
      this.messages = []
      this.loading = true
      try {
        return this.messages
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async addMessage(message) {
      // console.log(`[message.store messageStore] - addMessage`, JSON.stringify(message, null, 2))
      try {
        message.id = this.id++
        this.messages.push(message)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async deleteMessage(messageId) {
      const foundMessageIdx = this.messages.findIndex((msg) => msg.id === messageId)
      this.messages.splice(foundMessageIdx, 1)

      //Delete all replies that are linked to the parent message
      this.replies = [...this.replies.filter((reply) => reply.messageId !== messageId)]
    },

    async addReplyToMessage(message, reply) {
      // console.log(`message: ${JSON.stringify(message, null, 2)}`)
      // console.log(`reply: ${JSON.stringify(reply, null, 2)}`)
      // console.log(`[message.store messageStore] - addReplyToMessage`)
      try {
        reply.id = Date.now().toString().slice(-5)
        message.replies.push(reply)
        // console.log(`$###$${JSON.stringify(message.replies, null, 1)}`)

        // const foundMessage = this.messages.find((msg) => msg.id == message.id)
        //Give it an arbitrary id

        // reply.id = `${message.id}0${this.id++}` //This is in place to break reactivity
        // reply.id = Date.now().toString().slice(-5)
        // reply.messageId = message.id
        // let reps = [...foundMessage.replies]
        // console.log('replies:', JSON.stringify(reps, null, 2))
        // reps.push(reply)
        // console.log('replies:', JSON.stringify(reps, null, 2))
        // foundMessage.replies = reps
        // console.log('replies:', JSON.stringify(foundMessage.replies, null, 2))

        //Add a reply to the reply store
        // const replyStore = useReplyStore()
        // replyStore.addReply(reply)

        // this.replies.push(reply)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
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

    async addReplyToReply(source, reply) {
      console.log(`source: ${JSON.stringify(source, null, 2)}`)
      console.log(`reply: ${JSON.stringify(reply, null, 2)}`)
      source.replies.push(reply)
      // this.replies.push(reply)
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
      console.log(`msgId: ${msgId}`)
      console.log(`reply: ${JSON.stringify(reply, null, 2)}`)
      console.log(`replyId: ${replyId}`)
      console.log(`depth: ${depth}`)

      if (depth == 0) {
        let message = this.messages.find((message) => message.id === msgId)
        let index = message.replies.findIndex((reply) => reply.id === replyId)
        let replies = [...message.replies]
        replies.splice(index, 1)
        message.replies = replies
      } else {
        console.log('Deleting a reply to a reply')

        reply.replies = reply.replies.filter((reply) => reply.id !== replyId)

        // let replies = [...reply.replies]

        // let idx = replies.findIndex((rep) => rep.id === reply.id)
        // replies.splice(idx, 1)
        // reply.replies = replies

        // let reply = this.replies.find((reply) => reply.id === replyId)

        // this.replies = [...this.replies.filter((reply) => reply.id !== replyId)]

        // let index = this.replies.findIndex((reply) => reply.id === replyId)
        // this.replies.splice(index, 1)
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
