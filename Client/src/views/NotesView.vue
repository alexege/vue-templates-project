<template>
  <div>
    rootReplyData: {{ rootReplyData }} <br />
    rootReplies:
    <pre>{{ rootReplies }}</pre>
    <note v-model="rootReplyData" :replies="rootReplies" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import note from '@/components/notes/note.vue';

const rootReplyData = ref('');
const rootReplies = ref([]);
</script>