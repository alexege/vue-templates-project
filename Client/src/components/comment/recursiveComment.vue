<script setup>
import { ref } from 'vue'
const props = defineProps(['comment'])

//Store Imports
import { useCommentStore } from '@/stores/comment.store'
const commentStore = useCommentStore()

//Add a Comment to a Comment
const newCommentComment = {
  content: '',
  parentId: null,
  comments: [],
  author: JSON.parse(localStorage.getItem('user')).id || null
}

const addCommentToComment = (parentId) => {

  //New Comment
  const newComment = {
    content: newCommentComment.content,
    parentId: newCommentComment.parentId,
    comments: [],
    author: newCommentComment.author
  }

  //Add new Comment to Comment that has parentId
  commentStore.addCommentToComment(parentId, newComment)

  //Set newCommentComment values back to defaults
  newCommentComment.content = ''
}

</script>
<template>
  <div>
    {{ props.comment.comments }}
    <!-- <div v-for="(comment, idx) in props.comment.replies">
      <recursive-comment />
    </div> -->
  </div>
</template>
<style scoped></style>