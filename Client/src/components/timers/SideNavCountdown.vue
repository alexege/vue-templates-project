<script setup>
</script>
<template>
    <div class="container">

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
                <span @click="startTimer" class="material-symbols-outlined" :class="{ disabled: timeToZero <= 0 }">
                    play_arrow
                </span>
            </template>

            <span @click="clearTimer" class="material-symbols-outlined">
                close
            </span>

            <i class="bx bx-cog material-symbols-outlined"></i>

        </div>

        Countdown Timer
    </div>
</template>
<style scoped>
.container {
    width: 100%;
    height: 100%;
    border: 2px solid white;
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
</style>