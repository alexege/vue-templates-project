<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTimerStore } from '@/stores/timer.store.js'

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const timeOut = ref(0)
const timeToZero = ref(0)
const startDuration = ref(0)

const percentLeft = ref(0)
const timesUp = ref(false)

const props = defineProps(['timer'])
const emit = defineEmits(['close'])

const isPaused = ref(false)
const isEditing = ref(false)
const isHovering = ref(false)

//Modal
const timeIsEmpty = computed(() => {
  return timeToZero.value === 0;
})

const progressColor = computed(() => {
  if (percentLeft.value > 60) {
    return "green";
  } else if (percentLeft.value > 30) {
    return "yellow";
  } else {
    return "red";
  }
});

watch([days, hours, minutes, seconds], ([newDays, newHours, newMinutes, newSeconds], [oldDays, oldHours, oldMinutes, oldSeconds]) => {

  if (newHours == 24) {
    hours.value = 0;
    days.value++;
  }
  if (newMinutes == 60) {
    minutes.value = 0;
    hours.value++;
  }
  if (newSeconds == 60) {
    seconds.value = 0;
    minutes.value++;
  }

  timeToZero.value = days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000;

  //Keep track of original start duration.
  startDuration.value = timeToZero.value;
  if (timeToZero.value > 0) percentLeft.value = 100;
  if (timeToZero.value == 0) percentLeft.value = 0;
  console.log(`${newDays}:${newHours}:${newMinutes}:${newSeconds}`)
})

function start() {
  isPaused.value = false
  isEditing.value = false

  var startTime = Date.now()
  var desiredDelay = 1000;
  var actualDelay = 1000;

  percentLeft.value = Math.floor(timeToZero.value / startDuration.value * 100);

  timeOut.value = setTimeout(() => {

    var actual = Date.now() - startTime;
    actualDelay = desiredDelay - (actual - desiredDelay);

    timeToZero.value -= 1000;

    if (timeToZero.value > 0) {
      start()
    } else {
      percentLeft.value = 0;
      alert(`${props.timer.name} timer is up!`);
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
  days.value = 0;
  hours.value = 0;
  minutes.value = 0;
  seconds.value = 0;
  timeToZero.value = 0;
}

function addTime(mins) {
  if (minutes.value >= 60) {
    minutes.value = minutes.value - 60
    hours.value += 1;
  }
  // startDuration.value += mins * 60;

  minutes.value += mins;
}

function toggleSettings(timerId) {
  console.log("id:", timerId)
  this.isHovering = !this.isHovering;
}

function deleteTimer(timerId) {
  emit('close', timerId)
}

function msToTime(ms) {
  var seconds = Math.floor((ms / 1000) % 60);
  var minutes = Math.floor((ms / (1000 * 60)) % 60);
  var hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  var days = Math.floor((ms / (1000 * 60 * 60)) / 24);
  days = (days < 10) ? "0" + days : days;
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  return `${days}:${hours}:${minutes}:${seconds}`;
}

const inputStartTime = computed(() => {
  return days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000;
})

// Modal
import Modal from '@/components/Modal.vue'
const showModal = ref(false)
const openModal = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

</script>
<template>
  <div class="timer">

    <!-- Modal -->
    <button @click="openModal">Edit</button>
    <teleport to='#modals'>
      <div class="modal-bg" v-if="showModal" @click.self="closeModal">
        <div class="modal">
          <Modal @close="closeModal">
            <h2>Search Images</h2>
          </Modal>
        </div>
      </div>
    </teleport>

    <div class="timer-value">
      <div v-if="isHovering">
        <h2 class="time-left">{{ msToTime(timeToZero) }}</h2>

        <div class="time-left-controls">
          <div class="input-control">
            <label for="days">day</label>
            <div class="input-control-value">
              <input type="number" min="0" max="100" v-model="days" placeholder="Days" @change="updateStart()" />
              <span>:</span>
            </div>
          </div>
          <div class="input-control">
            <label for="hours">hrs</label>
            <div class="input-control-value">
              <input type="number" min="0" max="24" v-model="hours" placeholder="Hours" @change="updateStart()" />
              <span>:</span>
            </div>
          </div>
          <div class="input-control">
            <label for="minutes">min</label>
            <div class="input-control-value">
              <input type="number" min="0" max="60" v-model="minutes" placeholder="Minutes" @change="updateStart()" />
              <span>:</span>
            </div>
          </div>
          <div class="input-control">
            <label for="seconds">sec</label>
            <input type="number" min="0" max="60" v-model="seconds" placeholder="Seconds" @change="updateStart()" />
          </div>
        </div>
      </div>
      <div v-else>
        <h2 class="time-left">{{ msToTime(timeToZero) }}</h2>
      </div>
      <div v-if="isHovering" class="add-time">
        <button @click="addTime(1)" class="add-time-button">+1</button>
        <button @click="addTime(5)" class="add-time-button">+5</button>
        <button @click="addTime(15)" class="add-time-button">+15</button>
        <span>mins</span>
      </div>

      <transition name="fadeHeight" mode="out-in">
        <div v-if="isHovering" class="options">
          <template v-if="isPaused">
            <button @click="start" class="options-button" :class="{ disabled: timeIsEmpty }" :disabled="timeIsEmpty">
              &#9654;<br />Start
            </button>
          </template>
          <template v-else>
            <button @click="stop" class="options-button">||<span>Pause</span></button>
          </template>
          <button @click="reset" class="options-button">&#8634;<br />reset</button>
          <button @click="clear" class="options-button">&#9932;<br />clear</button>
        </div>
      </transition>

      <a @click="toggleSettings(timer._id)" class="toggleButton">
        <span class="material-symbols-outlined">settings</span></a>
      <a @click="deleteTimer(timer._id)" class="deleteButton">&#9932;</a>
    </div>
    <div class="timer-progress">
      <div class="progress-bar-container">
        <div class="progress-bar-text">{{ percentLeft }} %</div>
        <div class="progress-bar-background">{{ percentLeft }} %</div>
        <div class="progress-bar" :style="[
          { width: percentLeft + '%' },
          { animation: 'colorChange 2s both' },
          { 'background-color': progressColor },
        ]"></div>
      </div>
    </div>

  </div>
</template>
<style scoped>
/* Modals */
.modal {
  color: lime;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 80%;
  background: black;
  outline: 1px solid white;
  text-align: center;
  position: fixed;
  overflow: auto;
}

.modal-bg {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(3px);
}

/* Animate open */
.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.5s;
  max-height: 430px;
}

.fadeHeight-enter,
.fadeHeight-leave-to {
  opacity: 0;
  max-height: 0px;
}
</style>