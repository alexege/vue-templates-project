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

            <i @click="onReset()" class="bx bx-reset"></i>

            <i v-if="timerActive" @click="onPause()" class="bx bx-pause-circle"></i>
            <i v-else @click="onStart()" class="bx bx-play-circle" :class="{ disabled: timeRemaining <= 0 }"></i>
        </div>
        <div v-else class="timer-body">
            <div class="title">{{ timer.name }}</div>
            <div class="time">{{ time }}</div>
        </div>
    </div>
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

i,
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