import { defineStore } from 'pinia'
export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    message: null,
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
      console.log(`[message.store messageStore] - fetchMessages`)
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
      console.log(`[message.store messageStore] - addMessage`)
      try {
        message.id = this.id++
        this.messages.push(message)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addReplyToMessage(message, reply) {
      console.log(`[message.store messageStore] - addReplyToMessage`)
      try {
        const foundMessage = this.messages.find((msg) => msg.id == message.id) //Give it an arbitrary id
        reply.id = `${message.id}0${this.id++}` //This is in place to break reactivity
        let replies = [...foundMessage.replies]
        replies.push(reply)
        foundMessage.replies = replies //Add a reply to the reply store
        const replyStore = useReplyStore()
        replyStore.addReply(reply)
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
    }
  }
})
export const useReplyStore = defineStore('reply', {
  state: () => ({
    replies: [],
    loading: false,
    error: null,
    id: 0
  }),
  getters: {
    allReplies() {
      return this.replies
    }
  },
  actions: {
    async fetchReplies() {
      console.log(`[message.store fetchReplies] - fetchReplies`)
      this.replies = []
      this.loading = true
      try {
        return this.replies
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addReply(reply) {
      console.log(`[message.store replyStore] - addReply`)
      try {
        reply.id = this.id++
        console.log('replyid: ', reply.id)
        this.replies.push(reply)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addReplyToReply(source, reply) {
      console.log(`[message.store replyStore] - addReplyToReply`)
      console.log(source)
      console.log(reply)
      const sourceReply = this.replies.find((rep) => rep.id == source.id)
      reply.id = this.id++ //This is in place to break reactivity
      let replies = [...sourceReply.replies]
      replies.push(reply)
      sourceReply.replies = replies //Add a reply to the replies list
      this.replies.push(reply)
    }
  }
})
