<script setup>
//Component Imports
import Stopwatch from '@/components/timers/Stopwatch.vue';
import Countdown from '@/components/timers/Countdown.vue';

//Template Imports
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

//Store Imports
import { useTimerStore } from '@/stores/timer.store.js'
const { fetchTimers, addTimer, deleteTimer } = useTimerStore()

const timers = ref([
    {
        name: 'Timer1',
        type: 'countdown',
    },
    {
        name: 'timer2',
        type: 'stopwatch'
    }
])

</script>
<template>
    <div>
        <h2>Timers!</h2>

        <div v-for="timer in timers" :key="timer._id">
            <template v-if="timer.type == 'countdown'">
                <Countdown />
            </template>
            <template v-if="timer.type == 'stopwatch'">
                <Stopwatch :timer="timer" />
            </template>
        </div>
    </div>
</template>