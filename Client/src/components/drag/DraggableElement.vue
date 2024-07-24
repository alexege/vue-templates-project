<script setup>
import { ref } from 'vue'
const draggable = ref(null)
let isDragging = false
let initialMousePosition = { x: 0, y: 0 }
let initialElementPosition = { top: 0, left: 0 }
const props = defineProps(['top', 'left'])
const position = ref({ top: props.top, left: props.left })
const startDrag = (event) => {
    isDragging = true
    initialMousePosition.x = event.clientX
    initialMousePosition.y = event.clientY
    initialElementPosition.top = draggable.value.offsetTop
    initialElementPosition.left = draggable.value.offsetLeft
}
const drag = (event) => {
    if (isDragging) {
        const deltaX = event.clientX - initialMousePosition.x
        const deltaY = event.clientY - initialMousePosition.y
        position.value.top = initialElementPosition.top + deltaY
        position.value.left = initialElementPosition.left + deltaX
    }
}
const stopDrag = () => {
    isDragging = false
}
const noteTitle = ref('Note Title')
const isEditingTitle = ref(false)
const editTitle = (title) => {
    isEditingTitle.value = true
    noteTitle.value = title
}
</script>
<template>
    <div ref="draggable" class="draggable" :style="{ top: position.top + 'px', left: position.left + 'px' }"
        @mousedown="startDrag" @mousemove="drag" @mouseup="stopDrag" @mouseleave="stopDrag">
        <div class="title" @dblclick.prevent="editTitle">Note Title</div>
        <slot @mousedown="e.preventDefault()"></slot>
        top: {{ position.top }}, left: {{ position.left }}
    </div>
</template>
<style scoped>
.draggable {
    position: absolute;
    /* width: 100px; */
    /* height: 50px; */
    background-color: #4caf50;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: move;
}
</style>
