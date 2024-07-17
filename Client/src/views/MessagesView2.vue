<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import recursiveComment from '@/components/comment/recursiveComment.vue'

//Store Imports
import { useCommentStore } from '@/stores/comment.store';
const commentStore = useCommentStore()
commentStore.getAllComments()
const { allComments } = storeToRefs(useCommentStore())

//Adding a new Comment
const newComment = {
  content: '',
  parentId: null,
  comments: [],
  author: JSON.parse(localStorage.getItem('user')).id || null
}

const addComment = () => {
  console.log(`Adding new comment: ${JSON.stringify(newComment, null, 2)}`)
  commentStore.createComment(newComment)
  newComment.content = ''
}

const deleteComment = (commentId) => {
  commentStore.deleteCommentById(commentId)
}

</script>
<template>
  <div>

    <!-- Add New Comment -->
    <div>
      <input type="text" v-model="newComment.content" @keydown.enter="addComment" placeholder="Add a new Comment">
      <button @click="addComment">Add</button>
    </div>

    <div v-for="(comment, idx) in allComments" :key="idx" class="comment">

      <div class="close-btn" @click="deleteComment(comment._id)">
        <span class="material-symbols-outlined"> close </span>
      </div>

      [b] - {{ comment._id.slice(-5) }} - {{ comment.content }}

      <recursive-comment v-bind="{ comment: comment }" />

    </div>

    <pre>{{ allComments }}</pre>

  </div>
</template>
<style scoped>
.comment {
  outline: 1px solid black;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 16px;
}
</style>