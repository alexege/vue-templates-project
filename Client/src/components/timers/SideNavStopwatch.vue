<script setup>
import { ref } from 'vue'
import { useTimerStore } from '../../stores/timer.store';

const isHovering = ref(false)

var time = ref('00:00:00:00')
var timeBegan = ref(null)
var timeStopped = ref(null)
var stoppedDuration = ref(0)
var started = ref(null)
var running = ref(false)
const props = defineProps(['timer'])
const emit = defineEmits(['close'])

function start() {
    if (running.value) return;
    if (timeBegan.value === null) {
        reset();
        timeBegan.value = new Date();
    }
    if (timeStopped.value !== null) {
        stoppedDuration.value += (new Date() - timeStopped.value);
    }
    started.value = setInterval(clockRunning, 10);
    running.value = true;
}

function stop() {
    running.value = false;
    timeStopped.value = new Date();
    clearInterval(started.value);
}

function reset() {
    running.value = false;
    clearInterval(started.value);
    stoppedDuration.value = 0;
    timeBegan.value = null;
    timeStopped.value = null;
    time.value = "00:00:00:00";
}

function clockRunning() {
    var currentTime = new Date()
    var timeElapsed = new Date(currentTime - timeBegan.value - stoppedDuration.value)
    var hour = timeElapsed.getUTCHours()
    var min = timeElapsed.getUTCMinutes()
    var sec = timeElapsed.getUTCSeconds()
    var ms = timeElapsed.getUTCMilliseconds()
    time.value = zeroPrefix(hour, 2) + ":" +
        zeroPrefix(min, 2) + ":" +
        zeroPrefix(sec, 2) + ":" +
        zeroPrefix(ms, 2);
}

function zeroPrefix(num, digit) {
    var zero = '';
    for (var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

function deleteTimer(timerId) {
    emit('close', timerId)
}

const { updateTimer } = useTimerStore()
const editTimerName = ref(false);
const editTimer = {
    name: props.timer.name
}

async function updateTimerName() {
    var data = {
        _id: props.timer._id,
        name: editTimer.name
    }
    await updateTimer(data)
    editTimerName.value = false;
}
</script>
<template>
    <div class="container" @mouseover="isHovering = true" @mouseleave="isHovering = false">
        <div class="timer-controls" v-if="isHovering">

            <span @click="onReset()" class="material-symbols-outlined">replay</span>

            <template v-if="timerActive">
                <span @click="onPause()" class="material-symbols-outlined">
                    pause
                </span>
            </template>

            <template v-else>
                <span @click="onStart()" class="material-symbols-outlined" :class="{ disabled: timeRemaining <= 0 }">
                    play_arrow
                </span>
            </template>

            <i class="bx bx-cog material-symbols-outlined"></i>
        </div>
        <div v-else class="timer-body">
            <div class="title">{{ timer.name }}</div>
            <div class="time">{{ time }}</div>
        </div>
    </div>

    <!-- <div class="stopwatch-timer">
        <div class="timer-middle">
            {{ timer.name }}
            <div class="time-elapsed">
                {{ time }}
            </div>

        </div>

    </div> -->

    <!-- <div class="stopwatch-timer">
        <div class="timer-top">
            <template v-if="editTimerName">
                <input type="text" v-model="editTimer.name" @blur="updateTimerName" @keydown.enter="updateTimerName"
                    autofocus @focus="$event.target.select()">
                <span class="material-symbols-outlined" @click="updateTimerName">save</span>
            </template>
<template v-else>
                <span @dblclick="editTimerName = true">{{ timer.name }}</span>
            </template>
<span @click="deleteTimer(timer._id)" class="material-symbols-outlined close">close</span>
</div>
<div class="timer-middle">
    <span class="time-elapsed" :style="[{ borderBottom: `2px solid white` }, { borderTop: `2px solid white` }]">{{
        time }}</span>
</div>
<div class="timer-bottom">
    <div class="btn-container">
        <span @click="start" class="material-symbols-outlined" v-if="!running">play_arrow</span>
        <span @click="stop" class="material-symbols-outlined" v-else> pause </span>
        <span @click="reset" class="material-symbols-outlined"> replay </span>

    </div>
</div>
</div> -->
</template>
<style scoped>
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 60px;
    height: 100%;
    border: 2px solid white;
    color: white;
    box-sizing: border-box;
}

.material-symbols-outlined,
.bx-cog {
    cursor: pointer;
    color: white;
}

.timer-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.timer-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>