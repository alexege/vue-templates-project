<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTimerStore } from "@/stores/timer.store.js";

const main_bg_color = "black";

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

const isEditing = ref(false);
const editTime = ref(true);
const timerActive = ref(false);

const { updateTimer } = useTimerStore()
const editingTimerName = ref(false);
const editTimer = ref({
  name: props.timer.name
})
const editTimerName = ref(false);

//Modal
const timeIsEmpty = computed(() => {
  return timeToZero.value === 0;
});

const progressColor = computed(() => {
  if (percentLeft.value > 60) {
    return { bg: "green", fg: "white" }
  } else if (percentLeft.value > 30) {
    return { bg: "yellow", fg: "black" }
  } else {
    return { bg: "red", fg: "white" }
  }
})

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
      timerActive.value = false;
      setTimeout(() => {
        alert(`${props.timer.name} timer is up!`);
      }, 500)
    }
  }, actualDelay);
}

function updateStart() {
  startDuration.value = timeToZero.value;
}

function pauseTimer() {
  timerActive.value = false;
  // editTime.value = false;

  clearTimeout(time_out.value);
}

function reset() {
  clearTimeout(time_out.value);
  timerActive.value = false;
  timeToZero.value = inputStartTime.value;
}

function restartTimer() {

  //Get values from startDuration
  console.log("start duration: ", msToTime(startDuration.value).split(':'))
  let startingTime = msToTime(startDuration.value).split(':');
  timerActive.value = false;
  clearTimeout(time_out.value);

  if (timeToZero.value == 0) {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
  } else {
    days.value = startingTime[0];
    hours.value = startingTime[1];
    minutes.value = startingTime[2];
    seconds.value = startingTime[3];
  }

  timeToZero.value = startDuration.value;
}

function clearTimer() {
  editTime.value = true;
  timerActive.value = false;
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

function subtractTime(mins) {
  if (minutes.value > 0) {
    minutes.value -= mins;
  }
}

function toggleSettings(timerId) {
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

const updateTimerName = () => {
  var updateData = {
    _id: props.timer._id,
    name: editTimer.value.name
  }

  updateTimer(updateData)
  props.timer.name = updateData.name
  editTimerName.value = false;
}
</script>
<template>
  <div class="countdown-timer">

    <!-- Top -->
    <div class="timer-top">

      <div class="timer-title">
        <template v-if="editTimerName">
          <input type="text" v-model="editTimer.name" @blur="updateTimerName" @keydown.enter="updateTimerName" autofocus
            @focus="$event.target.select()" />
          <span class="material-symbols-outlined" @click="updateTimerName">
            save
          </span>
        </template>
        <template v-else>
          <span @dblclick="editTimerName = true">{{ timer.name }}</span>
        </template>
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
          <span class="time-left">{{ msToTime(timeToZero) }}</span>
        </template>

      </div>

      <div class="timer-controls">

        <!-- <span @click="subtractTime(1)" class="add-time" :class="{ disabled: minutes <= 0 }">
          -1
        </span> -->

        <span @click="restartTimer" class="material-symbols-outlined">
          replay
        </span>

        <template v-if="timerActive">
          <span @click="pauseTimer" class="material-symbols-outlined">
            pause
          </span>
        </template>

        <template v-else>
          <span @click="startTimer" class="material-symbols-outlined" :class="{ disabled: timeToZero <= 0 }">
            play_arrow
          </span>
        </template>

        <span @click="clearTimer" class="material-symbols-outlined">
          close
        </span>

        <!-- <span @click="addTime(1)" class="add-time">
          +1
        </span> -->

      </div>

    </div>

    <!-- Bottom -->
    <div class="timer-bottom">
      <div class="progressbar">
        <div class="text" :style="[{ 'color': progressColor.fg }]">{{ percentLeft }} %</div>
        <div class="background">{{ percentLeft }} %</div>
        <div class="bar" :style="[
          { width: percentLeft + '%' },
          { animation: 'colorChange 2s both' },
          { 'background-color': progressColor.bg }
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
.disabled {
  color: gray;
  opacity: .25;
}

.countdown-timer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* height: 100%; */
  position: relative;
  border: 1px solid white;
  border-radius: 5px;
  font-family: 'Share Tech Mono', sans-serif;
  background-color: black;
}

.timer-top,
.timer-middle,
.timer-bottom {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;

  color: white;
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
  padding: 10px 0;
}

.timer-top .timer-title {
  display: flex;
  justify-content: center;
  align-items: center;
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
  flex-direction: column;
}

.timer-middle .time-remaining {
  min-height: 60px;
  display: flex;
  align-items: center;
}

.timer-middle .time-remaining .time-input {
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-middle .time-remaining .time-input span {
  padding: .25em;
  align-self: flex-end;
}

.timer-middle .time-remaining .time-left {
  font-size: 2.5em;
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
  font-size: 20px;
}

/* Bottom */
.timer-bottom {
  padding-top: 10px;
}

.timer-bottom .progressbar {
  position: relative;
  /* outline: 1px solid white; */
  width: 100%;
  text-align: center;
}

.timer-bottom .text {
  border: 1px solid white;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

.timer-bottom .background {
  background-color: v-bind('main_bg_color');
  color: white;
}

.timer-bottom .bar {
  position: absolute;
  top: 0;
  bottom: 0;
  transition: width 1s;
  background-color: limegreen;
  animation: colorChange;
}
</style>
