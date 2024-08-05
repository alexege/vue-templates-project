<script setup>
// https://blog.logrocket.com/rendering-nested-comments-recursive-components-vue/?ref=dailydev
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import addMessageForm from "@/components/message/addMessageForm.vue"

//Store Imports
import recursiveMessage from '@/components/message/recursiveMessage.vue'
import { useMessageStore } from '@/stores/message.store'
const messageStore = useMessageStore()
messageStore.getAllMessages()
messageStore.getAllReplies()
const { allMessages } = storeToRefs(useMessageStore())

const messageReply = {
  content: '',
}
const addReply_ToMessage = (messageId, idx) => {
  toggleStates[idx] = true
  const reply = {
    content: messageReply.content,
    replies: [],
    parentId: null,
    sourceId: null, //This value is updated in Controller
    author: JSON.parse(localStorage.getItem('user')).id || null
  }
  messageStore.addReplyToMessage(messageId, reply)
  messageReply.content = ''
}
// Toggle Dynamic Components Independently
import TransitionExpand from '@/components/transitions/TransitionExpand.vue'
const toggleStates = reactive({})
if (!toggleStates[0]) {
  toggleStates[0] = ref(false)
}
const toggle = (id) => {
  toggleStates[id] = !toggleStates[id]
}
const nextId = (id) => {
  // return `${props.id}-child` // Example of generating unique IDs
  return id + 1 // Example of generating unique IDs
}
//Delete Message
const deleteMessage = (messageId) => {
  if (confirm(`Sure you want to delete: ${messageId}`)) {
    messageStore.deleteMessageById(messageId)
  }
}

//User Ownership
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

//Edit Message Logic
const editMode = ref(false)
const updateMessage = (message) => {
  messageStore.updateMessageById(message._id, message)
  editMode.value = false;
}

</script>
<template>
  <div>
    <div class="message-container">
      <!-- <div class="add-message"> -->
      <!-- <div class="add-message-title">
        <input type="text" v-model="newMessage.title" placeholder="Message Title">
      </div>
      <div class="add-message-body">
        <input type="text" v-model="newMessage.content" @keydown.enter="addMessage" placeholder="Message Body" />
        <textarea v-model="newMessage.content" @keydown.enter="addMessage" placeholder="Message Body"></textarea>
        <button @click="addMessage">Add</button>
      </div> -->
      <!-- </div> -->

      <add-message-form />

      <!-- Display Messages -->
      <ul v-for="(message, index) in allMessages" :key="index" class="post">
        <!-- Message_id: {{ message.id }} -->
        <div class="message">
          <div class="user-prof">
            <span class="author" v-if="message.author && message.author.username">{{ message.author.username }}</span>
            <i class='bx bxs-user-circle'></i>
            <div class="message-footer">
              {{ new Date(message.createdAt).toLocaleTimeString() }}
            </div>
          </div>
          <div class="message-box">
            <div class="message-header">

              <input v-if="editMode" type="text" v-model="message.title">
              <h2 v-else class="message-title">{{ message.title }}</h2>
            </div>

            <!-- Message Body -->
            <div class="message-body">
              <template v-if="editMode">
                <!-- <input type="text" v-model="message.content" @keydown.enter="updateMessage(message._id)"> -->
                <textarea v-model="message.content" @keydown.enter="updateMessage(message)"
                  @keydown.esc="editMode = false" />
              </template>
              <template v-else>
                {{ message.content }}
              </template>
            </div>


            <div class="message-footer">
              <!-- {{ new Date().toLocaleTimeString() }} -->
            </div>
          </div>
          <div class="message-actions">
            <div class="action-buttons">
              <div class="" @click="editMode = !editMode">
                <i class='bx bx-edit'></i>
              </div>
              <div class="close-btn" @click="deleteMessage(message._id)">
                <i class='bx bx-x'></i>
              </div>
            </div>
          </div>
        </div>
        <a @click="toggle(index)" class="toggle" v-if="message.replies && message.replies.length">
          {{ toggleStates[index] ? 'Hide Coments' : 'Show Comments' }}
          <template v-if="message.replies.length">
            ({{ message.replies.length }})
          </template>
        </a>
        <div class="comments-toggle">
          <TransitionExpand :key="`Message-${index}`" v-if="message && message.replies">
            <div v-if="toggleStates[index]">
              <recursiveMessage v-bind="{
                message: message,
                replies: message.replies
              }" :id="nextId(index)" :parentId="message._id" :sourceId="message._id" />
            </div>
          </TransitionExpand>
          <!-- Add Reply -->
          <div class="reply-box">
            <div class="user-icon">
              <i class='bx bxs-user-circle'></i>
            </div>
            <div class="add-reply">
              <input type="text" v-model="messageReply.content" placeholder="Add Reply to Message"
                @keydown.enter="addReply_ToMessage(message._id, index)" />
              <div class="actions">
                <button @click="addReply_ToMessage(message._id, index)">Add</button>
                <!-- <button @click="toggleStates[index] = false">Cancel</button> -->
              </div>
            </div>
          </div>
        </div>
      </ul>
      <!-- 
    Messages:
    <pre>{{ messageStore.messages }}</pre>
    Replies:
    <pre>{{ messageStore.replies }}</pre> -->
    </div>
  </div>
</template>
<style scoped>
* {
  color: var(--secondary-color);
}

.post {
  position: relative;
  display: flex;
  flex-direction: column;
  /* outline: 1px solid purple; */
  /* background: rgba(0, 255, 0, 0.15); */
  /* margin: 0.5em; */
  background: rgba(211, 209, 209, 0.2);
  outline: 1px solid black;
  list-style: none;
  margin-bottom: 1em;
  box-shadow: 2px 2px 5px black;

}

.post .toggle {
  align-self: center;
  width: 100%;
  text-align: center;
  font-size: 0.75em;
  background-color: var(--third-color);
}

.post:hover .toggle {
  cursor: pointer;
}

.post .comments-toggle {
  display: flex;
  flex-direction: column;
  background-color: var(--third-color);
  /* background: rgb(155, 155, 155); */
  /* justify-content: center; */
  /* align-items: center; */
  font-size: 0.75em;
}

.message {
  min-height: 7em;
  display: flex;
  gap: 0.25em;
  border-bottom: 1px solid black;
  /* background: white; */
  background: var(--third-color);
  /* background: rgb(155, 155, 155); */
  /* border: 1px solid black; */
  /* border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black; */
  /* padding-top: 0.5em;
    padding-left: 0.5em;
    padding-bottom: 0.5em; */
  padding: 0.5em;
  list-style: none;
}

.message .user-prof {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  flex: 1;
}

.message .user-prof span {
  font-size: 0.75em;
}

.message .user-prof i {
  font-size: 3em;
}

.message .message-box {
  flex: 7;
}

.message-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-header {
  font-size: 0.75em;
  font-weight: bold;
  /* flex: 1; */
  padding: 0 5px;
}

.message-header input[type=text] {
  border: none;
  background-color: #e2dede;
}

.message-title {
  /* text-align: center; */
}

.message-body {
  font-size: 0.75em;
  flex: 2;
  margin-right: 15px;
  padding: 5px;
  white-space: pre;
}

.message-body textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  background-color: #e2dede;
  font-family: 'Poppins', sans-serif;
  font-size: 1em;
  border-radius: 5px;
  padding: 5px;
}

.message-footer {
  font-size: 0.65em;
  /* flex: 1; */
}

.message-container {
  display: grid;
  width: 80%;
  margin: 0 auto;
  max-width: 75em;
}

.message-container input {
  flex: 4;
}

.message-container button {
  flex: 1;
}

/* Reply */
.reply-box {
  display: flex;
  flex-direction: row;
  /* background: white; */
  /* background: rgb(155, 155, 155); */
  /* outline: 1px solid red; */
  padding: 0.25em;
}

.add-reply {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.add-reply input {
  width: 100%;
}

.add-reply .actions {
  /* width: 100%; */
  /* display: flex; */
  flex-direction: row;
  justify-content: start;
}

.add-reply .actions button {
  cursor: pointer;
  width: 50px;
  padding: 2px;
  margin: 5px 0;
  margin-right: 0.25em;
}

.reply-box .user-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.reply-box .add-reply {
  /* flex-shrink: 0; */
  /* min-width: 60px; */
  flex: 1;
}

.reply-box .add-reply input {
  flex: 1;
}

/* Delete Message Button */
.close-btn {
  /* position: absolute; */
  /* top: 5px; */
  /* right: 5px; */
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  /* position: absolute; */
  /* top: 5px; */
  /* right: 5px; */
}

.action-buttons span:hover {
  cursor: pointer;
  color: gray;
}
</style>
