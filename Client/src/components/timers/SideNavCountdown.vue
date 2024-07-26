<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTimerStore } from '@/stores/timer.store';

const props = defineProps(['timer'])
const emit = defineEmits(['close'])

const isHovering = ref(false)

const timerStore = useTimerStore()
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const timeRemaining = ref(0)
const initialStartValue = ref()
const timerActive = ref(false)
const percentLeft = ref(100)
const timerComplete = ref(false)

onMounted(() => {

    if (props.timer.isActive) {
        if (props.timer.endDateTime) {
            const calcFutureDate = msToTimeFormat(new Date(props.timer.endDateTime).getTime() - Date.now()).split(':')
            if (calcFutureDate != 0) {
                days.value = calcFutureDate[0],
                    hours.value = calcFutureDate[1],
                    minutes.value = calcFutureDate[2],
                    seconds.value = calcFutureDate[3]
            }
        }

        startCountDown()

    } else {
        if (props.timer.duration) {
            const timeRem = msToTimeFormat(props.timer.duration).split(':')
            if (timeRem != 0) {
                days.value = timeRem[0],
                    hours.value = timeRem[1],
                    minutes.value = timeRem[2],
                    seconds.value = timeRem[3]
            }
        }
    }

    initialStartValue.value = days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000
})

const onStart = () => {

    if (timeRemaining.value == 0) return

    if (editTimerTime.value) editTimerTime.value = false

    initialStartValue.value = days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000

    if (props.timer.isActive) {
        startCountDown()
    } else {
        // Update Timer On Start if isActive value is different

        timerStore.updateTimer({
            _id: props.timer._id,
            endDateTime: Date.now() + timeRemaining.value,
            isActive: true,
            duration: timeRemaining.value
        })
    }
}

const countDownId = ref();
const startCountDown = () => {
    timerActive.value = true

    let now = Date.now()
    let desiredDelay = 1000
    let actualDelay = 1000

    countDownId.value = setInterval(() => {

        var actual = Date.now() - now
        actualDelay = desiredDelay - (actual - desiredDelay)

        timeRemaining.value -= 1000
        percentLeft.value = Math.floor((timeRemaining.value / initialStartValue.value) * 100)

        if (timeRemaining.value == 0) {
            percentLeft.value = 0
            timerComplete.value = true
        }

        let end = now + timeRemaining.value
        let remainder = end - now

        if (remainder <= 0) {
            console.log(`${props.timer.name} timer has expired!`)
            clearTimeout(countDownId.value)
        }
    }, actualDelay)
}

const stopCountDown = () => {
    const updateTimer = {
        _id: props.timer._id,
        isActive: false,
        duration: timeRemaining.value
    }
    timerStore.updateTimer(updateTimer)

    timerActive.value = false
    clearTimeout(countDownId.value)
}

watch(() => props.timer.isActive, (newVal, oldVal) => {
    //Update the duration
    const updateTimer = {
        _id: props.timer._id,
        duration: timeRemaining.value
    }

    timerStore.updateTimer(updateTimer)

    if (newVal == true) {
        startCountDown()
    } else {
        stopCountDown()
    }
})

const onPause = () => {

    stopCountDown()

    const pausedTime = msToTimeFormat(timeRemaining.value).split(':')
    if (timeRemaining.value != 0) {
        days.value = pausedTime[0],
            hours.value = pausedTime[1],
            minutes.value = pausedTime[2],
            seconds.value = pausedTime[3]
    }
}
const onReset = () => {
    //Stop Timer
    stopCountDown()

    //Set time back to start time
    timeRemaining.value = initialStartValue.value

    if (initialStartValue.value === undefined) initialStartValue.value = days.value * 86400000 + hours.value * 3600000 + minutes.value * 60000 + seconds.value * 1000

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
    stopCountDown()

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
    if (ms < 0) return '00:00:00:00'
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

        if (timeRemaining.value == initialStartValue.value) percentLeft.value = 100
        if (timeRemaining.value == 0) percentLeft.value = 0
        // console.log(`${newDays}:${newHours}:${newMinutes}:${newSeconds}`)
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
const progressColor = computed(() => {
    let color = 'rgba(50,205,50,0.75)'
    let color2 = 'rgba(50,205,50,0.05)'

    if (percentLeft.value <= 60) {
        color = 'rgba(240, 255, 0, 0.75)'
        color2 = 'rgba(240, 255, 0, 0.05)'
    }
    if (percentLeft.value <= 30) {
        color = 'rgba(255, 0, 0, 0.75)'
        color2 = 'rgba(255, 0, 0, 0.05)'
    }
    return { foreground: color, background: color2 }
})
</script>
<template>
    <div class="container" @mouseover="isHovering = true" @mouseleave="isHovering = false"
        :style="[{ border: `3px solid ${progressColor.foreground}` }]">

        <div class=" timer-controls" v-if="isHovering">

            <i @click="onReset()" class="bx bx-reset"></i>
            <i v-if="timerActive" @click="onPause()" class='bx bx-pause-circle'></i>
            <i v-else @click="onStart()" class='bx bx-play-circle' :class="{ disabled: timeRemaining <= 0 }"></i>

            <i @click="onPause()" class='bx bx-pause-circle'></i>

            <i @click="onClear()" class='bx bx-x'></i>

        </div>
        <div v-else class="timer-body">
            <div class="title">
                {{ props.timer.name }}
            </div>
            <div class="time">
                <!-- <pre>{{ props.timer }}</pre> -->
                <!-- {{ props.timer.isActive }} -->

                {{ msToTimeFormat(timeRemaining) }}
                <!-- {{ props.timer.duration }} -->
                <!-- 00:00:00:00 -->
            </div>
        </div>

        <div class="progressbar">
            <!-- <div class="text">ProgressBar</div> -->
            <div class="bar"></div>
        </div>

        <!-- <div class="progressbar">
            <div class="text" :style="[{ 'color': progressColor.fg }]">{{ percentLeft }} %</div>
            <div class="background">{{ percentLeft }} %</div>
            <div class="bar" :style="[
                { width: percentLeft + '%' },
                { animation: 'colorChange 2s both' },
                { 'background-color': progressColor.bg }
            ]"></div>
        </div> -->

    </div>
</template>
<style scoped>
.disabled {
    color: gray;
    opacity: 0.25;
}

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



.progressbar {
    position: absolute;
    z-index: -1;
    width: 100%;
    text-align: center;
    color: red;
}

.bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-height: 30px;
    /* background-color: lime; */
}

/* .progressbar {
    position: relative;
    width: 100%;
    text-align: center;
    color: red;
}

.text {
    border: 1px solid white;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
}

.background {
    background-color: v-bind('main_bg_color');
    color: white;
}

.bar {
    position: absolute;
    top: 0;
    bottom: 0;
    transition: width 1s;
    background-color: limegreen;
    animation: colorChange;
} */
</style>