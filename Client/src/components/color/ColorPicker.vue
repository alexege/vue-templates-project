<template>
    <div>
        {{ color }}
        <input type="color" id="colorPicker" v-model="color" @input="handleInput" @blur="setColor" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['color'])
const props = defineProps(['provided'])

// Reactive state for the color
const color = ref('');
const throttledColor = ref('');

color.value = props.provided

const emitColorSelection = () => {
    emit('color', throttledColor.value)
}

const setColor = () => {
    emitColorSelection(color.value)
}

// Custom throttle function
function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId;

    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

const updateValue = throttle((value) => {
    throttledColor.value = value;
    emitColorSelection();
}, 500);

const handleInput = (event) => {
    updateValue(event.target.value)
}

watch(color, (newValue) => {
    throttledColor.value = newValue;
})

</script>

<style scoped></style>