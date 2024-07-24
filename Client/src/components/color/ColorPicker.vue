<template>
    <div>
        <input type="color" id="colorPicker" v-model="color" @input="handleInput" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['color'])

// Reactive state for the color
const color = ref('#ff0000');
const throttledColor = ref('');

const emitColorSelection = () => {
    emit('color', throttledColor.value)
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
}, 1000)

const handleInput = (event) => {
    updateValue(event.target.value)
}

watch(color, (newValue) => {
    throttledColor.value = newValue;
})

</script>

<style scoped></style>