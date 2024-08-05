<script setup>
import { ref } from 'vue'

//Store Imports
import { useMessageStore } from '@/stores/message.store';
const messageStore = useMessageStore()

const newMessage = ref({
    title: '',
    content: ''
})

const addMessage = () => {

    const message = {
        title: newMessage.value.title,
        content: newMessage.value.content,
        replies: [],
        author: JSON.parse(localStorage.getItem('user')).id || null
    }
    messageStore.createMessage(message)

    newMessage.value.title = ''
    newMessage.value.content = ''
}
</script>
<template>
    <div class="add-message">
        <h3>Add A Message</h3>
        <input type="text" v-model="newMessage.title" placeholder="Message Title">
        <textarea v-model="newMessage.content" placeholder="Message Body"></textarea>
        <button @click="addMessage" class="add-message-btn">Add</button>
    </div>
</template>
<style scoped>
.add-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--third-color);
    /* outline: 1px solid red; */
    margin: 1em;
    outline: 1px solid black;
    padding: 1em;
    border-radius: 10px;
    box-shadow: 2px 2px 5px black;
    width: 75%;
    margin: 1em auto;
}

.add-message h3 {
    padding-bottom: 1em;
}

input[type=text] {
    width: 100%;
    /* padding: 12px 20px; */
    /* margin: 8px; */
    padding: .5em;
    margin-bottom: .75em;
    box-sizing: border-box;
}

textarea {
    width: 100%;
    height: 8em;
    box-sizing: border-box;
    padding: .5em;
}

.add-message-btn {
    padding: .5em 3em;
    margin-top: 1em;
}

.add-message-btn:hover {
    cursor: pointer;
}
</style>