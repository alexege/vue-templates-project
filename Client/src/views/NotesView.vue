<script setup>
import { ref } from 'vue'
const notes = ref([])
const page = ref(null)
const addNote = (event) => {
  console.log('addNote')
  const rect = page.value.getBoundingClientRect()
  const top = event.clientY - rect.top - 20 // Adjust for the note height
  const left = event.clientX - rect.left - 20 // Adjust for the note width
  notes.value.push({ text: '', top, left })
}
const deleteNote = (note) => {
  let noteIdx = notes.value.indexOf((n) => n.text == note.text)
  notes.value.splice(noteIdx, 1)
}
import DraggableElement from '@/components/drag/DraggableElement.vue'
</script>
<template>
  <div ref="page" class="notes-page" @dblclick="addNote">
    <div v-for="(note, index) in notes" :key="index">
      <draggable-element :top="note.top" :left="note.left">
        <span class="close" @click="deleteNote(note)">x</span>
        <textarea v-model="note.text" class="note-text"></textarea>
      </draggable-element>
    </div>
    <!-- <div
            v-for="(note, index) in notes"
            :key="index"
            class="note"
            @mousedown="startDrag"
            @mousemove="drag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            :style="{ top: note.top + 'px', left: note.left + 'px' }"
        >
            <DraggableElement>
                <span class="close" @click="deleteNote(note)">x</span>
                <textarea v-model="note.text" class="note-text"></textarea>
            </DraggableElement>
        </div> -->
  </div>
</template>
<style scoped>
textarea {
  outline: none;
  padding: 10px;
}

.notes-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
  overflow: hidden;
}

.note {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  resize: both;
  overflow: auto;
}

.note-text {
  width: 200px;
  height: 150px;
  border: none;
  resize: none;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
