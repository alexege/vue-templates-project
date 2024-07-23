<!-- Source: https://lobotuerto.com/notes/a-confirmation-dialog-component-with-vue-and-tailwind -->
<script setup>
defineProps(['show'])
</script>

<template>
  <!-- Render inside our `<div id="modals"></div>` in index.html -->
  <Teleport to="#modals">
    <!-- Show / hide the modal -->
    <div v-if="show" class="">
      <!-- The backdrop -->
      <div class="backdrop"></div>

      <!-- Where the actual content goes -->
      <div class="content">
        <div class="bg">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #111827;
  opacity: 0.4;
  z-index: 3;
}

.content {
  display: flex;
  position: fixed;
  inset: 0;
  justify-content: center;
  align-items: center;
  z-index: 4;
  backdrop-filter: blur(5px);
}

.bg {
  color: white;
  background-color: rgb(16, 15, 28);
  width: 50%;
  height: 15vh;
  min-height: 150px;
  border-radius: 10px;
}
</style>
