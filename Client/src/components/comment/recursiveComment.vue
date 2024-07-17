<script setup>
import { ref } from 'vue'
const props = defineProps(['comment', 'parentId', 'sourceId', 'depth'])

//Store Imports
import { useCommentStore } from '@/stores/comment.store'
const commentStore = useCommentStore()

//Add a Comment to a Comment
const newCommentComment = {
  content: '',
  depth: props.depth + 1,
  parentId: props.parentId || null,
  sourceId: props.sourceId || null,
  comments: [],
  author: JSON.parse(localStorage.getItem('user')).id || null
}

const addCommentToComment = (parentId) => {

  //New Comment
  const newComment = {
    content: newCommentComment.content,
    depth: newCommentComment.depth,
    parentId: newCommentComment.parentId,
    sourceId: newCommentComment.sourceId,
    comments: [],
    author: newCommentComment.author
  }

  //Add new Comment to Comment that has parentId
  commentStore.addCommentToComment(props.sourceId, parentId, newComment)

  //Set newCommentComment values back to defaults
  newCommentComment.content = ''
}

</script>
<template>
  <div>
    <div class="child-comment">
      <div v-for="(comment, idx) in props.comment.comments" :key="idx">
        <!-- <pre>{{ comment }}</pre> -->
        <pre v-if="props.parentId">parentId:{{ props.parentId.slice(-5) }}</pre>

        [c] - {{ comment._id.slice(-5) }} - {{ comment.content }} - {{ comment.comments }}

        <recursive-comment :comment="comment" :parentId="comment._id" :sourceId="props.sourceId"
          :depth="props.depth + 1" />
      </div>

      <!-- Add New Comment -->
      <div>
        <input type="text" v-model="newCommentComment.content" @keydown.enter="addCommentToComment(comment._id)"
          placeholder="Add a new Comment">
        <button @click="addCommentToComment(comment._id)">Add - {{ comment._id }}</button>
      </div>
    </div>

  </div>
</template>
<style scoped>
.child-comment {
  outline: 1px solid red;
  position: relative;
  margin-left: 20px;
}
</style>