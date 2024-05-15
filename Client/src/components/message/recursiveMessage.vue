<script setup>
defineProps(['replies', 'message'])
</script>
<template>
  <li>
    <span class="message">{{ message }}</span>
    <ul class="replies" v-if="replies && replies.length">
      <div v-for="(item, index) in replies" :key="index">
        <recursive-message
          v-bind="{
            message: item.message,
            replies: item.replies
          }"
        />
      </div>
    </ul>
  </li>
</template>
<style scoped>
ul {
  padding-left: 16px;
  margin: 6px 10px;
}
</style>
