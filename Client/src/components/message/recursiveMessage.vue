<script setup>
import { ref, reactive } from 'vue'
const props = defineProps(['replies', 'message', 'id', 'sourceId', 'parentId'])

//Store Imports
import { useMessageStore } from '@/stores/message.store';
const messageStore = useMessageStore()

//Add a Reply to Message
const replyData = {
  content: '',
}

const addReply_ToReply = (replyId, idx) => {

  toggleStates[idx] = true
  const reply = {
    content: replyData.content,
    parentId: props.parentId,
    sourceId: props.sourceId,
    replies: [],
    author: JSON.parse(localStorage.getItem('user')).id || null
  }

  messageStore.addReplyToReply(props.sourceId, replyId, reply)
  replyData.content = ''
}

// Toggle Dynamic Replies Independantly
import TransitionExpand from '../transitions/TransitionExpand.vue'
//Set initial state
const toggleStates = reactive({})
if (!toggleStates[props.id]) {
  toggleStates[props.id] = ref(false)
}
const toggle = (id) => {
  toggleStates[id] = !toggleStates[id]
}
const nextId = () => {
  return `${props.id}-child` // Example of generating unique IDs
}
const deleteReply = (messageId, reply, replyId) => {
  // if (confirm(`${messageId}, replyId: ${replyId}`) == true) {
  messageStore.deleteReplyById(messageId, replyId)
  // }
}
</script>
<template>
  <li class="reply-container">
    <ul class="replies" v-if="props.replies && props.replies.length">
      <div v-for="(message, index) in props.message.replies" :key="index" class="reply">
        <div class="message">
          <div class="action-buttons">
            <div class="" @click="editMode = !editMode">
              <i class='bx bx-edit'></i>
            </div>
            <div class="close-btn" @click="deleteReply(props.message._id, props.message, message._id)">
              <i class='bx bx-x'></i>
            </div>
          </div>
          <div class="user-prof">
            <span class="author" v-if="message.author">{{ message.author ? message.author.username : 'Author Name'
              }}</span>
            <i class='bx bxs-user-circle'></i>
            <div class="author-footer">
              <span v-if="message.createdAt">{{ new Date(message.createdAt).toLocaleTimeString() }}</span>
            </div>
          </div>
          <div class="message-box">
            <div class="message-header"></div>

            <!-- Reply Body -->
            <div class="message-body">
              <template v-if="editMode">
                <textarea rows="3" v-model="message.content" @keydown.enter="updateReply(message)"
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
        </div>
        <a @click="toggle(index)" class="toggle" v-if="message.replies && message.replies.length">
          {{ toggleStates[index] ? 'Hide Replies' : 'Show Replies' }}
          <template v-if="message.replies.length">({{ message.replies.length }})</template>
        </a>
        <TransitionExpand :key="`Reply-${index}`">
          <div v-if="toggleStates[index]">


            <recursiveMessage v-bind="{
              message: message,
              replies: message.replies
            }" :id="nextId(index)" :parentId="message._id" :sourceId="props.sourceId" />


          </div>
        </TransitionExpand>
        <!-- Add Reply -->
        <div class="reply-box">
          <div class="user-icon">
            <i class="bx bxs-user-circle"></i>
          </div>

          <div class="add-reply">
            <input type="text" placeholder="Add Reply to Reply" v-model="replyData.content"
              @keydown.enter="addReply_ToReply(message._id, index)" />
            <div class="actions">
              <button @click="addReply_ToReply(message._id, index)">Add</button>
              <!-- <a @click="toggleStates[index] = false">Cancel</a> -->
            </div>
          </div>

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

.reply-container {
  /* background: rgba(255, 0, 0, 0.15); */
  /* display: flex; */
  /* flex-direction: column; */
  /* outline: 1px solid black; */
  /* border: 1px solid black; */
  position: relative;
  display: flex;
  flex-direction: column;
  /* outline: 1px solid black; */
  list-style: none;
  margin-bottom: 1em;
}

.reply {
  display: flex;
  flex-direction: column;
  outline: 1px solid black;
  /* margin: 1em 0; */
  margin-bottom: 1em;
  box-shadow: 2px 2px 5px black;
}

.reply .toggle {
  align-self: center;
  width: 100%;
  text-align: center;
}

.reply:hover .toggle {
  cursor: pointer;
}

.message {
  position: relative;
  display: flex;
  gap: 0.25em;
  border-bottom: 1px solid black;
  margin-top: 5px;
  /* background: white; */
  background: var(--third-color);
  /* background: rgb(155, 155, 155); */
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
  flex: 1;
}

.message .user-prof span {
  font-size: 0.75em;
}

.message .user-prof i {
  font-size: 3em;
}

.user-prof .author {
  flex: 1;
}

.user-prof i {
  flex: 1;
}

.user-pro .author-footer {
  flex: 1;
}

.message .message-box {
  flex: 7;
}

.message-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-body textarea {
  width: 100%;
}

.message-header {
  font-size: 0.75em;
  font-weight: bold;
  flex: 1;
}

.message-body {
  font-size: 0.75em;
  flex: 2;
}

.message-footer {
  font-size: 0.65em;
  flex: 1;
}

.replies {
  /* background: rgba(155, 155, 155, 1); */
  list-style: none;
}

.reply-box {
  display: flex;
  flex-direction: row;
  /* outline: 1px solid red; */
  padding: 0.25em;
  /* background: white; */
  background: var(--third-color);
  /* background: rgb(155, 155, 155); */
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
  position: absolute;
  top: 5px;
  right: 5px;
}

.action-buttons span:hover {
  cursor: pointer;
  color: gray;
}
</style>
