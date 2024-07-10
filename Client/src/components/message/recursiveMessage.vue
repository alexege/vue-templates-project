<script setup>
const props = defineProps(['replies', 'message', 'depth'])
import { ref } from 'vue'

const replyData = ref({
  message: '',
  replies: [],
  depth: props.depth
})
import { useReplyStore } from '@/stores/message.store'

const replyStore = useReplyStore()

const addReply_ToReply = (item) => {
  const reply = {
    message: replyData.value.message,
    replies: replyData.value.replies,
    depth: props.depth
  }
  replyStore.addReplyToReply(item, reply)
  replyData.value.message = ''
}
</script>
<template>
  <li class="message">
    {{ props.message.message }}
    <ul class="replies" v-if="props.replies && props.replies.length">
      <div v-for="(message, index) in props.message.replies" :key="index">
        <recursive-message v-bind="{
          message: message,
          replies: message.replies
        }" :depth="props.depth + 1" />

        <!-- Add Reply -->
        <div class="add-reply">
          <input type="text" placeholder="Add Reply to Reply" v-model="replyData.message"
            @keydown.enter="addReply_ToReply(message)" />
          <button @click="addReply_ToReply(message)">Add</button>
        </div>

      </div>
    </ul>

  </li>
</template>
<style scoped>
ul {
  padding-left: 16px;
  /* margin: 6px 10px; */
}

li {
  /* outline: 1px solid black; */
  /* padding: 1em; */
}

.message {
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  padding-top: 1em;
  padding-left: 1em;
  padding-bottom: 1em;
  list-style: none;
}
</style>