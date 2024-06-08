<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTimerStore } from "@/stores/timer.store.js";

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const time_out = ref(0);
const timeToZero = ref(0);
const startDuration = ref(0);

const percentLeft = ref(0);
const timesUp = ref(false);

const props = defineProps(["timer"]);
const emit = defineEmits(["close"]);

const isPaused = ref(true);
const isEditing = ref(false);
const timerActive = ref(false);

//Modal
const timeIsEmpty = computed(() => {
  return timeToZero.value === 0;
});

const progressColor = computed(() => {
  if (percentLeft.value > 60) {
    return "green";
  } else if (percentLeft.value > 30) {
    return "yellow";
  } else {
    return "red";
  }
});

watch(
  [days, hours, minutes, seconds],
  (
    [newDays, newHours, newMinutes, newSeconds],
    [oldDays, oldHours, oldMinutes, oldSeconds]
  ) => {
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

    timeToZero.value =
      days.value * 86400000 +
      hours.value * 3600000 +
      minutes.value * 60000 +
      seconds.value * 1000;

    //Keep track of original start duration.
    startDuration.value = timeToZero.value;
    if (timeToZero.value > 0) percentLeft.value = 100;
    if (timeToZero.value == 0) percentLeft.value = 0;
    console.log(`${newDays}:${newHours}:${newMinutes}:${newSeconds}`);
  }
);

function startTimer() {
  isPaused.value = false;
  isEditing.value = false;

  var startTime = Date.now();
  var desiredDelay = 1000;
  var actualDelay = 1000;

  percentLeft.value = Math.floor((timeToZero.value / startDuration.value) * 100);

  time_out.value = setTimeout(() => {
    var actual = Date.now() - startTime;
    actualDelay = desiredDelay - (actual - desiredDelay);

    timeToZero.value -= 1000;

    if (timeToZero.value > 0) {
      start();
    } else {
      percentLeft.value = 0;
      alert(`${props.timer.name} timer is up!`);
      isPaused.value = true;
    }
  }, actualDelay);
}

function updateStart() {
  startDuration.value = timeToZero.value;
}

function pauseTimer() {
  isPaused.value = true;
  clearTimeout(time_out.value);
}

function reset() {
  isPaused.value = true;
  clearTimeout(time_out.value);
  timeToZero.value = inputStartTime.value;
}

function restartTimer() {
  isPaused.value = true;
  clearTimeout(time_out.value);
  days.value = 0;
  hours.value = 0;
  minutes.value = 0;
  seconds.value = 0;
  timeToZero.value = 0;
}

function addTime(mins) {
  if (minutes.value >= 60) {
    minutes.value = minutes.value - 60;
    hours.value += 1;
  }
  // startDuration.value += mins * 60;

  minutes.value += mins;
}

function toggleSettings(timerId) {
  console.log("id:", timerId);
  this.timerActive = !this.timerActive;
}

function deleteTimer(timerId) {
  emit("close", timerId);
}

function msToTime(ms) {
  var seconds = Math.floor((ms / 1000) % 60);
  var minutes = Math.floor((ms / (1000 * 60)) % 60);
  var hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  var days = Math.floor(ms / (1000 * 60 * 60) / 24);
  days = days < 10 ? "0" + days : days;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return `${days}:${hours}:${minutes}:${seconds}`;
}

const inputStartTime = computed(() => {
  return (
    days.value * 86400000 +
    hours.value * 3600000 +
    minutes.value * 60000 +
    seconds.value * 1000
  );
});
</script>
<template>
  <div class="countdown-timer">

    <!-- Top -->
    <div class="timer-top">

      <div class="timer-title">
        {{ timer.name }}
      </div>

      <div class="controls">
        <span class="material-symbols-outlined">settings</span>
        <span class="material-symbols-outlined">close</span>
      </div>

    </div>

    <!-- Middle -->
    <div class="timer-middle">

      <div class="time-remaining">
        <template v-if="timerActive">
          <h2>{{ msToTime(timeToZero) }}</h2>
        </template>
        <template v-else>

        </template>

      </div>

      <!-- <div class="optional-time-controls">
        <button @click="addTime(1)" class="add-time-button">+1</button>
        <button @click="addTime(5)" class="add-time-button">+5</button>
        <button @click="addTime(15)" class="add-time-button">+15</button>
        <span>mins</span>
      </div> -->

      <div class="timer-controls">
        <span @click="startTimer" class="material-symbols-outlined">
          play_arrow
        </span>
        <span @click="pauseTimer" class="material-symbols-outlined">
          pause
        </span>
        <span @click="restartTimer" class="material-symbols-outlined">
          replay
        </span>
      </div>

    </div>

    <!-- Bottom -->
    <div class="timer-bottom">
      <div class="progressbar">
        <div class="text">{{ percentLeft }} %</div>
        <div class="background">{{ percentLeft }} %</div>
        <div class="bar" :style="[
          { width: percentLeft + '%' },
          { animation: 'colorChange 2s both' },
          { 'background-color': progressColor }
        ]"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.countdown-timer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  outline: 1px solid red;
  position: relative;
}

.timer-top,
.timer-middle,
.timer-bottom {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

/* Generic */
.material-symbols-outlined {
  cursor: pointer;
}

.material-symbols-outlined:hover {
  color: white;
}

/* Top */
.timer-top {
  flex: 1;
  outline: 1px solid red;
  width: 100%;
}

.timer-top .close {
  position: absolute;
  top: 0;
  right: 0;
  margin: 2.5px 5px;
}

.timer-top .controls {
  display: flex;
  outline: 1px solid white;
  position: absolute;
  top: 0;
  right: 0;
}

/* Middle */
.timer-middle {
  flex: 2;
  flex-direction: column;
  outline: 1px solid lime;
}

/* Bottom */
.timer-bottom {
  flex: 1;
  outline: 1px solid blue;
}

.timer-bottom .progressbar {
  position: relative;
  outline: 1px solid yellow;
  width: 100%;
  text-align: center;
}

.timer-bottom .text {
  position: absolute;
  top: 0;
}

.timer-bottom .background {
  background-color: black;
  color: white;
}

/* .timer-bottom .bar {
  transition: width 1s;
  background-color: limegreen;
  animation: colorChange;
} */
</style>
