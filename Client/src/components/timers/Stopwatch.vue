<script setup>
import { ref } from 'vue'
import { useTimerStore } from '../../stores/timer.store';

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
    props.timer.name = data.name
    editTimerName.value = false;
}

</script>

<template>
    <div class="stopwatch-timer">
        <div class="timer-top">
            <template v-if="editTimerName">
                <input type="text" v-model="editTimer.name" @blur="updateTimerName" @keydown.enter="updateTimerName"
                    autofocus @focus="$event.target.select()">
            </template>
            <template v-else>
                <span @dblclick="editTimerName = true">{{ timer.name }}</span>
            </template>
            <span @click="deleteTimer(timer._id)" class="material-symbols-outlined close">close</span>
        </div>
        <div class="timer-middle">
            <span class="time-elapsed">{{ time }}</span>
        </div>
        <div class="timer-bottom">
            <div class="btn-container">
                <span id="start" @click="start">Start</span>
                <span id="stop" @click="stop">Stop</span>
                <span id="reset" @click="reset">Reset</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.stopwatch-timer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid white;
    border-radius: 5px;
    font-family: 'Share Tech Mono', sans-serif;
    background-color: black;
}

/* Generic */
.timer-top,
.timer-middle,
.timer-bottom {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;

    color: white;
}

/* Top  */
.timer-top {
    padding: 10px 0;
}

.timer-top .close {
    position: absolute;
    top: 0;
    right: 0;
    margin: 2.5px 2.5px;
    cursor: pointer;
}

/* Middle */
.timer-middle {
    flex-direction: column;
}

.timer-middle .time-elapsed {
    font-size: 2em;
    padding: 0 .5em;
    min-height: 60px;

    display: flex;
    align-items: center;
}

/* Bottom */
.timer-bottom {
    padding: 10px 0;
}

.timer-bottom .btn-container span {
    padding: .10em .25em;
    font-size: 20px;
    cursor: pointer;
}
</style>