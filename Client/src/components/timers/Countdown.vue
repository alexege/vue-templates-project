<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps(['timer'])
const emit = defineEmits(['close'])
import { useTimerStore } from '@/stores/timer.store.js'
const timerStore = useTimerStore()
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const timeRemaining = ref(0)
const time_out = ref(0)
const initialStartValue = ref()
const timerActive = ref(false)
const percentLeft = ref(100)

const onStart = () => {
    if (timeRemaining.value == 0) return

    if (editTimerTime.value == true) editTimerTime.value = false

    timerActive.value = true
    //Keep track of starting time value
    // initialStartValue.value = timeRemaining.value
    initialStartValue.value =
        days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000
    let now = Date.now()
    let desiredDelay = 1000
    let actualDelay = 1000
    percentLeft.value = Math.floor((timeRemaining.value / initialStartValue.value) * 100)
    time_out.value = setTimeout(() => {
        var actual = Date.now() - now
        actualDelay = desiredDelay - (actual - desiredDelay)
        timeRemaining.value -= 1000
        if (timeRemaining.value > 0) {
            onStart()
        } else {
            percentLeft.value = 0
            //Timer completed Message
            setTimeout(() => {
                alert(`${props.timer.name} is up!`)
            }, 500)
        }
    }, actualDelay)
}
const onPause = () => {
    clearTimeout(time_out.value)
    timerActive.value = false
}
const onReset = () => {
    //Stop Timer
    clearTimeout(time_out.value)
    timerActive.value = false
    //Set time back to start time
    timeRemaining.value = initialStartValue.value
    //Reset values back to starting values
    const startingTime = msToTimeFormat(initialStartValue.value).split(':')
    if (timeRemaining.value == 0) {
        ; (days.value = 0), (hours.value = 0), (minutes.value = 0), (seconds.value = 0)
    } else {
        ; (days.value = startingTime[0]),
            (hours.value = startingTime[1]),
            (minutes.value = startingTime[2]),
            (seconds.value = startingTime[3])
    }
}

const onClear = () => {
    editTimerTime.value = true;
    timerActive.value = false;
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    timeRemaining.value = 0;
}

//Convert ms to '00:00:00:00' string
const msToTimeFormat = (ms) => {
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
//Watch for value changes and update accordingly
watch(
    [days, hours, minutes, seconds],
    ([newDays, newHours, newMinutes, newSeconds], [oldDays, oldHours, oldMinutes, oldSeconds]) => {
        console.log(`Watcher updated`)
        console.log(`${newDays}:${newHours}:${newMinutes}:${newSeconds}`)

        if (newHours >= 24) {
            hours.value = (newHours - 24) > 0 ? newHours - 24 : 0
            days.value++
        }
        if (newMinutes >= 60) {
            minutes.value = (newMinutes - 60) > 0 ? newMinutes - 60 : 0
            hours.value++
        }
        if (newSeconds >= 60) {
            seconds.value = (newSeconds - 60) > 0 ? newSeconds - 60 : 0
            minutes.value++
        }
        timeRemaining.value =
            days.value * 86400000 +
            hours.value * 3600000 +
            minutes.value * 60000 +
            seconds.value * 1000

        if (timeRemaining.value > 0) percentLeft.value = 100
        if (timeRemaining.value == 0) percentLeft.value = 0
        console.log(`${newDays}:${newHours}:${newMinutes}:${newSeconds}`)
    }
)
// Edit Timer
const editTimer = ref({
    name: props.timer.name
})
const isEditTimerName = ref(false)
const editTimerTime = ref(false)
const updateTimerName = () => {
    let updateData = {
        _id: props.timer._id,
        name: editTimer.value.name
    }
    timerStore.updateTimer(updateData)
    //Close Edit Input
    isEditTimerName.value = false
}
const editTime = () => {
    editTimerTime.value = !editTimerTime.value
    onPause()
}
const deleteTimer = () => {
    emit('close', props.timer._id)
}
const updateTimeRemaining = () => {
    initialStartValue.value = timeRemaining.value
}

//Progress Bar
const progress = ref(100)
const progressColor = computed(() => {
    let color = 'lime'
    if (progress.value < 60) {
        color = 'yellow'
    }
    if (progress.value < 30) {
        color = 'red'
    }
    return color
})

</script>
<template>
    <div class="countdown-timer">
        <!-- Top -->
        <div class="timer-top">
            <div class="timer-title">
                <template v-if="isEditTimerName">
                    <input type="text" v-model="editTimer.name" @blur="updateTimerName" @keydown.enter="updateTimerName"
                        autofocus @focus="$event.target.select()" />
                    <span class="material-symbols-outlined" @click="updateTimerName">save</span>
                </template>
                <template v-else>
                    <span @dblclick="isEditTimerName = true">{{ timer.name }}</span>
                </template>
            </div>
            <div class="controls">
                <span @click="editTime" class="material-symbols-outlined">settings</span>
                <span @click="deleteTimer" class="material-symbols-outlined">close</span>
            </div>
        </div>
        <!-- Middle -->
        <div class="timer-middle">
            <div class="time-remaining">
                <template v-if="editTimerTime">
                    <div class="time-input">
                        <div class="input-control">
                            <label>days</label>
                            <input type="number" min="0" max="100" v-model="days" placeholder="Days"
                                @change="updateTimeRemaining" />
                        </div>
                        <span>:</span>
                        <div class="input-control">
                            <label>hours</label>
                            <input type="number" min="0" max="100" v-model="hours" placeholder="Hours"
                                @change="updateTimeRemaining" />
                        </div>
                        <span>:</span>
                        <div class="input-control">
                            <label>mins</label>
                            <input type="number" min="0" max="100" v-model="minutes" placeholder="Minutes"
                                @change="updateTimeRemaining" />
                        </div>
                        <span>:</span>
                        <div class="input-control">
                            <label>secs</label>
                            <input type="number" min="0" max="100" v-model="seconds" placeholder="Seconds"
                                @change="updateTimeRemaining" />
                        </div>
                    </div>
                </template>
                <template v-else>
                    <span class="time-left">{{ msToTimeFormat(timeRemaining) }}</span>
                </template>
            </div>
        </div>
        <!-- Bottom -->
        <div class="timer-bottom">

            <div class="timer-controls">
                <span @click="onReset()" class="material-symbols-outlined"> replay </span>
                <template v-if="timerActive">
                    <span @click="onPause()" class="material-symbols-outlined"> pause </span>
                </template>
                <template v-else>
                    <span @click="onStart()" class="material-symbols-outlined"
                        :class="{ disabled: timeRemaining <= 0 }">
                        play_arrow
                    </span>
                </template>
                <span @click="onClear()" class="material-symbols-outlined"> close </span>
            </div>

        </div>

        <div class="progressbar">
            <div class="bar"
                :style="[{ width: `${percentLeft}%` }, { animation: 'colorChange 2s both' }, { background: `${progressColor}` }]">
            </div>
            Progressbar
        </div>
        <!-- <div class="text" :style="[{ color: progressColor.fg }]">{{ percentLeft }} %</div>
                <div class="background">{{ percentLeft }} %</div>
                <div
                    class="bar"
                    :style="[
                        { width: percentLeft + '%' },
                        { animation: 'colorChange 2s both' },
                        { 'background-color': progressColor.bg }
                    ]"
                ></div> -->
    </div>
</template>
<style scoped>
.disabled {
    color: gray;
    opacity: 0.25;
}

.countdown-timer {
    height: 9em;
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
    /* background-color: black; */
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
    flex: 1;
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
    flex: 2;
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
    padding: 0.25em;
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

.timer-middle .time-input .input-control input[type='number'] {
    font-size: 1em;
    width: 40px;
}

.timer-middle .timer-controls .material-symbols-outlined {
    padding: 0.1em 0.25em;
    font-size: 20px;
}

/* Bottom */
.timer-bottom {
    flex: 1;
    padding: 10px 0;
}

.progressbar {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: red;
}

.progressbar .text {
    border: 1px solid white;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
}

.progressbar .background {
    background-color: v-bind('main_bg_color');
    color: white;
}

.progressbar .bar {
    /* position: absolute;
    top: 0;
    bottom: 0;
    transition: width 1s;
    background-color: limegreen;
    animation: colorChange; */

    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: red;
}
</style>
