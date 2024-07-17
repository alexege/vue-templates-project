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

//Adding a Comment to a Comment
const newCommentComment = {
  content: '',
  parentId: null,
  comments: [],
  author: JSON.parse(localStorage.getItem('user')).id || null
}

const addCommentToComment = (commentId, comment) => {

}

</script>
<template>
  <div>

    <!-- Add New Comment -->
    <div>
      {{ newComment }} <br />
      <input type="text" v-model="newComment.content" @keydown.enter="addComment" placeholder="Add a new Comment">
      <button @click="addComment">Add</button>
    </div>

    <div v-for="(comment, idx) in allComments" :key="idx" class="comment">
      base comment: {{ comment._id }}

      <recursive-comment v-bind="{ comment: comment }" />

    </div>


    <pre>{{ allComments }}</pre>

  </div>
</template>
<style scoped>
.comment {
  outline: 1px solid black;
}
</style>