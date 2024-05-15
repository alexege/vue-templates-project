<script setup>
// https://blog.logrocket.com/rendering-nested-comments-recursive-components-vue/?ref=dailydev
import { ref } from 'vue'
import recursiveMessage from '@/components/message/recursiveMessage.vue'
const messages = ref([
  {
    message: 'First message',
    replies: [
      {
        message: 'sub-message 1 for message 1',
        replies: [
          {
            message: 'sub-sub-message 1',
            replies: [
              {
                message: 'sub-sub-sub-message 1'
              },
              { message: 'sub-sub-sub-message 2' }
            ]
          },
          { message: 'sub-sub-message 2' }
        ]
      },
      { message: 'sub-message 2 for message 1' }
    ]
  },

  {
    message: 'Second message',
    replies: [
      {
        message: 'sub-message 1 for message 2',
        replies: [{ message: 'sub-sub-message 1' }, { message: 'sub-sub-message 2' }]
      },
      { message: 'sub-message 2 for message 2' }
    ]
  }
])

const addMessage = () => {
  messages.value.push(newMessage.value)
}

const newMessage = ref({
  message: 'Message Three',
  replies: []
})
</script>
<template>
  <input type="text" v-model="newMessage" />
  <button @click="addMessage">Add</button>

  <!-- <pre>{{ messages }}</pre> -->
  <ul v-for="(item, index) in messages" :key="index" class="messages">
    <recursiveMessage
      v-bind="{
        message: item.message,
        replies: item.replies
      }"
    />
  </ul>
</template>
<style></style>
