<script setup>

import { ref } from 'vue'

const isHovering = ref(false)

</script>
<template>
    <div class="container" @mouseenter="isHovering = true" @mouseleave="isHovering = false">

        <div class="timer-controls" v-if="isHovering">

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

            <i class="bx bx-cog material-symbols-outlined"></i>

        </div>
        <div v-else class="timer-body">
            <div class="title">
                Timer Title
            </div>
            <div class="time">
                00:00:00:00
            </div>
            <!-- <i class="bx bx-cog material-symbols-outlined"></i> -->
        </div>

        <div class="progressbar">
            <div class="text">ProgressBar</div>
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

.timer-body {}



.progressbar {
    position: absolute;
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