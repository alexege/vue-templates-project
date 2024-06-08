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
const editTime = ref(true);
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

  if (timeToZero.value == 0) {
    return;
  }

  isPaused.value = false;
  isEditing.value = false;
  editTime.value = false;
  timerActive.value = true;

  var startTime = Date.now();
  var desiredDelay = 1000;
  var actualDelay = 1000;

  percentLeft.value = Math.floor((timeToZero.value / startDuration.value) * 100);

  time_out.value = setTimeout(() => {
    var actual = Date.now() - startTime;
    actualDelay = desiredDelay - (actual - desiredDelay);

    timeToZero.value -= 1000;

    if (timeToZero.value > 0) {
      startTimer();
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
  timerActive.value = false;
  // editTime.value = false;

  clearTimeout(time_out.value);
}

function reset() {
  isPaused.value = true;
  clearTimeout(time_out.value);
  timerActive.value = false;
  timeToZero.value = inputStartTime.value;
}

function restartTimer() {

  //Get values from startDuration
  console.log("start duration: ", msToTime(startDuration.value).split(':'))
  let startingTime = msToTime(startDuration.value).split(':');
  timerActive.value = false;

  isPaused.value = true;
  clearTimeout(time_out.value);
  days.value = startingTime[0];
  hours.value = startingTime[1];
  minutes.value = startingTime[2];
  seconds.value = startingTime[3];
  timeToZero.value = startDuration.value;
}

function clearTimer() {
  editTime.value = true;
  timerActive.value = false;
  isPaused.value = true;
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
  // timerActive.value = false;
  // isPaused.value = true;
  editTime.value = !editTime.value;
  if (editTime.value) {
    pauseTimer()
  }
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
        <span @click="toggleSettings(timer._id)" class="material-symbols-outlined">settings</span>
        <span @click="deleteTimer(timer._id)" class="material-symbols-outlined">close</span>
      </div>

    </div>

    <!-- Middle -->
    <div class="timer-middle">

      <div class="time-remaining">
        <template v-if="editTime">
          <div class="time-input">
            <div class="input-control">
              <label>days</label>
              <input type="number" min="0" max="100" v-model="days" placeholder="Days" @change="updateStart()" />
            </div>
            <span>:</span>
            <div class="input-control">
              <label>hrs</label>
              <input type="number" min="0" max="100" v-model="hours" placeholder="Hrs" @change="updateStart()" />
            </div>
            <span>:</span>
            <div class="input-control">
              <label>mins</label>
              <input type="number" min="0" max="100" v-model="minutes" placeholder="Mins" @change="updateStart()" />
            </div>
            <span>:</span>
            <div class="input-control">
              <label>sec</label>
              <input type="number" min="0" max="100" v-model="seconds" placeholder="Sec" @change="updateStart()" />
            </div>
          </div>
        </template>
        <template v-else>
          <h2>{{ msToTime(timeToZero) }}</h2>
        </template>

      </div>

      <!-- <div class="optional-time-controls">
        <button @click="addTime(1)" class="add-time-button">+1</button>
        <button @click="addTime(5)" class="add-time-button">+5</button>
        <button @click="addTime(15)" class="add-time-button">+15</button>
        <span>mins</span>
      </div> -->

      <div class="timer-controls">

        <span @click="restartTimer" class="material-symbols-outlined">
          replay
        </span>

        <template v-if="timerActive">
          <span @click="pauseTimer" class="material-symbols-outlined">
            pause
          </span>
        </template>

        <template v-else>
          <span @click="startTimer" class="material-symbols-outlined">
            play_arrow
          </span>
        </template>

        <span @click="clearTimer" class="material-symbols-outlined">
          close
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

    <!-- <span class="debug">
      editTime: {{ editTime }} <br />
      time_out: {{ time_out }} <br />
      timeToZero: {{ timeToZero }} <br />
      startDuration: {{ startDuration }} <br />
      percentLeft: {{ percentLeft }} <br />
    </span> -->
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

.timer-middle .time-remaining .time-input {
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-middle .time-input .input-control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-middle .time-input .input-control input[type="number"] {
  font-size: 1em;
  width: 40px;
}

.timer-middle .timer-controls .material-symbols-outlined {
  padding: .10em .25em;
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
