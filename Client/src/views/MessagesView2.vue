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

    <div>
      {{ newComment }} <br />
      <input type="text" v-model="newComment.content" @keydown.enter="addComment" placeholder="Add a new Comment">
      <button @click="addComment">Add</button>
    </div>

    <recursive-comment />

    <pre>{{ allComments }}</pre>

  </div>
</template>
<style scoped></style>