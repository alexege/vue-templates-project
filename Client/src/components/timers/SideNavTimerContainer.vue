<script setup>
import SideNavStopwatch from "@/components/timers/SideNavStopwatch.vue";
import SideNavCountdown from "@/components/timers/SideNavCountdown.vue";

import { useTimerStore } from "../../stores/timer.store";
import { storeToRefs } from "pinia";
const { fetchTimers } = useTimerStore();

const { allTimers, countDownTimers, stopwatchTimers } = storeToRefs(useTimerStore())

</script>
<template>
    <div class="container">

        <div class="actions">
            <button>All</button>
            <button>Stopwatch</button>
            <button>CountDown</button>
        </div>
        <div>
            <div v-for="timer in countDownTimers" :key="timer">
                <SideNavCountdown :timer="timer" />
            </div>
            <div v-for="timer in stopwatchTimers" :key="timer">
                <SideNavStopwatch :timer="timer" />
            </div>
        </div>

    </div>
</template>
<style scoped>
.container {
    /* display: flex; */
    /* justify-content: center; */

}

.actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
}

.actions button {
    flex: 1;
    font-size: .75em;
}
</style>