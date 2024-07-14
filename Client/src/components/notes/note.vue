<template>
  <div class="reply-container">
    {{ replyData }}<br />
    <pre>{{ replies }}</pre>
    <input v-model="replyData" placeholder="Enter your reply" @keydown.enter="addReply" />
    <button @click="addReply">Reply</button>
    <div v-if="replies.length">
      <note v-for="(reply, index) in replies" :key="index" v-model="reply.replyData" :replies="reply.replies" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  replyData: {
    type: String,
    default: ''
  },
  replies: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:replyData']);

const replyData = ref(props.replyData);
const replies = ref(props.replies);

const addReply = () => {
  replies.value.push({
    replyData: '',
    replies: []
  });
};

watch(replyData, (newValue) => {
  emit('update:replyData', newValue);
});
</script>

<style scoped>
.reply-container {
  margin-left: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
