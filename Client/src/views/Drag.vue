<template>
  <DraggableDiv class="col-11 drag">
    <template v-slot:header>Header</template>
    <template v-slot:main>Main</template>
    <template v-slot:footer>Footer</template>
  </DraggableDiv>
</template>

<script>
import DraggableDiv from '../components/drag/DraggableDiv.vue'
export default {
  components: {
    DraggableDiv
  }
}
</script>
<style scoped>
.drag {
  outline: 1px dashed black;
}
</style>

<!-- <script setup>
import { ref } from 'vue'

const pos1 = ref(0)
const pos2 = ref(0)
const pos3 = ref(0)
const pos4 = ref(0)

const dragElement = (el) => {
  if (document.getElementById(el.id + 'header')) {
    document.getElementById(el.id + 'header').onmousedown = dragMouseDown
  } else {
    el.onmousedown = dragMouseDown
  }
}

dragElement(document.getElementById('mydiv'))

const dragMouseDown = (e) => {
  e = e || window.event
  e.preventDefault()

  pos3.value = e.clientX
  pos4.value = e.clientY
  document.onmouseup = closeDragElement
  document.onmousemove = elementDrag
}

const elementDrag = (e) => {
  e = e || window.event
  e.preventDefault()

  pos1.value = pos3.value - e.clientX
  pos2.value = pos4.value - e.clientY
  pos3.value = e.clientX
  pos4.value = e.clientY

  el.style.top = el.offsetTop - pos2.value + 'px'
  el.style.left = el.offsetLeft - pos1.value + 'px'
}

const closeDragElement = () => {
  document.onmouseup = null
  document.onmousemove = null
}
</script>
<template>
  <div>Drag View</div>

  <h1>Draggable DIV Element</h1>

  <p>Click and hold the mouse button down while moving the DIV element</p>

  <div id="mydiv">
    <div id="mydivheader">Click here to move</div>
    <p>Move</p>
    <p>this</p>
    <p>DIV</p>
  </div>
</template> -->
