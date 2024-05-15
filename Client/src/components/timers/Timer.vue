<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps(['timer'])
const emit = defineEmits(['close'])

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const timeOut = ref(0)
const timeToZero = ref(0)
const startDuration = ref(0)

const isPaused = ref(false)
const isEditing = ref(false)

let percentLeft = ref(0)
const timesUp = ref(false)

watch(
  [days, hours, minutes, seconds],
  ([newDays, newHours, newMinutes, newSeconds], [oldDays, oldHours, oldMinutes, oldSeconds]) => {
    if (newHours == 24) {
      hours.value = 0
      days.value++
    }
    if (newMinutes == 60) {
      minutes.value = 0
      hours.value++
    }
    if (newSeconds == 60) {
      seconds.value = 0
      minutes.value++
    }

    timeToZero.value =
      days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000

    //Keep track of original start duration.
    startDuration.value = timeToZero.value
    if (timeToZero.value > 0) percentLeft.value = 100
    if (timeToZero.value == 0) percentLeft.value = 0
    console.log(`${newDays}:${newHours}:${newMinutes}:${newSeconds}`)
  }
)

const start = () => {
  isPaused.value = false
  isEditing.value = false

  var startTime = Date.now()
  var desiredDelay = 1000
  var actualDelay = 1000

  percentLeft.value = Math.floor((timeToZero.value / startDuration.value) * 100)

  timeOut.value = setTimeout(() => {
    var actual = Date.now() - startTime
    actualDelay = desiredDelay - (actual - desiredDelay)

    timeToZero.value -= 1000

    if (timeToZero.value > 0) {
      start()
    } else {
      percentLeft.value = 0
      alert(`${props.timer.name} timer is up!`)
      isPaused.value = true
    }
  }, actualDelay)
}

function updateStart() {
  startDuration.value = timeToZero.value
}

function stop() {
  isPaused.value = true
  clearTimeout(timeOut.value)
}

function reset() {
  isPaused.value = true
  clearTimeout(timeOut.value)
  timeToZero.value = inputStartTime.value
}

function clear() {
  isPaused.value = true
  clearTimeout(timeOut.value)
  days.value = 0
  hours.value = 0
  minutes.value = 0
  seconds.value = 0
  timeToZero.value = 0
}

function addTime(mins) {
  if (minutes.value >= 60) {
    minutes.value = minutes.value - 60
    hours.value += 1
  }
  // startDuration.value += mins * 60;

  minutes.value += mins
}

function toggleSettings(timerId) {
  console.log('id:', timerId)
  this.isHovering = !this.isHovering
}

function deleteTimer(timerId) {
  emit('close', timerId)
}

function msToTime(ms) {
  var seconds = Math.floor((ms / 1000) % 60)
  var minutes = Math.floor((ms / (1000 * 60)) % 60)
  var hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  var days = Math.floor(ms / (1000 * 60 * 60) / 24)
  days = days < 10 ? '0' + days : days
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  return `${days}:${hours}:${minutes}:${seconds}`
}

const inputStartTime = computed(() => {
  return (
    days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000
  )
})

const close = () => {
  emit('close', props.timer.id)
}
</script>
<template>
  <div class="timer" @dragover="$event.preventDefault()">
    <div class="timer-menu grabbable" draggable="true">
      <span @click="close()" class="close">X</span>
    </div>
    Timer
    <pre>id:{{ timer.id }}</pre>
    <pre>pos:{{ timer.gridPosId }}</pre>
    <div><span>00</span>:<span>00</span>:<span>00</span></div>
    <div class="timer-controls">
      <button @click="start()">></button>
      <button @click="stop()">||</button>
      <button @click="reset()">[]</button>
    </div>
  </div>
</template>
<style scoped>
.timer {
  width: 80%;
  height: 80%;
  background-color: rgb(230, 228, 228);
  position: absolute;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.timer-controls {
  display: flex;
  justify-content: space-between;
}

.timer-controls button {
  padding: 0 0.5em;
  margin: 0 0.25em;
  font-size: 8px;
}

.timer-menu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  border-bottom: 1px solid black;
  top: 0;
  right: 0;
  width: 100%;
  height: 20px;

  cursor: pointer;
}

.close {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
}

.grabbable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
</style>
