<script setup>
import SideNavStopwatch from "@/components/timers/SideNavStopwatch.vue";
import SideNavCountdown from "@/components/timers/SideNavCountdown.vue";

import { useTimerStore } from "../../stores/timer.store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from 'vue'
const { fetchTimers } = useTimerStore();
fetchTimers()
const { allTimers, countDownTimers, stopwatchTimers } = storeToRefs(useTimerStore())

const activeButton = ref("All")

</script>
<template>
    <div class="container">

        <div class="actions">
            <button @click="activeButton = 'All'">All</button>
            <button @click="activeButton = 'Stopwatch'">Stopwatch</button>
            <button @click="activeButton = 'CountDown'">CountDown</button>
        </div>
        <div style="padding-top: 20px;">
            <template v-if="activeButton == 'All'">
                <div v-for="timer in allTimers" :key="timer">
                    <SideNavCountdown v-if="timer.type == 'countdown'" :timer="timer" />
                    <SideNavStopwatch v-if="timer.type == 'stopwatch'" :timer="timer" />
                </div>
            </template>
            <template v-else-if="activeButton == 'Stopwatch'">
                <div v-for="timer in stopwatchTimers" :key="timer">
                    <SideNavStopwatch :timer="timer" />
                </div>
            </template>
            <template v-else-if="activeButton == 'CountDown'">
                <div v-for="timer in countDownTimers" :key="timer">
                    <SideNavCountdown :timer="timer" />
                </div>
            </template>

        </div>

    </div>
</template>
<style scoped>
.container {
    /* display: flex; */
    /* justify-content: center; */
    /* outline: 1px solid lime; */
    /* margin-top: 30px; */
    overflow: hidden;
}

.actions {
    position: fixed;
    z-index: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
}

.actions button {
    flex: 1;
    font-size: .75em;
    cursor: pointer;
    color: white;
    background: none;

}

.container::-webkit-scrollbar {
    display: none;
}

.container {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>