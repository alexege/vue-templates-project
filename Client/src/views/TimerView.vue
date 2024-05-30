<script setup>
//Component Imports
import Stopwatch from '@/components/timers/Stopwatch.vue';
import Countdown from '@/components/timers/Countdown.vue';

//Template Imports
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

//Store Imports
import { useTimersStore } from '@/stores/timer.store.js'



</script>
<template>
    <div>
        <h2>Timers!</h2>

        <Stopwatch />
        <Countdown />
    </div>
</template>