<script setup>
// https://blog.logrocket.com/rendering-nested-comments-recursive-components-vue/?ref=dailydev
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import recursiveMessage from '@/components/message/recursiveMessage.vue'
import { useMessageStore } from '@/stores/message.store'

const messageStore = useMessageStore()
messageStore.fetchMessages()
const { allMessages } = storeToRefs(useMessageStore())

const newMessage = ref({
  message: '',
  replies: [],
  depth: 0
})

const addMessage = () => {
  const data = {
    message: newMessage.value.message,
    replies: newMessage.value.replies,
    depth: newMessage.value.depth
  }
  messageStore.addMessage(data)
  newMessage.value.message = ''
}

const messageReply = ref({
  message: '',
  replies: [],
  depth: 0
})

const addReply_ToMessage = (message) => {
  console.log(`Adding reply to message: ${JSON.stringify(message)}`)
  const reply = {
    message: messageReply.value.message,
    replies: messageReply.value.replies,
    depth: messageReply.value.depth
  }
  console.log(`message reply: ${JSON.stringify(reply)}`)
  messageStore.addReplyToMessage(message, reply)
  messageReply.value.message = ''
}

</script>
<template>
  <div class="message-container">

    <div class="add-message">
      <input type="text" v-model="newMessage.message" @keydown.enter="addMessage" placeholder="Add Message" />
      <button @click="addMessage">Add</button>
    </div>

    <ul v-for="(message, index) in allMessages" :key="index" class="messages">

      <recursiveMessage v-bind="{
        message: message,
        replies: message.replies
      }" :depth="0" />

      <div class="add-reply">
        <input type="text" v-model="messageReply.message" placeholder="Add Reply to Message"
          @keydown.enter="addReply_ToMessage(message)" />
        <button @click="addReply_ToMessage(message)">Add</button>
      </div>

    </ul>
  </div>
</template>
<style scoped>
.message-container {
  display: grid;
  width: 80%;
  margin: 0 auto;
}

.messages {
  border-right: 1px solid black;
}

.add-message {
  display: flex;
  min-height: 30px;
  padding: 1em;
}

.message-container input {
  flex: 4;
}

.message-container button {
  flex: 1;
}
</style>